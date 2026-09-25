import React from 'react';
import { useFlood } from '../../context/FloodContext';
import { FORECAST_STEPS } from '../../data/puneFloodData';

export const ForecastTimeline: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { forecastIndex, setForecastIndex, currentTimeStep } = useFlood();

  return (
    <div
      className={`bg-white border border-[#BAE6FD] rounded-md p-3 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Forecast Timeline
          </span>
          <span className="text-[11px] text-[#64748B] font-medium">
            Horizon: <span className="font-bold text-[#075985]">{currentTimeStep.timeLabel}</span>
          </span>
        </div>
        <div className="text-[11px] text-[#64748B] font-mono tabular-nums">
          Projected Max Depth: <span className="font-bold text-[#0284C7]">{currentTimeStep.maxDepthCm} cm</span>
        </div>
      </div>

      {/* Time Step Buttons */}
      <div className="flex items-center gap-1.5 mb-2">
        {FORECAST_STEPS.map((step, idx) => {
          const isSelected = forecastIndex === idx;
          return (
            <button
              key={step.timeLabel}
              onClick={() => setForecastIndex(idx)}
              className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded transition-all duration-150 text-center ${
                isSelected
                  ? 'bg-jaldrishti-gradient text-white shadow-xs scale-[1.02]'
                  : 'bg-[#F0FDFA] hover:bg-[#E0F7FA] text-[#075985] border border-[#BAE6FD]/80'
              }`}
            >
              {step.timeLabel}
            </button>
          );
        })}
      </div>

      {/* Slider */}
      <div className="relative flex items-center px-1">
        <input
          type="range"
          min="0"
          max={FORECAST_STEPS.length - 1}
          step="1"
          value={forecastIndex}
          onChange={e => setForecastIndex(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-[#E0F7FA] rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
          aria-label="Forecast time slider"
        />
      </div>
    </div>
  );
};
