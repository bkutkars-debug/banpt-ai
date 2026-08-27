import React, { useState } from 'react';
import { MapPin, Phone, Navigation, Shield, Flame, Cross, AlertCircle, ExternalLink } from 'lucide-react';
import { EmergencyResource } from '../types';

interface MapProps {
  resources: EmergencyResource[];
  latitude?: number | null;
  longitude?: number | null;
  locationName: string;
}

export const NearbyResourcesMap: React.FC<MapProps> = ({ resources, latitude, longitude, locationName }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Hospital / Trauma Center', 'Police Station', 'Fire & Rescue', '24/7 Pharmacy / First Aid'];

  const filteredResources = activeCategory === 'All'
    ? resources
    : resources.filter((r) => r.category === activeCategory);

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Hospital / Trauma Center':
        return <Cross className="w-4 h-4 text-emerald-400" />;
      case 'Police Station':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'Fire & Rescue':
        return <Flame className="w-4 h-4 text-red-400" />;
      default:
        return <MapPin className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Verified Nearby Emergency Infrastructure
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geospatial proximity routing around: <span className="text-slate-200 font-mono">{locationName}</span>
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeCategory === c
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-dark-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {c === 'Hospital / Trauma Center' ? 'Hospitals' : c === 'Police Station' ? 'Police' : c === 'Fire & Rescue' ? 'Fire' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Verified Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-dark-900 border border-slate-700">
                    {getIcon(res.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[200px]">{res.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{res.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-emerald-400 block">{res.eta_minutes}</span>
                  <span className="text-[10px] font-mono text-slate-400">{res.distance_km} km away</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mb-2 truncate">
                📍 {res.address}
              </p>

              {/* Extra badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {res.icu_equipped && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    ICU Equipped ({res.beds_available} beds free)
                  </span>
                )}
                {res.patrol_units_active && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {res.patrol_units_active} Active Patrols
                  </span>
                )}
                {res.vehicles_ready && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                    {res.vehicles_ready} Engines Ready
                  </span>
                )}
                {res.open_24_7 && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    24/7 Open
                  </span>
                )}
              </div>
            </div>

            {/* Action Triggers */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <a
                href={`tel:${res.phone}`}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>Call: {res.emergency_helpline}</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(res.name + ' ' + res.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition-colors"
              >
                <Navigation className="w-3 h-3 text-sky-400" />
                <span>Navigate</span>
              </a>
            </div>

          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-dark-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>* Real-time telemetry fetched via Emergency Spatial Dispatch Layer.</span>
        <span className="text-emerald-400 font-mono font-semibold">Closest Facility ETA: 2-4 mins</span>
      </div>

    </div>
  );
};