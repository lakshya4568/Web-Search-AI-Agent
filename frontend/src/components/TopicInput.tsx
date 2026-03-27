import React from 'react';

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const suggestedTopics = [
  'Impact of AI in Healthcare',
  'Quantum Computing Breakthroughs',
  'Climate Change Mitigation Strategies',
  'Future of Space Exploration',
  'Blockchain and Decentralized Finance',
];

const TopicInput: React.FC<TopicInputProps> = ({ topic, setTopic, onSubmit, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && topic.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
      {/* Main Input Area */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-sm" />
        <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
          <label htmlFor="topic-input" className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
            Research Topic
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a topic to research..."
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-gray-900/80 text-white placeholder-gray-500 rounded-xl border border-gray-600/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              id="generate-report-btn"
              onClick={onSubmit}
              disabled={!topic.trim() || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Topics */}
      <div className="mt-5 flex flex-wrap gap-2 justify-center">
        <span className="text-xs text-gray-500 mr-1 self-center">Try:</span>
        {suggestedTopics.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setTopic(suggestion)}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs bg-gray-800/60 text-gray-400 rounded-full border border-gray-700/50 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicInput;
