import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  X,
  Building,
  Info,
  BadgeCheck,
  ChevronRight,
} from 'lucide-react';
import { useFlood } from '../../context/FloodContext';
import { AUTHORIZED_PMC_OFFICERS } from '../../data/puneFloodData';

export const OfficerAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginOfficer, authenticatedOfficer } = useFlood();

  const [badgeId, setBadgeId] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!badgeId.trim() || !pin.trim()) {
      setErrorMsg('Please enter both Officer Badge ID and Security PIN.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginOfficer(badgeId, pin);
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleSelectDemoOfficer = (officer: (typeof AUTHORIZED_PMC_OFFICERS)[0]) => {
    setBadgeId(officer.badgeId);
    setPin(officer.pin);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-[#BAE6FD] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Official Header */}
        <div className="bg-gradient-to-r from-[#075985] via-[#0284C7] to-[#0369A1] p-5 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-sky-100 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-sm backdrop-blur-xs">
              <ShieldCheck className="w-7 h-7 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded text-sky-100">
                  Government of Maharashtra · PMC
                </span>
                <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SCADA Portal
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight mt-1">
                Disaster Cell Officer Authentication
              </h3>
              <p className="text-xs text-sky-100 mt-0.5">
                Restricted to authorized Pune Municipal Corporation command personnel
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Failed</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Officer Badge / Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={badgeId}
                  onChange={e => setBadgeId(e.target.value)}
                  placeholder="e.g. PMC-DISASTER-01"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Official Security PIN / Access Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#075985] to-[#0284C7] hover:from-[#0369A1] hover:to-[#0284C7] rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Officer Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate &amp; Unlock Command Console</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="pt-3 border-t border-sky-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#075985] uppercase tracking-wider flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Quick-Select Department Officers</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to fill</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {AUTHORIZED_PMC_OFFICERS.map(officer => (
                <button
                  key={officer.badgeId}
                  type="button"
                  onClick={() => handleSelectDemoOfficer(officer)}
                  className={`p-2 rounded-lg border text-left transition-all flex items-center justify-between hover:border-[#0284C7] ${
                    badgeId === officer.badgeId
                      ? 'bg-[#F0FDFA] border-[#0284C7] ring-1 ring-[#0284C7]'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#0F172A]">{officer.name}</span>
                      <span className="text-[10px] font-mono px-1 py-0.2 bg-white border border-slate-200 rounded text-[#075985] font-semibold">
                        {officer.badgeId}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">
                      {officer.designation} · {officer.wardZone}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Legal / Statutory Compliance Notice */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-500 leading-relaxed flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Statutory Warning:</strong> This system controls municipal high-capacity dewatering pumps, Khadakwasla dam telemetry, and emergency flood siren alerts under the Disaster Management Act, 2005. All operational actions are cryptographically logged.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
