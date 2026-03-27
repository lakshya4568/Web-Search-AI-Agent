import React from 'react';

interface LoadingSpinnerProps {
  topic: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ topic }) => {
  const steps = [
    { icon: '🔍', text: 'Searching the web...', delay: '0s' },
    { icon: '📚', text: 'Scanning Wikipedia...', delay: '0.2s' },
    { icon: '🧠', text: 'Analyzing sources...', delay: '0.4s' },
    { icon: '📝', text: 'Compiling report...', delay: '0.6s' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="relative">
        {/* Glow background */}
        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl" />

        <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 animate-pulse-glow">
          {/* Central spinner */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 mb-6">
              {/* Outer ring */}
              <div className="absolute inset-0 border-4 border-gray-700 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 border-r-indigo-400 rounded-full animate-spin" />
              {/* Inner ring */}
              <div className="absolute inset-2 border-4 border-transparent border-b-purple-500 border-l-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Researching...
            </h3>
            <p className="text-indigo-300 text-center font-medium">
              "{topic}"
            </p>
          </div>

          {/* Animated steps */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700/30"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${step.delay} both`,
                }}
              >
                <span className="text-xl animate-pulse" style={{ animationDelay: step.delay }}>
                  {step.icon}
                </span>
                <div className="flex-1">
                  <div className="h-2 animate-shimmer rounded-full" style={{ width: `${70 + index * 8}%` }} />
                </div>
                <span className="text-xs text-gray-500">{step.text}</span>
              </div>
            ))}
          </div>

          {/* Estimated time */}
          <p className="text-center text-gray-500 text-sm mt-6">
            This may take 30–90 seconds depending on the topic complexity
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
