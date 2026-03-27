import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReportData {
  topic: string;
  report: string;
  research_steps: number;
}

interface ReportViewerProps {
  data: ReportData;
  onNewResearch: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ data, onNewResearch }) => {
  const [copied, setCopied] = useState(false);
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = data.report;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([`# ${data.topic}\n\n${data.report}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.topic.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_').toLowerCase()}_report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold font-headline text-on-surface">Generated Report</h2>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold self-start sm:self-auto">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          Complete
        </span>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 ambient-shadow ghost-border space-y-8">
        {/* Metadata Row */}
        <div className="flex flex-wrap gap-6 pb-6 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">tag</span>
            <span className="text-xs font-semibold text-on-surface-variant uppercase line-clamp-1">{data.topic}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">link</span>
            <span className="text-xs font-semibold text-on-surface-variant uppercase">{data.research_steps} Sources Cited</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">schedule</span>
            <span className="text-xs font-semibold text-on-surface-variant uppercase">{timestamp}</span>
          </div>
        </div>

        {/* Markdown Content Simulator */}
        <article className="prose max-w-none text-on-surface font-body space-y-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.report}
          </ReactMarkdown>
        </article>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 border-t border-surface-container-high">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant text-on-surface-variant font-semibold text-sm hover:bg-surface-container transition-all"
            >
              <span className="material-symbols-outlined text-lg">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-all"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Download .md
            </button>
          </div>
          <button
            onClick={onNewResearch}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-white font-semibold text-sm hover:bg-secondary-container transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Research
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
