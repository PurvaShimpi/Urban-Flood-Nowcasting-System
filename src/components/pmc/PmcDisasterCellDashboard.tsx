import React, { useState } from 'react';
import {
  ShieldAlert,
  Radio,
  Sliders,
  Power,
  RotateCw,
  Megaphone,
  AlertTriangle,
  Send,
  Droplets,
  Truck,
  Anchor,
  Activity,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Gauge,
  Compass,
  Layers,
  Users,
  Lock,
  LogOut,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { useFlood } from '../../context/FloodContext';
import { FloodMap } from '../map/FloodMap';
import { ForecastTimeline } from '../dashboard/ForecastTimeline';
import { BroadcastAlertModal } from './BroadcastAlertModal';

export const PmcDisasterCellDashboard: React.FC = () => {
  const {
    currentMetrics,
    drainagePoints,
    toggleDrainagePump,
    setDrainageSluiceGate,
    damsList,
    dispatchUnits,
    dispatchUnitToSector,
    isSimulating,
    startSimulation,
    stopSimulation,
    citizenReports,
    authenticatedOfficer,
    logoutOfficer,
    setUserRole,
  } = useFlood();

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [selectedSectorToDispatch, setSelectedSectorToDispatch] = useState('Baner Nullah Crossway');
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'scada' | 'dams' | 'reports'>('scada');

  // Municipal Siren Simulator using Web Audio API
  const triggerMunicipalSiren = () => {
    if (sirenPlaying) return;
    setSirenPlaying(true);
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      // Pitch sweep up and down
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(750, audioCtx.currentTime + 0.6);
      osc.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 1.2);
      osc.frequency.linearRampToValueAtTime(750, audioCtx.currentTime + 1.8);
      osc.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 2.4);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime + 2.2);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 2.5);

      setTimeout(() => {
        setSirenPlaying(false);
      }, 2500);
    } catch {
      setSirenPlaying(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Authenticated Officer Session Status Banner */}
      <div className="bg-[#075985]/90 border border-[#0284C7] rounded-lg p-3 px-4 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0284C7] flex items-center justify-center shrink-0 border border-sky-300">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                {authenticatedOfficer?.name || 'Officer On Duty'}
              </span>
              <span className="font-mono text-[10px] bg-white/20 text-sky-200 px-1.5 py-0.2 rounded font-semibold">
                {authenticatedOfficer?.badgeId || 'PMC-DISASTER-01'}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-400/30">
                Authorized SCADA Session
              </span>
            </div>
            <p className="text-[11px] text-sky-200 mt-0.5">
              {authenticatedOfficer?.designation || 'Disaster Cell Duty Officer'} · {authenticatedOfficer?.wardZone || 'PMC Central Headquarters'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => setUserRole('citizen')}
            className="px-3 py-1.5 text-xs font-bold text-[#075985] bg-white hover:bg-sky-50 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Preview how citizens see the public portal"
          >
            <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Citizen Public View</span>
          </button>
          <button
            onClick={logoutOfficer}
            className="px-3 py-1.5 text-xs font-bold text-red-200 hover:text-white bg-red-900/40 hover:bg-red-900/60 border border-red-500/40 rounded-md transition-colors flex items-center gap-1.5"
            title="Terminate officer SCADA session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* Tactical Command Bar */}
      <div className="bg-[#075985] border border-[#0284C7] rounded-xl p-4 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle decorative background wave */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none w-80 flex items-center justify-end">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-white">
            <path d="M40,-68.1C51.9,-61.7,61.7,-51.2,69.5,-39C77.4,-26.8,83.3,-13.4,82.4,-0.5C81.6,12.4,73.9,24.8,65.3,35.9C56.6,47,47,56.7,35.5,63.9C24.1,71.1,10.7,75.7,-2.4,79.9C-15.5,84,-31,87.6,-43.3,82.1C-55.7,76.6,-64.8,61.9,-71.1,47.3C-77.4,32.7,-80.8,18.3,-80.7,4.3C-80.6,-9.7,-77,-23.4,-70.6,-36C-64.2,-48.6,-55.1,-60.1,-43.3,-66.6C-31.4,-73.1,-15.7,-74.6,-0.6,-73.6C14.5,-72.6,28.1,-74.5,40,-68.1Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-[#0284C7] border border-[#38BDF8] flex items-center justify-center shrink-0 shadow-sm">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                PMC Disaster Cell Command Console
              </h2>
              <span className="text-[10px] font-mono font-bold bg-[#10B981] text-white px-2 py-0.5 rounded shadow-2xs">
                OPERATIONAL · WARD 1–15
              </span>
            </div>
            <p className="text-xs text-sky-200 mt-0.5">
              SCADA telemetry, remote pump actuation, Khadakwasla dam discharge &amp; NDRF asset deployment
            </p>
          </div>
        </div>

        {/* Command Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          {/* Siren test button */}
          <button
            onClick={triggerMunicipalSiren}
            disabled={sirenPlaying}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              sirenPlaying
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
            title="Test Municipal Siren (audio alert test)"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{sirenPlaying ? 'Siren Sounding...' : 'Test Siren'}</span>
          </button>

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all duration-150 flex items-center gap-1.5 hover:scale-[1.02]"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Broadcast Red Alert</span>
          </button>

          {isSimulating ? (
            <button
              onClick={stopSimulation}
              className="px-3 py-2 text-xs font-bold text-amber-900 bg-amber-300 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Stop Simulation</span>
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="px-3 py-2 text-xs font-bold text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Simulate Cloudburst</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Column Tactical Monitoring: Sluice Controls, Dam Telemetry, Dispatch Units */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1. Sluice Gates & Dewatering Pump Actuation Console */}
        <div className="bg-white border border-[#BAE6FD] rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-100">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#0284C7]" />
              <span>Dewatering Pumps &amp; Sluice Gates</span>
            </span>
            <span className="text-[11px] font-mono text-[#075985] font-semibold">SCADA Online</span>
          </div>

          <p className="text-xs text-[#64748B]">
            Remotely trigger municipal stormwater high-capacity suction pumps and adjust gate positions:
          </p>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 text-xs">
            {drainagePoints.map(dp => {
              const isOverloaded = dp.status === 'Overloaded';
              return (
                <div
                  key={dp.id}
                  className="p-3 bg-[#F0FDFA]/60 border border-[#BAE6FD] rounded-md space-y-2 transition-all hover:bg-[#F0FDFA]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0F172A]">{dp.code}</span>
                      <span className="text-[11px] text-[#64748B] ml-1.5">{dp.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isOverloaded
                          ? 'bg-red-100 text-[#EF4444]'
                          : dp.status === 'Warning'
                          ? 'bg-amber-100 text-[#D97706]'
                          : 'bg-emerald-100 text-[#16A34A]'
                      }`}
                    >
                      {dp.currentLoadPct}% Load
                    </span>
                  </div>

                  {/* Flow Telemetry */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-1.5 rounded border border-sky-100 font-mono">
                    <div>
                      <span className="text-[#64748B] block">Rated Capacity:</span>
                      <span className="font-bold text-[#0F172A]">{dp.capacityLps} L/s</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Active Outflow:</span>
                      <span className="font-bold text-[#0284C7] flex items-center gap-1">
                        {dp.isPumpActive && <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-ping" />}
                        {dp.pumpFlowLps || (dp.isPumpActive ? Math.round(dp.capacityLps * 0.85) : 0)} L/s
                      </span>
                    </div>
                  </div>

                  {/* Interactive Controls: Pump On/Off and Sluice Gate */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-sky-100/60">
                    <button
                      onClick={() => toggleDrainagePump(dp.id)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded flex items-center gap-1.5 transition-all shadow-2xs ${
                        dp.isPumpActive
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      <Power className={`w-3 h-3 ${dp.isPumpActive ? 'animate-turbine text-emerald-200' : ''}`} />
                      <span>{dp.isPumpActive ? 'Pump Running' : 'Pump Standby'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <select
                        value={dp.gateStatus}
                        onChange={e =>
                          setDrainageSluiceGate(
                            dp.id,
                            e.target.value as 'Fully Open' | 'Partially Open' | 'Closed'
                          )
                        }
                        className="bg-white border border-[#BAE6FD] text-[#0F172A] text-[11px] font-medium py-1 px-1.5 rounded focus:outline-none focus:border-[#0284C7]"
                      >
                        <option value="Fully Open">Fully Open</option>
                        <option value="Partially Open">Partially Open</option>
                        <option value="Closed">Closed (Stop Backflow)</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Khadakwasla & Dam Catchment Discharge Telemetry */}
        <div className="bg-white border border-[#BAE6FD] rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-100">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#0284C7]" />
              <span>Dam Inflow &amp; Discharge (Mutha Basin)</span>
            </span>
            <span className="text-[11px] text-[#64748B]">Irrigation Dept Feed</span>
          </div>

          <p className="text-xs text-[#64748B]">
            Upstream reservoir levels dictating river rise in Pune city corridors:
          </p>

          <div className="space-y-3 text-xs">
            {damsList.map(dam => {
              const isAlert = dam.warningStatus === 'Alert';
              return (
                <div
                  key={dam.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isAlert
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-[#F0FDFA]/40 border-[#BAE6FD]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0F172A]">{dam.name}</span>
                      <span className="text-[10px] text-[#64748B] block">{dam.catchment}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isAlert ? 'bg-[#D97706] text-white' : 'bg-[#10B981] text-white'
                      }`}
                    >
                      {dam.warningStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px] bg-white p-2 rounded border border-sky-100">
                    <div>
                      <span className="text-[#64748B] block">Current Storage:</span>
                      <span className="font-bold text-[#075985]">{dam.currentStoragePct}% Full</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Discharge Rate:</span>
                      <span className={`font-bold ${isAlert ? 'text-[#EF4444]' : 'text-[#0284C7]'}`}>
                        {dam.dischargeCusecs.toLocaleString()} cusecs
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] text-[#64748B] flex items-center justify-between">
                    <span>
                      Sluice Gates Open: <strong>{dam.gatesOpen}/{dam.totalGates}</strong>
                    </span>
                    <span>{dam.lastUpdated}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 bg-sky-50 rounded border border-sky-200 text-[11px] text-[#075985] flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
            <span>
              Riverbank societies (Ekta Nagari, Pulachi Wadi) enter critical backwater surge threshold at &gt;35,000 cusecs discharge.
            </span>
          </div>
        </div>

        {/* 3. Emergency Quick Response Teams & NDRF Deployment */}
        <div className="bg-white border border-[#BAE6FD] rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-100">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#0284C7]" />
              <span>Emergency Field Units &amp; NDRF</span>
            </span>
            <span className="text-[10px] font-bold text-[#16A34A] bg-[#D1FAE5] px-1.5 py-0.5 rounded">
              Active Fleet
            </span>
          </div>

          <p className="text-xs text-[#64748B]">
            Status and live deployment of municipal rescue boats, dewatering vans, and traffic units:
          </p>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 text-xs">
            {dispatchUnits.map(unit => (
              <div
                key={unit.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">{unit.name}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      unit.status === 'On Scene'
                        ? 'bg-emerald-100 text-[#16A34A]'
                        : unit.status === 'En Route'
                        ? 'bg-amber-100 text-[#D97706]'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {unit.status}
                  </span>
                </div>

                <div className="text-[11px] text-[#64748B]">
                  <span>Sector: </span>
                  <strong className="text-[#075985]">{unit.currentSector}</strong>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1 border-t border-slate-200">
                  <span className="font-mono">{unit.contactRadio}</span>
                  <button
                    onClick={() => dispatchUnitToSector(unit.id, selectedSectorToDispatch)}
                    className="text-[10px] font-bold text-[#0284C7] hover:underline"
                  >
                    Re-dispatch →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Dispatch Action Bar */}
          <div className="pt-2 border-t border-sky-100 flex items-center gap-2">
            <select
              value={selectedSectorToDispatch}
              onChange={e => setSelectedSectorToDispatch(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded px-2 py-1.5 text-[#0F172A] focus:outline-none"
            >
              <option value="Baner Nullah Crossway">Baner Nullah Crossway</option>
              <option value="Old Sangvi Causeway">Old Sangvi Causeway</option>
              <option value="Wakad Underpass">Wakad Underpass</option>
              <option value="Sinhagad Road Ekta Nagari">Sinhagad Road Ekta Nagari</option>
              <option value="Khadki Railway Dip">Khadki Railway Dip</option>
            </select>
            <button
              onClick={() => dispatchUnitToSector('unit-03', selectedSectorToDispatch)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-jaldrishti-gradient rounded shadow-xs hover:opacity-95 whitespace-nowrap"
            >
              Dispatch QRT
            </button>
          </div>
        </div>
      </div>

      {/* Main Tactical GIS Map with Sensor Diagnostics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#0284C7]" />
            <span>Municipal GIS Tactical Inundation Canvas</span>
          </h3>
          <span className="text-[11px] text-[#64748B]">
            Real-time road submergence, pump nodes &amp; catchment runoff
          </span>
        </div>
        <FloodMap />
        <ForecastTimeline />
      </div>

      {/* Broadcast Modal */}
      <BroadcastAlertModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
      />
    </div>
  );
};
