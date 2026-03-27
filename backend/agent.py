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

_agent_executor = None

def get_agent_executor():
    """Lazy-initialize the agent executor so the server can start without API keys."""
    global _agent_executor
    if _agent_executor is None:
        api_key = os.getenv("NVIDIA_API_KEY")
        if not api_key or api_key.startswith("nvapi-xxxx"):
            raise ValueError("Please set a valid NVIDIA_API_KEY in backend/.env")

        llm = ChatNVIDIA(
            model="meta/llama-3.1-70b-instruct",
            nvidia_api_key=api_key,
            temperature=0.3,
            max_tokens=4096,
        )

        react_agent = create_react_agent(llm=llm, tools=tools, prompt=REACT_PROMPT)

        _agent_executor = AgentExecutor(
            agent=react_agent,
            tools=tools,
            verbose=True,
            max_iterations=6,
            handle_parsing_errors=True,
            return_intermediate_steps=True,
        )
    return _agent_executor
