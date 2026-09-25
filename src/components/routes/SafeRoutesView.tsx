import React, { useState } from 'react';
import { Search, Navigation, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useFlood } from '../../context/FloodContext';
import { PUNE_RIVERS } from '../../data/puneFloodData';
import { RouteOption } from '../../types/flood';

export const SafeRoutesView: React.FC = () => {
  const {
    routeOrigin,
    setRouteOrigin,
    routeDestination,
    setRouteDestination,
    routesList,
    selectedRouteId,
    setSelectedRouteId,
    isCalculatingRoute,
    calculateRoutes,
    floodZones,
  } = useFlood();

  const [hasSearched, setHasSearched] = useState(true);

  const selectedRoute = routesList.find(r => r.id === selectedRouteId) || routesList[1];

  const handleFindRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    calculateRoutes();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
      case 'Critical':
        return {
          stroke: '#EF4444',
          badge: 'text-[#EF4444] bg-red-50 border-red-200',
          text: 'High flood risk',
        };
      case 'Moderate':
        return {
          stroke: '#F59E0B',
          badge: 'text-[#D97706] bg-amber-50 border-amber-200',
          text: 'Moderate flood risk',
        };
      default:
        return {
          stroke: '#10B981',
          badge: 'text-[#16A34A] bg-[#D1FAE5] border-[#A7F3D0]',
          text: 'Low predicted flood risk',
        };
    }
  };

  const toPathString = (pts: [number, number][]) => {
    return pts.reduce((acc, [x, y], idx) => {
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Safe Routes Navigation
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Dynamic routing avoiding low-lying flood corridors and submerged underpasses
        </p>
      </div>

      {/* Input Form matching Section 15 */}
      <form
        onSubmit={handleFindRoute}
        className="bg-white border border-[#BAE6FD] rounded-md p-4 space-y-3 shadow-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                value={routeOrigin}
                onChange={e => setRouteOrigin(e.target.value)}
                placeholder="Current Location"
                className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                value={routeDestination}
                onChange={e => setRouteDestination(e.target.value)}
                placeholder="Search destination (e.g. Hinjawadi, Baner, Wakad)"
                className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:bg-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isCalculatingRoute}
          className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-jaldrishti-gradient hover:opacity-95 rounded transition-all duration-150 flex items-center justify-center gap-1.5 shadow-xs hover:scale-[1.02]"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{isCalculatingRoute ? 'Calculating Hydrological Path...' : 'Find Route'}</span>
        </button>
      </form>

      {/* Map & Routes Section */}
      {hasSearched && (
        <div className="space-y-4">
          {/* Route Map Preview */}
          <div className="bg-slate-100 border border-slate-200 rounded-md overflow-hidden relative h-64 sm:h-72">
            <svg
              viewBox="0 200 600 400"
              className="w-full h-full bg-[#f1f5f9]"
            >
              {/* Subtle Grid */}
              <defs>
                <pattern id="routeGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="1000" height="1000" fill="url(#routeGrid)" />

              {/* Rivers */}
              {PUNE_RIVERS.map(r => (
                <path
                  key={r.id}
                  d={toPathString(r.path)}
                  fill="none"
                  stroke="#bae6fd"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
              ))}

              {/* Flood Zones */}
              {floodZones.map(z => (
                <polygon
                  key={z.id}
                  points={z.polygon.map(([x, y]) => `${x},${y}`).join(' ')}
                  fill="rgba(244, 63, 94, 0.22)"
                  stroke="#f43f5e"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Routes Paths */}
              {routesList.map(route => {
                const isSelected = selectedRoute.id === route.id;
                const style = getRiskColor(route.riskLevel);
                return (
                  <g
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className="cursor-pointer"
                  >
                    {/* Outline / glow */}
                    <path
                      d={toPathString(route.pathCoordinates)}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '12' : '6'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={toPathString(route.pathCoordinates)}
                      fill="none"
                      stroke={style.stroke}
                      strokeWidth={isSelected ? '6' : '3.5'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={isSelected ? 1 : 0.65}
                    />
                  </g>
                );
              })}

              {/* Start & End Points */}
              {selectedRoute && (
                <>
                  <circle
                    cx={selectedRoute.pathCoordinates[0][0]}
                    cy={selectedRoute.pathCoordinates[0][1]}
                    r="6"
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle
                    cx={
                      selectedRoute.pathCoordinates[
                        selectedRoute.pathCoordinates.length - 1
                      ][0]
                    }
                    cy={
                      selectedRoute.pathCoordinates[
                        selectedRoute.pathCoordinates.length - 1
                      ][1]
                    }
                    r="6"
                    fill="#16a34a"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </>
              )}
            </svg>

            {/* Quick Map Overlay Note */}
            <div className="absolute top-2.5 left-2.5 bg-white/95 border border-slate-200 px-2.5 py-1 rounded text-[11px] text-slate-700 shadow-xs">
              Selected: <span className="font-semibold">{selectedRoute.name}</span>
            </div>
          </div>

          {/* Available Routes strictly matching Section 15 */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
              Available Routes
            </h3>

            <div className="space-y-3">
              {routesList.map(route => {
                const isSelected = selectedRoute.id === route.id;
                const style = getRiskColor(route.riskLevel);

                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-4 bg-white border rounded-md transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 ring-1 ring-sky-500 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{route.name}</h4>
                          {route.isRecommended && (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              Recommended lower-risk route
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                          <span className="font-bold text-slate-900 font-mono tabular-nums">
                            {route.durationMin} min
                          </span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">{route.distanceKm} km</span>
                          <span>·</span>
                          <span className={`font-semibold ${route.riskLevel === 'High' ? 'text-red-700' : route.riskLevel === 'Moderate' ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {style.text}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Max Est. Depth</span>
                        <span className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                          {route.maxWaterDepthCm} cm
                        </span>
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs text-slate-600 border-t border-slate-100 pt-2 leading-relaxed">
                      {route.advisory}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
