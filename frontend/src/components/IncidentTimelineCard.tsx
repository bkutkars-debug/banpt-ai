import React, { useState } from 'react';
import { Clock, PlusCircle, RefreshCw, Send, Radio, AlertCircle } from 'lucide-react';
import { TimelineEvent } from '../types';

interface TimelineProps {
  timeline: TimelineEvent[];
  onAddUpdate: (updateText: string) => void;
  isUpdating: boolean;
}

export const IncidentTimelineCard: React.FC<TimelineProps> = ({ timeline, onAddUpdate, isUpdating }) => {
  const [updateText, setUpdateText] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateText.trim()) return;
    onAddUpdate(updateText);
    setUpdateText('');
    setShowInput(false);
  };

  const sampleUpdates = [
    "Person is now conscious and talking.",
    "Ambulance just arrived on scene.",
    "Police patrol has cordoned off the area.",
    "Bleeding is getting worse, need urgent tourniquet advice.",
  ];

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Real-Time Incident Timeline
          </h3>
        </div>
        <button
          onClick={() => setShowInput(!showInput)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Live Update</span>
        </button>
      </div>

      {/* Input Modal / Inline Form */}
      {showInput && (
        <form onSubmit={handleSubmit} className="mb-5 p-3.5 rounded-xl bg-dark-800/90 border border-sky-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-sky-400 font-semibold">
              Broadcast Field Status Update (AI will re-calculate severity):
            </span>
            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <input
            type="text"
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="e.g. 'Person is now conscious' or 'Fire spreading to adjacent room'"
            className="w-full bg-dark-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-sans"
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5">
            {sampleUpdates.map((s, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setUpdateText(s)}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-900 text-slate-400 hover:text-white border border-slate-700/60"
              >
                + {s}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isUpdating || !updateText.trim()}
            className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Transmit & Re-Analyze Incident</span>
          </button>
        </form>
      )}

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((evt, idx) => (
          <div key={evt.id || idx} className="relative group">
            <div className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 border-dark-900 ${
              evt.event_type === 'STATUS_UPDATE'
                ? 'bg-amber-400 ring-2 ring-amber-400/30'
                : idx === 0
                ? 'bg-red-500 ring-2 ring-red-500/30'
                : 'bg-slate-400'
            }`} />

            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-mono font-bold text-slate-400">
                {evt.time_display}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
                {evt.source}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-snug">
              {evt.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};