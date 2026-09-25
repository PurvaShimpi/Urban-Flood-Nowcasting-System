import React from 'react';

export const MapLegend: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-white/95 backdrop-blur-xs border border-[#BAE6FD] rounded-md p-2.5 text-xs shadow-sm ${className}`}
    >
      <div className="font-bold text-[#0F172A] text-[11px] mb-1.5 uppercase tracking-wider">
        Flood Risk (Water Depth)
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[#64748B] text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
          <span>Safe (&lt;10 cm)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
          <span>Moderate (10–25 cm)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shrink-0" />
          <span>High (25–40 cm)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0 animate-pulse" />
          <span>Critical (&gt;40 cm)</span>
        </div>
      </div>
      <div className="mt-2 pt-1.5 border-t border-sky-100 flex items-center justify-between text-[10px] text-[#64748B]">
        <div className="flex items-center gap-1">
          <span className="w-3 h-1 bg-[#0284C7] rounded-xs" />
          <span>Mula / Mutha Rivers</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#075985]" />
          <span>Drainage Outfall</span>
        </div>
      </div>
    </div>
  );
};
