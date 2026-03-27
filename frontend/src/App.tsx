import { useState } from 'react';
import axios from 'axios';
import TopicInput from './components/TopicInput';
import LoadingSpinner from './components/LoadingSpinner';
import ReportViewer from './components/ReportViewer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ReportData {
  topic: string;
  report: string;
  research_steps: number;
}

function App() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await axios.post(`${API_URL}/research`, {
        topic: topic.trim(),
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/3 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-16 pb-12 px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-950 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent mb-3">
            AI Research Agent
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Powered by NVIDIA AI & LangChain — generate comprehensive research reports on any topic in seconds
          </p>
        </header>

        {/* Main Content */}
        <main className="px-4 pb-20">
          {/* Show input when no report and not loading */}
          {!isLoading && !report && (
            <TopicInput
              topic={topic}
              setTopic={setTopic}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}

          {/* Loading State */}
          {isLoading && <LoadingSpinner topic={topic} />}

          {/* Error State */}
          {error && !isLoading && (
            <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-300 mb-2">Research Failed</h3>
                <p className="text-red-200/70 mb-6">{error}</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    id="retry-btn"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                  >
                    Retry
                  </button>
                  <button
                    id="back-btn"
                    onClick={handleNewResearch}
                    className="px-6 py-2.5 bg-gray-700/30 hover:bg-gray-600/30 text-gray-400 hover:text-gray-300 rounded-xl border border-gray-600/30 hover:border-gray-500/30 transition-all duration-300"
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
        </main>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-800/50">
          <p className="text-gray-600 text-sm">
            Built with FastAPI · LangChain · NVIDIA AI · React
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
