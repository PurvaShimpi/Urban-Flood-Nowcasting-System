import React from 'react';
import { StatusCardsGrid } from './StatusCard';
import { FloodMap } from '../map/FloodMap';
import { ForecastTimeline } from './ForecastTimeline';
import { AlertPanel } from './AlertPanel';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-4 p-4 md:p-6 max-w-[1600px] mx-auto">
      {/* Section 1 — Four small status cards */}
      <StatusCardsGrid />

      {/* Main Map & Alerts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Map Column (~70% of grid, 8-9 cols on desktop) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-3">
          <FloodMap />
          {/* Map Time Control (Forecast Slider) */}
          <ForecastTimeline />
        </div>

        {/* Flood Alert Panel Column (~30% of grid, 3-4 cols on desktop) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <AlertPanel className="min-h-[420px]" />
        </div>
      </div>
    </div>
  );
};
