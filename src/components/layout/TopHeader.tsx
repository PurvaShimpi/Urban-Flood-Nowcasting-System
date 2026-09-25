import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  MapPin,
  Play,
  Square,
  ChevronDown,
  User,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Home,
  Lock,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useFlood } from '../../context/FloodContext';

export const TopHeader: React.FC = () => {
  const {
    userRole,
    setUserRole,
    authenticatedOfficer,
    openAuthModal,
    logoutOfficer,
    activePage,
    alerts,
    isSimulating,
    startSimulation,
    stopSimulation,
    selectedLocality,
    setSelectedLocality,
    setActivePage,
    setSelectedRoad,
    roads,
  } = useFlood();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLocalityMenu, setShowLocalityMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const localityRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (localityRef.current && !localityRef.current.contains(e.target as Node)) {
        setShowLocalityMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  const pageTitles: Record<string, string> = {
    landing: 'Monsoon Portal Overview',
    dashboard: userRole === 'citizen' ? 'Citizen Safety Portal' : 'PMC Disaster Operations Console',
    'flood-map': 'Live Flood Map',
    forecast: 'Flood Forecast',
    rainfall: 'Rainfall Monitoring',
    'safe-routes': 'Safe Routes Navigation',
    alerts: 'Active Flood Alerts',
    helplines: 'Emergency Helplines & SOS',
    reports: 'Municipal Reports',
    settings: 'System Settings',
  };

  const localities = [
    'Pune Central',
    'Baner - Balewadi',
    'Wakad - Hinjawadi',
    'Shivajinagar - Deccan',
    'Vadgaon - Sinhagad Rd',
    'Aundh - Sangvi',
    'Kothrud',
  ];

  return (
    <header className="h-14 bg-white/95 backdrop-blur-xs border-b border-[#BAE6FD] px-4 md:px-6 flex items-center justify-between z-30 sticky top-0 transition-colors">
      {/* Left zone: Landing shortcut, Page Title & Location */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick return to Landing Page */}
        <button
          onClick={() => setActivePage('landing')}
          className="p-1.5 text-[#075985] hover:text-[#0284C7] bg-[#F0FDFA] hover:bg-[#E0F7FA] border border-[#BAE6FD] rounded-md transition-all shadow-2xs flex items-center gap-1"
          title="Return to JalDrishti Landing Page"
        >
          <Home className="w-4 h-4 text-[#0284C7]" />
          <span className="text-[11px] font-bold hidden lg:inline">Home</span>
        </button>

        <h1 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight truncate max-w-[180px] sm:max-w-none">
          {pageTitles[activePage] || 'Dashboard'}
        </h1>

        <div className="h-4 w-px bg-sky-200 hidden sm:block" />

        {/* Location Dropdown */}
        <div className="relative hidden md:block" ref={localityRef}>
          <button
            onClick={() => setShowLocalityMenu(!showLocalityMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#075985] bg-[#F0FDFA] hover:bg-[#E0F7FA] border border-[#BAE6FD] rounded-md transition-colors shadow-2xs"
            title="Switch municipal sector"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="font-semibold text-[#0F172A]">Pune</span>
            <span className="text-[#38BDF8]">·</span>
            <span className="text-[#075985] truncate max-w-[120px]">{selectedLocality}</span>
            <ChevronDown className="w-3 h-3 text-[#64748B] ml-0.5" />
          </button>

          {showLocalityMenu && (
            <div className="absolute left-0 mt-1.5 w-52 bg-white border border-[#BAE6FD] rounded-md shadow-lg py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 font-semibold text-[#64748B] border-b border-sky-100 bg-[#F0FDFA]/50">
                Municipal Zones (PMC / PCMC)
              </div>
              {localities.map(loc => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocality(loc);
                    setShowLocalityMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F0FDFA] transition-colors ${
                    selectedLocality === loc ? 'font-semibold text-[#0284C7] bg-[#F0FDFA]' : 'text-[#0F172A]'
                  }`}
                >
                  <span>{loc}</span>
                  {selectedLocality === loc && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center zone: Role Switcher & Simulation */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* DUAL DASHBOARD SWITCHER WITH OFFICER AUTH GUARD */}
        <div className="bg-[#F0FDFA] border border-[#BAE6FD] p-0.5 sm:p-1 rounded-lg flex items-center shadow-2xs">
          <button
            onClick={() => setUserRole('citizen')}
            className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-md transition-all duration-150 flex items-center gap-1.5 ${
              userRole === 'citizen'
                ? 'bg-[#0284C7] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#075985]'
            }`}
          >
            <span>👤 Citizen View</span>
          </button>

          {authenticatedOfficer ? (
            <button
              onClick={() => setUserRole('pmc')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-md transition-all duration-150 flex items-center gap-1.5 ${
                userRole === 'pmc'
                  ? 'bg-[#075985] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#075985]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PMC Cell</span>
              <span className="sm:hidden">PMC</span>
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-2.5 sm:px-3 py-1 text-xs font-bold text-[#075985] hover:text-[#0284C7] hover:bg-[#E0F7FA] rounded-md transition-all duration-150 flex items-center gap-1"
              title="Restricted: Sign in with PMC Officer credentials"
            >
              <Lock className="w-3 h-3 text-[#0284C7]" />
              <span className="hidden sm:inline">Officer Login</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}
        </div>

        {/* Simulation Mode Toggle (Officer authorized or shows lock) */}
        <div className="hidden xl:flex items-center gap-1.5">
          {userRole === 'pmc' ? (
            isSimulating ? (
              <div className="flex items-center gap-1.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-md px-2.5 py-1 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
                </span>
                <span className="text-[11px] font-bold text-[#92400E]">Simulating Squall</span>
                <button
                  onClick={stopSimulation}
                  className="ml-1 px-1.5 py-0.2 text-[10px] font-bold text-[#92400E] bg-white border border-[#FCD34D] rounded hover:bg-amber-100"
                >
                  Stop
                </button>
              </div>
            ) : (
              <button
                onClick={startSimulation}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#075985] bg-[#F0FDFA] hover:bg-[#E0F7FA] border border-[#BAE6FD] rounded-md transition-all duration-150 shadow-2xs"
                title="Simulate cloudburst water rise"
              >
                <Play className="w-3 h-3 text-[#0284C7]" />
                <span>Simulate</span>
              </button>
            )
          ) : null}
        </div>
      </div>

      {/* Right zone: Notifications & User Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Alerts"
            className="p-1.5 text-[#64748B] hover:text-[#0284C7] hover:bg-[#F0FDFA] rounded-md transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full animate-ping" />
            )}
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
            )}
          </button>

          {/* Clean Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white border border-[#BAE6FD] rounded-md shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-3.5 pb-2 border-b border-sky-100 bg-[#F0FDFA]/40">
                <span className="text-xs font-bold text-[#0F172A]">Notifications</span>
                <span className="text-xs font-mono text-[#075985] tabular-nums font-semibold">
                  {unreadAlerts.length} active
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                {alerts.map(item => {
                  const isRed = item.severity === 'Critical' || item.severity === 'High';
                  const isAmber = item.severity === 'Moderate';
                  const dotColor = isRed
                    ? 'bg-[#EF4444]'
                    : isAmber
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#10B981]';

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setShowNotifications(false);
                        const matchedRoad = roads.find(r => r.name.toLowerCase().includes(item.location.toLowerCase()));
                        if (matchedRoad) {
                          setSelectedRoad(matchedRoad);
                          setActivePage('dashboard');
                        } else {
                          setActivePage('alerts');
                        }
                      }}
                      className="px-3.5 py-2.5 hover:bg-[#F0FDFA] cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${dotColor}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#0F172A] truncate">
                            {item.title}
                          </p>
                          <p className="text-[#64748B] mt-0.5">{item.location}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#64748B]">
                            <span>{item.timestamp}</span>
                            {item.predictedDepthCm && (
                              <>
                                <span>·</span>
                                <span className="font-mono tabular-nums font-semibold text-[#075985]">
                                  {item.predictedDepthCm} cm depth
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 px-3.5 border-t border-sky-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActivePage('alerts');
                  }}
                  className="text-xs font-semibold text-[#0284C7] hover:text-[#075985]"
                >
                  View All Alerts in Detail →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Officer Status */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 hover:bg-[#F0FDFA] rounded-md transition-colors text-xs"
          >
            {authenticatedOfficer ? (
              <>
                <div className="w-6 h-6 rounded-full bg-[#075985] text-white flex items-center justify-center font-bold text-[10px] shadow-2xs border border-[#38BDF8]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-left hidden sm:block">
                  <span className="font-bold text-[#0F172A] block leading-none text-xs">
                    {authenticatedOfficer.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-[#0284C7] leading-none">
                    {authenticatedOfficer.badgeId}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-[#E0F7FA] text-[#0284C7] border border-[#BAE6FD] flex items-center justify-center font-bold text-[10px] shadow-2xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-[#0F172A] hidden sm:inline">Citizen Guest</span>
              </>
            )}
            <ChevronDown className="w-3 h-3 text-[#64748B] hidden sm:inline" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white border border-[#BAE6FD] rounded-md shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-sky-100 bg-[#F0FDFA]/50">
                {authenticatedOfficer ? (
                  <>
                    <p className="font-bold text-[#0F172A]">{authenticatedOfficer.name}</p>
                    <p className="text-[#075985] font-mono text-[10px] font-semibold">{authenticatedOfficer.badgeId}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5 leading-tight">{authenticatedOfficer.designation}</p>
                    <p className="text-[10px] text-[#10B981] font-semibold mt-1">● Authenticated SCADA Session</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-[#0F172A]">Public Citizen Session</p>
                    <p className="text-[#64748B] text-[11px]">Limited Information Mode</p>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        openAuthModal();
                      }}
                      className="mt-2 w-full py-1 text-[11px] font-bold text-white bg-jaldrishti-gradient rounded text-center block shadow-2xs"
                    >
                      PMC Officer Sign In
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActivePage('landing');
                }}
                className="w-full text-left px-3.5 py-2 text-[#0F172A] hover:bg-[#F0FDFA] flex items-center gap-2 transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Return to Landing Page</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActivePage('settings');
                }}
                className="w-full text-left px-3.5 py-2 text-[#0F172A] hover:bg-[#F0FDFA] flex items-center gap-2 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Preferences</span>
              </button>

              {authenticatedOfficer && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logoutOfficer();
                  }}
                  className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-100"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock Console &amp; Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
