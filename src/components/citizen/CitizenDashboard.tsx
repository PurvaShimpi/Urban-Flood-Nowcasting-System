import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Navigation,
  PhoneCall,
  CheckCircle2,
  Clock,
  Car,
  Bike,
  Truck,
  PlusCircle,
  ThumbsUp,
  MapPin,
  ExternalLink,
  Info,
  Volume2,
  VolumeX,
  Building,
  Home,
  Waves,
  Droplet,
  Compass,
  Lock,
} from 'lucide-react';
import { useFlood } from '../../context/FloodContext';
import { FloodMap } from '../map/FloodMap';
import { ForecastTimeline } from '../dashboard/ForecastTimeline';
import { CitizenReportModal } from './CitizenReportModal';
import { PUNE_EMERGENCY_HELPLINES, INITIAL_SHELTERS } from '../../data/puneFloodData';
import { VehicleCategory } from '../../types/flood';

export const CitizenDashboard: React.FC = () => {
  const {
    currentMetrics,
    roads,
    selectedLocality,
    setSelectedLocality,
    vehicleCategory,
    setVehicleCategory,
    setActivePage,
    setSelectedRoad,
    citizenReports,
    upvoteReport,
    emergencyBroadcast,
    dismissEmergencyBroadcast,
    openAuthModal,
  } = useFlood();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedQuickArea, setSelectedQuickArea] = useState('Baner');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'shelters' | 'depth-gauge'>('map');

  // Audio advisory using Web Audio API
  const playSafetyChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // AudioContext fallback
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playSafetyChime();
    }
  };

  // Quick area safety checks
  const localityStatusList = [
    { name: 'Baner - Balewadi', status: 'High Waterlogging', depth: '18–42 cm', safe: false, alert: 'Avoid Nullah crossway' },
    { name: 'Wakad - Hinjawadi', status: 'Moderate Slowdown', depth: '12–24 cm', safe: false, alert: 'Underpass dipping slope' },
    { name: 'Shivajinagar - Deccan', status: 'Clear & Open', depth: '4–9 cm', safe: true, alert: 'Normal traffic flow' },
    { name: 'Kothrud - Karve Rd', status: 'Minor Water Flow', depth: '8–16 cm', safe: true, alert: 'Flyover approach clear' },
    { name: 'Sinhagad Road', status: 'High Backwater Caution', depth: '22–38 cm', safe: false, alert: 'Riverbank water rise' },
    { name: 'Aundh DP Road', status: 'Clear & Open', depth: '6–14 cm', safe: true, alert: 'Regular commute restored' },
  ];

  const currentAreaInfo = localityStatusList.find(l => l.name.toLowerCase().includes(selectedQuickArea.toLowerCase())) || localityStatusList[0];

  // Dynamic vehicle passability calculation
  const getVehiclePassability = () => {
    const maxDepth = currentMetrics.maxDepthCm;
    if (vehicleCategory === 'two-wheeler') {
      if (maxDepth > 15) return { status: 'High Risk', color: 'text-[#EF4444] bg-red-50 border-red-200', advice: 'Avoid driving 2-wheelers. Risk of engine flood stalling and skidding on submerged gratings.' };
      if (maxDepth > 8) return { status: 'Caution', color: 'text-[#D97706] bg-amber-50 border-amber-200', advice: 'Ride slowly along road center; avoid curb puddles and open gutters.' };
      return { status: 'Safe', color: 'text-[#16A34A] bg-emerald-50 border-emerald-200', advice: 'Roads passable for two-wheelers. Maintain standard wet-weather braking distance.' };
    } else if (vehicleCategory === 'four-wheeler') {
      if (maxDepth > 28) return { status: 'High Risk', color: 'text-[#EF4444] bg-red-50 border-red-200', advice: 'Water level exceeds sedan exhaust clearance. Low-lying underpasses impassable.' };
      if (maxDepth > 16) return { status: 'Moderate Caution', color: 'text-[#D97706] bg-amber-50 border-amber-200', advice: 'Proceed in low gear without braking suddenly; avoid stalled vehicle bow waves.' };
      return { status: 'Safe to Drive', color: 'text-[#16A34A] bg-emerald-50 border-emerald-200', advice: 'Main corridors clear for standard passenger cars. Stay on elevated lanes.' };
    } else {
      if (maxDepth > 45) return { status: 'Severe Caution', color: 'text-[#EF4444] bg-red-50 border-red-200', advice: 'Extreme water depth at Old Sangvi & Baner underpass; bypass via Highway.' };
      if (maxDepth > 25) return { status: 'Passable for SUVs', color: 'text-[#0284C7] bg-[#F0FDFA] border-[#BAE6FD]', advice: 'High-clearance vehicles can navigate safely. Watch for submerged roadside curbs.' };
      return { status: 'Fully Clear', color: 'text-[#16A34A] bg-emerald-50 border-emerald-200', advice: 'Normal driving conditions for commercial vehicles and SUVs.' };
    }
  };

  const passability = getVehiclePassability();

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Citizen View Mode Indicator Banner */}
      <div className="bg-[#E0F7FA]/70 border border-[#BAE6FD] p-2.5 px-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#075985]">
          <span className="font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Citizen Public Information Mode:</span>
          </span>
          <span className="text-[#475569] hidden md:inline">
            Viewing public road submergence, safe dry routes, relief shelters, and crowdsourced waterlogging reports.
          </span>
        </div>
        <button
          onClick={openAuthModal}
          className="font-bold text-[#0284C7] hover:text-[#075985] hover:underline flex items-center gap-1 text-[11px] self-end sm:self-center shrink-0"
        >
          <Lock className="w-3 h-3 text-[#0284C7]" />
          <span>PMC Officer Login (Restricted SCADA Controls) →</span>
        </button>
      </div>

      {/* Official Emergency Broadcast Banner if active */}
      {emergencyBroadcast && (
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white p-3.5 rounded-lg shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-critical-glow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-md shrink-0 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm uppercase tracking-wide">
                  {emergencyBroadcast.title}
                </span>
                <span className="bg-white text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  OFFICIAL PMC ADVISORY
                </span>
              </div>
              <p className="text-xs text-red-100 mt-0.5">
                {emergencyBroadcast.recommendedAction}
              </p>
            </div>
          </div>
          <button
            onClick={dismissEmergencyBroadcast}
            className="self-end sm:self-center px-3 py-1 bg-white text-red-700 hover:bg-red-50 text-xs font-bold rounded transition-colors shadow-xs"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Hero Welcome & Safety Summary with Ocean Theme Wave Effect */}
      <div className="bg-gradient-to-r from-[#075985] via-[#0284C7] to-[#0EA5E9] rounded-xl p-5 text-white shadow-md relative overflow-hidden">
        {/* Animated wave background ribbon */}
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden flex items-end">
          <div className="w-[200%] h-24 bg-repeat-x animate-wave" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: '800px 90px'
          }} />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold tracking-wide backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>📍 Pune Metropolitan Citizen Portal</span>
              <span>·</span>
              <span className="text-sky-100">Live Monsoon Operations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Is it safe to travel right now in Pune?
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              Current city flood risk is <strong className="text-white underline">{currentMetrics.overallRisk}</strong> with rainfall at <strong className="text-white font-mono">{currentMetrics.rainfallMmHr} mm/hr</strong>. Check your vehicle clearance and verified road submergence before stepping out.
            </p>
          </div>

          {/* Quick Citizen Actions & Sound Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                soundEnabled
                  ? 'bg-[#10B981] text-white border-[#34D399] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title={soundEnabled ? 'Emergency sound notifications enabled' : 'Enable audio safety chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActivePage('safe-routes')}
              className="px-4 py-2 text-xs font-bold text-[#075985] bg-white hover:bg-sky-50 rounded-lg shadow-sm transition-all duration-150 flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <Navigation className="w-4 h-4 text-[#0284C7]" />
              <span>Find Safe Dry Route</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-all duration-150 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-[#38BDF8]" />
              <span>Report Flooding</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Citizen Utility: Area Safety Checker, Vehicle Clearance & Helplines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1. Quick Area Safety Checker */}
        <div className="bg-white border border-[#BAE6FD] rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-sky-100">
            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
              <span>Area Safety Quick Check</span>
            </span>
            <span className="text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Live Telemetry
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-3 gap-1.5">
              {['Baner', 'Wakad', 'Deccan', 'Sinhagad', 'Kothrud', 'Aundh'].map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedQuickArea(area)}
                  className={`py-1.5 px-2 rounded text-xs font-semibold transition-all ${
                    selectedQuickArea === area
                      ? 'bg-[#0284C7] text-white shadow-2xs'
                      : 'bg-[#F0FDFA] text-[#075985] border border-[#BAE6FD]/70 hover:bg-[#E0F7FA]'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            <div className={`mt-3 p-3 rounded-lg border transition-all ${
              currentAreaInfo.safe ? 'bg-[#D1FAE5]/60 border-[#A7F3D0]' : 'bg-amber-50/80 border-amber-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">{currentAreaInfo.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  currentAreaInfo.safe ? 'bg-[#16A34A] text-white' : 'bg-[#D97706] text-white'
                }`}>
                  {currentAreaInfo.safe ? 'SAFE TO TRAVEL' : 'CAUTION ADVISED'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1.5 text-xs text-[#0F172A]">
                <span className="text-[#64748B]">Water Depth:</span>
                <span className="font-mono font-bold text-[#075985]">{currentAreaInfo.depth}</span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                <span>{currentAreaInfo.alert}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Vehicle Water Clearance & Passability Advisor */}
        <div className="bg-white border border-[#BAE6FD] rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-sky-100">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-[#0284C7]" />
                <span>Can I Drive? Vehicle Advisory</span>
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${passability.color}`}>
                {passability.status}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setVehicleCategory('two-wheeler')}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                    vehicleCategory === 'two-wheeler'
                      ? 'border-[#0284C7] bg-[#F0FDFA] ring-1 ring-[#0284C7] shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Bike className={`w-4.5 h-4.5 ${vehicleCategory === 'two-wheeler' ? 'text-[#0284C7]' : 'text-[#64748B]'}`} />
                  <span className="text-[11px] font-bold text-[#0F172A]">Two-Wheeler</span>
                  <span className="text-[10px] font-mono text-[#64748B]">Max 12 cm</span>
                </button>

                <button
                  onClick={() => setVehicleCategory('four-wheeler')}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                    vehicleCategory === 'four-wheeler'
                      ? 'border-[#0284C7] bg-[#F0FDFA] ring-1 ring-[#0284C7] shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Car className={`w-4.5 h-4.5 ${vehicleCategory === 'four-wheeler' ? 'text-[#0284C7]' : 'text-[#64748B]'}`} />
                  <span className="text-[11px] font-bold text-[#0F172A]">Hatchback</span>
                  <span className="text-[10px] font-mono text-[#64748B]">Max 22 cm</span>
                </button>

                <button
                  onClick={() => setVehicleCategory('suv-heavy')}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                    vehicleCategory === 'suv-heavy'
                      ? 'border-[#0284C7] bg-[#F0FDFA] ring-1 ring-[#0284C7] shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Truck className={`w-4.5 h-4.5 ${vehicleCategory === 'suv-heavy' ? 'text-[#0284C7]' : 'text-[#64748B]'}`} />
                  <span className="text-[11px] font-bold text-[#0F172A]">SUV / Bus</span>
                  <span className="text-[10px] font-mono text-[#64748B]">Max 40 cm</span>
                </button>
              </div>

              {/* Dynamic Vehicle Advice */}
              <div className="p-2.5 bg-[#F8FAFC] border border-sky-100 rounded-md text-xs text-[#0F172A] leading-relaxed">
                {passability.advice}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActivePage('safe-routes')}
            className="w-full mt-2.5 py-1.5 text-xs font-bold text-white bg-jaldrishti-gradient hover:opacity-95 rounded-md transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Plan Route for {vehicleCategory.replace('-', ' ')} →</span>
          </button>
        </div>

        {/* 3. 24x7 Emergency SOS Contacts widget */}
        <div className="bg-white border border-[#BAE6FD] rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-sky-100">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-[#EF4444]" />
                <span>Pune Disaster Helpline</span>
              </span>
              <span className="text-[10px] font-semibold text-[#16A34A] bg-[#D1FAE5] px-2 py-0.5 rounded">
                24x7 Control Room
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="p-2 bg-[#F0FDFA] rounded border border-sky-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0F172A] block">PMC Disaster Central</span>
                  <span className="text-[11px] text-[#64748B]">Rescue &amp; Dewatering</span>
                </div>
                <a
                  href="tel:02025501269"
                  className="font-mono font-bold text-xs text-[#0284C7] bg-white border border-[#BAE6FD] px-2 py-1 rounded hover:bg-sky-50 shadow-2xs"
                >
                  020-25501269
                </a>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0F172A] block">Fire Brigade Rescue</span>
                  <span className="text-[11px] text-[#64748B]">Submerged Vehicle Pull</span>
                </div>
                <a
                  href="tel:101"
                  className="font-mono font-bold text-xs text-[#EF4444] bg-white border border-red-200 px-2.5 py-1 rounded hover:bg-red-50 shadow-2xs"
                >
                  101
                </a>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0F172A] block">National Emergency</span>
                  <span className="text-[11px] text-[#64748B]">Police / Ambulance / NDRF</span>
                </div>
                <a
                  href="tel:112"
                  className="font-mono font-bold text-xs text-[#075985] bg-white border border-slate-300 px-2.5 py-1 rounded hover:bg-slate-100 shadow-2xs"
                >
                  112
                </a>
              </div>
            </div>
          </div>

          <div className="mt-2.5 space-y-2">
            <button
              onClick={() => setActivePage('helplines')}
              className="w-full py-1.5 text-xs font-bold text-[#075985] bg-[#F0FDFA] hover:bg-[#E0F7FA] border border-[#BAE6FD] rounded-md transition-all shadow-2xs flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Full Helplines &amp; SOS Dispatcher →</span>
            </button>
            <p className="text-[11px] text-[#64748B] pt-1 border-t border-sky-100">
              Keep phone charged; avoid wading through standing water near electric transformers.
            </p>
          </div>
        </div>
      </div>

      {/* Citizen View Mode Switcher: Live Map | Evacuation Centers | Water Depth Visualizer | Emergency SOS */}
      <div className="flex items-center gap-2 border-b border-[#BAE6FD] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'map'
              ? 'bg-[#0284C7] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#075985] bg-[#F0FDFA]'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>Interactive Waterlogging Map</span>
        </button>

        <button
          onClick={() => setActiveTab('shelters')}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'shelters'
              ? 'bg-[#0284C7] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#075985] bg-[#F0FDFA]'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Nearby Relief Shelters ({INITIAL_SHELTERS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('depth-gauge')}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'depth-gauge'
              ? 'bg-[#0284C7] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#075985] bg-[#F0FDFA]'
          }`}
        >
          <Droplet className="w-3.5 h-3.5" />
          <span>Water Depth Comparison Gauge</span>
        </button>

        <button
          onClick={() => setActivePage('helplines')}
          className="px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 whitespace-nowrap ml-auto"
        >
          <PhoneCall className="w-3.5 h-3.5 text-red-600 animate-bounce" />
          <span>Emergency SOS &amp; Helplines Directory</span>
        </button>
      </div>

      {/* Tab 1: Live Interactive Flood Map + Crowdsourced Community Feed */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8 space-y-3">
            <FloodMap />
            <ForecastTimeline />
          </div>

          {/* Right Column: Citizen-Reported Waterlogging Feed */}
          <div className="lg:col-span-4 bg-white border border-[#BAE6FD] rounded-lg p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-sky-100">
              <div>
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Community Waterlogging Feed
                </h3>
                <p className="text-[11px] text-[#64748B]">Verified reports from Pune commuters</p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-xs font-bold text-white bg-jaldrishti-gradient px-2.5 py-1 rounded shadow-xs hover:opacity-90 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Report</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {citizenReports.map(report => (
                <div
                  key={report.id}
                  className="p-3 bg-[#F0FDFA]/50 hover:bg-[#F0FDFA] border border-[#BAE6FD]/80 rounded-md transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-[#0F172A] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0284C7] shrink-0" />
                        <span>{report.location}</span>
                      </span>
                      <span className="text-[10px] text-[#64748B] block">{report.landmark}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        report.waterDepthCm >= 30
                          ? 'bg-red-50 text-[#EF4444] border-red-200'
                          : report.waterDepthCm >= 20
                          ? 'bg-amber-50 text-[#D97706] border-amber-200'
                          : 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                      }`}
                    >
                      {report.waterDepthCm} cm Depth
                    </span>
                  </div>

                  <p className="text-xs text-[#0F172A] mt-2 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-sky-100 flex items-center justify-between text-[11px] text-[#64748B]">
                    <span className="font-medium">{report.reportedAt} · {report.reportedBy}</span>
                    <button
                      onClick={() => upvoteReport(report.id)}
                      className="flex items-center gap-1 font-semibold text-[#075985] hover:text-[#0284C7] bg-white border border-[#BAE6FD] px-2 py-0.5 rounded transition-colors"
                      title="Confirm this waterlogging report"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Confirm ({report.upvotes})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Nearby Relief Shelters */}
      {activeTab === 'shelters' && (
        <div className="bg-white border border-[#BAE6FD] rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-[#0284C7]" />
                <span>Municipal Flood Relief Camps &amp; Evacuation Centers</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Safe emergency shelters equipped with drinking water, medical kits, and dry bedding in Pune.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#D1FAE5] text-[#16A34A] rounded-md self-start sm:self-center">
              All 5 Facilities Open
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_SHELTERS.map(shelter => {
              const occupancyPct = Math.round((shelter.occupiedBeds / shelter.capacityBeds) * 100);
              return (
                <div
                  key={shelter.id}
                  className="p-4 bg-[#F0FDFA]/40 hover:bg-[#F0FDFA] border border-[#BAE6FD] rounded-lg transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-[#0F172A] leading-snug">{shelter.name}</h4>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">{shelter.ward} · {shelter.distanceKm} km away</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-[#BAE6FD] text-[#075985]">
                      {shelter.distanceKm} km
                    </span>
                  </div>

                  <p className="text-xs text-[#475569]">{shelter.address}</p>

                  {/* Bed Occupancy Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B]">Capacity Available:</span>
                      <span className="font-bold text-[#0F172A]">
                        {shelter.capacityBeds - shelter.occupiedBeds} beds left ({shelter.occupiedBeds}/{shelter.capacityBeds})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-jaldrishti-gradient rounded-full transition-all duration-300"
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-sky-100">
                    <span className="text-[#10B981] font-semibold">Food &amp; Medical: {shelter.suppliesStatus}</span>
                    <a
                      href={`tel:${shelter.contact}`}
                      className="font-mono font-bold text-[#0284C7] hover:underline"
                    >
                      {shelter.contact}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Water Depth Comparison Visualizer */}
      {activeTab === 'depth-gauge' && (
        <div className="bg-white border border-[#BAE6FD] rounded-lg p-5 shadow-xs space-y-5">
          <div className="pb-3 border-b border-sky-100">
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Droplet className="w-4 h-4 text-[#0284C7]" />
              <span>Interactive Water Submergence Gauge &amp; Hazard Limits</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Understand what water depth numbers mean on the street for pedestrians, two-wheelers, and passenger vehicles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            {/* 10 cm */}
            <div className="p-4 rounded-lg bg-[#E0F7FA]/50 border border-[#BAE6FD] space-y-2">
              <span className="text-2xl font-black font-mono text-[#0284C7]">10 cm</span>
              <h4 className="text-xs font-bold text-[#0F172A]">Ankle Depth</h4>
              <p className="text-[11px] text-[#475569]">
                Puddle splashing. Safe for all vehicles. Pedestrians should watch for invisible pothole edges.
              </p>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-[#D1FAE5] text-[#16A34A] rounded">
                🟢 Safe
              </span>
            </div>

            {/* 20 cm */}
            <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 space-y-2">
              <span className="text-2xl font-black font-mono text-[#F59E0B]">20 cm</span>
              <h4 className="text-xs font-bold text-[#0F172A]">Wheel Rim Level</h4>
              <p className="text-[11px] text-[#475569]">
                Hazardous for two-wheelers. Silencer backpressure risks engine stall. Slow down to avoid spray.
              </p>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-[#D97706] rounded">
                🟠 Two-Wheeler Danger
              </span>
            </div>

            {/* 35 cm */}
            <div className="p-4 rounded-lg bg-orange-50/70 border border-orange-200 space-y-2">
              <span className="text-2xl font-black font-mono text-[#F97316]">35 cm</span>
              <h4 className="text-xs font-bold text-[#0F172A]">Knee &amp; Sedan Exhaust</h4>
              <p className="text-[11px] text-[#475569]">
                Hatchbacks and sedans will stall if water enters air intake filter. Do not restart if stalled.
              </p>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-[#EA580C] rounded">
                🔴 Car Hazard
              </span>
            </div>

            {/* 50+ cm */}
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-2">
              <span className="text-2xl font-black font-mono text-[#EF4444]">50+ cm</span>
              <h4 className="text-xs font-bold text-[#0F172A]">Flotation Risk</h4>
              <p className="text-[11px] text-[#475569]">
                Cars can lose tire contact with roadbed and begin floating with the current. High drowning hazard.
              </p>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-red-100 text-[#DC2626] rounded">
                ⛔ Severe Hazard
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Citizen Report Modal */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
