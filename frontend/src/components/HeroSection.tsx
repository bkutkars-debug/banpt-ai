import React from 'react';
import { ArrowRight, Play, ShieldAlert, Sparkles, Zap } from 'lucide-react';
import { DemoScenario } from '../types';

interface HeroProps {
  onStartEmergency: () => void;
  onSelectScenario: (scenario: DemoScenario) => void;
  scenarios: DemoScenario[];
}

export const HeroSection: React.FC<HeroProps> = ({ onStartEmergency, onSelectScenario, scenarios }) => {
  return (
    <div className="relative pt-8 pb-12 overflow-hidden">
      {/* Background radial glowing effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center px-4">
        
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-6">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span>BANT PT — Autonomous Emergency Intelligence</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
          When every second matters, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-red-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
            AI should act.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          <strong>BANT PT</strong> turns raw emergency distress signals into synchronized first-responder briefs, dynamic severity models, and life-saving step-by-step action plans.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={onStartEmergency}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Zap className="w-5 h-5 text-amber-300" />
            <span>Start Emergency Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {scenarios.length > 0 && (
            <button
              onClick={() => onSelectScenario(scenarios[0])}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-dark-800 hover:bg-dark-700 border border-slate-700 hover:border-slate-600 transition-all shadow-md"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Try Instant Demo (Road Crash)</span>
            </button>
          )}
        </div>

        {/* Quick Scenario Selector Pills */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 max-w-3xl mx-auto text-left">
          <div className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Benchmark Scenarios
            </span>
            <span className="text-slate-500">Auto-populates multimodal telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc)}
                className="group p-3 rounded-xl bg-dark-800/80 hover:bg-dark-700 border border-slate-700/60 hover:border-red-500/40 text-left transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-white group-hover:text-red-400 transition-colors">
                    {sc.category}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300">
                    {sc.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {sc.description}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};