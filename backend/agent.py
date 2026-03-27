# agent.py
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_classic.agents import create_react_agent, AgentExecutor
from langchain_core.prompts import PromptTemplate
from tools import web_search, wikipedia_search
import os

tools = [web_search, wikipedia_search]

# ReAct prompt template
REACT_PROMPT = PromptTemplate.from_template("""
You are an expert research assistant. Your task is to research the given topic thoroughly and compile findings.

Use the following tools to gather information:
{tools}

Tool Names: {tool_names}

Follow this format strictly:
Thought: What do I need to find?
Action: tool_name
Action Input: your input to the tool
Observation: tool output
... (repeat Thought/Action/Observation as needed)
Thought: I have enough information.
Final Answer: [structured findings]

Begin!

Topic: {input}
{agent_scratchpad}
""")

_llm = None
_agent_executors = {}

def get_agent_executor(use_web_search=True, use_wikipedia=True):
    """Lazy-initialize and cache the agent executor based on selected tools."""
    global _llm, _agent_executors
    
    key = (use_web_search, use_wikipedia)
    if key in _agent_executors:
        return _agent_executors[key]

    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key or api_key.startswith("nvapi-xxxx"):
        raise ValueError("Please set a valid NVIDIA_API_KEY in backend/.env")

    if _llm is None:
        _llm = ChatNVIDIA(
            model="meta/llama-3.1-70b-instruct",
            nvidia_api_key=api_key,
            temperature=0.3,
            max_tokens=4096,
        )

    tools = []
    if use_web_search:
        tools.append(web_search)
    if use_wikipedia:
        tools.append(wikipedia_search)

    if not tools:
        raise ValueError("At least one tool must be selected")

    react_agent = create_react_agent(llm=_llm, tools=tools, prompt=REACT_PROMPT)

    executor = AgentExecutor(
        agent=react_agent,
        tools=tools,
        verbose=True,
        max_iterations=6,
        handle_parsing_errors=True,
        return_intermediate_steps=True,
    )
    
    _agent_executors[key] = executor
    return executor
