import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, HelpCircle, CheckCircle } from 'lucide-react';
import { RiskData } from '../types';

interface SeverityProps {
  risk: RiskData;
}

export const SeverityGaugeCard: React.FC<SeverityProps> = ({ risk }) => {
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MODERATE':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const getGaugeColor = (score: number) => {
    if (score >= 76) return 'from-red-600 to-rose-500';
    if (score >= 51) return 'from-amber-600 to-orange-500';
    if (score >= 26) return 'from-yellow-500 to-amber-500';
    return 'from-emerald-600 to-teal-500';
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Severity Engine Index
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${getBadgeStyle(risk.severity_level)}`}>
            {risk.severity_level}
          </span>
        </div>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-3 mb-4">
          <div className="text-5xl font-black text-white font-mono tracking-tight">
            {risk.severity_score}
            <span className="text-2xl text-slate-500 font-normal">/100</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            <div>Confidence: <span className="text-emerald-400 font-semibold">{risk.confidence}%</span></div>
            <div className="text-[11px] text-slate-400">{risk.urgency_target}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 mb-5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getGaugeColor(risk.severity_score)} transition-all duration-700`}
            style={{ width: `${Math.max(risk.severity_score, 8)}%` }}
          />
        </div>

        {/* Detected Risk Factors */}
        <div className="mb-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
            🚨 Detected Risk Factors:
          </span>
          <ul className="space-y-1.5">
            {risk.detected_risks.map((r, i) => (
              <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Why the AI assigned this severity (Transparent Reasoning) */}
      <div className="pt-3 border-t border-slate-800/80">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-slate-500" />
          Explainable AI Decision Audit:
        </span>
        <div className="space-y-1">
          {risk.reasoning_points.map((pt, i) => (
            <p key={i} className="text-[11px] text-slate-300 leading-snug font-sans">
              • {pt}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
};