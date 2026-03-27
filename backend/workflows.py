# workflows.py
from langchain_core.runnables import RunnableBranch, RunnableLambda, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from agent import get_agent_executor
import os


def _get_llm():
    """Lazy-initialize the report-generation LLM."""
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key or api_key.startswith("nvapi-xxxx"):
        raise ValueError("Please set a valid NVIDIA_API_KEY in backend/.env")
    return ChatNVIDIA(
        model="meta/llama-3.1-70b-instruct",
        nvidia_api_key=api_key,
        temperature=0.5
    )


# Step 1: Research using ReAct Agent
def run_research(inputs: dict) -> dict:
    topic = inputs["topic"]
    use_web_search = inputs.get("use_web_search", True)
    use_wikipedia = inputs.get("use_wikipedia", True)
    agent_executor = get_agent_executor(use_web_search=use_web_search, use_wikipedia=use_wikipedia)
    result = agent_executor.invoke({"input": f"Research this topic comprehensively: {topic}"})
    return {
        "topic": topic,
        "raw_research": result["output"],
        "steps": len(result.get("intermediate_steps", [])),
    }


def generate_report(topic: str, use_web_search: bool = True, use_wikipedia: bool = True) -> dict:
    """Full pipeline: research → route → report generation."""
    llm = _get_llm()

    # Step 2a: Short report (< 3 research steps)
    short_report_chain = (
        ChatPromptTemplate.from_template(
            "Topic: {topic}\nResearch: {raw_research}\n\n"
            "Write a brief 3-section report: Overview, Key Findings, Conclusion."
        )
        | llm
        | StrOutputParser()
    )

    # Step 2b: Detailed report (>= 3 research steps)
    detailed_report_chain = (
        ChatPromptTemplate.from_template(
            "Topic: {topic}\nResearch: {raw_research}\n\n"
            "Generate a detailed structured report with these sections:\n"
            "1. Executive Summary\n2. Background & Context\n3. Key Insights\n"
            "4. Data & Evidence\n5. Challenges & Risks\n6. Future Outlook\n7. References & Sources"
        )
        | llm
        | StrOutputParser()
    )

    # RunnableBranch: route based on research depth
    report_branch = RunnableBranch(
        (lambda x: x.get("steps", 0) >= 3, detailed_report_chain),
        short_report_chain,   # default
    )

    # Full pipeline
    research_pipeline = (
        RunnableLambda(run_research)
        | RunnablePassthrough.assign(report=report_branch)
    )

    result = research_pipeline.invoke({"topic": topic, "use_web_search": use_web_search, "use_wikipedia": use_wikipedia})
    return {
        "topic": topic,
        "report": result["report"],
        "research_steps": result["steps"],
    }
