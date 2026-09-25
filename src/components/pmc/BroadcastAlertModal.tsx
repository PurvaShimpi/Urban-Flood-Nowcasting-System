import React, { useState } from 'react';
import { X, Radio, Megaphone, AlertCircle, ShieldAlert } from 'lucide-react';
import { useFlood } from '../../context/FloodContext';

export const BroadcastAlertModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { broadcastEmergencyAlert } = useFlood();

  const [title, setTitle] = useState('PMC EMERGENCY RED ALERT: Flash Waterlogging & River Rise');
  const [sector, setSector] = useState('Sinhagad Road, Ekta Nagari & Pulachi Wadi');
  const [severity, setSeverity] = useState<'Critical' | 'High'>('Critical');
  const [instructions, setInstructions] = useState(
    'Khadakwasla Dam discharge exceeded 30,000 cusecs. Immediate evacuation of basement parking; commuters must divert via Paud Road.'
  );

  if (!isOpen) return null;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastEmergencyAlert(title, sector, instructions, severity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-red-300 rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-red-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[#EF4444]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Broadcast Municipal Flood Emergency Alert
              </h3>
              <p className="text-xs text-[#64748B] mt-0.2">
                Transmits real-time alert banner to all citizen dashboards &amp; ward sirens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#0F172A] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleBroadcast} className="py-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-[#0F172A] font-bold mb-1">Alert Headline</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-red-50/40 border border-red-200 rounded px-3 py-2 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#EF4444]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#0F172A] font-bold mb-1">Target Sector / Ward</label>
              <input
                type="text"
                required
                value={sector}
                onChange={e => setSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              />
            </div>
            <div>
              <label className="block text-[#0F172A] font-bold mb-1">Severity Tier</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as 'Critical' | 'High')}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              >
                <option value="Critical">🔴 Critical (Immediate Evacuation / Barricade)</option>
                <option value="High">🟠 High (Commuter Advisory / Gutter Overflow)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#0F172A] font-bold mb-1">
              Public Instructions &amp; Commuter Advisory
            </label>
            <textarea
              rows={3}
              required
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] resize-none"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded border border-amber-200 text-[11px] text-[#92400E] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#F59E0B] mt-0.5" />
            <span>
              This will publish to live citizen interfaces and trigger PMC SMS broadcast to registered ward residents.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 text-xs font-semibold text-[#64748B] bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Broadcast Official Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
