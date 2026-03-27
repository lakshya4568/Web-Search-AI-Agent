# 🧠 AI Research Agent

> Generate comprehensive research reports on any topic using NVIDIA AI, LangChain ReAct agents, and real-time web search.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## ✨ Features

- **ReAct Agent** — Reason → Act → Observe loop using LangChain `AgentExecutor`
- **Web Search** — Real-time web scraping via [Firecrawl](https://firecrawl.dev)
- **Wikipedia Integration** — Structured summaries from Wikipedia
- **Smart Routing** — `RunnableBranch` generates short or detailed reports based on research depth
- **NVIDIA LLM** — Free 10K queries via `nvapi-` key on `meta/llama-3.1-70b-instruct`
- **Markdown Reports** — Beautiful rendered reports with copy & download support
- **Dark Theme UI** — Premium glassmorphic design with smooth animations

---

## 📁 Project Structure

```
research-agent/
├── backend/
│   ├── main.py           # FastAPI entry point
│   ├── agent.py           # ReAct agent with NVIDIA LLM
│   ├── tools.py           # Firecrawl + Wikipedia tools
│   ├── workflows.py       # RunnableBranch pipeline
│   ├── requirements.txt   # Python dependencies
│   └── .env               # API keys (not committed)
├── frontend/
│   ├── src/
│   │   ├── App.tsx                    # Main application
│   │   └── components/
│   │       ├── TopicInput.tsx         # Search input + suggestions
│   │       ├── LoadingSpinner.tsx     # Animated loading state
│   │       └── ReportViewer.tsx       # Markdown report renderer
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── package.json           # Root — runs both servers
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** and **Node.js 18+**
- [NVIDIA API Key](https://build.nvidia.com/explore/discover) (free, 10K queries)
- [Firecrawl API Key](https://firecrawl.dev) (free tier available)

### 1. Clone & Install

```bash
# Install all dependencies (creates Python venv + installs npm packages)
npm run install:all
```

Or manually:

```bash
# Backend
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt

# Frontend
cd ../frontend
npm install

# Root (for concurrently)
cd ..
npm install
```

### 2. Configure API Keys

Edit `backend/.env`:

```env
NVIDIA_API_KEY=nvapi-your-key-here
FIRECRAWL_API_KEY=fc-your-key-here
```

### 3. Run

```bash
npm run dev
```

This starts both servers concurrently:
- **Backend API** → http://localhost:8000
- **Frontend UI** → http://localhost:5173

---

## 🔌 API Endpoints

| Method | Endpoint    | Body                    | Response                                      |
|--------|-------------|-------------------------|-----------------------------------------------|
| POST   | `/research` | `{ "topic": "string" }` | `{ topic, report, research_steps }`           |
| GET    | `/health`   | —                       | `{ "status": "ok" }`                          |

### Example

```bash
curl -X POST http://localhost:8000/research \
  -H "Content-Type: application/json" \
  -d '{"topic": "Impact of AI in Healthcare"}'
```

---

## 🧩 Architecture

```
User Input → FastAPI → RunnableLambda(run_research)
                            ↓
                    ReAct Agent (AgentExecutor)
                    ├── web_search (Firecrawl)
                    └── wikipedia_search
                            ↓
                    RunnableBranch
                    ├── steps >= 3 → Detailed Report Chain
                    └── default    → Short Report Chain
                            ↓
                    Formatted Markdown Report → React UI
```

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| LLM       | NVIDIA `meta/llama-3.1-70b-instruct` |
| Agent     | LangChain ReAct + AgentExecutor     |
| Pipeline  | RunnableBranch + RunnableLambda     |
| Search    | Firecrawl (web) + Wikipedia API     |
| Backend   | FastAPI + Uvicorn                   |
| Frontend  | React 18 + TypeScript + Tailwind    |
| Markdown  | react-markdown + remark-gfm        |

---

## 📝 Key Concepts

| Concept         | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| **ReAct Agent** | Reason → Act → Observe loop until final answer                             |
| **RunnableBranch** | Conditional chain routing based on research depth                       |
| **NVIDIA Endpoints** | Free 10K queries via `nvapi-` API key                               |
| **Firecrawl**   | Search + scrape in a single API call                                       |
| **AgentExecutor** | Runs the agent loop with tools, memory, and error handling              |

---

## 📄 License

MIT
