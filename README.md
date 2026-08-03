<p align="center">
  <img
    src="https://ik.imagekit.io/Rishi749/Model_Arena_AI/Arena_Banner.png"
    alt="ModelArena AI Banner"
    width="100%"
  />
</p>

<div align="center">

### **Benchmark, compare, and evaluate multiple Large Language Models through an intelligent AI orchestration pipeline powered by LangGraph.**

<br>

<a href="#-features">
  <img src="https://img.shields.io/badge/🚀_Features-161B22?style=for-the-badge&logo=rocket&logoColor=white"/>
</a>

<a href="#-evaluation-engine">
  <img src="https://img.shields.io/badge/⚖️_Evaluation_Engine-161B22?style=for-the-badge&logo=googleanalytics&logoColor=white"/>
</a>

<a href="#-technology-stack">
  <img src="https://img.shields.io/badge/🛠️_Technology_Stack-161B22?style=for-the-badge&logo=stackshare&logoColor=white"/>
</a>

<a href="#-system-architecture">
  <img src="https://img.shields.io/badge/🏗️_Architecture-161B22?style=for-the-badge&logo=icloud&logoColor=white"/>
</a>

</div>

---

# 📖 About ModelArena AI

**ModelArena AI** is a full-stack AI benchmarking platform that enables developers to compare multiple Large Language Models through a single unified evaluation workflow.

Instead of relying on one AI model, the platform executes the same prompt across multiple LLMs simultaneously and performs an automated side-by-side comparison. Every generated response is analyzed by an independent AI Judge that assigns quantitative scores and detailed reasoning, helping users understand not only which model performed better, but why.

Built with **LangGraph**, **LangChain**, **Google Gemini**, **Mistral AI**, and **Cohere**, ModelArena AI demonstrates modern AI orchestration, graph-based workflows, and explainable LLM evaluation within a scalable full-stack architecture.

---

# 🚀 Features

- 🤖 Side-by-side comparison of multiple LLMs
- ⚡ Graph-based orchestration powered by LangGraph
- 🧠 Automated AI evaluation using Gemini Flash
- 📊 Quantitative scoring with detailed reasoning
- ⚖️ Objective model benchmarking
- 💬 GitHub-style Markdown rendering
- 🔐 JWT-based authentication
- 📜 Persistent evaluation history
- 🌙 Dark & Light theme support
- 📱 Fully responsive interface

---

# ⚖️ Evaluation Engine

ModelArena AI follows a structured evaluation pipeline to ensure every benchmark is performed consistently and transparently.

| Stage | Description |
|--------|-------------|
| 📝 **Prompt Submission** | A single prompt is submitted by the user. |
| 🤖 **Parallel Execution** | The prompt is executed simultaneously across multiple LLMs. |
| 📦 **Response Collection** | Responses are gathered into a unified workflow state. |
| ⚖️ **AI Judge** | Google Gemini Flash evaluates each response independently. |
| 📊 **Scoring** | Every model receives a score out of **10**. |
| 💡 **Reasoning** | The judge explains the strengths and weaknesses behind each score. |
| 🏆 **Final Ranking** | Responses are ranked and displayed side-by-side for comparison. |

---

# 🤖 AI Models

ModelArena AI currently benchmarks the following Large Language Models:

| Role | Model |
|------|-------|
| 🟣 **LLM 1** | Mistral Medium |
| 🟢 **LLM 2** | Cohere Command A |
| ⚖️ **AI Judge** | Google Gemini Flash |

The architecture is modular, allowing additional models to be integrated into the evaluation workflow with minimal changes to the orchestration graph.

---

# 🛠️ Technology Stack

| Category | Technologies |
|-----------|--------------|
| 🎨 **Frontend** | React, Vite, TypeScript, Tailwind CSS |
| ⚙️ **Backend** | Node.js, Express.js, TypeScript |
| 🧠 **AI Orchestration** | LangGraph, LangChain |
| 🤖 **LLMs** | Mistral Medium, Cohere Command A |
| ⚖️ **Judge Model** | Google Gemini Flash |
| 🗄️ **Database** | MongoDB |
| 🔐 **Authentication** | JWT |
| 🚀 **Deployment** | Render |

---

# 🏗️ System Architecture

ModelArena AI follows a graph-driven architecture where each evaluation is executed as a sequence of interconnected nodes.

