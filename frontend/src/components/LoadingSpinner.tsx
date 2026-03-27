import React, { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  topic: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ topic }) => {
  const [progress, setProgress] = useState(10);
  
  useEffect(() => {
    // Fake progress bar increment
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up mt-8">
      {/* Agent Status Card */}
      <section className="bg-surface-container-lowest rounded-2xl overflow-hidden ghost-border ambient-shadow border-l-4 border-primary">
        <div className="h-1.5 w-full bg-surface-container-high relative">
          <div 
            className="absolute inset-y-0 left-0 signature-gradient transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <span className="material-symbols-outlined">cognition</span>
            </div>
            <div>
              <h3 className="font-bold text-lg font-headline text-on-surface">Agent is Researching...</h3>
              <p className="text-on-surface-variant text-sm line-clamp-1 break-all">Synthesizing data for "{topic}"</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
              Searching Web
            </div>
            <div 
              className="flex items-center gap-1.5 px-3 py-1 text-on-surface-variant bg-surface-container rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ animation: 'fade-in-up 0.5s ease-out 1.5s both' }}
            >
              <span className="material-symbols-outlined text-[12px]">book</span>
              Reading Wikipedia
            </div>
            <div 
              className="flex items-center gap-1.5 px-3 py-1 text-on-surface-variant bg-surface-container rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ animation: 'fade-in-up 0.5s ease-out 3s both' }}
            >
              <span className="material-symbols-outlined text-[12px]">description</span>
              Generating Report
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoadingSpinner;
