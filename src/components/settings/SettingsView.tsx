import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { useFlood } from '../../context/FloodContext';

export const SettingsView: React.FC = () => {
  const { layers, toggleLayer } = useFlood();
  const [saved, setSaved] = useState(false);

  // Settings state strictly matching Section 18
  const [defaultLocation, setDefaultLocation] = useState('Pune Central (PMC Office)');
  const [savedLocations, setSavedLocations] = useState('Baner, Wakad, Shivajinagar');

  const [floodAlertsEnabled, setFloodAlertsEnabled] = useState(true);
  const [criticalAlertsEnabled, setCriticalAlertsEnabled] = useState(true);
  const [rainfallAlertsEnabled, setRainfallAlertsEnabled] = useState(true);

  const [mapType, setMapType] = useState('GIS Vector Topographic');

  const [accountName, setAccountName] = useState('Purva Shimpi');
  const [accountEmail, setAccountEmail] = useState('purvashimpi2006@gmail.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-sky-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">System Settings</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure monitoring thresholds, operational location preferences, and telemetry layers
          </p>
        </div>

        {saved && (
          <span className="text-xs font-semibold text-[#16A34A] bg-[#D1FAE5] border border-[#A7F3D0] px-2.5 py-1 rounded flex items-center gap-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. Location */}
        <div className="bg-white border border-[#BAE6FD] rounded-md p-4 space-y-3 shadow-xs">
          <h3 className="font-bold text-[#0F172A] text-sm border-b border-sky-100 pb-2">
            Location
          </h3>
          <div className="space-y-2">
            <label className="block text-[#0F172A] font-medium">Default location</label>
            <input
              type="text"
              value={defaultLocation}
              onChange={e => setDefaultLocation(e.target.value)}
              className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[#0F172A] font-medium">
              Saved locations (comma-separated)
            </label>
            <input
              type="text"
              value={savedLocations}
              onChange={e => setSavedLocations(e.target.value)}
              className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:bg-white"
            />
          </div>
        </div>

        {/* 2. Alerts */}
        <div className="bg-white border border-[#BAE6FD] rounded-md p-4 space-y-3 shadow-xs">
          <h3 className="font-bold text-[#0F172A] text-sm border-b border-sky-100 pb-2">
            Alerts
          </h3>
          <div className="space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#0F172A] font-medium">Flood alerts</span>
              <input
                type="checkbox"
                checked={floodAlertsEnabled}
                onChange={e => setFloodAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#0284C7] rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#0F172A] font-medium">Critical alerts (SMS &amp; Emergency Sirens)</span>
              <input
                type="checkbox"
                checked={criticalAlertsEnabled}
                onChange={e => setCriticalAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#0284C7] rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#0F172A] font-medium">Rainfall threshold alerts (&gt;40 mm/hr)</span>
              <input
                type="checkbox"
                checked={rainfallAlertsEnabled}
                onChange={e => setRainfallAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#0284C7] rounded"
              />
            </label>
          </div>
        </div>

        {/* 3. Map */}
        <div className="bg-white border border-[#BAE6FD] rounded-md p-4 space-y-3 shadow-xs">
          <h3 className="font-bold text-[#0F172A] text-sm border-b border-sky-100 pb-2">
            Map
          </h3>
          <div className="space-y-2">
            <label className="block text-[#0F172A] font-medium">Default map type</label>
            <select
              value={mapType}
              onChange={e => setMapType(e.target.value)}
              className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
            >
              <option>GIS Vector Topographic</option>
              <option>Hydrological Drainage Mesh</option>
              <option>High-Contrast Night Operations</option>
            </select>
          </div>
          <div className="space-y-2.5 pt-1">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#0F172A] font-medium">Show rainfall radar overlay</span>
              <input
                type="checkbox"
                checked={layers.rainfallRadar}
                onChange={() => toggleLayer('rainfallRadar')}
                className="w-4 h-4 accent-[#0284C7] rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#0F172A] font-medium">Show drainage points on map</span>
              <input
                type="checkbox"
                checked={layers.drainagePoints}
                onChange={() => toggleLayer('drainagePoints')}
                className="w-4 h-4 accent-[#0284C7] rounded"
              />
            </label>
          </div>
        </div>

        {/* 4. Account */}
        <div className="bg-white border border-[#BAE6FD] rounded-md p-4 space-y-3 shadow-xs">
          <h3 className="font-bold text-[#0F172A] text-sm border-b border-sky-100 pb-2">
            Account
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[#0F172A] font-medium">Name</label>
              <input
                type="text"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[#0F172A] font-medium">Email</label>
              <input
                type="email"
                value={accountEmail}
                onChange={e => setAccountEmail(e.target.value)}
                className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:bg-white"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-[#0F172A] font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-jaldrishti-gradient hover:opacity-95 rounded transition-all duration-150 flex items-center gap-1.5 shadow-xs hover:scale-[1.02]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