Unlike traditional request-response systems, LangGraph manages application state, node execution, and workflow transitions, enabling deterministic orchestration between multiple AI models and the evaluation engine.

<p align="center">
  <img
    src="https://ik.imagekit.io/Rishi749/Model_Arena_AI/System%20Architecture.png"
    alt="ModelArena AI Architecture"
    width="100%"
  />
</p>

---

# 🧩 LangGraph Workflow

The entire evaluation pipeline is orchestrated through a **LangGraph State Graph**, where each node performs a dedicated responsibility within the benchmark lifecycle.

| Node | Responsibility |
|------|----------------|
| 🚀 **Input Node** | Receives the user's benchmark prompt and initializes the workflow state. |
| 🤖 **Comparison Node** | Executes the prompt across Mistral Medium and Cohere Command A in parallel. |
| 📦 **Aggregation Node** | Collects model responses into a unified graph state. |
| ⚖️ **Judge Node** | Uses Google Gemini Flash to evaluate, score, and explain each response. |
| 📊 **Output Node** | Returns the ranked comparison report to the frontend dashboard. |

---

> **"ModelArena AI demonstrates how graph-based AI orchestration can transform multiple independent LLMs into a unified, explainable, and production-ready evaluation platform."**
> # 📂 Project Structure

```text
ModelArena-AI/
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   └── ...
│   └── package.json
│
├── Backend/
│   ├── src/
│   │   ├── ai/              # LangGraph & LangChain workflow
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
│
├── README.md
└── LICENSE
```

---

# 🚀 Getting Started

Follow the steps below to run **ModelArena AI** locally.

---

# 📋 Prerequisites

Ensure the following tools are installed before running the project.

- Node.js (v18 or above)
- npm
- MongoDB Atlas (or Local MongoDB)
- Google Gemini API Key
- Mistral AI API Key
- Cohere API Key
- Git

---

# ⚙️ Installation

Clone the repository.

```bash
git clone https://github.com/YOUR_USERNAME/ModelArena-AI.git

cd ModelArena-AI
```

---

# 💻 Backend Setup

Navigate to the backend directory and install the dependencies.

```bash
cd Backend

npm install
```

### Configure Environment Variables

Create a `.env` file inside the **Backend** folder.

```env
# Server
PORT=

# Database
MONGO_URL=

# AI Models
GOOGLE_API_KEY=
MISTRAL_API_KEY=
COHERE_API_KEY=

# Authentication
JWT_SECRET=
```

Start the backend server.

```bash
npm run dev
```

---

# 🎨 Frontend Setup

Open a new terminal and install the frontend dependencies.

```bash
cd Frontend

npm install
```

Start the frontend.

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# 📸 Platform Preview

Experience an intuitive benchmarking workspace designed for comparing multiple Large Language Models through a unified evaluation interface.

<table align="center">

<tr>

<td align="center" width="50%">

### 🏠 Workspace Dashboard

<img src="https://ik.imagekit.io/Rishi749/Model_Arena_AI/Dashboard.png" width="100%" alt="ModelArena Dashboard"/>

<p align="center">
Create new comparison battles, monitor previous evaluations, and launch AI benchmarks from a unified workspace.
</p>

</td>

<td align="center" width="50%">

### ⚖️ Side-by-Side Evaluation

<img src="https://ik.imagekit.io/Rishi749/Model_Arena_AI/Comparision.gif" width="100%" alt="LLM Comparison"/>

<p align="center">
Compare responses from multiple LLMs alongside AI-generated scores and detailed reasoning from the evaluation engine.
</p>

</td>

</tr>

</table>

---

# 🤝 Contributing

Contributions are always welcome.

Whether you're improving the evaluation engine, adding support for new LLMs, enhancing the user interface, or refining benchmarking workflows, every contribution helps make ModelArena AI more powerful and reliable.

Feel free to open an issue, submit a pull request, or suggest new evaluation ideas.

---

<p align="center">
  <img
    src="https://ik.imagekit.io/Rishi749/Model_Arena_AI/Model_Arena_Footer.png"
    alt="ModelArena AI Footer"
    width="100%"
  />
</p>

<div align="center">

### ⭐ Thank you for exploring ModelArena AI

If you found this project valuable, consider giving it a **Star** on GitHub.

**Built with ❤️ by Rishabh Jagtap**

</div>
