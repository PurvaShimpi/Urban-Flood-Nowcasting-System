import React, { useState } from 'react';
import { X, Camera, MapPin, Send, AlertTriangle } from 'lucide-react';
import { useFlood } from '../../context/FloodContext';

export const CitizenReportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { submitCitizenReport } = useFlood();

  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [depthCategory, setDepthCategory] = useState<'ankle' | 'knee' | 'waist'>('knee');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');

  if (!isOpen) return null;

  const depthMap = {
    ankle: 12,
    knee: 28,
    waist: 45,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    submitCitizenReport({
      location: location.trim(),
      landmark: landmark.trim() || 'Nearby road intersection',
      waterDepthCm: depthMap[depthCategory],
      description: description.trim() || `${depthCategory.toUpperCase()} deep waterlogging reported by resident.`,
      reportedBy: reporterName.trim() || 'Pune Resident',
      coordinates: [300 + Math.random() * 200, 350 + Math.random() * 200],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-2xs">
      <div className="w-full max-w-md bg-white border border-[#BAE6FD] rounded-lg shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-sky-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <span>Report Local Flooding / Clogged Drain</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Instantly notifies PMC Disaster Cell &amp; nearby commuters
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#0F172A] rounded transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-3.5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[#0F172A] font-semibold mb-1">
              Location / Road Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Baner Road near Orchid School"
                className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:bg-white"
              />
              <MapPin className="w-3.5 h-3.5 text-[#0284C7] absolute right-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-[#0F172A] font-semibold mb-1">
              Nearest Landmark / Junction
            </label>
            <input
              type="text"
              value={landmark}
              onChange={e => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Petrol Pump / High Street corner"
              className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[#0F172A] font-semibold mb-1.5">
              Estimated Water Depth
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDepthCategory('ankle')}
                className={`py-2 px-2 rounded border text-center transition-all ${
                  depthCategory === 'ankle'
                    ? 'border-[#0284C7] bg-[#E0F7FA] text-[#075985] font-bold shadow-2xs'
                    : 'border-[#BAE6FD]/80 bg-white text-[#64748B] hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">Ankle Deep</div>
                <div className="text-[10px] text-[#64748B]">~10-15 cm</div>
              </button>

              <button
                type="button"
                onClick={() => setDepthCategory('knee')}
                className={`py-2 px-2 rounded border text-center transition-all ${
                  depthCategory === 'knee'
                    ? 'border-[#F59E0B] bg-amber-50 text-[#D97706] font-bold shadow-2xs'
                    : 'border-[#BAE6FD]/80 bg-white text-[#64748B] hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">Knee Deep</div>
                <div className="text-[10px] text-[#64748B]">~25-30 cm</div>
              </button>

              <button
                type="button"
                onClick={() => setDepthCategory('waist')}
                className={`py-2 px-2 rounded border text-center transition-all ${
                  depthCategory === 'waist'
                    ? 'border-[#EF4444] bg-red-50 text-[#EF4444] font-bold shadow-2xs'
                    : 'border-[#BAE6FD]/80 bg-white text-[#64748B] hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">Waist Deep</div>
                <div className="text-[10px] text-[#64748B]">&gt; 40 cm (High)</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[#0F172A] font-semibold mb-1">
              Description / Obstruction
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Storm drain blocked with tree branches; cars stalling in left lane."
              className="w-full bg-[#F0FDFA]/40 border border-[#BAE6FD] rounded px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:bg-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 text-xs font-semibold text-[#64748B] bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-3 text-xs font-semibold text-white bg-jaldrishti-gradient hover:opacity-95 rounded transition-all duration-150 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to PMC</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
