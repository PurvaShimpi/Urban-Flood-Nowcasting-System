import React from 'react';
import { X } from 'lucide-react';
import { useFlood } from '../../context/FloodContext';

export const DrainageDetailsModal: React.FC = () => {
  const { selectedDrainage, setSelectedDrainage } = useFlood();

  if (!selectedDrainage) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Overloaded':
        return 'text-[#EF4444] bg-red-50 border-red-200';
      case 'Warning':
        return 'text-[#D97706] bg-amber-50 border-amber-200';
      default:
        return 'text-[#16A34A] bg-[#D1FAE5] border-[#A7F3D0]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm bg-white border border-[#BAE6FD] rounded-md shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-sky-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              Drainage Point {selectedDrainage.code}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">{selectedDrainage.name}</p>
          </div>
          <button
            onClick={() => setSelectedDrainage(null)}
            className="p-1 text-[#64748B] hover:text-[#0F172A] rounded transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Status</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded border ${getStatusColor(
                selectedDrainage.status
              )}`}
            >
              {selectedDrainage.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Capacity</span>
            <span className="font-semibold font-mono tabular-nums text-[#0F172A]">
              {selectedDrainage.capacityPct}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Current Load</span>
            <span className="font-semibold font-mono tabular-nums text-[#075985]">
              {selectedDrainage.currentLoadPct}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Predicted Overload</span>
            <span className="font-semibold font-mono tabular-nums text-[#0F172A]">
              {selectedDrainage.predictedOverloadMin
                ? `${selectedDrainage.predictedOverloadMin} min`
                : 'None (< 3 hrs)'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-sky-100 text-[11px] text-[#64748B]">
            <span>Asset Type</span>
            <span className="font-semibold text-[#075985]">{selectedDrainage.type}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Sluice / Gate</span>
            <span className="font-semibold text-[#075985]">{selectedDrainage.gateStatus}</span>
          </div>
        </div>

        <div className="mt-2">
          <button
            onClick={() => setSelectedDrainage(null)}
            className="w-full py-1.5 px-3 text-xs font-semibold text-[#075985] bg-[#F0FDFA] hover:bg-[#E0F7FA] border border-[#BAE6FD] rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
