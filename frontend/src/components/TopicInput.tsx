import React from 'react';

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  useWebSearch: boolean;
  setUseWebSearch: (val: boolean) => void;
  useWikipedia: boolean;
  setUseWikipedia: (val: boolean) => void;
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

const TopicInput: React.FC<TopicInputProps> = ({ 
  topic, setTopic, useWebSearch, setUseWebSearch, useWikipedia, setUseWikipedia, onSubmit, isLoading 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && topic.trim() && !isLoading && (useWebSearch || useWikipedia)) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-fade-in-up">
      {/* Hero Section */}
      <header className="text-center space-y-4 pt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-on-surface leading-tight">
          Your <span className="text-transparent bg-clip-text signature-gradient">Autonomous AI Research</span> Agent
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl mx-auto font-body">
          Enter any topic. The agent searches, analyzes, and writes a full report in seconds.
        </p>
      </header>

      {/* Input Card */}
      <section className="relative">
        <div className="bg-surface-container-lowest ambient-shadow rounded-2xl p-6 space-y-6 ghost-border">
          <div className="relative">
            <input
              className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-6 pr-12 text-lg focus:ring-2 focus:ring-primary/20 placeholder-outline text-on-surface focus:outline-none transition-shadow"
              placeholder="e.g. Impact of AI in Healthcare..."
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
              search
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setUseWebSearch(!useWebSearch)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors group border ${useWebSearch ? 'bg-primary-container/20 border-primary text-primary' : 'bg-surface-container-low border-transparent text-on-surface hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                  language
                </span>
                <span className="text-sm font-semibold font-label">Web Search</span>
              </button>
              <button 
                onClick={() => setUseWikipedia(!useWikipedia)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors group border ${useWikipedia ? 'bg-green-100 border-green-600 text-green-700' : 'bg-surface-container-low border-transparent text-on-surface hover:bg-surface-container-high'}`}
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                  menu_book
                </span>
                <span className="text-sm font-semibold font-label">Wikipedia</span>
              </button>
            </div>
            <button
              id="generate-report-btn"
              onClick={onSubmit}
              disabled={!topic.trim() || isLoading || (!useWebSearch && !useWikipedia)}
              className="signature-gradient text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Report
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Examples Row */}
        <div className="mt-8 flex flex-wrap items-center gap-3 justify-center md:justify-start">
          <span className="text-on-surface-variant text-sm font-medium font-label">Try an example:</span>
          {suggestedTopics.map((suggestion, index) => {
            const colors = [
              'bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim',
              'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim',
              'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim',
              'bg-orange-100 text-orange-900 hover:bg-orange-200'
            ];
            const colorClass = colors[index % colors.length];
            return (
              <button
                key={suggestion}
                onClick={() => setTopic(suggestion)}
                disabled={isLoading}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colorClass}`}
              >
                {suggestion}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TopicInput;
