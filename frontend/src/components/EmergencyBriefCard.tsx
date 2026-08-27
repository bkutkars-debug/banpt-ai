import React, { useState } from 'react';
import { FileText, Copy, Share2, Download, Check, Volume2, VolumeX } from 'lucide-react';
import { EmergencyBriefData } from '../types';
import { VoiceAssistant } from '../utils/voiceAssistant';

interface BriefProps {
  brief: EmergencyBriefData;
  incidentId: string;
}

export const EmergencyBriefCard: React.FC<BriefProps> = ({ brief, incidentId }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(brief.shareable_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `RAKSHAK SOS - ${brief.emergency_type}`,
        text: brief.shareable_text,
      }).catch(() => handleCopy());
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([brief.shareable_text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Rakshak-Emergency-Brief-${incidentId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSpeakBrief = () => {
    if (isSpeaking) {
      VoiceAssistant.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToSpeak = `Emergency Briefing for incident ${incidentId}. Emergency type: ${brief.emergency_type}. Priority: ${brief.priority}, severity score ${brief.severity_score} out of 100. Situation: ${brief.situation_summary}. Primary recommended action: ${brief.recommended_action}.`;
      VoiceAssistant.speak(textToSpeak, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div className="glass-panel-glow-red p-5 sm:p-6 rounded-2xl border border-red-500/30 shadow-2xl relative overflow-hidden">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-red-500/20 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Official Emergency Dispatch Brief
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakBrief}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              isSpeaking
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-dark-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Read brief out loud"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isSpeaking ? 'Stop Voice' : 'Speak Aloud'}</span>
          </button>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
            ID: {incidentId}
          </span>
        </div>
      </div>

      {/* Brief Content Formatted */}
      <div className="space-y-3 font-sans text-xs mb-5">
        <div className="grid grid-cols-2 gap-2 bg-dark-900/60 p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-400 font-mono text-[10px] block">TYPE</span>
            <span className="font-bold text-white text-sm">{brief.emergency_type}</span>
          </div>
          <div>
            <span className="text-slate-400 font-mono text-[10px] block">PRIORITY</span>
            <span className="font-bold text-red-400 text-sm">{brief.priority} ({brief.severity_score}/100)</span>
          </div>
          <div>
            <span className="text-slate-400 font-mono text-[10px] block">PEOPLE INVOLVED</span>
            <span className="font-semibold text-slate-200">{brief.people_affected} individual(s)</span>
          </div>
          <div>
            <span className="text-slate-400 font-mono text-[10px] block">LOCATION</span>
            <span className="font-semibold text-slate-200 truncate block">{brief.location_display}</span>
          </div>
        </div>

        {/* Situation */}
        <div className="bg-dark-900/40 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Situation Synopsis
          </span>
          <p className="text-slate-200 leading-relaxed">{brief.situation_summary}</p>
        </div>

        {/* Critical Risks */}
        <div className="bg-dark-900/40 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block mb-1 font-semibold">
            Detected Critical Hazards
          </span>
          <ul className="space-y-1">
            {brief.detected_risks.map((risk, i) => (
              <li key={i} className="text-slate-300 flex items-center gap-1.5">
                <span className="text-red-400 font-bold">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Action */}
        <div className="bg-red-950/30 p-3 rounded-xl border border-red-500/30">
          <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider block mb-1 font-semibold">
            Primary Dispatch Action
          </span>
          <p className="text-white font-medium">{brief.recommended_action}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Share SOS</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-md shadow-red-600/30 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>

    </div>
  );
};