import React, { useState } from 'react';
import { ShieldAlert, Ban, Clock, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { ActionPlanData } from '../types';
import { VoiceAssistant } from '../utils/voiceAssistant';

interface ActionPlanProps {
  actionPlan: ActionPlanData;
}

export const ActionPlanCard: React.FC<ActionPlanProps> = ({ actionPlan }) => {
  const [readingStep, setReadingStep] = useState<number | null>(null);

  const handleSpeakStep = (stepNumber: number, title: string, detail: string) => {
    if (readingStep === stepNumber) {
      VoiceAssistant.stop();
      setReadingStep(null);
    } else {
      setReadingStep(stepNumber);
      VoiceAssistant.speak(`Step ${stepNumber}: ${title}. ${detail}`, () => {
        setReadingStep(null);
      });
    }
  };

  const handleSpeakAll = () => {
    const fullSpeech = actionPlan.immediate_actions
      .map((a) => `Step ${a.step}: ${a.title}. ${a.detail}`)
      .join('. ');
    VoiceAssistant.speak(`Here are the immediate actions to follow: ${fullSpeech}`);
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Immediate Emergency Action Plan
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakAll}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-700 text-[11px] font-mono text-emerald-400 border border-slate-700 transition-colors"
              title="Voice assistant speaks all steps"
            >
              <Volume2 className="w-3 h-3" />
              <span>Read All</span>
            </button>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>Window: {actionPlan.estimated_action_time_minutes}</span>
            </div>
          </div>
        </div>

        {/* Immediate Step-by-Step Actions */}
        <div className="space-y-3 mb-6">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block font-semibold">
            ⚡ Step-by-Step Response Protocol:
          </span>

          {actionPlan.immediate_actions.map((act) => (
            <div
              key={act.step}
              className="p-3.5 rounded-xl bg-dark-800/90 border border-slate-700/80 hover:border-slate-600 transition-all flex items-start gap-3 relative group"
            >
              <div className="w-6 h-6 rounded-lg bg-red-600/20 border border-red-500/40 text-red-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                {act.step}
              </div>
              <div className="flex-1 pr-6">
                <h4 className="text-xs font-bold text-white mb-0.5">{act.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{act.detail}</p>
              </div>

              {/* Single step voice trigger */}
              <button
                onClick={() => handleSpeakStep(act.step, act.title, act.detail)}
                className="absolute right-3 top-3 p-1 rounded-md bg-dark-900/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Speak this step aloud"
              >
                {readingStep === act.step ? (
                  <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Bystander Instructions */}
        {actionPlan.bystander_steps && actionPlan.bystander_steps.length > 0 && (
          <div className="mb-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 block mb-2 font-semibold">
              👥 Bystander Coordination:
            </span>
            <div className="space-y-1.5">
              {actionPlan.bystander_steps.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* High-Risk Contraindications (What NOT to do) */}
      {actionPlan.contraindications && actionPlan.contraindications.length > 0 && (
        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-2">
            <Ban className="w-4 h-4 text-red-400" />
            <span>CRITICAL CONTRAINDICATIONS (DO NOT):</span>
          </div>
          <ul className="space-y-1">
            {actionPlan.contraindications.map((c, i) => (
              <li key={i} className="text-xs text-red-200/90 leading-snug flex items-start gap-2 font-medium">
                <span className="text-red-400">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};