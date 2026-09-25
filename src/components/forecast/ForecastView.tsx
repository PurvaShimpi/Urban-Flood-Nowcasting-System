import React from 'react';
import { useFlood } from '../../context/FloodContext';
import { FORECAST_STEPS, AREAS_AT_RISK } from '../../data/puneFloodData';
import { FloodRiskLevel } from '../../types/flood';

export const ForecastView: React.FC = () => {
  const { forecastIndex, setForecastIndex, isSimulating } = useFlood();

  const getRiskBadge = (risk: FloodRiskLevel) => {
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

  const chartMaxDepth = 50;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header & Subheading */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Flood Forecast</h2>
        <p className="text-xs text-[#64748B] mt-0.5">Next 3 hours hydrological model projection</p>
      </div>

      {/* Forecast Table matching Section 13 */}
      <div className="bg-white border border-[#BAE6FD] rounded-md overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F0FDFA] border-b border-[#BAE6FD] text-[#075985] font-bold">
              <th className="py-2.5 px-4">Time</th>
              <th className="py-2.5 px-4">Risk</th>
              <th className="py-2.5 px-4 text-right">Max Depth</th>
              <th className="py-2.5 px-4 text-right hidden sm:table-cell">Drainage Load</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100">
            {FORECAST_STEPS.map((step, idx) => {
              const isSelected = forecastIndex === idx;
              return (
                <tr
                  key={step.timeLabel}
                  onClick={() => setForecastIndex(idx)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#F0FDFA] font-semibold' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <td className="py-3 px-4 text-[#0F172A] flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-[#0284C7]' : 'bg-slate-300'
                      }`}
                    />
                    <span className="font-semibold">{step.timeLabel}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getRiskBadge(
                        step.overallRisk
                      )}`}
                    >
                      {step.overallRisk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#075985] tabular-nums">
                    {step.maxDepthCm} cm
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#64748B] tabular-nums hidden sm:table-cell">
                    {step.drainageLoadPct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Simple Flood-Depth Progression Chart */}
      <div className="bg-white border border-[#BAE6FD] rounded-md p-4 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Flood Depth Trend (Next 3 Hours)
          </h3>
          <span className="text-[11px] text-[#075985] font-mono font-medium">Unit: Centimeters</span>
        </div>

        {/* Clean SVG Bar & Area Chart */}
        <div className="h-44 w-full">
          <svg viewBox="0 0 600 160" className="w-full h-full">
            {/* Guide lines */}
            <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="60" x2="580" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="100" x2="580" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="140" x2="580" y2="140" stroke="#BAE6FD" strokeWidth="1" />

            {/* Y Axis labels */}
            <text x="32" y="24" fontSize="9" fill="#94a3b8" textAnchor="end" className="font-mono">
              45cm
            </text>
            <text x="32" y="64" fontSize="9" fill="#94a3b8" textAnchor="end" className="font-mono">
              30cm
            </text>
            <text x="32" y="104" fontSize="9" fill="#94a3b8" textAnchor="end" className="font-mono">
              15cm
            </text>
            <text x="32" y="144" fontSize="9" fill="#94a3b8" textAnchor="end" className="font-mono">
              0cm
            </text>

            {/* Bars & Line connectors */}
            {FORECAST_STEPS.map((step, idx) => {
              const x = 70 + idx * 115;
              const barHeight = (step.maxDepthCm / chartMaxDepth) * 120;
              const y = 140 - barHeight;
              const isSelected = forecastIndex === idx;

              return (
                <g key={step.timeLabel} onClick={() => setForecastIndex(idx)} className="cursor-pointer group">
                  <rect
                    x={x - 18}
                    y={y}
                    width="36"
                    height={barHeight}
                    rx="3"
                    fill={isSelected ? '#0284C7' : '#BAE6FD'}
                    className="transition-all duration-200 group-hover:fill-[#38BDF8]"
                  />
                  {/* Value tag */}
                  <text
                    x={x}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill={isSelected ? '#075985' : '#64748B'}
                    className="font-mono"
                  >
                    {step.maxDepthCm}cm
                  </text>
                  {/* X Axis Time label */}
                  <text
                    x={x}
                    y="155"
                    textAnchor="middle"
                    fontSize="10"
                    fill={isSelected ? '#0F172A' : '#64748B'}
                    fontWeight={isSelected ? '700' : '500'}
                  >
                    {step.timeLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Areas at Risk strictly matching Section 13 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#0F172A]">Areas at Risk</h3>
          <span className="text-xs text-[#075985] font-medium">Critical drainage catchments</span>
        </div>

        <div className="bg-white border border-[#BAE6FD] rounded-md divide-y divide-sky-100 shadow-xs">
          {AREAS_AT_RISK.map(area => (
            <div key={area.name} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-[#F0FDFA]/40 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0F172A]">{area.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getRiskBadge(
                      area.risk
                    )}`}
                  >
                    {area.risk}
                  </span>
                </div>
                <p className="text-[#64748B] text-[11px] mt-0.5">{area.locality}</p>
              </div>

              <div className="flex items-center gap-4 text-[#64748B] text-right shrink-0">
                <div>
                  <span className="text-[10px] text-[#64748B] block">Peak Inundation</span>
                  <span className="font-mono font-bold text-[#075985] tabular-nums">
                    {area.maxDepthCm} cm ({area.peakAt})
                  </span>
                </div>
                <div className="hidden md:block">
                  <span className="text-[10px] text-[#64748B] block">Clearance</span>
                  <span className="text-[#0F172A] font-medium">{area.clearanceEstimate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
