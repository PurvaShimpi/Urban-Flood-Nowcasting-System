import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Activity,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  AlertTriangle,
  RotateCw,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useFlood } from '../../context/FloodContext';
import { WEATHER_STATIONS } from '../../data/puneFloodData';

export const RainfallView: React.FC = () => {
  const { currentMetrics, isSimulating } = useFlood();

  // Interactive simulated rain intensity level
  const [selectedIntensity, setSelectedIntensity] = useState<'light' | 'moderate' | 'heavy' | 'cloudburst'>('heavy');
  const [isAudioRainActive, setIsAudioRainActive] = useState<boolean>(false);
  const [radarActive, setRadarActive] = useState<boolean>(true);
  const [lightningFlash, setLightningFlash] = useState<boolean>(false);

  // Intensity configuration
  const intensityConfigs = {
    light: {
      rate: 12,
      label: 'Light Shower',
      color: 'text-[#0284C7]',
      bg: 'bg-sky-50',
      badge: 'bg-[#0284C7] text-white',
      dropCount: 16,
      speedClass: 'animate-rainfall-slow',
      description: 'Scattered drizzle. Normal urban drainage handling. No roadway backflow.',
    },
    moderate: {
      rate: 26,
      label: 'Moderate Downpour',
      color: 'text-[#0284C7]',
      bg: 'bg-sky-100/60',
      badge: 'bg-[#0284C7] text-white',
      dropCount: 28,
      speedClass: 'animate-rainfall-med',
      description: 'Steady monsoon rain. Surface accumulation beginning on low curb edges.',
    },
    heavy: {
      rate: 44,
      label: 'Heavy Monsoon Torrent',
      color: 'text-[#F59E0B]',
      bg: 'bg-amber-50',
      badge: 'bg-[#D97706] text-white',
      dropCount: 42,
      speedClass: 'animate-rainfall-fast',
      description: 'Intense precipitation. Waterlogging risk active across Baner and Wakad underpasses.',
    },
    cloudburst: {
      rate: 82,
      label: 'Severe Cloudburst',
      color: 'text-[#EF4444]',
      bg: 'bg-red-50',
      badge: 'bg-[#EF4444] text-white',
      dropCount: 60,
      speedClass: 'animate-rainfall-fast',
      description: 'Extreme squall. Catchment basins overwhelmed. Emergency dewatering pumps operating at 100%.',
    },
  };

  const currentConfig = intensityConfigs[selectedIntensity];
  const activeRate = isSimulating ? currentMetrics.rainfallMmHr : currentConfig.rate;

  // Web Audio Monsoon Rain Sound Generator
  useEffect(() => {
    if (!isAudioRainActive) return;

    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      // Generate pink noise for realistic rain sound
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.02; // low volume
        b6 = white * 0.115926;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter for smooth rainfall timbre
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(selectedIntensity === 'cloudburst' ? 1400 : 750, audioCtx.currentTime);

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      whiteNoise.start();

      return () => {
        try {
          whiteNoise.stop();
          audioCtx.close();
        } catch {}
      };
    } catch {
      // Audio not permitted
    }
  }, [isAudioRainActive, selectedIntensity]);

  // Periodic lightning flash for cloudburst
  useEffect(() => {
    if (selectedIntensity !== 'cloudburst') return;
    const interval = setInterval(() => {
      setLightningFlash(true);
      setTimeout(() => setLightningFlash(false), 140);
    }, 4200);
    return () => clearInterval(interval);
  }, [selectedIntensity]);

  // Dynamic past 3 hours data
  const past3HoursData = [
    { time: '3 hrs ago', rainfall: Math.max(8, Math.round(activeRate * 0.35)) },
    { time: '2.5 hrs ago', rainfall: Math.max(12, Math.round(activeRate * 0.52)) },
    { time: '2 hrs ago', rainfall: Math.max(18, Math.round(activeRate * 0.68)) },
    { time: '1.5 hrs ago', rainfall: Math.max(24, Math.round(activeRate * 0.85)) },
    { time: '1 hr ago', rainfall: Math.max(28, Math.round(activeRate * 0.94)) },
    { time: '30 min ago', rainfall: Math.max(30, Math.round(activeRate * 0.98)) },
    { time: 'Now', rainfall: activeRate },
  ];

  // Dynamic forecast next 3 hours
  const forecastRainData = [
    { time: 'Now', rainfall: activeRate },
    { time: '+30 min', rainfall: Math.min(95, activeRate + (selectedIntensity === 'cloudburst' ? 10 : 4)) },
    { time: '+1 hr', rainfall: Math.min(98, activeRate + (selectedIntensity === 'cloudburst' ? 14 : 8)) },
    { time: '+1.5 hr', rainfall: Math.max(14, activeRate - 4) },
    { time: '+2 hr', rainfall: Math.max(10, activeRate - 12) },
    { time: '+2.5 hr', rainfall: Math.max(8, activeRate - 18) },
    { time: '+3 hr', rainfall: Math.max(6, activeRate - 24) },
  ];

  const maxVal = 100;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Live Telemetry & Sound Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BAE6FD] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Live Rainfall Monitoring &amp; Doppler Radar
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#10B981] text-white flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>LIVE TELEMETRY</span>
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Automated weather stations (IMD Shivajinagar &amp; PMC Catchment Sensor Network)
          </p>
        </div>

        {/* Current Rainfall Display & Sound Chime Toggle */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={() => setIsAudioRainActive(!isAudioRainActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 shadow-2xs ${
              isAudioRainActive
                ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-sm'
                : 'bg-white text-[#64748B] border-[#BAE6FD] hover:bg-[#F0FDFA]'
            }`}
            title="Toggle synthesized rain audio"
          >
            {isAudioRainActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAudioRainActive ? 'Rain Audio ON' : 'Rain Audio'}</span>
          </button>

          <div className="flex items-baseline gap-2 bg-[#F0FDFA] border border-[#BAE6FD] px-3.5 py-1.5 rounded-lg shadow-xs">
            <span className="text-xs font-bold text-[#075985]">Live Intensity:</span>
            <span className="text-xl font-black font-mono text-[#0284C7] tabular-nums">
              {activeRate}
            </span>
            <span className="text-xs text-[#075985] font-semibold">mm/hr</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Animated Rainfall Simulator Stage */}
      <div className={`relative rounded-2xl border border-[#BAE6FD] overflow-hidden p-5 shadow-md transition-all duration-300 ${
        lightningFlash ? 'bg-sky-200' : 'bg-gradient-to-b from-[#075985] via-[#0284C7] to-[#0369A1]'
      } text-white`}>
        {/* Animated Rain Droplet Canvas Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: currentConfig.dropCount }).map((_, idx) => {
            const leftPos = (idx * 100) / currentConfig.dropCount + (idx % 3) * 1.5;
            const animDuration = (0.5 + (idx % 5) * 0.15) / (selectedIntensity === 'cloudburst' ? 1.8 : 1);
            const animDelay = (idx % 7) * 0.12;
            const height = 14 + (idx % 4) * 8;
            return (
              <div
                key={idx}
                className="absolute top-0 w-0.5 bg-gradient-to-b from-transparent via-sky-200 to-white rounded-full opacity-70 animate-rainfall-fast"
                style={{
                  left: `${leftPos}%`,
                  height: `${height}px`,
                  animationDuration: `${animDuration}s`,
                  animationDelay: `${animDelay}s`,
                  transform: 'rotate(12deg)',
                }}
              />
            );
          })}
        </div>

        {/* Floating Clouds Background Accent */}
        <div className="absolute top-2 right-4 opacity-20 pointer-events-none">
          <CloudRain className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold text-sky-100 backdrop-blur-xs">
                <CloudRain className="w-3.5 h-3.5 text-sky-200" />
                <span>Monsoon Catchment Dynamics</span>
                <span>·</span>
                <span className="text-emerald-300 font-mono">Pune Mutha Basin</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mt-1">
                {currentConfig.label} ({activeRate} mm/hr)
              </h3>
              <p className="text-xs sm:text-sm text-sky-100 max-w-2xl mt-1 leading-relaxed">
                {currentConfig.description}
              </p>
            </div>

            {/* Interactive Simulation Intensity Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 bg-black/25 p-1.5 rounded-xl backdrop-blur-xs border border-white/20 shrink-0">
              {(['light', 'moderate', 'heavy', 'cloudburst'] as const).map(level => {
                const cfg = intensityConfigs[level];
                const isSelected = selectedIntensity === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedIntensity(level)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                      isSelected
                        ? 'bg-white text-[#075985] shadow-sm scale-105'
                        : 'text-sky-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cfg.label.split(' ')[0]} ({cfg.rate} mm)
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Real-Time Precipitation Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
              <span className="text-[10px] text-sky-200 uppercase tracking-wide block">Rain Direction</span>
              <span className="text-sm font-black text-white font-mono flex items-center gap-1.5 mt-0.5">
                <Compass className="w-4 h-4 text-sky-300 animate-spin" style={{ animationDuration: '20s' }} />
                <span>SW → NE (215°)</span>
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
              <span className="text-[10px] text-sky-200 uppercase tracking-wide block">Wind Velocity</span>
              <span className="text-sm font-black text-white font-mono flex items-center gap-1.5 mt-0.5">
                <Wind className="w-4 h-4 text-sky-300" />
                <span>32 km/h Gusts</span>
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
              <span className="text-[10px] text-sky-200 uppercase tracking-wide block">Catchment Runoff</span>
              <span className="text-sm font-black text-white font-mono flex items-center gap-1.5 mt-0.5">
                <Droplets className="w-4 h-4 text-emerald-300" />
                <span>{selectedIntensity === 'cloudburst' ? '92% Heavy' : '68% Normal'}</span>
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
              <span className="text-[10px] text-sky-200 uppercase tracking-wide block">IMD Alert Status</span>
              <span className="text-sm font-black text-amber-300 font-mono flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{selectedIntensity === 'cloudburst' ? 'Red Warning' : 'Orange Watch'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Two Columns: Live Animated Doppler Radar & Hydrograph Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Animated Doppler Radar Canvas */}
        <div className="lg:col-span-6 bg-white border border-[#BAE6FD] rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-sky-100">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#0284C7]" />
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Doppler Catchment Weather Radar (IMD Pune)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#10B981] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              <span>360° Sweep Active</span>
            </span>
          </div>

          {/* SVG Doppler Radar Screen */}
          <div className="relative w-full aspect-square max-h-[340px] mx-auto bg-slate-950 rounded-xl overflow-hidden shadow-inner border border-sky-900/60 flex items-center justify-center">
            {/* Radar Circular Grid & Distance Rings */}
            <svg viewBox="0 0 300 300" className="w-full h-full absolute inset-0">
              <circle cx="150" cy="150" r="130" stroke="#0369A1" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4" />
              <circle cx="150" cy="150" r="95" stroke="#0369A1" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
              <circle cx="150" cy="150" r="60" stroke="#0369A1" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
              <circle cx="150" cy="150" r="25" stroke="#0369A1" strokeWidth="1" fill="none" opacity="0.8" />
              
              {/* Radar Crosshairs */}
              <line x1="20" y1="150" x2="280" y2="150" stroke="#0369A1" strokeWidth="0.8" opacity="0.4" />
              <line x1="150" y1="20" x2="150" y2="280" stroke="#0369A1" strokeWidth="0.8" opacity="0.4" />

              {/* Pulsing Sonar Ring */}
              <circle cx="150" cy="150" r="70" stroke="#38BDF8" strokeWidth="1.5" fill="none" className="animate-radar-pulse-1" />
              <circle cx="150" cy="150" r="110" stroke="#38BDF8" strokeWidth="1.5" fill="none" className="animate-radar-pulse-2" />

              {/* Cloud Rain Clusters */}
              <g className="opacity-70 animate-pulse">
                {/* Khadakwasla Catchment */}
                <ellipse cx="110" cy="190" rx="35" ry="24" fill={selectedIntensity === 'cloudburst' ? '#EF4444' : '#F59E0B'} opacity="0.75" />
                {/* Baner - Pashan Valley */}
                <ellipse cx="130" cy="115" rx="30" ry="20" fill={selectedIntensity === 'cloudburst' ? '#DC2626' : '#0284C7'} opacity="0.8" />
                {/* Shivajinagar Core */}
                <circle cx="165" cy="145" r="22" fill="#0EA5E9" opacity="0.7" />
                {/* Sinhagad Foot */}
                <ellipse cx="90" cy="225" rx="26" ry="18" fill="#F97316" opacity="0.75" />
              </g>

              {/* Key Pune Landmark Labels */}
              <text x="155" y="142" fill="#BAE6FD" fontSize="8" fontWeight="bold">Pune Central</text>
              <text x="85" y="112" fill="#7DD3FC" fontSize="7.5">Baner-Pashan</text>
              <text x="70" y="185" fill="#FDE68A" fontSize="7.5">Khadakwasla Dam</text>
              <text x="75" y="240" fill="#FED7AA" fontSize="7.5">Sinhagad</text>
              <text x="180" y="100" fill="#7DD3FC" fontSize="7.5">PCMC / Sangvi</text>

              {/* Sweeping Radar Beam (Conical Sector) */}
              <g className="animate-radar-sweep origin-center" style={{ transformOrigin: '150px 150px' }}>
                <defs>
                  <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#0284C7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 150 150 L 280 150 A 130 130 0 0 1 240 240 Z" fill="url(#beamGradient)" />
                <line x1="150" y1="150" x2="280" y2="150" stroke="#7DD3FC" strokeWidth="1.8" />
              </g>
            </svg>

            {/* Radar Corner Telemetry Overlay */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-sky-300 bg-black/60 px-2 py-1 rounded backdrop-blur-xs space-y-0.5 border border-sky-800/40">
              <span className="block text-white font-bold">RADAR ID: IMD-PUN-01</span>
              <span className="block text-emerald-400">RANGE: 45 KM CATCHMENT</span>
              <span className="block text-sky-200">SWEEP: 7.2 RPM</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-sky-100 text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="text-[11px]">&gt;50 mm Heavy</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="text-[11px]">25–50 mm Mod</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
              <span className="text-[11px]">&lt;25 mm Light</span>
            </span>
          </div>
        </div>

        {/* Right Column: Animated Hydrograph & Forecast Sparkline */}
        <div className="lg:col-span-6 space-y-4">
          {/* Chart 1: Animated Rainfall Intensity (Last 3 Hours) */}
          <div className="bg-white border border-[#BAE6FD] rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Rainfall Intensity — Last 3 Hours</span>
              </h3>
              <span className="text-[11px] font-mono text-[#075985] font-bold">Unit: mm/hr</span>
            </div>

            <div className="h-44 w-full">
              <svg viewBox="0 0 600 150" className="w-full h-full">
                {/* Guide lines */}
                <line x1="40" y1="20" x2="580" y2="20" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="60" x2="580" y2="60" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="580" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="130" x2="580" y2="130" stroke="#BAE6FD" strokeWidth="1.5" />

                {/* Y axis numbers */}
                <text x="32" y="24" fontSize="9" fill="#94a3b8" textAnchor="end" className="font-mono">80</text>
                <text x="32" y="64" fontSize="9" fill="#94a3b8" textAnchor="end" className="font-mono">50</text>
                <text x="32" y="104" fontSize="9" fill="#94a3b8" textAnchor="end" className="font-mono">25</text>
                <text x="32" y="134" fontSize="9" fill="#94a3b8" textAnchor="end" className="font-mono">0</text>

                {/* Bars with animated gradients */}
                {past3HoursData.map((d, i) => {
                  const x = 70 + i * 80;
                  const h = Math.min(110, (d.rainfall / maxVal) * 110);
                  const y = 130 - h;
                  const isCurrent = i === past3HoursData.length - 1;
                  return (
                    <g key={d.time} className="group cursor-pointer">
                      <rect
                        x={x - 14}
                        y={y}
                        width="28"
                        height={h}
                        rx="4"
                        fill={isCurrent ? 'url(#activeBarGrad)' : '#38BDF8'}
                        className="transition-all duration-300 group-hover:brightness-110"
                      />
                      <text
                        x={x}
                        y={y - 5}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="700"
                        fill={isCurrent ? '#0284C7' : '#075985'}
                        className="font-mono"
                      >
                        {d.rainfall}
                      </text>
                      <text x={x} y="145" textAnchor="middle" fontSize="9" fill="#64748B" fontWeight={isCurrent ? '700' : '500'}>
                        {d.time}
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="activeBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Chart 2: Projected Forecast with Flowing Animated Line */}
          <div className="bg-white border border-[#BAE6FD] rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Next 3 Hours Projection</span>
              </h3>
              <span className="text-[11px] font-mono text-[#10B981] font-bold">Predictive Model</span>
            </div>

            <div className="h-44 w-full">
              <svg viewBox="0 0 600 150" className="w-full h-full">
                {/* Guide lines */}
                <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="60" x2="580" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="580" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="130" x2="580" y2="130" stroke="#BAE6FD" strokeWidth="1.5" />

                {/* Animated sparkline path */}
                <path
                  d={forecastRainData.reduce((acc, d, i) => {
                    const x = 70 + i * 80;
                    const h = Math.min(110, (d.rainfall / maxVal) * 110);
                    const y = 130 - h;
                    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="2.8"
                  className="animate-flow-line"
                />

                {/* Data points */}
                {forecastRainData.map((d, i) => {
                  const x = 70 + i * 80;
                  const h = Math.min(110, (d.rainfall / maxVal) * 110);
                  const y = 130 - h;
                  return (
                    <g key={d.time}>
                      <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#0284C7" strokeWidth="2.5" className="animate-pulse" />
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="700"
                        fill="#0F172A"
                        className="font-mono"
                      >
                        {d.rainfall}
                      </text>
                      <text x={x} y="145" textAnchor="middle" fontSize="9" fill="#64748B">
                        {d.time}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Automated Pune Weather Stations Observation Matrix */}
      <div className="bg-white border border-[#BAE6FD] rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-sky-100 bg-[#F0FDFA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#075985] uppercase tracking-wider">
              Automated Weather Stations (Pune Municipal Matrix)
            </h3>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#D1FAE5] text-[#16A34A]">
              5 ONLINE
            </span>
          </div>
          <span className="text-[11px] text-[#64748B] font-mono">10-Min Polling Cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-[#64748B] font-semibold bg-white">
                <th className="py-2.5 px-4">Station &amp; Catchment</th>
                <th className="py-2.5 px-4">Elevation</th>
                <th className="py-2.5 px-4 text-right">1-Hr Rain</th>
                <th className="py-2.5 px-4 text-right">24-Hr Cumulative</th>
                <th className="py-2.5 px-4 text-right">Wind Gusts</th>
                <th className="py-2.5 px-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {WEATHER_STATIONS.map((stn, idx) => (
                <tr key={stn.id} className="hover:bg-[#F0FDFA]/50 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-[#0F172A] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                    <span>{stn.name}</span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[#64748B]">{stn.elevation}m MSL</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-[#075985]">
                    {stn.rainfall1Hr} mm
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-[#0F172A]">
                    {stn.rainfall24Hr} mm
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                    {stn.windSpeedKmh} km/h
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span
                      className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                        stn.trend === 'Increasing'
                          ? 'bg-sky-100 text-[#0284C7]'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {stn.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
