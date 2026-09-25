import React from 'react';
import { LayoutDashboard, Map, Clock, Navigation, AlertTriangle, UserCheck, Building2, Home, Lock, ShieldCheck, PhoneCall, CloudRain } from 'lucide-react';
import { useFlood, NavPage } from '../../context/FloodContext';

export const MobileNavigation: React.FC = () => {
  const { activePage, setActivePage, alerts, userRole, setUserRole, authenticatedOfficer, openAuthModal } = useFlood();
  const activeAlertsCount = alerts.filter(a => !a.acknowledged).length;

  const items: { id: NavPage; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'landing', label: 'Portal', icon: Home },
    { id: 'dashboard', label: 'Hub', icon: LayoutDashboard },
    { id: 'rainfall', label: 'Rain', icon: CloudRain },
    { id: 'safe-routes', label: 'Routes', icon: Navigation },
    { id: 'helplines', label: 'SOS', icon: PhoneCall },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-xs border-t border-[#BAE6FD] z-40 px-2 flex items-center justify-around shadow-lg">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] relative transition-colors ${
              isActive ? 'text-[#0284C7] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <div className="relative">
              <Icon className="w-4 h-4" />
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#EF4444] text-white rounded-full text-[9px] flex items-center justify-center font-bold font-mono">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="mt-0.5 leading-none">{item.label}</span>
          </button>
        );
      })}

      {/* Role Switcher on Mobile with Lock indicator */}
      <button
        onClick={() => {
          if (userRole === 'citizen') {
            if (authenticatedOfficer) {
              setUserRole('pmc');
            } else {
              openAuthModal();
            }
          } else {
            setUserRole('citizen');
          }
        }}
        className={`flex flex-col items-center justify-center px-2 py-1 text-[10px] font-bold rounded transition-colors ${
          userRole === 'pmc'
            ? 'bg-[#075985] text-white'
            : 'bg-[#F0FDFA] text-[#0284C7] border border-[#BAE6FD]'
        }`}
        title="Toggle between Citizen & PMC View"
      >
        {userRole === 'citizen' ? (
          <>
            {authenticatedOfficer ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
            )}
            <span className="mt-0.5 leading-none">PMC Cell</span>
          </>
        ) : (
          <>
            <Building2 className="w-3.5 h-3.5 text-white" />
            <span className="mt-0.5 leading-none">Citizen</span>
          </>
        )}
      </button>
    </div>
  );
};

