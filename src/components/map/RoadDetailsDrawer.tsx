import React from 'react';
import { X, Navigation, AlertCircle } from 'lucide-react';
import { useFlood } from '../../context/FloodContext';

export const RoadDetailsDrawer: React.FC = () => {
  const { selectedRoad, setSelectedRoad, findSaferRouteForRoad } = useFlood();

  if (!selectedRoad) return null;

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return 'text-[#EF4444] bg-red-50 border-red-200';
      case 'High':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Moderate':
        return 'text-[#D97706] bg-amber-50 border-amber-200';
      case 'Low':
        return 'text-lime-700 bg-lime-50 border-lime-200';
      default:
        return 'text-[#16A34A] bg-[#D1FAE5] border-[#A7F3D0]';
    }
  };

  return (
    <div className="absolute top-3 right-3 w-80 max-w-[calc(100%-24px)] bg-white border border-[#BAE6FD] rounded-md shadow-xl z-30 p-4 animate-in fade-in slide-in-from-right-2 duration-150">
      <div className="flex items-start justify-between border-b border-sky-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] leading-tight">
            {selectedRoad.name}
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">{selectedRoad.zone}</p>
        </div>
        <button
          onClick={() => setSelectedRoad(null)}
          className="p-1 text-[#64748B] hover:text-[#0F172A] rounded transition-colors"
          aria-label="Close road details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics List strictly matching Section 12 */}
      <div className="py-3 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#64748B] font-medium">Flood Risk</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded border ${getRiskBadgeColor(
              selectedRoad.riskLevel
            )}`}
          >
            {selectedRoad.riskLevel}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#64748B]">Current Depth</span>
          <span className="font-semibold font-mono tabular-nums text-[#075985]">
            {selectedRoad.currentDepthCm} cm
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#64748B]">Predicted Depth</span>
          <span className="font-semibold font-mono tabular-nums text-[#075985]">
            {selectedRoad.predictedDepthCm} cm
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#64748B]">Peak Time</span>
          <span className="font-semibold text-[#0F172A]">{selectedRoad.peakTime}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#64748B]">Rainfall</span>
          <span className="font-semibold font-mono tabular-nums text-[#0F172A]">
            {selectedRoad.rainfallMmHr} mm/hr
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#64748B]">Drainage Load</span>
          <span className="font-semibold font-mono tabular-nums text-[#0F172A]">
            {selectedRoad.drainageLoadPct}%
          </span>
        </div>
      </div>

      {selectedRoad.submergedSections && (
        <div className="mb-3.5 p-2 bg-[#F0FDFA] rounded border border-[#BAE6FD]/60 text-[11px] text-[#075985] flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
          <span>{selectedRoad.submergedSections}</span>
        </div>
      )}

      {/* Button: Find Safer Route */}
      <button
        onClick={() => findSaferRouteForRoad(selectedRoad.name)}
        className="w-full py-2 px-3 text-xs font-semibold text-white bg-jaldrishti-gradient hover:opacity-95 rounded-md transition-all duration-150 flex items-center justify-center gap-1.5 shadow-xs"
      >
        <Navigation className="w-3.5 h-3.5" />
        <span>Find Safer Route</span>
      </button>
    </div>
  );
};
