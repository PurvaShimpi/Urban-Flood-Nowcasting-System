import React from 'react';
import { useFlood } from '../../context/FloodContext';
import { FloodRiskLevel } from '../../types/flood';

export const StatusCardsGrid: React.FC = () => {
  const { currentMetrics } = useFlood();

  const getRiskColor = (risk: FloodRiskLevel) => {
    switch (risk) {
      case 'Critical':
        return 'text-[#EF4444] bg-red-50 border-red-200';
      case 'High':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Moderate':
        return 'text-[#D97706] bg-amber-50 border-amber-200';
      case 'Low':
        return 'text-lime-700 bg-lime-50 border-lime-200';
      case 'Safe':
      default:
        return 'text-[#16A34A] bg-[#D1FAE5] border-[#A7F3D0]';
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Rainfall */}
      <div className="bg-white border border-[#BAE6FD] hover:border-[#38BDF8] hover:shadow-sm rounded-md p-3.5 flex flex-col justify-between transition-all duration-200 group">
        <div className="flex items-center justify-between text-xs text-[#64748B] font-medium">
          <span className="group-hover:text-[#075985] transition-colors">Rainfall</span>
          <span className="text-[#64748B] font-normal">
            Status: <span className="font-semibold text-[#0284C7]">{currentMetrics.rainfallTrend}</span>
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono tracking-tight text-[#075985] tabular-nums">
            {currentMetrics.rainfallMmHr}
          </span>
          <span className="text-xs text-[#64748B] font-medium">mm/hr</span>
        </div>
      </div>

      {/* 2. Flood Risk */}
      <div className="bg-white border border-[#BAE6FD] hover:border-[#38BDF8] hover:shadow-sm rounded-md p-3.5 flex flex-col justify-between transition-all duration-200 group">
        <div className="text-xs text-[#64748B] font-medium group-hover:text-[#075985] transition-colors">
          Flood Risk
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
            {currentMetrics.overallRisk}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded border transition-colors ${getRiskColor(
              currentMetrics.overallRisk
            )}`}
          >
            {currentMetrics.overallRisk === 'Safe' ? 'Normal' : currentMetrics.overallRisk}
          </span>
        </div>
      </div>

      {/* 3. Maximum Water Depth */}
      <div className="bg-white border border-[#BAE6FD] hover:border-[#38BDF8] hover:shadow-sm rounded-md p-3.5 flex flex-col justify-between transition-all duration-200 group">
        <div className="text-xs text-[#64748B] font-medium group-hover:text-[#075985] transition-colors">
          Maximum Water Depth
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono tracking-tight text-[#075985] tabular-nums">
            {currentMetrics.maxDepthCm}
          </span>
          <span className="text-xs text-[#64748B] font-medium">cm</span>
        </div>
      </div>

      {/* 4. Drainage */}
      <div className="bg-white border border-[#BAE6FD] hover:border-[#38BDF8] hover:shadow-sm rounded-md p-3.5 flex flex-col justify-between transition-all duration-200 group">
        <div className="text-xs text-[#64748B] font-medium group-hover:text-[#075985] transition-colors">
          Drainage
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono tracking-tight text-[#0F172A] tabular-nums">
            {currentMetrics.drainageLoadPct}%
          </span>
          <span className="text-xs text-[#64748B] font-medium">Load</span>
        </div>
      </div>
    </div>
  );
};
