import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Terminal, Cpu, Database, Activity, 
  CheckCircle2, Play, RefreshCw, Send, Radio, Lock, Eye, 
  Layers, Crosshair, ArrowRight, UserX, Server, Check, Clock,
  Volume2, VolumeX, ShieldAlert, Zap, Flame, PhoneCall
} from 'lucide-react';
import { VoiceAssistant } from './utils/voiceAssistant';

export function App() {
  const [activeModule, setActiveModule] = useState<'EMERGENCY' | 'CYBER_SOC'>('EMERGENCY');
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);

  // --- EMERGENCY STATE ---
  const [emergencyScenarios, setEmergencyScenarios] = useState<any[]>([]);
  const [selectedEmergencyScenario, setSelectedEmergencyScenario] = useState<any | null>(null);
  const [emergencyText, setEmergencyText] = useState('');
  const [emergencyCategory, setEmergencyCategory] = useState('Road Accident');
  const [emergencyLocation, setEmergencyLocation] = useState('Ring Road Sector 4 Junction, New Delhi');
  const [isAnalyzingEmergency, setIsAnalyzingEmergency] = useState(false);
  const [emergencyIncident, setEmergencyIncident] = useState<any | null>(null);
  const [updateText, setUpdateText] = useState('');
  const [isUpdatingTimeline, setIsUpdatingTimeline] = useState(false);

  // --- CYBER SOC STATE ---
  const [socScenarios, setSocScenarios] = useState<any[]>([]);
  const [selectedSocScenarioId, setSelectedSocScenarioId] = useState<string>('scenario-cred-stuffing');
  const [socIncident, setSocIncident] = useState<any | null>(null);
  const [isSimulatingSoc, setIsSimulatingSoc] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    { sender: 'agent', text: 'BantPT AI SOC Copilot active. Ask me about MITRE techniques, targeted users, or containment actions.', time: '23:00' }
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [isAskingCopilot, setIsAskingCopilot] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);

  // Load initial scenarios
  useEffect(() => {
    // Fetch Emergency scenarios
    fetch('http://localhost:8080/api/emergency/scenarios')
      .then(r => r.json())
      .then(d => { if (d.scenarios) setEmergencyScenarios(d.scenarios); })
      .catch(e => console.warn(e));

    // Fetch SOC scenarios & baseline incident
    fetch('http://localhost:8080/api/soc/scenarios')
      .then(r => r.json())
      .then(d => { if (d.scenarios) setSocScenarios(d.scenarios); })
      .catch(e => console.warn(e));

    fetch('http://localhost:8080/api/soc/incident/current')
      .then(r => r.json())
      .then(d => setSocIncident(d))
      .catch(e => console.warn(e));
  }, []);

  // --- EMERGENCY HANDLERS ---
  const handleSelectEmergencyScenario = (sc: any) => {
    setSelectedEmergencyScenario(sc);
    setEmergencyText(sc.sample_text);
    setEmergencyCategory(sc.category);
    setEmergencyLocation(sc.location_name);
    VoiceAssistant.speak(`Loaded emergency benchmark scenario: ${sc.title}`);
  };

  const handleAnalyzeEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyText.trim()) return;
    setIsAnalyzingEmergency(true);
    VoiceAssistant.speak("BantPT AI analyzing emergency situation. Dispatching multi-agent coordination pipeline.");

    try {
      const res = await fetch('http://localhost:8080/api/emergency/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: emergencyText,
          location_name: emergencyLocation,
          category: emergencyCategory,
          latitude: 28.5672,
          longitude: 77.2100
        }),
      });
      const data = await res.json();
      setEmergencyIncident(data);
      setIsAnalyzingEmergency(false);

      if (data?.situation && data?.risk) {
        VoiceAssistant.speakEmergencyAlert(
          data.situation.emergency_type,
          data.risk.severity_level,
          data.action_plan?.immediate_actions?.[0]?.title || 'Secure area'
        );
      }
    } catch (err) {
      setIsAnalyzingEmergency(false);
    }
  };

  const handleAddTimelineUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateText.trim() || !emergencyIncident) return;
    setIsUpdatingTimeline(true);
    VoiceAssistant.speak(`Field update received: ${updateText}. Recalculating incident severity.`);

    try {
      const res = await fetch('http://localhost:8080/api/emergency/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: emergencyIncident.incident_id,
          update_text: updateText,
          source: 'BantPT Field Operator'
        }),
      });
      const data = await res.json();
      setEmergencyIncident((prev: any) => ({
        ...prev,
        risk: data.risk || prev.risk,
        action_plan: data.action_plan || prev.action_plan,
        timeline: data.timeline_event ? [data.timeline_event, ...prev.timeline] : prev.timeline
      }));
      setUpdateText('');
      setIsUpdatingTimeline(false);
    } catch (err) {
      setIsUpdatingTimeline(false);
    }
  };

  // --- CYBER SOC HANDLERS ---
  const handleSimulateSoc = async (scId: string) => {
    setSelectedSocScenarioId(scId);
    setIsSimulatingSoc(true);
    try {
      const res = await fetch('http://localhost:8080/api/soc/incident/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scId }),
      });
      const data = await res.json();
      setSocIncident(data);
      setIsSimulatingSoc(false);
    } catch (err) {
      setIsSimulatingSoc(false);
    }
  };

  const handleApproveSocAction = async (actionId: string) => {
    setExecutingActionId(actionId);
    try {
      const res = await fetch('http://localhost:8080/api/soc/action/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_id: actionId }),
      });
      const data = await res.json();
      if (data.incident) setSocIncident(data.incident);
      setExecutingActionId(null);
    } catch (e) {
      setExecutingActionId(null);
    }
  };

  const handleSendCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isAskingCopilot) return;
    const q = userQuery;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: q, time: now }]);
    setUserQuery('');
    setIsAskingCopilot(true);

    try {
      const res = await fetch('http://localhost:8080/api/soc/copilot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'agent', text: data.reply, time: data.timestamp }]);
      setIsAskingCopilot(false);
    } catch (e) {
      setIsAskingCopilot(false);
    }
  };

  const toggleVoice = () => {
    const nextState = !isVoiceMuted;
    setIsVoiceMuted(nextState);
    VoiceAssistant.setMuted(nextState);
    if (!nextState) {
      VoiceAssistant.speak('BantPT AI Voice assistant active.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 glass-soc border-b border-slate-800 bg-[#07090e]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-white">
                  BANTPT <span className="text-red-500">AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  UNIFIED PLATFORM v3.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Autonomous Emergency Response & Cyber Defense SOC</p>
            </div>
          </div>

          {/* Module Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveModule('EMERGENCY')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeModule === 'EMERGENCY'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Emergency Response (BANT PT)</span>
            </button>

            <button
              onClick={() => setActiveModule('CYBER_SOC')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeModule === 'CYBER_SOC'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-300" />
              <span>Cyber Security SOC (Sentinel AI)</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                !isVoiceMuted
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              {!isVoiceMuted ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Voice: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Voice: OFF</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Safety Notice */}
      <div className="bg-red-950/70 border-b border-red-500/30 py-2 px-4 text-center text-xs text-red-200">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span><strong>BantPT AI Unified Command Center:</strong> Autonomous AI decision engine for physical disaster triage and enterprise cyber defense. Dial 112 / 911 in active life-critical emergencies.</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">

        {/* ========================================================================= */}
        {/* MODULE 1: EMERGENCY RESPONSE ASSISTANT (BANT PT)                          */}
        {/* ========================================================================= */}
        {activeModule === 'EMERGENCY' && (
          <div className="space-y-6">
            
            {/* Hero & Benchmark Scenarios */}
            <div className="glass-soc p-5 rounded-2xl border border-slate-800">
              <div className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-red-400 font-bold">
                  <Flame className="w-4 h-4" />
                  1-Click Emergency Benchmark Scenarios
                </span>
                <span className="text-slate-500">Auto-populates distress signals</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {emergencyScenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectEmergencyScenario(sc)}
                    className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-red-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-red-400">{sc.category}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{sc.badge}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{sc.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Input Form */}
            <div className="glass-soc p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Emergency Distress Input Console
              </h3>

              <form onSubmit={handleAnalyzeEmergency} className="space-y-4">
                <div>
                  <textarea
                    rows={3}
                    value={emergencyText}
                    onChange={(e) => setEmergencyText(e.target.value)}
                    placeholder="Describe the emergency (e.g., 'Severe two-car accident on highway. One victim unconscious with bleeding')..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>Location:</span>
                    <input
                      type="text"
                      value={emergencyLocation}
                      onChange={(e) => setEmergencyLocation(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzingEmergency || !emergencyText.trim()}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all"
                  >
                    {isAnalyzingEmergency ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-300" />}
                    <span>{isAnalyzingEmergency ? 'Orchestrating 6 Agents...' : 'Analyze Emergency & Dispatch'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Emergency Results Dashboard */}
            {emergencyIncident && (
              <div className="space-y-6">
                
                {/* Ribbon */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">INCIDENT ID</span>
                      <div className="text-sm font-bold text-white font-mono">{emergencyIncident.incident_id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">SEVERITY</span>
                      <span className="font-bold text-red-400">{emergencyIncident.risk.severity_level} ({emergencyIncident.risk.severity_score}/100)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">AGENTS</span>
                      <span className="font-bold text-emerald-400">6 Synced</span>
                    </div>
                  </div>
                </div>

                {/* 3-Card Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Severity */}
                  <div className="glass-soc p-5 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-mono uppercase text-slate-300 font-bold block">Severity Engine Index</span>
                    <div className="text-4xl font-black text-white font-mono">{emergencyIncident.risk.severity_score}<span className="text-xl text-slate-500">/100</span></div>
                    <div className="space-y-1 text-xs text-slate-300">
                      {emergencyIncident.risk.detected_risks.map((r: string, idx: number) => (
                        <div key={idx}>• {r}</div>
                      ))}
                    </div>
                  </div>

                  {/* Action Plan */}
                  <div className="glass-soc p-5 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-mono uppercase text-slate-300 font-bold block">Immediate Action Protocol</span>
                    <div className="space-y-2">
                      {emergencyIncident.action_plan.immediate_actions.map((act: any) => (
                        <div key={act.step} className="p-2.5 rounded-lg bg-slate-900 text-xs">
                          <span className="font-bold text-white">{act.step}. {act.title}</span>
                          <p className="text-slate-400 text-[11px]">{act.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dispatch Brief */}
                  <div className="glass-soc p-5 rounded-2xl border border-red-500/30 space-y-3">
                    <span className="text-xs font-mono uppercase text-red-400 font-bold block">Official Responder Brief</span>
                    <p className="text-xs text-slate-200 leading-relaxed">{emergencyIncident.emergency_brief.situation_summary}</p>
                    <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-semibold text-amber-300">
                      Action: {emergencyIncident.emergency_brief.recommended_action}
                    </div>
                  </div>

                </div>

                {/* Timeline Update */}
                <div className="glass-soc p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-mono uppercase text-slate-300 font-bold mb-3">Live Incident Timeline & Dynamic Re-Evaluation</h4>
                  <form onSubmit={handleAddTimelineUpdate} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={updateText}
                      onChange={(e) => setUpdateText(e.target.value)}
                      placeholder="Add field status update (e.g. 'Person is now conscious')..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button type="submit" disabled={isUpdatingTimeline} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs">
                      {isUpdatingTimeline ? 'Recalculating...' : 'Update Status'}
                    </button>
                  </form>

                  <div className="space-y-2">
                    {emergencyIncident.timeline.map((evt: any, i: number) => (
                      <div key={i} className="p-2 rounded bg-slate-900 text-xs flex justify-between text-slate-300">
                        <span>[{evt.time_display}] {evt.description}</span>
                        <span className="text-[10px] font-mono text-slate-500">{evt.source}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 2: CYBER SECURITY SOC (SENTINEL AI)                                */}
        {/* ========================================================================= */}
        {activeModule === 'CYBER_SOC' && (
          <div className="space-y-6">
            
            {/* Scenarios */}
            <div className="glass-soc p-4 rounded-2xl border border-slate-800">
              <div className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Crosshair className="w-4 h-4" />
                  1-Click Synthetic Cyber Attack Scenarios
                </span>
                <span className="text-slate-500">Injects EDR & Cloud SIEM correlation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {socScenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSimulateSoc(sc.id)}
                    disabled={isSimulatingSoc}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      selectedSocScenarioId === sc.id
                        ? 'bg-slate-800 border-cyan-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold truncate max-w-[170px]">{sc.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400">{sc.severity}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{sc.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* SOC Incident Grid */}
            {socIncident && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Severity & Story */}
                <div className="glass-soc p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono uppercase text-slate-300 font-bold">Threat Severity</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-red-500/20 text-red-400">{socIncident.risk.level}</span>
                  </div>
                  <div className="text-4xl font-black text-white font-mono">{socIncident.risk.score}<span className="text-xl text-slate-500">/100</span></div>
                  <p className="text-xs text-slate-300 leading-relaxed">{socIncident.narrative.executive_summary}</p>
                </div>

                {/* MITRE & Timeline */}
                <div className="glass-soc p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-mono uppercase text-slate-300 font-bold block">MITRE ATT&CK Mapping</span>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {socIncident.investigation.mitre_techniques.map((t: any, idx: number) => (
                      <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                        {t.id}: {t.name}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {socIncident.narrative.chronological_story.map((s: string, idx: number) => (
                      <div key={idx} className="p-2 rounded bg-slate-900">{s}</div>
                    ))}
                  </div>
                </div>

                {/* Human-in-the-Loop SOAR */}
                <div className="glass-soc p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold block">Human Approval Containment Gate</span>
                  <div className="space-y-3">
                    {socIncident.recommended_actions.map((act: any) => (
                      <div key={act.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{act.title}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            act.status === 'EXECUTED_CONTAINED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {act.status === 'EXECUTED_CONTAINED' ? 'CONTAINED ✓' : 'PENDING'}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{act.description}</p>
                        {act.status !== 'EXECUTED_CONTAINED' && (
                          <button
                            onClick={() => handleApproveSocAction(act.id)}
                            disabled={executingActionId === act.id}
                            className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                          >
                            Authorize Containment
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Log Stream & Copilot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Logs */}
              <div className="glass-soc p-5 rounded-2xl border border-slate-800 h-[360px] flex flex-col">
                <span className="text-xs font-mono uppercase text-slate-300 font-bold mb-3 block">Raw SIEM / EDR Security Telemetry</span>
                <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px] terminal-scroll pr-1">
                  {socIncident?.telemetry_events.map((ev: any) => (
                    <div key={ev.id} className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-cyan-400 font-bold">[{ev.timestamp}] {ev.source}</span>: {ev.raw_log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Copilot */}
              <div className="glass-soc p-5 rounded-2xl border border-slate-800 h-[360px] flex flex-col">
                <span className="text-xs font-mono uppercase text-indigo-400 font-bold mb-3 block">AI SOC Investigation Copilot</span>
                <div className="flex-1 overflow-y-auto space-y-2 text-xs terminal-scroll pr-1 mb-3">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl ${msg.sender === 'user' ? 'ml-auto bg-indigo-600 text-white max-w-[85%]' : 'bg-slate-900 text-slate-200'}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendCopilot} className="flex gap-2">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Ask about this cyber incident..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button type="submit" disabled={isAskingCopilot} className="px-4 py-2 rounded-xl bg-cyan-600 text-black font-bold text-xs">
                    Ask
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="glass-soc border-t border-slate-800 py-4 mt-8 text-center text-xs text-slate-500 font-mono">
        BANTPT AI &bull; Autonomous Emergency Response & Security Operations Center Platform &bull; Unified Multi-Agent Intelligence
      </footer>

    </div>
  );
}

export default App;