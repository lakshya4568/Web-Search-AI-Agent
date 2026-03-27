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
        print(f"\n[🔥 Firecrawl API] Initiating web search for query: '{query}'")
        firecrawl = _get_firecrawl()
        
        print(f"   -> Sending request to Firecrawl endpoints...")
        results = firecrawl.search(
            query,
            limit=3,
            scrape_options={"formats": ["markdown"]}
        )
        
        pages = results.get("data", [])
        print(f"   -> Successfully fetched {len(pages)} source(s) from Firecrawl.")
        
        output = ""
        for page in pages:
            url = page.get('url', 'Unknown URL')
            print(f"      - Scraped content from: {url}")
            output += f"\n## Source: {url}\n"
            output += page.get("markdown", page.get("content", ""))[:1500]
            
        print("[🔥 Firecrawl API] Web search operation complete.\n")
        return output or "No results found."
    except Exception as e:
        print(f"[🔥 Firecrawl API] ERROR during web search: {str(e)}\n")
        return f"Web search error: {str(e)}"

@tool
def wikipedia_search(topic: str) -> str:
    """Fetch a structured Wikipedia summary and key sections on a topic."""
    print(f"\n[📚 Wikipedia API] Fetching article for topic: '{topic}'")
    
    page = wiki.page(topic)
    if not page.exists():
        print(f"   -> Article not found on Wikipedia.")
        print("[📚 Wikipedia API] Operation complete.\n")
        return f"No Wikipedia page found for: {topic}"
        
    print(f"   -> Success! Retrieved article: '{page.title}'")
    summary = page.summary[:2000]
    sections = [s.title for s in page.sections[:8]]
    print(f"   -> Extracted {len(sections)} sections and summary.")
    
    print("[📚 Wikipedia API] Operation complete.\n")
    return f"# {page.title}\n\n**Summary:**\n{summary}\n\n**Key Sections:**\n{'\n'.join(sections)}"
