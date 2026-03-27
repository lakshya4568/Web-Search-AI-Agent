# tools.py
import wikipediaapi
from langchain_core.tools import tool
import os

wiki = wikipediaapi.Wikipedia(user_agent="ResearchAgent/1.0", language="en")

def _get_firecrawl():
    """Lazy-initialize Firecrawl client to avoid startup failures when API key is not set."""
    from firecrawl import Firecrawl
    api_key = os.getenv("FIRECRAWL_API_KEY")
    if not api_key or api_key.startswith("fc-xxxx"):
        raise ValueError("Please set a valid FIRECRAWL_API_KEY in backend/.env")
    return Firecrawl(api_key=api_key)

@tool
def web_search(query: str) -> str:
    """Search the web for current information on a topic and return full page content."""
    try:
        firecrawl = _get_firecrawl()
        results = firecrawl.search(
            query,
            limit=3,
            scrape_options={"formats": ["markdown"]}
        )
        pages = results.get("data", [])
        output = ""
        for page in pages:
            output += f"\n## Source: {page.get('url', '')}\n"
            output += page.get("markdown", page.get("content", ""))[:1500]
        return output or "No results found."
    except Exception as e:
        return f"Web search error: {str(e)}"

@tool
def wikipedia_search(topic: str) -> str:
    """Fetch a structured Wikipedia summary and key sections on a topic."""
    page = wiki.page(topic)
    if not page.exists():
        return f"No Wikipedia page found for: {topic}"
    summary = page.summary[:2000]
    sections = "\n".join([s.title for s in page.sections[:8]])
    return f"# {page.title}\n\n**Summary:**\n{summary}\n\n**Key Sections:**\n{sections}"
