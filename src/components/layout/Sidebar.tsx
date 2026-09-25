import React from 'react';
import {
  LayoutDashboard,
  Map,
  Clock,
  CloudRain,
  Navigation,
  AlertTriangle,
  FileText,
  Settings,
  Droplets,
  Sliders,
  Truck,
  Users,
  Building2,
  UserCheck,
  Home,
  Lock,
  LogOut,
  ShieldCheck,
  ExternalLink,
  PhoneCall,
} from 'lucide-react';
import { useFlood, NavPage } from '../../context/FloodContext';

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    alerts,
    userRole,
    setUserRole,
    authenticatedOfficer,
    openAuthModal,
    logoutOfficer,
  } = useFlood();

  const activeAlertsCount = alerts.filter(a => !a.acknowledged).length;

  const navItem = (page: NavPage, label: string, Icon: React.ElementType, badge?: number) => {
    const isActive = activePage === page;
    return (
      <button
        onClick={() => setActivePage(page)}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all duration-150 ${
          isActive
            ? 'bg-[#F0FDFA] text-[#075985] font-semibold border-l-2 border-[#0284C7] shadow-xs'
            : 'text-slate-600 hover:text-[#075985] hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#0284C7]' : 'text-slate-400'}`} />
          <span className="truncate">{label}</span>
        </div>
        {typeof badge === 'number' && badge > 0 && (
          <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 bg-red-100 text-red-700 rounded font-semibold animate-pulse">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-60 bg-white border-r border-[#BAE6FD] flex flex-col shrink-0 h-screen sticky top-0 shadow-xs">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-sky-100/70 bg-gradient-to-b from-[#F0FDFA]/50 to-transparent">
        <div
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Return to Landing Page"
        >
          <div className="w-8 h-8 rounded-lg bg-jaldrishti-gradient flex items-center justify-center text-white shrink-0 shadow-sm transition-transform group-hover:scale-105 duration-200">
            <Droplets className="w-4.5 h-4.5 fill-white/90" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1 group-hover:text-[#0284C7] transition-colors">
              <span>JalDrishti</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-normal mt-0.5 leading-none">
              Urban Flood Monitoring &amp; Prediction
            </p>
          </div>
        </div>
        <p className="text-[10px] text-sky-800 font-medium mt-2 italic flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block"></span>
          <span>See the Flood Before It Happens.</span>
        </p>

        {/* Current Active Persona Banner */}
        <div className="mt-2.5 pt-2 border-t border-sky-100/60 flex items-center justify-between text-[11px]">
          <span className="text-[#64748B] font-medium">Dashboard:</span>
          {userRole === 'pmc' && authenticatedOfficer ? (
            <span className="font-bold px-1.5 py-0.5 rounded text-[10px] bg-[#075985] text-white flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-sky-300" />
              <span>Officer Active</span>
            </span>
          ) : (
            <span className="font-bold px-1.5 py-0.5 rounded text-[10px] bg-[#E0F7FA] text-[#075985]">
              👤 Citizen View
            </span>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Landing Page Link */}
        <div>
          <div className="space-y-0.5">
            {navItem('landing', 'Overview Landing Page', Home)}
          </div>
        </div>

        {userRole === 'citizen' ? (
          <>
            {/* Citizen: Commuter & Safety */}
            <div>
              <p className="px-3 text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">
                Public Safety Info
              </p>
              <div className="space-y-0.5">
                {navItem('dashboard', 'Citizen Safety Hub', LayoutDashboard)}
                {navItem('flood-map', 'Live Waterlogging Map', Map)}
                {navItem('safe-routes', 'Safe Dry Routes', Navigation)}
                {navItem('rainfall', 'Rainfall & Weather', CloudRain)}
              </div>
            </div>

            {/* Citizen: Community & Assistance */}
            <div>
              <p className="px-3 text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">
                Helplines &amp; Alerts
              </p>
              <div className="space-y-0.5">
                {navItem('helplines', 'Emergency SOS & Helplines', PhoneCall)}
                {navItem('alerts', 'Active Flood Alerts', AlertTriangle, activeAlertsCount)}
                {navItem('reports', 'Incident Documentation', FileText)}
              </div>
            </div>

            {/* Restricted Officer Section Promo */}
            <div className="pt-2 px-1">
              <div className="p-3 bg-[#F0FDFA] border border-[#BAE6FD] rounded-lg space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#075985] font-bold text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>PMC Officer Portal</span>
                </div>
                <p className="text-[10px] text-[#64748B] leading-relaxed">
                  Municipal SCADA pumps, dam discharge, and NDRF dispatch require department badge login.
                </p>
                <button
                  onClick={openAuthModal}
                  className="w-full py-1.5 text-[11px] font-bold text-white bg-jaldrishti-gradient rounded shadow-xs hover:opacity-95 flex items-center justify-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Officer Sign In</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* PMC: Municipal Command */}
            <div>
              <p className="px-3 text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1 flex items-center justify-between">
                <span>Tactical Command</span>
                <span className="text-[9px] font-mono text-[#0284C7]">{authenticatedOfficer?.badgeId}</span>
              </p>
              <div className="space-y-0.5">
                {navItem('dashboard', 'PMC Operations Console', LayoutDashboard)}
                {navItem('flood-map', 'Tactical GIS Map', Map)}
                {navItem('forecast', 'Hydrological Forecast', Clock)}
                {navItem('rainfall', 'Catchment Telemetry', CloudRain)}
              </div>
            </div>

            {/* PMC: Municipal Operations */}
            <div>
              <p className="px-3 text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">
                Municipal Operations
              </p>
              <div className="space-y-0.5">
                {navItem('alerts', 'Alerts & Broadcast', AlertTriangle, activeAlertsCount)}
                {navItem('reports', 'Audit & Event Reports', FileText)}
              </div>
            </div>

            {/* Officer Quick Logout & Switch */}
            <div className="pt-2 px-1">
              <button
                onClick={logoutOfficer}
                className="w-full py-1.5 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Lock Console &amp; Sign Out</span>
              </button>
            </div>
          </>
        )}

        {/* Universal Settings */}
        <div>
          <p className="px-3 text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1">
            System
          </p>
          <div className="space-y-0.5">
            {navItem('settings', 'Settings & Preferences', Settings)}
          </div>
        </div>
      </div>

      {/* Bottom Status bar */}
      <div className="p-3 border-t border-sky-100/80 bg-[#F0FDFA]/60">
        <div className="flex items-center justify-between text-xs px-2 py-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="font-semibold text-[#075985]">
              {userRole === 'citizen' ? 'Citizen Link Active' : 'PMC SCADA Online'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">PMC/PCMC</span>
        </div>
      </div>
    </aside>
  );
};

