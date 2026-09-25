import React, { useState } from 'react';
import { FileText, Download, Eye, X, Printer } from 'lucide-react';
import { useFlood } from '../../context/FloodContext';

export const ReportsView: React.FC = () => {
  const { currentMetrics } = useFlood();
  const [activeReportModal, setActiveReportModal] = useState<string | null>(null);

  const reports = [
    {
      id: 'flood-event',
      title: 'Flood Event Report',
      period: 'Monsoon 2026 — Heavy Precipitation Incident #04',
      generated: 'Today, 18:00 IST',
      description:
        'Detailed road waterlogging log, peak water depth recordings, affected wards (Baner, Wakad, Sangvi, Sinhagad Road), and response logs.',
    },
    {
      id: 'rainfall',
      title: 'Rainfall Report',
      period: 'Pune Metropolitan 24-Hour Precipitation Summary',
      generated: 'Today, 17:30 IST',
      description:
        'IMD Shivajinagar, Pashan, Lavale, and PCMC automated weather station totals, peak hourly intensity readings, and cumulative rainfall isohyets.',
    },
    {
      id: 'drainage',
      title: 'Drainage Report',
      period: 'Stormwater Network & Pumping Station Asset Telemetry',
      generated: 'Today, 16:45 IST',
      description:
        'Sluice gate operations, nullah outfall discharge rates, pump station operational capacity, and predicted hydraulic bottleneck locations.',
    },
  ];

  const handleDownload = (reportTitle: string) => {
    // Clean mock PDF trigger / simulated blob print
    const content = `JalDrishti - Pune Municipal Corporation\nOfficial Report: ${reportTitle}\nDate: 2026-09-24\nRainfall: ${currentMetrics.rainfallMmHr} mm/hr\nCurrent Risk: ${currentMetrics.overallRisk}\nStatus: Verified Operational Audit.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportTitle.toLowerCase().replace(/\s+/g, '_')}_20260924.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
          Municipal Reports
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Official incident documentation and hydrological telemetry records
        </p>
      </div>

      <div className="space-y-4">
        {reports.map(rep => (
          <div
            key={rep.id}
            className="bg-white border border-[#BAE6FD] rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#38BDF8] transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0284C7] shrink-0" />
                <h3 className="text-sm font-bold text-[#0F172A]">{rep.title}</h3>
              </div>
              <p className="text-xs text-[#64748B] max-w-xl leading-relaxed">
                {rep.description}
              </p>
              <p className="text-[11px] text-[#075985] font-mono font-medium">
                {rep.period} · Generated: {rep.generated}
              </p>
            </div>

            {/* Buttons: View & Download PDF strictly matching Section 19 */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveReportModal(rep.id)}
                className="px-3 py-1.5 text-xs font-semibold text-[#075985] bg-[#F0FDFA] hover:bg-[#E0F7FA] border border-[#BAE6FD] rounded transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              <button
                onClick={() => handleDownload(rep.title)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-jaldrishti-gradient hover:opacity-95 rounded transition-all duration-150 flex items-center gap-1.5 shadow-xs hover:scale-[1.02]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-md shadow-xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] text-sky-700 font-bold uppercase tracking-wider">
                  Government of Maharashtra · Pune Municipal Corporation
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {reports.find(r => r.id === activeReportModal)?.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveReportModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 block">Incident Date</span>
                  <span className="font-semibold text-slate-900">2026-09-24</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Location</span>
                  <span className="font-semibold text-slate-900">Pune Urban Catchment</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Max Rain Intensity</span>
                  <span className="font-semibold text-slate-900">{currentMetrics.rainfallMmHr} mm/hr</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Drainage Load</span>
                  <span className="font-semibold text-slate-900">{currentMetrics.drainageLoadPct}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">1. Meteorological Summary</h4>
                <p>
                  A localized convective cloud system triggered sustained rainfall across the western
                  suburbs of Pune, with peak precipitation recorded in Lavale and Pashan catchments.
                  Runoff entered the Mula and Mutha river channels at a rate of approximately 240 m³/s.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">2. Critical Corridors Affected</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Baner Road (Sadanand Crossway):</strong> Peak water level reached 42 cm;
                    traffic slowed; sluice gate D-104 partially opened to relieve local ponding.
                  </li>
                  <li>
                    <strong>Old Sangvi Causeway:</strong> Water crossed 28 cm threshold; preventive
                    lane barricading enforced by PCMC traffic police.
                  </li>
                  <li>
                    <strong>Wakad Underpass:</strong> Localized gutter overflow observed; pump operational.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">3. Protective Actions Executed</h4>
                <p>
                  Automated flood alerts dispatched to registered field wardens. Safe routes algorithm
                  re-routed traffic via elevated ridge corridors (Pashan-Sus Link Road).
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Authorized by PMC Disaster Response Operations Cell
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setActiveReportModal(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
