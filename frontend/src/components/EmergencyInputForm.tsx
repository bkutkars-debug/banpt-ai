import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Camera, MapPin, Sparkles, Send, Upload, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { DemoScenario } from '../types';

interface InputFormProps {
  onAnalyze: (payload: {
    text: string;
    audio_transcript: string;
    image_base64: string | null;
    image_metadata: any;
    latitude: number | null;
    longitude: number | null;
    location_name: string;
    category: string;
  }) => void;
  isLoading: boolean;
  selectedScenario: DemoScenario | null;
}

export const EmergencyInputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading, selectedScenario }) => {
  const [text, setText] = useState('');
  const [audioTranscript, setAudioTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageHint, setImageHint] = useState<string | null>(null);
  const [category, setCategory] = useState('Road Accident');
  const [locationName, setLocationName] = useState('Ring Road Sector 4 Junction, New Delhi');
  const [latitude, setLatitude] = useState<number | null>(28.5672);
  const [longitude, setLongitude] = useState<number | null>(77.2100);
  const [geoStatus, setGeoStatus] = useState<'default' | 'detecting' | 'detected'>('detected');

  const recognitionRef = useRef<any>(null);

  // Sync scenario when changed
  useEffect(() => {
    if (selectedScenario) {
      setText(selectedScenario.sample_text);
      setCategory(selectedScenario.category);
      setLocationName(selectedScenario.location_name);
      setLatitude(selectedScenario.latitude);
      setLongitude(selectedScenario.longitude);
      setImageHint(selectedScenario.sample_image_hint);
      setImagePreview('https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80');
      setImageBase64('data:image/jpeg;base64,mock_preview_sample');
    }
  }, [selectedScenario]);

  // Voice recording using Web Speech API
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setAudioTranscript(currentTranscript);
          setText((prev) => prev ? `${prev} ${currentTranscript}` : currentTranscript);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
      } else {
        // Fallback simulation for browsers without Web Speech API
        setIsRecording(true);
        setTimeout(() => {
          const simulated = "There is a severe collision. Victim is not moving and has high blood loss.";
          setAudioTranscript(simulated);
          setText((prev) => prev ? `${prev} ${simulated}` : simulated);
          setIsRecording(false);
        }, 3000);
      }
    }
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageBase64(result);
        setImageHint(`Uploaded: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Geolocation detector
  const fetchLocation = () => {
    setGeoStatus('detecting');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setLocationName(`GPS: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
          setGeoStatus('detected');
        },
        () => {
          // Fallback location
          setLatitude(28.6139);
          setLongitude(77.2090);
          setLocationName('Connaught Place, New Delhi');
          setGeoStatus('detected');
        }
      );
    } else {
      setGeoStatus('detected');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !audioTranscript.trim() && !imageBase64) {
      return;
    }
    onAnalyze({
      text,
      audio_transcript: audioTranscript,
      image_base64: imageBase64,
      image_metadata: imageHint ? { hint: imageHint } : null,
      latitude,
      longitude,
      location_name: locationName,
      category,
    });
  };

  const categories = [
    'Road Accident',
    'Fire / Explosion',
    'Medical Emergency',
    'Personal Safety / Threat',
    'Natural Disaster',
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-slate-800 shadow-2xl relative">
      <div className="flex items-center justify-between mb-5 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-lg font-bold text-white tracking-wide">Emergency Input Console</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Multimodal Agent Ready</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Category Selector */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            1. Select Emergency Type
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-dark-800 text-slate-300 hover:bg-dark-700 border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Text & Voice Input Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
              2. Describe Emergency Situation (Text or Voice)
            </label>
            {isRecording && (
              <span className="flex items-center gap-1.5 text-xs text-red-400 font-mono animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Listening via Microphone...
              </span>
            )}
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., 'There's been a bike accident near me. One person is unconscious and another person is bleeding.'"
              className="w-full bg-dark-800/90 border border-slate-700 focus:border-red-500 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all font-sans leading-relaxed"
            />

            {/* Voice Record Action inside textarea */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-700/80 hover:bg-slate-700 text-slate-200 border border-slate-600'
                }`}
                title="Speak to dictate"
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-red-400" />}
                <span>{isRecording ? 'Stop Recording' : 'Voice Input'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Multimodal: Image Upload + GPS Geolocation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Image Upload Box */}
          <div className="p-3.5 rounded-xl bg-dark-800/60 border border-slate-700/70">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              3. Visual Context / Scene Photo
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-slate-600 hover:border-red-400 bg-dark-900/60 cursor-pointer transition-colors text-xs text-slate-300">
                <Camera className="w-4 h-4 text-slate-400" />
                <span>Upload Scene Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-red-500/40">
                  <img src={imagePreview} alt="Scene preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageBase64(null);
                      setImageHint(null);
                    }}
                    className="absolute inset-0 bg-dark-900/80 text-white text-[9px] font-bold flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            {imageHint && (
              <p className="text-[11px] text-slate-400 mt-2 truncate font-mono">
                📸 {imageHint}
              </p>
            )}
          </div>

          {/* Location Box */}
          <div className="p-3.5 rounded-xl bg-dark-800/60 border border-slate-700/70">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                4. Location Coordinates
              </label>
              <button
                type="button"
                onClick={fetchLocation}
                className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${geoStatus === 'detecting' ? 'animate-spin' : ''}`} />
                <span>Auto-Detect</span>
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-900/80 border border-slate-700 text-xs text-slate-200">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-200 focus:outline-none w-full font-mono truncate"
                placeholder="GPS Location..."
              />
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
          </div>

        </div>

        {/* Analyze Action Trigger */}
        <button
          type="submit"
          disabled={isLoading || (!text.trim() && !audioTranscript.trim())}
          className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-xl ${
            isLoading
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
              <span>Orchestrating Multi-Agent Emergency Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Analyze Emergency & Dispatch Agents</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};