# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from workflows import generate_report
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="Research Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str
    use_web_search: bool = True
    use_wikipedia: bool = True

@app.post("/research")
async def research(request: ResearchRequest):
    result = generate_report(request.topic, request.use_web_search, request.use_wikipedia)
    return result

@app.get("/health")
async def health():
    return {"status": "ok"}
