import React from 'react';
import { FloodMap } from './FloodMap';
import { ForecastTimeline } from '../dashboard/ForecastTimeline';
import { useFlood } from '../../context/FloodContext';
import { RoadSegment } from '../../types/flood';

export const FullMapView: React.FC = () => {
  const { roads, setSelectedRoad, selectedRoad, setSelectedLocality } = useFlood();

  const handleFocusRoad = (road: RoadSegment) => {
    setSelectedRoad(road);
  };

  return (
    <div className="p-3 md:p-5 max-w-[1600px] mx-auto space-y-3">
      {/* Quick Zone Filter Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-semibold text-slate-500 uppercase text-[11px]">Quick Focus:</span>
          {['Baner Road', 'Wakad Link Road', 'Sinhagad Road', 'Old Sangvi Bridge Road', 'JM Road'].map(name => {
            const matched = roads.find(r => r.name === name);
            const isSelected = selectedRoad?.name === name;
            return (
              <button
                key={name}
                onClick={() => matched && handleFocusRoad(matched)}
                className={`px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {name.replace(' Road', '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map expanded */}
      <div className="space-y-3">
        <FloodMap isFullHeight className="min-h-[560px] lg:min-h-[640px]" />
        <ForecastTimeline />
      </div>
    </div>
  );
};
