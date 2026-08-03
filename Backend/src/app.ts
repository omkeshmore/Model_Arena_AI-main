import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
import cors from "cors";
import cookie from "cookie-parser"
import runGraph from "./ai/graph.ai.js";
import authRouter from "./routes/auth.route.js";

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(process.cwd(), "public");

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman) or any localhost origin
        if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow production origin fallback
        }
    },
    credentials: true
}));
app.use(cookie());
app.use(express.json());

// Serve static assets from the built React frontend in the public directory
app.use(express.static(publicPath));

app.use("/api/auth", authRouter);

const invokeHandler = async (req: express.Request, res: express.Response) => {
    const prompt = (req.body?.prompt || req.query?.prompt) as string;
    if (!prompt || !prompt.trim()) {
        return res.status(400).json({ message: "Prompt is required", success: false });
    }
    try {
        const result = await runGraph(prompt);

        // Determine analytical winner from Gemini judge scores
        const score1 = Number(result?.judge?.solution_1_score) || 0;
        const score2 = Number(result?.judge?.solution_2_score) || 0;
        const winner = score1 > score2 ? 'solution_1' : score2 > score1 ? 'solution_2' : 'tie';

        res.status(200).json({
            message: "Prompt Invoked Successfully",
            success: true,
            data: {
                ...result,
                solution_1_model: "Mistral Medium (Latest)",
                solution_2_model: "Cohere Command-A (2025)",
                judge_model: "Google Gemini Flash (AI Judge)",
                judge: {
                    ...result?.judge,
                    winner
                }
            }
        });
    } catch (error: any) {
        console.error("AI Invoke Execution Error:", error);
        res.status(500).json({
            message: "Error evaluating prompt across frontier AI models",
            error: error?.message || "Internal Server Error",
            success: false
        });
    }
};

// Main AI model evaluation route (POST /api/invoke)
app.post("/api/invoke", invokeHandler);

// Wildcard fallback route to support React client-side routing on Render monolithic deploy
app.use((req, res) => {
    res.sendFile(path.join(publicPath, "index.html"), (err) => {
        if (err) {
            res.status(500).send("Error serving frontend bundle. Make sure to build Frontend into Backend/public.");
        }
    });
});

export default app;