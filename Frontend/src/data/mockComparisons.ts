import { ComparisonObject } from '../types';

export const INITIAL_COMPARISONS: ComparisonObject[] = [
  {
    id: 'cmp_opt_88291',
    problem: 'Write an asynchronous Python function using asyncio and aiohttp to concurrently fetch JSON payloads from a list of 20 API URLs with automatic exponential backoff retry and concurrency limit of 5.',
    solution_1: `### Solution 1: Using \`asyncio.Semaphore\` with Custom Backoff Decorator

Here is a resilient implementation using \`asyncio.Semaphore\` for strict concurrency control and a modular exponential backoff retry mechanism.

#### Implementation
\`\`\`python
import asyncio
import logging
from typing import List, Any, Optional
import aiohttp

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AsyncFetcher")

async def fetch_with_retry(
    session: aiohttp.ClientSession,
    url: str,
    max_retries: int = 4,
    base_delay: float = 0.5
) -> Optional[dict]:
    for attempt in range(max_retries + 1):
        try:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                response.raise_for_status()
                return await response.json()
        except (aiohttp.ClientError, asyncio.TimeoutError) as err:
            if attempt == max_retries:
                logger.error(f"Failed to fetch {url} after {max_retries} attempts: {err}")
                return None
            delay = base_delay * (2 ** attempt)
            logger.warning(f"Error on {url} (Attempt {attempt + 1}). Retrying in {delay}s...")
            await asyncio.sleep(delay)

async def bounded_fetch(
    semaphore: asyncio.Semaphore,
    session: aiohttp.ClientSession,
    url: str
) -> Optional[dict]:
    async with semaphore:
        return await fetch_with_retry(session, url)

async def fetch_all_urls(urls: List[str], max_concurrency: int = 5) -> List[Any]:
    semaphore = asyncio.Semaphore(max_concurrency)
    async with aiohttp.ClientSession() as session:
        tasks = [bounded_fetch(semaphore, session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=False)
        return [res for res in results if res is not None]
\`\`\`

#### Key Architecture Decisions
- **Concurrency Bottling**: Uses \`asyncio.Semaphore(5)\` wrapped neatly around session execution.
- **Resource Management**: Uses a single shared \`ClientSession\` to reuse TCP connections efficiently.
- **Graceful Fault Tolerance**: Exceptions are captured per URL so one broken endpoint does not kill the batch.

| Metric | Guaranteed Value |
| :--- | :--- |
| Max Concurrency | Explicitly capped at 5 |
| Retry Strategy | Exponential Backoff ($0.5 \\times 2^n$ sec) |
| Connection Pooling | Enabled via Single ClientSession |`,
    solution_2: `### Solution 2: Functional \`asyncio.TaskGroup\` & Native Exception Routing (Python 3.11+)

This solution utilizes Python 3.11's modern **\`asyncio.TaskGroup\`** along with tenacity pattern equivalents built natively using structured asynchronous generators.

#### High-Performance Code
\`\`\`python
import asyncio
import random
import aiohttp

class ConcurrencyBoundedFetcher:
    def __init__(self, limit: int = 5, max_retries: int = 3):
        self.limit = asyncio.Semaphore(limit)
        self.max_retries = max_retries
        self.results = []

    async def _fetch_single(self, session: aiohttp.ClientSession, url: str) -> None:
        async with self.limit:
            backoff = 1.0
            for attempt in range(self.max_retries + 1):
                try:
                    async with session.get(url) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            self.results.append({'url': url, 'data': data, 'success': True})
                            return
                        elif resp.status in (429, 500, 502, 503, 504):
                            raise aiohttp.ClientResponseError(
                                resp.request_info, resp.history, status=resp.status
                            )
                except Exception as e:
                    if attempt == self.max_retries:
                        self.results.append({'url': url, 'error': str(e), 'success': False})
                        return
                    # Add Jitter to prevent Throttling Thundera
                    await asyncio.sleep(backoff + random.uniform(0, 0.3))
                    backoff *= 2.0

    async def execute_batch(self, urls: list[str]) -> list[dict]:
        connector = aiohttp.TCPConnector(limit=self.limit._value)
        async with aiohttp.ClientSession(connector=connector) as session:
            # Using modern Python 3.11 TaskGroup
            async with asyncio.TaskGroup() as tg:
                for url in urls:
                    tg.create_task(self._fetch_single(session, url))
        return self.results
\`\`\`

#### Highlights
1. **Jittered Backoff**: Adds randomized micro-delay (\`random.uniform\`) to prevent API thundering herd collisions during retries.
2. **TCP Connector Tuning**: Matches \`aiohttp.TCPConnector(limit=5)\` natively to the semaphore boundary.
3. **Structured Data Return**: Returns explicit dictionaries indicating success or exact trace failure per URL.`,
    solution_1_model: "Gemini 3 Pro",
    solution_2_model: "Claude 3.7 Sonnet",
    judge: {
      solution_1_score: 91,
      solution_2_score: 96,
      solution_1_reasoning: "Solution 1 offers an exceptionally clean, readable implementation with proper separation of concerns between concurrency bounding and retry logic. However, it misses adding random jitter to the exponential backoff, which is best practice when calling rate-limited APIs.",
      solution_2_reasoning: "Solution 2 is outstanding. It leverages modern Python 3.11+ structured concurrency (asyncio.TaskGroup), includes randomized jitter in the retry backoff to prevent thundering herd phenomena, and properly syncs the aiohttp TCPConnector limit with the semaphore.",
      winner: "solution_2"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'cmp_sql_99120',
    problem: 'Compare index usage and query optimization for paginating through 10,000,000 records in PostgreSQL: Offset/Limit vs Cursor-Based (Keyset) Pagination.',
    solution_1: `### Solution 1: Deep Analytical Breakdown & Keyset Implementation

When paginating over huge PostgreSQL tables ($10\\text{M}+$ rows), traditional \`OFFSET\` is notorious for quadratic latency degradation because the Postgres execution engine must scan and discard all prior rows before yielding the window.

#### 1. Why \`OFFSET / LIMIT\` Falls Short
\`\`\`sql
-- TERRIBLE PERFORMANCE AT SCALE (E.g., page 50,000)
SELECT id, user_id, action, created_at
FROM event_logs
ORDER BY created_at DESC, id DESC
LIMIT 50 OFFSET 500000;
-- Execution Time: ~1,420 ms (Requires sequential index scan discarding 500k tuples)
\`\`\`

#### 2. The Solution: Keyset (Cursor-Based) Pagination
Instead of telling Postgres how many rows to skip, pass the exact composite index marker of the last item from the previous page:

\`\`\`sql
-- OPTIMAL KEYSET QUERY (Instant execution at ANY page depth)
SELECT id, user_id, action, created_at
FROM event_logs
WHERE (created_at, id) < ('2026-07-25 10:30:00.000', 9842103)
ORDER BY created_at DESC, id DESC
LIMIT 50;
-- Execution Time: ~0.4 ms (Direct B-Tree Index Seek)
\`\`\`

#### Mandatory Composite B-Tree Index
To enable instantaneous B-Tree index traversal, create this deterministic composite index:
\`\`\`sql
CREATE INDEX CONCURRENTLY idx_event_logs_created_id 
ON event_logs (created_at DESC, id DESC);
\`\`\`

#### Comparative Performance Profile
| Method | Depth: Page 1 | Depth: Page 1,000 | Depth: Page 100,000 | Big-O Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **OFFSET / LIMIT** | 0.8 ms | 32.0 ms | 1,450 ms | $\\mathcal{O}(N + M)$ |
| **Keyset (Cursor)** | 0.4 ms | 0.4 ms | 0.4 ms | $\\mathcal{O}(1)$ (Indexed) |`,
    solution_2: `### Solution 2: Practical Engineering Guide with Window Functions & Index Strategy

Handling 10 million rows in PostgreSQL demands shifting from row-counting to index-seeking. Here is a practical engineering breakdown comparing both paradigms.

#### 1. Architectural Comparison

> **Rule of Thumb:** Never use \`OFFSET\` above 1,000 rows in high-throughput user-facing endpoints.

#### 2. Advanced Keyset Implementation in Application Layer
When handling ties in timestamps, you MUST include a unique secondary column (like \`UUID\` or \`BIGSERIAL\` id) to establish total order:

\`\`\`sql
-- Step 1: Create Index supporting directionality
CREATE INDEX idx_logs_keyset ON logs(created_at DESC, id DESC);

-- Step 2: Parameterized Keyset Query
WITH last_seen AS (
  SELECT $1::timestamptz AS last_time, $2::bigint AS last_id
)
SELECT l.*
FROM logs l, last_seen s
WHERE (l.created_at = s.last_time AND l.id < s.last_id)
   OR (l.created_at < s.last_time)
ORDER BY l.created_at DESC, l.id DESC
LIMIT $3;
\`\`\`

#### 3. Pros and Cons Matrix

- **Keyset Advantages**:
  - Consistent sub-millisecond execution regardless of page depth.
  - No skipping or duplicates if rows are inserted concurrently.
- **Keyset Tradeoffs**:
  - Cannot directly jump to random pages (e.g. "Jump to page 45").
  - Requires directional index alignment.`,
    solution_1_model: "GPT-4.5 Preview",
    solution_2_model: "Gemini 3 Pro",
    judge: {
      solution_1_score: 98,
      solution_2_score: 93,
      solution_1_reasoning: "Solution 1 delivers a flawless technical explanation with concrete SQL execution times, exact B-Tree Big-O analysis, and a clean tuple comparison syntax (created_at, id) < (val1, val2) which PostgreSQL optimizes natively into a single index condition.",
      solution_2_reasoning: "Solution 2 offers practical guidelines and explains the UI tradeoffs (inability to jump to random page numbers). However, its manual expansion of the tuple comparison into OR logic in the CTE can sometimes confuse PostgreSQL query planner compared to Solution 1's concise tuple syntax.",
      winner: "solution_1"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'cmp_ui_31902',
    problem: 'How should a Senior React Architect implement high-frequency real-time WebSocket data subscriptions (1,000 ticks/sec) in a financial candlestick dashboard without triggering React re-render freezes?',
    solution_1: `### Solution 1: Bypassing React Rendering via Mutable References & HTML5 Canvas / WebGL

At **1,000 ticks/second**, attempting to feed incoming updates into React state (\`useState\`, \`useReducer\`, or Context) will cause catastrophic main-thread lockups due to Virtual DOM reconciliation overhead.

#### Architectural Principle: Separate State from Visuals
1. **Direct Mutable Buffer**: Store incoming ticks in an in-memory ring buffer or \`useRef<Float32Array>\`.
2. **RAF Throttled Sync**: Render animations using \`requestAnimationFrame\` directly to a \`Canvas\` or lightweight library (like Lightweight Charts by TradingView).

#### Implementation Example
\`\`\`tsx
import React, { useEffect, useRef, useState } from 'react';

interface TradeTick {
  price: number;
  volume: number;
  time: number;
}

export const RealTimeTicker: React.FC<{ symbol: string }> = ({ symbol }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const latestTickRef = useRef<TradeTick | null>(null);
  const bufferRef = useRef<TradeTick[]>([]);
  
  // Minimal UI state throttled to human-readable speed (4 Hz / 250ms)
  const [displayPrice, setDisplayPrice] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket(\`wss://feed.pro-trading.io/\${symbol}\`);
    
    ws.onmessage = (event) => {
      const tick: TradeTick = JSON.parse(event.data);
      // O(1) in-memory push without touching React state!
      latestTickRef.current = tick;
      bufferRef.current.push(tick);
      if (bufferRef.current.length > 5000) bufferRef.current.shift();
    };

    return () => ws.close();
  }, [symbol]);

  // UI display throttled via Interval (4 updates/sec for human eye)
  useEffect(() => {
    const interval = setInterval(() => {
      if (latestTickRef.current) {
        setDisplayPrice(latestTickRef.current.price);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  // High-frequency 60 FPS Canvas rendering loop
  useEffect(() => {
    let animId: number;
    const render = () => {
      const canvas = canvasRef.current;
      if (canvas && bufferRef.current.length > 0) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="p-4 bg-slate-900 rounded-xl text-white font-mono">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-400">Live Spot {symbol}</span>
        <span className="text-2xl font-bold text-emerald-400">\${displayPrice.toFixed(2)}</span>
      </div>
      <canvas ref={canvasRef} width={600} height={120} className="w-full bg-slate-950 rounded border border-slate-800" />
    </div>
  );
};
\`\`\`

#### Key Takeaway Table
| Component | Update Frequency | Strategy |
| :--- | :--- | :--- |
| **WebSocket Buffer** | 1,000+ Hz | useRef (Zero React reconciliation) |
| **Canvas Graph** | 60 Hz | requestAnimationFrame Hardware Acceleration |
| **Text Price Tag** | 4 Hz (250ms) | Throttled useState (Human readable limit) |`,
    solution_2: `### Solution 2: RxJS Streams & Custom Throttling Hooks with Web Workers

When building institutional-grade dashboards, main thread parsing of 1,000 JSON messages/second can itself cause GC micro-stuttering. The architecturally definitive solution uses a **Web Worker** coupled with **RxJS observables**.

#### Architecture Flow
\`\`\`
[ WebSocket (Worker Thread) ] ──(Transferable Float32Array)──> [ RxJS Stream ] ──(60FPS Sample)──> [ DOM / Canvas ]
\`\`\`

#### 1. Web Worker Script (ticker.worker.ts)
\`\`\`ts
// Runs entirely off the UI Main Thread!
let ws: WebSocket;
const buffer = new Float32Array(3000); // [time, price, volume, ...]
let index = 0;

self.onmessage = (e: MessageEvent) => {
  if (e.data.action === 'START') {
    ws = new WebSocket(e.data.url);
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      buffer[index++] = Date.now();
      buffer[index++] = data.p;
      buffer[index++] = data.v;
      if (index >= 3000) index = 0;
    };
    
    // Flush batch to UI thread every 16.6ms (60hz)
    setInterval(() => {
      self.postMessage({ type: 'BATCH', data: buffer.slice(0, index) });
      index = 0;
    }, 16);
  }
};
\`\`\`

#### 2. React Consumer Component
\`\`\`tsx
import React, { useEffect, useState } from 'react';

export const InstitutionalTicker: React.FC = () => {
  const [tickerPrice, setTickerPrice] = useState('0.00');

  useEffect(() => {
    const worker = new Worker(new URL('./ticker.worker.ts', import.meta.url), { type: 'module' });
    worker.postMessage({ action: 'START', url: 'wss://marketdata.pro.io/btc-usd' });

    worker.onmessage = (e) => {
      if (e.data.type === 'BATCH' && e.data.data.length > 0) {
        const arr = e.data.data;
        const latestPrice = arr[arr.length - 2];
        setTickerPrice(latestPrice.toFixed(2));
      }
    };

    return () => worker.terminate();
  }, []);

  return (
    <div className="border border-indigo-500/30 p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950">
      <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Worker Buffered Stream</h3>
      <p className="text-4xl font-extrabold text-white mt-2 font-mono">\${tickerPrice}</p>
    </div>
  );
};
\`\`\`

#### Summary
By delegating both network parsing and buffer aggregation to an isolated Web Worker, the main UI browser thread stays at an uninterrupted 60 FPS even under extreme market volatility.`,
    solution_1_model: "Claude 3.7 Sonnet",
    solution_2_model: "Gemini 3.1 Pro (High)",
    judge: {
      solution_1_score: 95,
      solution_2_score: 99,
      solution_1_reasoning: "Solution 1 solves the immediate React render bottleneck effectively by decoupling the WebSocket buffer via useRef and using an interval for UI text updates alongside RAF for canvas drawing.",
      solution_2_reasoning: "Solution 2 achieves institutional perfection. Recognizing that parsing 1,000 JSON payloads/sec on the main thread causes Garbage Collection pauses, it moves WebSocket consumption and serialization to an isolated Web Worker, transmitting binary Float32Array batches at 60Hz.",
      winner: "solution_2"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString()
  }
];

export function generateDynamicComparison(prompt: string): ComparisonObject {
  const isCoding = /code|function|react|python|sql|java|rust|html|api|css|async|algorithm|bug|database/i.test(prompt);
  const models = ["Gemini 3 Pro", "Claude 3.7 Sonnet", "GPT-4.5 Turbo", "DeepSeek R1 Pro", "Llama 3.3 70B Instruct"];
  const m1 = models[Math.floor(Math.random() * 2)];
  const m2 = models[2 + Math.floor(Math.random() * 3)];

  const sol1Score = Math.floor(88 + Math.random() * 12);
  const sol2Score = Math.floor(82 + Math.random() * 16);
  const winner = sol1Score > sol2Score ? 'solution_1' : sol2Score > sol1Score ? 'solution_2' : 'tie';

  let s1Text = "";
  let s2Text = "";

  if (isCoding) {
    s1Text = `### Comprehensive Implementation & Best Practices

To resolve your request regarding **"${prompt}"**, we approach the solution with enterprise-grade resilience, strict type safety, and clean separation of concerns.

#### Architecture Highlights
- **Optimal Time Complexity**: Evaluated to $\\mathcal{O}(N)$ using hash mapping or single-pass traversal.
- **Defensive Error Handling**: All boundary conditions and null checks are cleanly handled.

#### Code Solution
\`\`\`typescript
/**
 * Optimized industrial implementation for ModelArena AI
 * Handles high-throughput scenarios with zero memory leaks.
 */
export async function executeOptimizedTask(input: string, maxRetries: number = 3): Promise<{ success: boolean; data: any }> {
  try {
    console.log(\`[System Exec] Processing payload for: \${input}\`);
    
    // Simulate robust async processing loop
    const result = {
      timestamp: new Date().toISOString(),
      executionHash: "0x8fa90bc7a3e",
      status: "VERIFIED_COMPLETION",
      metrics: { latencyMs: 12.4, memoryMb: 4.8 }
    };
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Execution anomaly encountered:", error);
    if (maxRetries > 0) {
      return executeOptimizedTask(input, maxRetries - 1);
    }
    throw new Error(\`Fatal processing halt: \${error.message}\`);
  }
}
\`\`\`

#### Verification & Edge Cases
1. **Empty Inputs**: Gracefully halts with descriptive debugging tags.
2. **Concurrency**: Fully functional without mutating shared global state.
3. **Unit Testing**: Easily mockable through Dependency Injection interfaces.`;

    s2Text = `### Concise High-Performance Solution & Tradeoff Analysis

Here is a highly direct, production-optimized implementation designed for minimal bundle overhead and maximum processing speed for **"${prompt}"**.

#### Direct Functional Code
\`\`\`typescript
import { useMemo, useCallback } from 'react';

// Streamlined implementation emphasizing efficiency
export const useOptimizedWorkflow = (query: string) => {
  const processedPayload = useMemo(() => {
    if (!query) return null;
    
    return {
      queryId: \`q_\${Math.random().toString(36).substring(2, 9)}\`,
      normalized: query.trim().toLowerCase(),
      ready: true,
      timestamp: Date.now()
    };
  }, [query]);

  const triggerExecution = useCallback(async () => {
    if (!processedPayload) return;
    console.info('[Worker Triggered]', processedPayload);
    return Promise.resolve({ code: 200, output: processedPayload });
  }, [processedPayload]);

  return { processedPayload, triggerExecution };
};
\`\`\`

#### Comparative Tradeoffs Table
| Feature | This Approach | Conventional Methods |
| :--- | :--- | :--- |
| **Memory Footprint** | Minimal (\`useMemo\` caching) | High (Continuous allocations) |
| **Execution Latency** | **$< 2\\text{ms}$** | $> 15\\text{ms}$ |
| **Readability** | Declarative & concise | Verbose procedural blocks |

> **Pro-Tip**: When embedding this inside a high-frequency component loop, make sure to memoize callback parameters to prevent unnecessary downstream DOM diffing.`;
  } else {
    s1Text = `### Analytical Deep Dive & Systemic Framework

Addressing your question: **"${prompt}"**, requires analyzing multiple foundational dimensions to establish a clear structural strategy.

#### 1. Strategic Foundational Pillars
- **Scalability & Longevity**: Ensuring the conceptual model adapts without friction to increasing demands or scaling paradigms.
- **Frictionless UX & Integration**: Eliminating unnecessary friction points while maintaining complete systemic visibility.
- **Resource Efficiency**: Optimizing operational cost ratios and cognitive burden.

#### 2. Comprehensive Breakdown Table
| Dimension | Primary Impact | Strategic Countermeasure |
| :--- | :--- | :--- |
| **Reliability** | Core service uptime and trust | Multi-region redundant failovers |
| **Performance** | User engagement and conversion | Edge caching & progressive rendering |
| **Security** | Data sovereignty and compliance | Zero-trust authentication architecture |

#### Key Conclusion
By establishing automated feedback loops and adhering to immutable domain boundaries, systems designed around these methodologies consistently outperform ad-hoc implementations by over **40% in operational efficiency**.`;

    s2Text = `### Actionable Executive Summary & Roadmap

When analyzing **"${prompt}"**, industry leaders prioritize clear execution milestones over theoretical speculation. Here is an actionable operational synthesis.

#### Core Executive Summary
1. **Immediate Assessment**: Perform a comprehensive structural audit to identify resource bottlenecks.
2. **Modular Decoupling**: Separate high-variance components into independent lifecycle pipelines.
3. **Continuous Evaluation**: Measure performance metrics directly against real-world benchmarking criteria.

#### Step-by-Step Implementation Flow
\`\`\`
[ Initial Assessment ] ──> [ Architectural Decoupling ] ──> [ Continuous Benchmarking ] ──> [ Market Optimization ]
\`\`\`

> *"Complexity is the enemy of reliability. Build simple interfaces over robust infrastructure."*

#### Strategic Recommendation
Adopt a phased deployment model starting with a **20% canary cohort** to ensure real-time telemetry validation before global rollout.`;
  }

  return {
    id: `cmp_dyn_${Math.random().toString(36).substring(2, 8)}`,
    problem: prompt,
    solution_1: s1Text,
    solution_2: s2Text,
    solution_1_model: m1,
    solution_2_model: m2,
    judge: {
      solution_1_score: sol1Score,
      solution_2_score: sol2Score,
      solution_1_reasoning: `The ${m1} implementation excels in comprehensive architectural depth, thorough error handling, and structured documentation. It provides enterprise-grade robustness with excellent type safety and clear edge case mitigations.`,
      solution_2_reasoning: `${m2} focuses heavily on pragmatic efficiency, minimal computational overhead, and actionable developer ergonomics. Its inclusion of comparative tradeoff matrices and concise execution speed is highly commendable.`,
      winner: winner as 'solution_1' | 'solution_2' | 'tie'
    },
    createdAt: new Date().toISOString()
  };
}
