import React from 'react';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, Activity, Brain, AlertTriangle, FileText, MapPin, Eye } from 'lucide-react';
import { AgentTrace } from '../types';

interface PipelineProps {
  isLoading: boolean;
  activeStep: number;
  agentTraces: AgentTrace[];
}

export const AgentPipelineVisualizer: React.FC<PipelineProps> = ({ isLoading, activeStep, agentTraces }) => {
  const steps = [
    { name: 'Multimodal', role: 'Input Perception', icon: Eye, color: 'text-sky-400' },
    { name: 'Situation Agent', role: 'Context Extraction', icon: Brain, color: 'text-indigo-400' },
    { name: 'Risk Agent', role: 'Severity Engine', icon: AlertTriangle, color: 'text-amber-400' },
    { name: 'Action Agent', role: 'Guidance Generator', icon: Activity, color: 'text-emerald-400' },
    { name: 'Resource Agent', role: 'Geo Dispatcher', icon: MapPin, color: 'text-blue-400' },
    { name: 'Verification Agent', role: 'Safety Auditor', icon: ShieldCheck, color: 'text-purple-400' },
    { name: 'Emergency Brief', role: 'Responder Briefing', icon: FileText, color: 'text-rose-400' },
  ];

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Autonomous Agent Orchestration Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sequential & parallel execution across specialized logical sub-agents
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              Agent Step {activeStep + 1} of {steps.length} Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              All 6 Agents Synchronized
            </span>
          )}
        </div>
      </div>

      {/* Stepper Pipeline Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = !isLoading || idx < activeStep;
          const isCurrent = isLoading && idx === activeStep;

          return (
            <div
              key={step.name}
              className={`relative p-3 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-900/30 scale-105 z-10'
                  : isDone
                  ? 'bg-dark-800/90 border-slate-700/80 hover:border-slate-600'
                  : 'bg-dark-900/50 border-slate-800/50 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg bg-dark-900/80 ${step.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-600">0{idx + 1}</span>
                )}
              </div>

              <div className="text-xs font-bold text-slate-200 truncate">{step.name}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{step.role}</div>

              {/* Connected arrow for wide screens */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Agent Output Traces (When Available) */}
      {agentTraces && agentTraces.length > 0 && !isLoading && (
        <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {agentTraces.slice(0, 3).map((trace) => (
            <div key={trace.agent} className="p-2.5 rounded-lg bg-dark-900/70 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span className="text-slate-300 font-semibold">{trace.agent}</span>
                <span className="text-emerald-400 font-bold">{trace.duration_ms} ms</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                {trace.output_summary}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};