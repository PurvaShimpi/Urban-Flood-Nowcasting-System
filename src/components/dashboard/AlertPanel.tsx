import React from 'react';
import { useFlood } from '../../context/FloodContext';

export const AlertPanel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { alerts, setSelectedRoad, roads, setActivePage } = useFlood();

  const activeAlerts = alerts.filter(a => !a.acknowledged);

  const getAlertStyle = (severity: string) => {
    switch (severity) {
      case 'Critical':
      case 'High':
        return {
          dot: 'bg-[#EF4444]',
          badge: 'text-[#EF4444] bg-red-50 border-red-200',
          title: 'High Flood Risk',
        };
      case 'Moderate':
        return {
          dot: 'bg-[#F59E0B]',
          badge: 'text-[#D97706] bg-amber-50 border-amber-200',
          title: 'Moderate Flood Risk',
        };
      default:
        return {
          dot: 'bg-[#10B981]',
          badge: 'text-[#16A34A] bg-[#D1FAE5] border-[#A7F3D0]',
          title: 'Notice',
        };
    }
  };

  return (
    <div
      className={`bg-white border border-[#BAE6FD] rounded-md p-3.5 flex flex-col justify-between shadow-xs ${className}`}
    >
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-sky-100">
          <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Active Alerts
          </h2>
          <span className="text-[11px] font-mono tabular-nums text-[#075985] font-semibold">
            {activeAlerts.length} total
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64748B] flex flex-col items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block animate-pulse" />
              <span className="font-semibold text-[#16A34A]">No active flood alerts</span>
              <span className="text-[11px] text-[#64748B]">All monitored road corridors safe</span>
            </div>
          ) : (
            activeAlerts.slice(0, 3).map(alert => {
              const style = getAlertStyle(alert.severity);
              return (
                <div
                  key={alert.id}
                  onClick={() => {
                    const matchedRoad = roads.find(r =>
                      alert.location.toLowerCase().includes(r.name.toLowerCase().replace(' road', ''))
                    );
                    if (matchedRoad) {
                      setSelectedRoad(matchedRoad);
                    }
                  }}
                  className="p-2.5 rounded border border-[#BAE6FD]/70 bg-[#F0FDFA]/50 hover:bg-[#F0FDFA] hover:border-[#38BDF8] cursor-pointer transition-all duration-150 group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot} animate-pulse`} />
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors">
                      {style.title}
                    </span>
                  </div>

                  <div className="mt-1 pl-3.5">
                    <p className="text-xs font-semibold text-[#075985]">{alert.location}</p>
                    {alert.predictedDepthCm && (
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Predicted depth:{' '}
                        <span className="font-bold font-mono text-[#0F172A]">
                          {alert.predictedDepthCm} cm
                        </span>
                      </p>
                    )}
                    {alert.rainfallMmHr && (
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Rainfall:{' '}
                        <span className="font-bold font-mono text-[#0F172A]">
                          {alert.rainfallMmHr} mm/hr
                        </span>
                      </p>
                    )}
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Expected:{' '}
                      <span className="font-semibold text-[#0F172A]">{alert.expectedIn}</span>
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-sky-100 text-center">
        <button
          onClick={() => setActivePage('alerts')}
          className="text-xs font-semibold text-[#0284C7] hover:text-[#075985] transition-colors"
        >
          View all alert history →
        </button>
      </div>
    </div>
  );
};
