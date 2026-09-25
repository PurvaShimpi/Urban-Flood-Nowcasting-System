import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Crosshair,
  Layers,
  Droplets,
  CloudRain,
  Activity,
} from 'lucide-react';
import { useFlood } from '../../context/FloodContext';
import { PUNE_RIVERS } from '../../data/puneFloodData';
import { RoadSegment, DrainagePoint } from '../../types/flood';
import { MapLegend } from './MapLegend';
import { RoadDetailsDrawer } from './RoadDetailsDrawer';
import { DrainageDetailsModal } from './DrainageDetailsModal';

export const FloodMap: React.FC<{
  className?: string;
  isFullHeight?: boolean;
}> = ({ className = '', isFullHeight = false }) => {
  const {
    roads,
    floodZones,
    drainagePoints,
    selectedRoad,
    setSelectedRoad,
    setSelectedDrainage,
    layers,
    toggleLayer,
    currentTimeStep,
    isSimulating,
  } = useFlood();

  // Viewport transform: zoom & pan
  const [viewBox, setViewBox] = useState({ x: 0, y: 180, width: 960, height: 640 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredRoad, setHoveredRoad] = useState<RoadSegment | null>(null);
  const [hoveredDrainage, setHoveredDrainage] = useState<DrainagePoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  // Landmarks for geographic orientation
  const landmarks = [
    { name: 'Hinjawadi IT Park', x: 80, y: 260 },
    { name: 'Wakad', x: 150, y: 290 },
    { name: 'Baner', x: 270, y: 340 },
    { name: 'Aundh', x: 390, y: 370 },
    { name: 'Savitribai Phule Pune Univ', x: 370, y: 440 },
    { name: 'Khadki Cantt', x: 520, y: 320 },
    { name: 'Shivajinagar', x: 500, y: 490 },
    { name: 'Deccan Gymkhana', x: 470, y: 560 },
    { name: 'Kothrud', x: 350, y: 600 },
    { name: 'Sinhagad Rd / Vadgaon', x: 380, y: 720 },
    { name: 'Sangam Bridge', x: 580, y: 460 },
    { name: 'Yerwada / Bund Garden', x: 670, y: 430 },
    { name: 'Viman Nagar', x: 840, y: 380 },
  ];

  // Zoom controls
  const handleZoom = useCallback((factor: number) => {
    setViewBox(prev => {
      const newWidth = Math.max(300, Math.min(1200, prev.width * factor));
      const newHeight = Math.max(200, Math.min(800, prev.height * factor));
      const dx = (prev.width - newWidth) / 2;
      const dy = (prev.height - newHeight) / 2;
      return {
        x: prev.x + dx,
        y: prev.y + dy,
        width: newWidth,
        height: newHeight,
      };
    });
  }, []);

  const handleReset = useCallback(() => {
    setViewBox({ x: 0, y: 180, width: 960, height: 640 });
  }, []);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = ((e.clientX - panStart.x) / (svgRef.current?.clientWidth || 1)) * viewBox.width;
    const dy = ((e.clientY - panStart.y) / (svgRef.current?.clientHeight || 1)) * viewBox.height;

    setViewBox(prev => ({
      ...prev,
      x: prev.x - dx,
      y: prev.y - dy,
    }));
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Search road/zone focus
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const term = searchQuery.toLowerCase();
    const foundRoad = roads.find(
      r => r.name.toLowerCase().includes(term) || r.zone.toLowerCase().includes(term)
    );

    if (foundRoad) {
      setSelectedRoad(foundRoad);
      const [midX, midY] = foundRoad.coordinates[Math.floor(foundRoad.coordinates.length / 2)];
      setViewBox({
        x: midX - 250,
        y: midY - 170,
        width: 500,
        height: 340,
      });
      return;
    }

    const foundLandmark = landmarks.find(l => l.name.toLowerCase().includes(term));
    if (foundLandmark) {
      setViewBox({
        x: foundLandmark.x - 250,
        y: foundLandmark.y - 170,
        width: 500,
        height: 340,
      });
    }
  };

  // Road color by risk level
  const getRoadColor = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return '#EF4444'; // Red
      case 'High':
        return '#F97316'; // Orange
      case 'Moderate':
        return '#F59E0B'; // Amber
      case 'Low':
        return '#84CC16'; // Lime
      default:
        return '#16A34A'; // Green Safe
    }
  };

  const getFloodZoneFill = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return 'rgba(239, 68, 68, 0.42)';
      case 'High':
        return 'rgba(249, 115, 22, 0.35)';
      case 'Moderate':
        return 'rgba(245, 158, 11, 0.28)';
      default:
        return 'rgba(16, 185, 129, 0.22)';
    }
  };

  // Convert array of [x,y] to SVG path string
  const toPathString = (pts: [number, number][]) => {
    return pts.reduce((acc, [x, y], idx) => {
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  // Convert polygon coordinates to SVG points
  const toPolygonPoints = (pts: [number, number][]) => {
    return pts.map(([x, y]) => `${x},${y}`).join(' ');
  };

  return (
    <div
      className={`relative bg-[#F8FAFC] border border-[#BAE6FD] rounded-md overflow-hidden flex flex-col select-none ${
        isFullHeight ? 'h-full min-h-[500px]' : 'h-[440px] sm:h-[480px] lg:h-[510px]'
      } ${className}`}
    >
      {/* Top Map Bar: Title & Search & Controls */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-xs border border-[#BAE6FD] rounded-md px-3 py-1.5 shadow-xs flex items-center gap-2">
            <h2 className="text-xs font-bold text-[#0F172A] tracking-tight">Live Flood Map</h2>
            <span className="text-[#38BDF8]">·</span>
            <span className="text-[11px] font-mono text-[#075985] font-semibold tabular-nums">
              Forecast: {currentTimeStep.timeLabel}
            </span>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search road (e.g. Baner, Wakad)..."
                className="w-48 lg:w-60 bg-white/95 backdrop-blur-xs border border-[#BAE6FD] rounded-md pl-7 pr-2.5 py-1 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#0284C7] shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-[#0284C7] absolute left-2 top-2" />
            </div>
          </form>
        </div>

        {/* Layer Toggle & Map Actions */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Layer Menu */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="bg-white border border-[#BAE6FD] hover:bg-[#F0FDFA] text-[#075985] p-1.5 rounded-md shadow-xs transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Map Layers"
            >
              <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="hidden md:inline">Layers</span>
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#BAE6FD] rounded-md shadow-xl p-2 z-40 text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="font-bold text-[#64748B] text-[10px] uppercase pb-1 border-b border-sky-100">
                  Visible GIS Layers
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-[#0F172A] hover:text-[#0284C7]">
                  <input
                    type="checkbox"
                    checked={layers.roads}
                    onChange={() => toggleLayer('roads')}
                    className="accent-[#0284C7] rounded"
                  />
                  <span>Road Network</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#0F172A] hover:text-[#0284C7]">
                  <input
                    type="checkbox"
                    checked={layers.floodZones}
                    onChange={() => toggleLayer('floodZones')}
                    className="accent-[#0284C7] rounded"
                  />
                  <span>Inundation Basins</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#0F172A] hover:text-[#0284C7]">
                  <input
                    type="checkbox"
                    checked={layers.rainfallRadar}
                    onChange={() => toggleLayer('rainfallRadar')}
                    className="accent-[#0284C7] rounded"
                  />
                  <span>Rainfall Radar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#0F172A] hover:text-[#0284C7]">
                  <input
                    type="checkbox"
                    checked={layers.drainagePoints}
                    onChange={() => toggleLayer('drainagePoints')}
                    className="accent-[#0284C7] rounded"
                  />
                  <span>Drainage Assets</span>
                </label>
              </div>
            )}
          </div>

          {/* Zoom Buttons */}
          <div className="bg-white border border-[#BAE6FD] rounded-md shadow-xs flex items-center divide-x divide-sky-100 overflow-hidden">
            <button
              onClick={() => handleZoom(0.8)}
              className="p-1.5 text-[#075985] hover:text-[#0284C7] hover:bg-[#F0FDFA] transition-colors"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(1.25)}
              className="p-1.5 text-[#075985] hover:text-[#0284C7] hover:bg-[#F0FDFA] transition-colors"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-[#075985] hover:text-[#0284C7] hover:bg-[#F0FDFA] transition-colors"
              title="Reset Extents"
              aria-label="Reset map"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas GIS Viewport */}
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className="w-full h-full cursor-grab active:cursor-grabbing bg-[#F8FAFC]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          {/* Subtle grid pattern for GIS coordinate feel */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.7" />
          </pattern>

          {/* Radar mesh gradient overlay */}
          <radialGradient id="radarPrecip1" cx="30%" cy="40%" r="45%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="radarPrecip2" cx="50%" cy="70%" r="35%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background Coordinate Grid */}
        <rect x="-1000" y="-1000" width="3000" height="3000" fill="url(#grid)" />

        {/* Rainfall Radar Layer */}
        {layers.rainfallRadar && (
          <g className="pointer-events-none">
            <circle cx="280" cy="380" r="280" fill="url(#radarPrecip1)" />
            <circle cx="420" cy="650" r="220" fill="url(#radarPrecip2)" />
            {/* Animated radar scanning line */}
            <line
              x1="280"
              y1="380"
              x2="520"
              y2="260"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeOpacity="0.7"
              className="animate-radar-sweep origin-[280px_380px]"
            />
            {isSimulating && (
              <circle
                cx="300"
                cy="370"
                r="310"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                opacity="0.5"
                className="animate-pulse"
              />
            )}
            {/* Animated Rain Droplet Streaks */}
            <g className="pointer-events-none opacity-50">
              <line x1="220" y1="280" x2="228" y2="305" stroke="#0EA5E9" strokeWidth="1.5" className="animate-rain-1" />
              <line x1="340" y1="360" x2="348" y2="385" stroke="#0EA5E9" strokeWidth="1.5" className="animate-rain-2" />
              <line x1="160" y1="410" x2="168" y2="435" stroke="#0EA5E9" strokeWidth="1.5" className="animate-rain-3" />
              <line x1="450" y1="310" x2="458" y2="335" stroke="#0EA5E9" strokeWidth="1.5" className="animate-rain-1" />
              <line x1="390" y1="520" x2="398" y2="545" stroke="#0EA5E9" strokeWidth="1.5" className="animate-rain-2" />
              <line x1="580" y1="430" x2="588" y2="455" stroke="#0EA5E9" strokeWidth="1.5" className="animate-rain-3" />
              <line x1="270" y1="620" x2="278" y2="645" stroke="#0EA5E9" strokeWidth="1.5" className="animate-rain-1" />
            </g>
          </g>
        )}

        {/* Rivers with animated water current flow */}
        <g id="rivers">
          {PUNE_RIVERS.map(river => (
            <g key={river.id}>
              {/* River bank */}
              <path
                d={toPathString(river.path)}
                fill="none"
                stroke="#E0F7FA"
                strokeWidth="22"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Outer water body */}
              <path
                d={toPathString(river.path)}
                fill="none"
                stroke="#BAE6FD"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* River water core */}
              <path
                d={toPathString(river.path)}
                fill="none"
                stroke="#0284C7"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
              {/* Animated Current Streamlines */}
              <path
                d={toPathString(river.path)}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-river-flow"
                opacity="0.7"
              />
              <text
                x={river.path[1][0] + 15}
                y={river.path[1][1] - 10}
                fill="#075985"
                fontSize="11"
                fontWeight="600"
                className="select-none pointer-events-none"
              >
                {river.name}
              </text>
            </g>
          ))}
        </g>

        {/* Inundation Basins with gentle water pulse */}
        {layers.floodZones && (
          <g id="flood-zones">
            {floodZones.map(zone => (
              <g key={zone.id} className="cursor-pointer">
                {/* Water ripple animated background */}
                <polygon
                  points={toPolygonPoints(zone.polygon)}
                  fill={getFloodZoneFill(zone.riskLevel)}
                  stroke={getRoadColor(zone.riskLevel)}
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  className={zone.riskLevel === 'Critical' || zone.riskLevel === 'High' ? 'animate-water-pulse' : ''}
                />
                <circle
                  cx={zone.center[0]}
                  cy={zone.center[1]}
                  r="3.5"
                  fill={getRoadColor(zone.riskLevel)}
                />
                <text
                  x={zone.center[0] + 6}
                  y={zone.center[1] + 4}
                  fill="#0F172A"
                  fontSize="10"
                  fontWeight="700"
                  className="select-none pointer-events-none"
                >
                  {zone.currentDepthCm} cm
                </text>
              </g>
            ))}
          </g>
        )}

        {/* Road Network (when enabled) */}
        {layers.roads && (
          <g id="roads">
            {roads.map(road => {
              const isSelected = selectedRoad?.id === road.id;
              const isHovered = hoveredRoad?.id === road.id;
              const strokeColor = getRoadColor(road.riskLevel);
              const pathStr = toPathString(road.coordinates);

              const midIdx = Math.floor(road.coordinates.length / 2);
              const labelPos = road.coordinates[midIdx];

              return (
                <g
                  key={road.id}
                  className="cursor-pointer group"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedRoad(road);
                  }}
                  onMouseEnter={() => setHoveredRoad(road)}
                  onMouseLeave={() => setHoveredRoad(null)}
                >
                  {/* Road Casing / Click buffer */}
                  <path
                    d={pathStr}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '14' : '10'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />

                  {/* Road Status Stroke */}
                  <path
                    d={pathStr}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isSelected ? '7' : isHovered ? '6' : '4.5'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-150"
                  />

                  {/* Selection Pulse Ring */}
                  {isSelected && (
                    <circle
                      cx={labelPos[0]}
                      cy={labelPos[1]}
                      r="9"
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Road Name Label */}
                  <text
                    x={labelPos[0]}
                    y={labelPos[1] - 8}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="11"
                    fontWeight="600"
                    stroke="#ffffff"
                    strokeWidth="3"
                    paintOrder="stroke"
                    className="select-none pointer-events-none"
                  >
                    {road.name}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Drainage Points (when enabled) */}
        {layers.drainagePoints && (
          <g id="drainage-points">
            {drainagePoints.map(dp => {
              const isOverloaded = dp.status === 'Overloaded';
              const isWarning = dp.status === 'Warning';
              const pinColor = isOverloaded ? '#dc2626' : isWarning ? '#f59e0b' : '#0284c7';

              return (
                <g
                  key={dp.id}
                  className="cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedDrainage(dp);
                  }}
                  onMouseEnter={() => setHoveredDrainage(dp)}
                  onMouseLeave={() => setHoveredDrainage(null)}
                >
                  <rect
                    x={dp.coordinates[0] - 7}
                    y={dp.coordinates[1] - 7}
                    width="14"
                    height="14"
                    rx="3"
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="hover:scale-125 transition-transform"
                  />
                  <text
                    x={dp.coordinates[0]}
                    y={dp.coordinates[1] + 3.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="8"
                    fontWeight="700"
                    className="select-none pointer-events-none"
                  >
                    D
                  </text>
                  <text
                    x={dp.coordinates[0] + 10}
                    y={dp.coordinates[1] + 4}
                    fill="#334155"
                    fontSize="9.5"
                    fontWeight="600"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    paintOrder="stroke"
                    className="select-none pointer-events-none"
                  >
                    {dp.code} ({dp.currentLoadPct}%)
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* City Locality Landmarks */}
        <g id="landmarks" className="pointer-events-none select-none">
          {landmarks.map(lm => (
            <g key={lm.name}>
              <circle cx={lm.x} cy={lm.y} r="2" fill="#64748b" />
              <text
                x={lm.x}
                y={lm.y + 11}
                textAnchor="middle"
                fill="#475569"
                fontSize="9"
                fontWeight="500"
                opacity="0.85"
              >
                {lm.name}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Floating Legend (bottom-left) */}
      <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-auto">
        <MapLegend />
      </div>

      {/* Road Details Drawer (when clicked) */}
      <RoadDetailsDrawer />

      {/* Drainage Details Modal (when clicked) */}
      <DrainageDetailsModal />
    </div>
  );
};
