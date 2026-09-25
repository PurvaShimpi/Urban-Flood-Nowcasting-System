import React, { useState } from 'react';
import { MapPin, Check, AlertTriangle, Filter } from 'lucide-react';
import { useFlood } from '../../context/FloodContext';
import { FloodAlert } from '../../types/flood';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, setSelectedRoad, roads, setActivePage } = useFlood();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return {
          border: 'border-l-4 border-l-red-600',
          badge: 'bg-red-50 text-red-700 border border-red-200',
          dot: 'bg-red-600',
        };
      case 'High':
        return {
          border: 'border-l-4 border-l-orange-500',
          badge: 'bg-orange-50 text-orange-700 border border-orange-200',
          dot: 'bg-orange-500',
        };
      case 'Moderate':
        return {
          border: 'border-l-4 border-l-amber-500',
          badge: 'bg-amber-50 text-amber-700 border border-amber-200',
          dot: 'bg-amber-500',
        };
      default:
        return {
          border: 'border-l-4 border-l-emerald-500',
          badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          dot: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Alerts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Emergency flood warnings and rainfall advisories issued by PMC Disaster Cell
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs">
          {['all', 'critical', 'high', 'moderate'].map(f => (
            <button
              key={f}
              onClick={() => setFilterSeverity(f)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                filterSeverity === f
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-md p-8 text-center text-xs text-slate-500">
            No alerts matching the selected filter.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const style = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                className={`bg-white border border-slate-200 rounded-md p-4 shadow-xs ${style.border}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                      <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${style.badge}`}>
                        {alert.severity}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{alert.location}</span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      {alert.predictedDepthCm && (
                        <p>
                          Predicted depth:{' '}
                          <span className="font-semibold font-mono text-slate-900">
                            {alert.predictedDepthCm} cm
                          </span>
                        </p>
                      )}
                      {alert.rainfallMmHr && (
                        <p>
                          Rainfall:{' '}
                          <span className="font-semibold font-mono text-slate-900">
                            {alert.rainfallMmHr} mm/hr
                          </span>
                        </p>
                      )}
                      <p>
                        Expected:{' '}
                        <span className="font-medium text-slate-800">{alert.expectedIn}</span>
                      </p>
                    </div>

                    {alert.recommendedAction && (
                      <p className="mt-2.5 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="font-semibold text-slate-700">Advisory: </span>
                        {alert.recommendedAction}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-medium text-slate-500 block">
                      {alert.timestamp}
                    </span>

                    <div className="mt-4 flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      <button
                        onClick={() => {
                          const matchedRoad = roads.find(r =>
                            alert.location.toLowerCase().includes(r.name.toLowerCase().replace(' road', ''))
                          );
                          if (matchedRoad) {
                            setSelectedRoad(matchedRoad);
                            setActivePage('dashboard');
                          }
                        }}
                        className="text-xs font-medium text-sky-700 hover:text-sky-800 underline"
                      >
                        Inspect on Map
                      </button>

                      {!alert.acknowledged ? (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Acknowledge</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
