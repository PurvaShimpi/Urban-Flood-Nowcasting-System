import React, { useState } from 'react';
import {
  ShieldCheck,
  Droplets,
  Navigation,
  Car,
  Bike,
  Truck,
  Building,
  PhoneCall,
  AlertTriangle,
  Lock,
  ArrowRight,
  Waves,
  MapPin,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  Compass,
  Info,
  Radio,
  Sliders,
  SlidersHorizontal,
  CloudRain,
  Eye,
  LogOut,
  User,
} from 'lucide-react';
import { useFlood, NavPage } from '../../context/FloodContext';
import { PUNE_EMERGENCY_HELPLINES, INITIAL_SHELTERS } from '../../data/puneFloodData';

export const LandingPage: React.FC = () => {
  const {
    currentMetrics,
    damsList,
    drainagePoints,
    setActivePage,
    setUserRole,
    openAuthModal,
    authenticatedOfficer,
    logoutOfficer,
    setVehicleCategory,
  } = useFlood();

  const [selectedArea, setSelectedArea] = useState('Baner - Balewadi');
  const [selectedVehicle, setSelectedVehicle] = useState<'two-wheeler' | 'four-wheeler' | 'suv-heavy'>('four-wheeler');

  const khadakwaslaDam = damsList.find(d => d.id === 'dam-01') || damsList[0];
  const activePumpsCount = drainagePoints.filter(d => d.isPumpActive).length;

  const quickAreaStats: Record<string, { depth: string; risk: string; advice: string; safe: boolean }> = {
    'Baner - Balewadi': {
      depth: '18–42 cm',
      risk: 'High Waterlogging',
      advice: 'Avoid low-lying Nullah bypass; use Expressway service corridor.',
      safe: false,
    },
    'Wakad - Hinjawadi': {
      depth: '14–26 cm',
      risk: 'Moderate Dip',
      advice: 'Underpass slow movement; elevated flyover clear.',
      safe: false,
    },
    'Shivajinagar - Deccan': {
      depth: '4–9 cm',
      risk: 'Clear & Open',
      advice: 'Normal traffic flow; flyover approaches dry.',
      safe: true,
    },
    'Sinhagad Road - Vadgaon': {
      depth: '22–38 cm',
      risk: 'Backwater Surge',
      advice: 'High river surge alert; avoid riverside road stretch.',
      safe: false,
    },
    'Kothrud - Karve Road': {
      depth: '6–14 cm',
      risk: 'Minor Runoff',
      advice: 'Regular commute restored; stay in center lane.',
      safe: true,
    },
    'Old Sangvi - PCMC': {
      depth: '28–46 cm',
      risk: 'Severe Hazard',
      advice: 'Causeway submerged. Heavy vehicle diversion in effect.',
      safe: false,
    },
  };

  const currentAreaStat = quickAreaStats[selectedArea] || quickAreaStats['Baner - Balewadi'];

  const handleEnterCitizen = (targetPage: NavPage = 'dashboard') => {
    setUserRole('citizen');
    setActivePage(targetPage);
  };

  const handleEnterPmc = () => {
    if (authenticatedOfficer) {
      setUserRole('pmc');
      setActivePage('dashboard');
    } else {
      openAuthModal();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-200">
      {/* 1. Official Municipal Top Banner */}
      <header className="bg-white border-b border-[#BAE6FD] sticky top-0 z-40 shadow-xs backdrop-blur-xs">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-jaldrishti-gradient flex items-center justify-center text-white shadow-sm">
              <Droplets className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
                  JalDrishti
                </span>
                <span className="text-[10px] font-bold bg-[#E0F7FA] text-[#075985] px-2 py-0.5 rounded border border-[#BAE6FD] hidden sm:inline-block">
                  PMC DISASTER RESPONSE
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] hidden sm:block">
                Pune Metropolitan Flood Monitoring &amp; Early Warning System
              </p>
            </div>
          </div>

          {/* Quick Nav & Mode Access */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => handleEnterCitizen('dashboard')}
              className="px-3.5 py-2 text-xs font-bold text-[#075985] bg-[#F0FDFA] hover:bg-[#E0F7FA] border border-[#BAE6FD] rounded-lg transition-all shadow-2xs flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Citizen Portal (Public)</span>
            </button>

            {authenticatedOfficer ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEnterPmc}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#075985] to-[#0284C7] hover:from-[#0369A1] hover:to-[#0284C7] rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-200" />
                  <span className="hidden sm:inline">Officer Console:</span>
                  <span>{authenticatedOfficer.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logoutOfficer}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
                  title="Sign Out Officer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#075985] to-[#0284C7] hover:from-[#0369A1] hover:to-[#0284C7] rounded-lg shadow-sm transition-all flex items-center gap-1.5 hover:scale-[1.02]"
              >
                <Lock className="w-3.5 h-3.5 text-sky-200" />
                <span>PMC Officer Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Monsoon Status Ticker */}
        <div className="bg-[#075985] text-white py-1.5 px-4 text-xs font-medium border-t border-sky-600/40">
          <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4 overflow-x-auto text-[11px] whitespace-nowrap">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 bg-[#EF4444] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                Live Monsoon Telemetry
              </span>
              <span className="text-sky-200">
                City Flood Risk:{' '}
                <strong className="text-white underline font-mono">{currentMetrics.overallRisk}</strong>
              </span>
              <span className="text-sky-300">|</span>
              <span className="text-sky-200">
                Rainfall: <strong className="text-white font-mono">{currentMetrics.rainfallMmHr} mm/hr</strong> (Heavy at Baner &amp; Wakad)
              </span>
              <span className="text-sky-300">|</span>
              <span className="text-sky-200">
                Khadakwasla Dam Outflow:{' '}
                <strong className="text-amber-300 font-mono">
                  {khadakwaslaDam.dischargeCusecs.toLocaleString()} cusecs
                </strong>{' '}
                (Mutha Riverbank Alert)
              </span>
              <span className="text-sky-300">|</span>
              <span className="text-sky-200">
                Municipal Dewatering: <strong className="text-emerald-300 font-mono">{activePumpsCount} Pumps Running</strong>
              </span>
            </div>
            <div className="flex items-center gap-3 text-sky-200 font-mono shrink-0">
              <span>PMC Helpline: <a href="tel:02025501269" className="text-white underline font-bold">020-25501269</a></span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Water Visual Accent & Animated Rain Stream */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E0F7FA]/40 via-white to-slate-50 py-12 md:py-16 border-b border-[#BAE6FD]">
        {/* Subtle animated rainfall overlay on hero */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute left-[10%] top-0 w-0.5 h-12 bg-sky-400 rounded-full animate-rainfall-fast" />
          <div className="absolute left-[25%] top-0 w-0.5 h-16 bg-sky-400 rounded-full animate-rainfall-med" />
          <div className="absolute left-[40%] top-0 w-0.5 h-14 bg-sky-400 rounded-full animate-rainfall-slow" />
          <div className="absolute left-[60%] top-0 w-0.5 h-12 bg-sky-400 rounded-full animate-rainfall-fast" />
          <div className="absolute left-[78%] top-0 w-0.5 h-18 bg-sky-400 rounded-full animate-rainfall-med" />
          <div className="absolute left-[92%] top-0 w-0.5 h-14 bg-sky-400 rounded-full animate-rainfall-slow" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F7FA] border border-[#BAE6FD] text-[#075985] text-xs font-bold">
              <Building className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Pune Municipal Corporation (PMC) &amp; PCMC Disaster Management</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              Pune Metropolitan Urban Flood Monitoring &amp; Early Warning System
            </h1>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Real-time road inundation tracking, water clearance guidance for commuters, and safe dry route navigation — seamlessly integrated with SCADA municipal pump actuation and dam discharge response.
            </p>

            {/* Two Primary Action Portals */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => handleEnterCitizen('dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-extrabold text-white bg-jaldrishti-gradient hover:opacity-95 rounded-xl shadow-md transition-all duration-150 flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Eye className="w-4 h-4" />
                <span>Explore Citizen Public Information</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={handleEnterPmc}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-extrabold text-[#075985] bg-white hover:bg-sky-50 border-2 border-[#0284C7] rounded-xl shadow-xs transition-all duration-150 flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Lock className="w-4 h-4 text-[#0284C7]" />
                <span>
                  {authenticatedOfficer ? 'Open PMC Command Console' : 'PMC Department Officer Login'}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Public visitors can view flood maps, route navigation, and shelter contacts. Officers require badge authentication to access SCADA pump and dam controls.
            </p>
          </div>

          {/* 4 Telemetry Metric Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-10">
            <div className="p-4 rounded-xl bg-white border border-[#BAE6FD] shadow-xs">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide block">City Flood Risk</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-ping" />
                <span className="text-xl font-black text-[#D97706] font-mono">{currentMetrics.overallRisk}</span>
              </div>
              <span className="text-[10px] text-[#64748B] mt-1 block">Monitored across 15 Wards</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#BAE6FD] shadow-xs">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide block">Khadakwasla Dam</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-[#0284C7] font-mono">
                  {khadakwaslaDam.dischargeCusecs.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-[#64748B]">cusecs</span>
              </div>
              <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
                Alert: {khadakwaslaDam.gatesOpen}/{khadakwaslaDam.totalGates} Gates Discharging
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#BAE6FD] shadow-xs">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide block">Average Rainfall</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-[#075985] font-mono">{currentMetrics.rainfallMmHr}</span>
                <span className="text-xs font-semibold text-[#64748B]">mm/hr</span>
              </div>
              <span className="text-[10px] text-[#64748B] mt-1 block">Trend: {currentMetrics.rainfallTrend}</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#BAE6FD] shadow-xs">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide block">Stormwater SCADA</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-[#10B981] font-mono">{activePumpsCount}</span>
                <span className="text-xs font-semibold text-[#64748B]">/ {drainagePoints.length} Active</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">High-Capacity Dewatering</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Role Split & Boundary Clarification */}
      <section className="py-12 bg-white border-b border-[#BAE6FD]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Two Tailored Experiences for Public &amp; Administration
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              JalDrishti maintains strict separation between open public citizen safety tools and authenticated municipal emergency control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Citizen Public Access Card */}
            <div className="bg-[#F0FDFA]/50 border-2 border-[#BAE6FD] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-shadow relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs">
                    <Eye className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-[#D1FAE5] text-[#16A34A] rounded-full border border-emerald-200">
                    Open Public Information
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Citizen Safety &amp; Commuter Hub</h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Designed for Pune citizens, daily commuters, and vehicle owners to travel safely during monsoons.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-[#0F172A] pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Live Waterlogging Map:</strong> View water depths (cm) across Baner, Wakad, Sinhagad Rd, and Deccan.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Safe Dry Route Navigation:</strong> Get dry bypass routes calculated specifically for your Two-Wheeler, Car, or SUV.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Relief Shelter Directory:</strong> Instant access to 5 municipal community relief centers with real-time bed availability.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Crowdsourced Incident Reporting:</strong> Report water logging on your street with photo landmarks and upvote alerts.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>24x7 Emergency Helplines:</strong> Direct click-to-dial for PMC Control Room, Fire Brigade, and Police.</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-sky-100 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => handleEnterCitizen('dashboard')}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Launch Citizen Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleEnterCitizen('safe-routes')}
                  className="py-2.5 px-4 text-xs font-bold text-[#075985] bg-white border border-[#BAE6FD] hover:bg-[#E0F7FA] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Check Safe Routes</span>
                </button>
              </div>
            </div>

            {/* PMC Disaster Cell Card */}
            <div className="bg-[#075985] text-white border-2 border-[#0284C7] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none w-64 flex items-center justify-end">
                <ShieldCheck className="w-full h-full text-white" />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-sky-200" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-red-500/20 text-red-200 rounded-full border border-red-400/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Officer Authentication Required</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">PMC Disaster Management Cell</h3>
                  <p className="text-xs text-sky-100 mt-1">
                    Tactical SCADA command room for authorized municipal officers, ward engineers, and disaster coordinators.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-sky-100 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                    <span><strong>SCADA Pump Actuation:</strong> Remotely turn municipal high-capacity suction pumps ON/OFF with live flow telemetry.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                    <span><strong>Sluice Gate Backflow Control:</strong> Adjust gate positions (Fully Open / Partially / Closed) to prevent river surge into residential drains.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                    <span><strong>Khadakwasla Dam Coordination:</strong> Inflow &amp; outflow discharge rate analysis for Mutha and Mula riverbanks.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                    <span><strong>Emergency QRT &amp; NDRF Dispatch:</strong> Deploy rescue boats, sump tankers, and traffic diversion squads.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                    <span><strong>City-Wide Emergency Broadcast:</strong> Issue official Red Alerts that broadcast directly across all citizen screens.</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-sky-600/50 flex flex-col sm:flex-row gap-2.5 relative z-10">
                <button
                  onClick={handleEnterPmc}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-[#075985] bg-white hover:bg-sky-50 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                >
                  <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>
                    {authenticatedOfficer ? 'Enter Command Console →' : 'Officer Sign In with Badge ID'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quick Public Locality & Vehicle Safety Preview (Directly on Landing Page) */}
      <section className="py-12 bg-slate-50 border-b border-[#BAE6FD]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              Instant Commuter Check
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">
              Check Your Area &amp; Vehicle Clearance Right Now
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Select your commute locality and vehicle type to see instant water submergence estimates.
            </p>
          </div>

          <div className="bg-white border border-[#BAE6FD] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            {/* Area selection */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Select Municipal Locality:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {Object.keys(quickAreaStats).map(area => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all text-center ${
                      selectedArea === area
                        ? 'bg-[#0284C7] text-white shadow-xs'
                        : 'bg-[#F0FDFA] text-[#075985] border border-[#BAE6FD] hover:bg-[#E0F7FA]'
                    }`}
                  >
                    {area.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle selection */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Select Your Vehicle Category:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedVehicle('two-wheeler')}
                  className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                    selectedVehicle === 'two-wheeler'
                      ? 'border-[#0284C7] bg-[#F0FDFA] ring-1 ring-[#0284C7]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Bike className="w-4 h-4 text-[#0284C7]" />
                  <span className="text-xs font-bold text-[#0F172A]">Two-Wheeler</span>
                  <span className="text-[10px] text-[#64748B]">Max Safe: 12 cm</span>
                </button>

                <button
                  onClick={() => setSelectedVehicle('four-wheeler')}
                  className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                    selectedVehicle === 'four-wheeler'
                      ? 'border-[#0284C7] bg-[#F0FDFA] ring-1 ring-[#0284C7]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Car className="w-4 h-4 text-[#0284C7]" />
                  <span className="text-xs font-bold text-[#0F172A]">Car / Hatchback</span>
                  <span className="text-[10px] text-[#64748B]">Max Safe: 22 cm</span>
                </button>

                <button
                  onClick={() => setSelectedVehicle('suv-heavy')}
                  className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                    selectedVehicle === 'suv-heavy'
                      ? 'border-[#0284C7] bg-[#F0FDFA] ring-1 ring-[#0284C7]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#0284C7]" />
                  <span className="text-xs font-bold text-[#0F172A]">SUV / Heavy</span>
                  <span className="text-[10px] text-[#64748B]">Max Safe: 40 cm</span>
                </button>
              </div>
            </div>

            {/* Quick Result Output Banner */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              currentAreaStat.safe
                ? 'bg-[#D1FAE5]/60 border-[#A7F3D0]'
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#0F172A]">{selectedArea}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    currentAreaStat.safe ? 'bg-[#16A34A] text-white' : 'bg-[#D97706] text-white'
                  }`}>
                    {currentAreaStat.risk}
                  </span>
                </div>
                <p className="text-xs text-[#475569]">
                  Water Depth: <strong className="text-[#075985] font-mono">{currentAreaStat.depth}</strong> · {currentAreaStat.advice}
                </p>
              </div>

              <button
                onClick={() => {
                  setVehicleCategory(selectedVehicle);
                  handleEnterCitizen('safe-routes');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-jaldrishti-gradient hover:opacity-95 rounded-lg shadow-xs transition-all whitespace-nowrap self-end sm:self-center"
              >
                Plan Safe Bypass Route →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Animated Rainfall Monitoring Section (Live Pune Doppler & Weather Stations) */}
      <section className="py-12 bg-white border-b border-[#BAE6FD]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F7FA] border border-[#BAE6FD] text-[#075985] text-xs font-bold mb-2">
                <CloudRain className="w-3.5 h-3.5 text-[#0284C7] animate-bounce" />
                <span>Live IMD & Municipal Weather Radar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Pune Animated Rainfall &amp; Catchment Radar
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Real-time precipitation rates, catchment inflow monitoring, and Doppler radar cloud sweep across Pune metropolitan region.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#075985] bg-[#F0FDFA] px-3 py-1.5 rounded-lg border border-[#BAE6FD] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-ping" />
                <span>City Average: <strong className="font-mono text-[#0284C7]">{currentMetrics.rainfallMmHr} mm/hr</strong></span>
              </span>
              <button
                onClick={() => handleEnterCitizen('rainfall')}
                className="px-4 py-2 text-xs font-bold text-white bg-jaldrishti-gradient hover:opacity-95 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Full Radar View &amp; Audio Simulator →</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Animated Doppler Radar Screen */}
            <div className="lg:col-span-7 bg-[#075985] rounded-2xl p-5 text-white border-2 border-[#0284C7] shadow-md relative overflow-hidden flex flex-col justify-between min-h-[340px]">
              {/* Animated Radar Canvas Background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Concentric distance range rings */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-sky-400/25 rounded-full" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-sky-400/20 rounded-full" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] border border-sky-400/15 rounded-full" />
                {/* Crosshairs */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-sky-400/20 -translate-x-1/2" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-sky-400/20 -translate-y-1/2" />
                
                {/* Rotating Doppler Radar Beam */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full pointer-events-none">
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg at 50% 50%, rgba(56, 189, 248, 0.45) 0deg, rgba(14, 165, 233, 0.15) 45deg, transparent 90deg, transparent 360deg)',
                      animation: 'radar-sweep 4s linear infinite',
                    }}
                  />
                </div>

                {/* Animated Rain Streaks */}
                <div className="absolute left-[18%] top-6 w-0.5 h-12 bg-sky-300 rounded-full animate-rainfall-fast opacity-60" />
                <div className="absolute left-[36%] top-10 w-0.5 h-16 bg-sky-300 rounded-full animate-rainfall-med opacity-70" />
                <div className="absolute left-[54%] top-4 w-0.5 h-14 bg-sky-300 rounded-full animate-rainfall-slow opacity-50" />
                <div className="absolute left-[72%] top-8 w-0.5 h-12 bg-sky-300 rounded-full animate-rainfall-fast opacity-60" />
                <div className="absolute left-[88%] top-12 w-0.5 h-18 bg-sky-300 rounded-full animate-rainfall-med opacity-60" />

                {/* Pulsing Rain Echo Patches over Pune Map */}
                <div className="absolute left-[32%] top-[38%] w-16 h-16 bg-red-500/30 rounded-full filter blur-md animate-pulse" />
                <div className="absolute left-[62%] top-[48%] w-24 h-24 bg-amber-500/25 rounded-full filter blur-lg animate-pulse" />
                <div className="absolute left-[45%] top-[60%] w-20 h-20 bg-sky-400/25 rounded-full filter blur-md" />
              </div>

              {/* Radar Overlay Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                    IMD Pune Doppler Precipitation Scan
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-sky-950/70 border border-sky-400/30 px-2 py-0.5 rounded text-sky-200">
                  Range: 60 KM · Band: S-Band Doppler
                </span>
              </div>

              {/* Station Indicators on Radar */}
              <div className="relative z-10 my-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-sky-950/75 border border-sky-400/30 rounded-xl p-3 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Pashan (IMD)</span>
                    <span className="text-[10px] text-amber-300 font-bold">Torrential</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black font-mono text-amber-300">52</span>
                    <span className="text-[10px] text-sky-200">mm/hr</span>
                  </div>
                  <div className="w-full bg-sky-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="bg-sky-950/75 border border-sky-400/30 rounded-xl p-3 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Shivajinagar</span>
                    <span className="text-[10px] text-sky-300 font-bold">Moderate</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black font-mono text-sky-300">38</span>
                    <span className="text-[10px] text-sky-200">mm/hr</span>
                  </div>
                  <div className="w-full bg-sky-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>

                <div className="bg-sky-950/75 border border-red-400/50 rounded-xl p-3 backdrop-blur-xs col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Lavasa / Catchment</span>
                    <span className="text-[10px] text-red-400 font-bold animate-pulse">Cloudburst</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black font-mono text-red-400">84</span>
                    <span className="text-[10px] text-sky-200">mm/hr</span>
                  </div>
                  <div className="w-full bg-sky-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>

              {/* Radar Footer Action */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-sky-500/30 text-xs">
                <span className="text-sky-200 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-sky-300" />
                  <span>Khadakwasla Dam inflow actively surging from Western Ghats</span>
                </span>
                <button
                  onClick={() => handleEnterCitizen('rainfall')}
                  className="px-3 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Interactive Rain Simulator</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Weather Stations Telemetry Table */}
            <div className="lg:col-span-5 bg-slate-50 border border-[#BAE6FD] rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#0284C7]" />
                    <span>Ward Automated Rain Gauges (ARG)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    5 Stations Online
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: 'Pashan - Sus Road', rate: '52 mm/hr', status: 'Heavy Torrent', color: 'text-amber-600', bg: 'bg-amber-100', bar: 'w-4/5 bg-amber-500' },
                    { name: 'Chinchwad - PCMC', rate: '46 mm/hr', status: 'Heavy Rain', color: 'text-amber-600', bg: 'bg-amber-100', bar: 'w-3/4 bg-amber-500' },
                    { name: 'Shivajinagar - Deccan', rate: '38 mm/hr', status: 'Moderate', color: 'text-[#0284C7]', bg: 'bg-sky-100', bar: 'w-3/5 bg-[#0284C7]' },
                    { name: 'Hadapsar - Magarpatta', rate: '28 mm/hr', status: 'Steady Rain', color: 'text-[#0284C7]', bg: 'bg-sky-100', bar: 'w-2/5 bg-[#0284C7]' },
                    { name: 'NDA - Khadakwasla Base', rate: '74 mm/hr', status: 'Intense Inflow', color: 'text-red-600', bg: 'bg-red-100', bar: 'w-11/12 bg-red-500' },
                  ].map((station, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#0F172A]">{station.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${station.bg} ${station.color}`}>
                            {station.status}
                          </span>
                          <span className="font-mono font-bold text-[#0F172A]">{station.rate}</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${station.bar}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#64748B]">
                  Updated every 5 mins via PMC SCADA telemetry
                </span>
                <button
                  onClick={() => handleEnterCitizen('forecast')}
                  className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
                >
                  <span>24h IMD Forecast →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Comprehensive 24x7 Emergency Helplines & SOS Section */}
      <section className="py-12 bg-slate-50 border-b border-[#BAE6FD]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2 border border-red-200">
                <PhoneCall className="w-3.5 h-3.5 text-red-600 animate-bounce" />
                <span>24x7 Monsoon Crisis Dispatch</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Emergency Helplines &amp; Immediate Relief Support
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Direct municipal contact numbers, one-click emergency calls, and nearest flood relief shelters with live bed occupancy.
              </p>
            </div>

            <button
              onClick={() => handleEnterCitizen('helplines')}
              className="px-4 py-2 text-xs font-bold text-white bg-jaldrishti-gradient hover:opacity-95 rounded-lg transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span>Full Helpline Directory &amp; SOS Dispatcher →</span>
            </button>
          </div>

          {/* Quick-Dial Hotline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50/80 border-2 border-red-300 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                    Primary Command
                  </span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </div>
                <h3 className="font-extrabold text-sm text-red-950">PMC Disaster Control Room</h3>
                <p className="text-[11px] text-red-800 mt-1">
                  High-capacity suction pumps, dewatering sump tankers, and fallen tree clearance.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-red-200">
                <a
                  href="tel:02025501269"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 020-25501269</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-600 text-white">
                    Water Rescue
                  </span>
                  <span className="text-[10px] font-bold text-amber-700">Immediate</span>
                </div>
                <h3 className="font-extrabold text-sm text-amber-950">Pune Fire Brigade</h3>
                <p className="text-[11px] text-amber-800 mt-1">
                  Inflatable rescue boats, submerged car pullouts, and trapped citizen evacuation.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-amber-200">
                <a
                  href="tel:101"
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 101 / 020-26451707</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-sky-50/80 border-2 border-sky-300 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#0284C7] text-white">
                    National SOS
                  </span>
                  <span className="text-[10px] font-bold text-sky-700">Toll-Free</span>
                </div>
                <h3 className="font-extrabold text-sm text-sky-950">Police &amp; NDRF Battalion</h3>
                <p className="text-[11px] text-sky-800 mt-1">
                  Unified emergency response, road blockade enforcement, and military disaster rescue.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-sky-200">
                <a
                  href="tel:112"
                  className="w-full py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 112 / 100</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                    Medical SOS
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">State Ambulance</span>
                </div>
                <h3 className="font-extrabold text-sm text-emerald-950">Emergency Ambulance 108</h3>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Ambulance trauma care, emergency transport for elderly and waterborne illnesses.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-emerald-200">
                <a
                  href="tel:108"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 108</span>
                </a>
              </div>
            </div>
          </div>

          {/* Emergency Relief Shelters Sneak Peek */}
          <div className="bg-white border border-[#BAE6FD] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0284C7]" />
                  <span>Municipal Emergency Relief Centers &amp; Shelters</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Equipped with clean drinking water, food packets, primary healthcare, and dry beds.
                </p>
              </div>
              <button
                onClick={() => handleEnterCitizen('helplines')}
                className="text-xs font-bold text-[#0284C7] hover:underline"
              >
                View all shelters on map →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {INITIAL_SHELTERS.slice(0, 3).map(shelter => {
                const occupancyPercent = Math.round((shelter.occupiedBeds / shelter.capacityBeds) * 100);
                const availableBeds = shelter.capacityBeds - shelter.occupiedBeds;
                return (
                  <div key={shelter.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-[#0F172A]">{shelter.name}</h4>
                        <span className="text-[10px] text-[#64748B]">{shelter.address}</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded shrink-0">
                        {availableBeds} beds open
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-[#64748B]">
                        <span>Capacity: {shelter.occupiedBeds}/{shelter.capacityBeds} beds</span>
                        <span>{occupancyPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0284C7] h-full rounded-full"
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-[#075985] font-semibold">{shelter.contact}</span>
                      <span className="text-slate-500 font-mono">{shelter.distanceKm} km away</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Municipal Statutory Footer */}
      <footer className="mt-auto bg-[#075985] text-white py-8 border-t border-[#0284C7]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <p className="font-bold text-sm">JalDrishti · Pune Metropolitan Monsoon Portal</p>
              <p className="text-[11px] text-sky-200 mt-0.5">
                Pune Municipal Corporation (PMC) &amp; Pimpri Chinchwad Municipal Corporation (PCMC)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sky-200 text-xs">
            <button
              onClick={() => handleEnterCitizen('dashboard')}
              className="hover:text-white transition-colors"
            >
              Citizen Portal
            </button>
            <button
              onClick={() => handleEnterCitizen('safe-routes')}
              className="hover:text-white transition-colors"
            >
              Safe Routes
            </button>
            <button
              onClick={() => handleEnterCitizen('flood-map')}
              className="hover:text-white transition-colors"
            >
              Waterlogging Map
            </button>
            <button
              onClick={handleEnterPmc}
              className="font-bold text-white hover:underline flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-sky-300" />
              <span>Officer SCADA Access</span>
            </button>
          </div>

          <p className="text-[10px] text-sky-300 text-center md:text-right">
            Disaster Management Act 2005 · Official Government Portal · Pune, Maharashtra
          </p>
        </div>
      </footer>
    </div>
  );
};
