import { useState } from 'react';
import axios from 'axios';
import TopicInput from './components/TopicInput';
import LoadingSpinner from './components/LoadingSpinner';
import ReportViewer from './components/ReportViewer';
import TopNavBar from './components/TopNavBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ReportData {
  topic: string;
  report: string;
  research_steps: number;
}

function App() {
  const [topic, setTopic] = useState('');
  const [useWebSearch, setUseWebSearch] = useState(true);
  const [useWikipedia, setUseWikipedia] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    if (!useWebSearch && !useWikipedia) {
      setError('Please select at least one search tool.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await axios.post(`${API_URL}/research`, {
        topic: topic.trim(),
        use_web_search: useWebSearch,
        use_wikipedia: useWikipedia,
      });
      setReport(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ||
          err.message ||
          'Failed to generate report. Please try again.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewResearch = () => {
    setReport(null);
    setError(null);
    setTopic('');
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-background relative pt-16 flex flex-col">
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 pb-20 flex flex-col">
        <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col justify-center">
          {/* Show input when no report and not loading */}
          {!isLoading && !report && (
            <TopicInput
              topic={topic}
              setTopic={setTopic}
              useWebSearch={useWebSearch}
              setUseWebSearch={setUseWebSearch}
              useWikipedia={useWikipedia}
              setUseWikipedia={setUseWikipedia}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}

          {/* Loading State */}
          {isLoading && <LoadingSpinner topic={topic} />}

          {/* Error State */}
          {error && !isLoading && (
            <div className="w-full max-w-2xl mx-auto animate-fade-in-up mt-8">
              <div className="bg-error-container/20 border border-error/30 rounded-2xl p-6 text-center ambient-shadow">
                <div className="w-14 h-14 mx-auto mb-4 bg-error-container rounded-full flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-3xl">error</span>
                </div>
                <h3 className="text-lg font-bold font-headline text-error mb-2">Research Failed</h3>
                <p className="text-on-surface-variant mb-6">{error}</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    id="retry-btn"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-error text-on-error hover:opacity-90 rounded-full font-semibold transition-all shadow-md active:scale-95"
                  >
                    Retry
                  </button>
                  <button
                    id="back-btn"
                    onClick={handleNewResearch}
                    className="px-6 py-2.5 bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant rounded-full font-semibold transition-all active:scale-95"
                  >
                    Try Another Topic
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Report Display */}
          {report && !isLoading && (
            <ReportViewer data={report} onNewResearch={handleNewResearch} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-surface-container-high bg-surface-container-lowest mt-auto">
        <p className="text-on-surface-variant text-sm font-semibold">
          Built with FastAPI · LangChain · NVIDIA AI · React
        </p>
      </footer>
    </div>
  );
}

export default App;
