import React from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileNavigation } from './MobileNavigation';
import { useFlood } from '../../context/FloodContext';
import { LandingPage } from '../landing/LandingPage';
import { OfficerAuthModal } from '../auth/OfficerAuthModal';
import { CitizenDashboard } from '../citizen/CitizenDashboard';
import { PmcDisasterCellDashboard } from '../pmc/PmcDisasterCellDashboard';
import { FullMapView } from '../map/FullMapView';
import { ForecastView } from '../forecast/ForecastView';
import { RainfallView } from '../rainfall/RainfallView';
import { SafeRoutesView } from '../routes/SafeRoutesView';
import { AlertsView } from '../alerts/AlertsView';
import { HelplineSection } from '../helpline/HelplineSection';
import { ReportsView } from '../reports/ReportsView';
import { SettingsView } from '../settings/SettingsView';
import { X, Info } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { activePage, toastMessage, clearToast, userRole } = useFlood();

  // If user is on landing page, display the dedicated full-bleed portal landing
  if (activePage === 'landing') {
    return (
      <>
        <LandingPage />
        <OfficerAuthModal />
      </>
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return userRole === 'citizen' ? <CitizenDashboard /> : <PmcDisasterCellDashboard />;
      case 'flood-map':
        return <FullMapView />;
      case 'forecast':
        return <ForecastView />;
      case 'rainfall':
        return <RainfallView />;
      case 'safe-routes':
        return <SafeRoutesView />;
      case 'alerts':
        return <AlertsView />;
      case 'helplines':
        return <HelplineSection />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return userRole === 'citizen' ? <CitizenDashboard /> : <PmcDisasterCellDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopHeader />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="bg-sky-900 text-white text-xs px-4 py-2 flex items-center justify-between shadow-md z-40 transition-all">
            <div className="flex items-center gap-2 max-w-2xl">
              <Info className="w-4 h-4 text-sky-300 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={clearToast}
              className="p-1 hover:bg-sky-800 rounded transition-colors text-sky-200"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Main Content area */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-6">
          {renderActivePage()}
        </main>

        {/* Mobile Navigation bar */}
        <MobileNavigation />
      </div>

      {/* Always available Officer Authentication Modal */}
      <OfficerAuthModal />
    </div>
  );
};

