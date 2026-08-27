import React from 'react';
import { Shield, Terminal, Radio, Volume2, VolumeX } from 'lucide-react';
import { VoiceAssistant } from '../utils/voiceAssistant';

interface NavbarProps {
  judgeMode: boolean;
  setJudgeMode: (val: boolean) => void;
  activeIncident: boolean;
  onReset: () => void;
  isVoiceMuted: boolean;
  setIsVoiceMuted: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  judgeMode,
  setJudgeMode,
  activeIncident,
  onReset,
  isVoiceMuted,
  setIsVoiceMuted,
}) => {
  const toggleVoice = () => {
    const nextState = !isVoiceMuted;
    setIsVoiceMuted(nextState);
    VoiceAssistant.setMuted(nextState);
    if (!nextState) {
      VoiceAssistant.speak('Voice assistant enabled. BANT PT emergency briefings will be announced aloud.');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-dark-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white bg-clip-text">
                BANT <span className="text-red-500">PT</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                PROTOTYPE v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Autonomous Emergency Response Assistant</p>
          </div>
        </div>

        {/* Center Live Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800/80 border border-slate-700/50 text-xs text-slate-300">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>BANT PT Dispatch Grid:</span>
          <span className="text-emerald-400 font-semibold">6 Agents Online</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Voice Assistant Toggle */}
          <button
            onClick={toggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              !isVoiceMuted
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950/40'
                : 'bg-dark-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={!isVoiceMuted ? 'Voice Assistant Active (Click to mute)' : 'Voice Assistant Muted (Click to enable audio voice)'}
          >
            {!isVoiceMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Voice: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Voice: OFF</span>
              </>
            )}
          </button>

          {activeIncident && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              New Emergency
            </button>
          )}

          {/* Judge Mode Switch */}
          <button
            onClick={() => setJudgeMode(!judgeMode)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
              judgeMode
                ? 'bg-purple-950/70 border-purple-500/60 text-purple-200 shadow-lg shadow-purple-950/50'
                : 'bg-dark-800 hover:bg-dark-700 border-slate-700 text-slate-300'
            }`}
          >
            <Terminal className={`w-3.5 h-3.5 ${judgeMode ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
            <span>Judge Mode</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${judgeMode ? 'bg-purple-500/30 text-purple-300' : 'bg-slate-700 text-slate-400'}`}>
              {judgeMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};