import React from 'react';

const TopNavBar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 text-xl font-bold text-gray-900 font-headline">
        <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
        Autonomous AI Research Agent
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a className="text-secondary font-bold border-b-2 border-secondary font-headline text-sm py-1 cursor-pointer hover:border-primary hover:text-primary transition-colors">
          Docs
        </a>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-gray-600 hover:text-primary transition-colors">
            code
          </button>
          <button className="text-white px-5 py-2 rounded-full text-sm font-semibold signature-gradient hover:opacity-90 transition-all active:scale-95">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
