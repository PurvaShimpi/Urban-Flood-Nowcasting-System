import React, { useState } from 'react';
import {
  PhoneCall,
  Phone,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Zap,
  HeartPulse,
  Truck,
  Copy,
  Check,
  Send,
  LifeBuoy,
  Building,
  MapPin,
  Clock,
  Compass,
  FileText,
  Volume2,
  ChevronDown,
  Info,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useFlood } from '../../context/FloodContext';

export const HelplineSection: React.FC = () => {
  const { currentMetrics, selectedLocality } = useFlood();

  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [selectedSosIssue, setSelectedSosIssue] = useState('Water entered house ground floor');
  const [sosLocation, setSosLocation] = useState('Baner, near High Street Nullah');
  const [sosPeopleCount, setSosPeopleCount] = useState('3');
  const [isCopiedSos, setIsCopiedSos] = useState(false);
  const [activeDirectoryTab, setActiveDirectoryTab] = useState<'central' | 'wards' | 'utilities'>('central');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(id);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  // Central Emergency Contacts
  const emergencyHotlines = [
    {
      id: 'pmc-control',
      title: 'PMC Disaster Central Control Room',
      subtitle: '24x7 Municipal Headquarters Command',
      purpose: 'Stormwater suction pumps, dewatering sump vans, fallen tree clearance, and shelter coordination',
      primaryNumber: '020-25501269',
      altNumber: '020-25506800',
      icon: Building,
      color: 'border-red-400 bg-red-50/50',
      badgeColor: 'bg-red-600 text-white',
      badgeText: 'PRIMARY COMMAND',
      available: '24x7 Dedicated Call Center',
      priority: true,
    },
    {
      id: 'fire-rescue',
      title: 'Pune City Fire Brigade Flood Rescue',
      subtitle: 'Water Rescue & Inundated Vehicle Pull',
      purpose: 'Emergency inflatable boat deployment, trapped resident rescue, high water vehicle pullouts',
      primaryNumber: '101',
      altNumber: '020-26451707',
      icon: Flame,
      color: 'border-amber-400 bg-amber-50/50',
      badgeColor: 'bg-amber-600 text-white',
      badgeText: 'IMMEDIATE RESCUE',
      available: '24x7 Quick Response Fleet',
      priority: true,
    },
    {
      id: 'national-sos',
      title: 'National Emergency / Police & NDRF',
      subtitle: 'Unified National SOS Dispatch',
      purpose: 'Police protection, NDRF specialized flood disaster team mobilization, road blockage enforcement',
      primaryNumber: '112',
      altNumber: '100',
      icon: ShieldAlert,
      color: 'border-sky-400 bg-sky-50/50',
      badgeColor: 'bg-[#0284C7] text-white',
      badgeText: 'POLICE & NDRF',
      available: 'Instant Toll-Free Connection',
      priority: true,
    },
    {
      id: 'ambulance-108',
      title: 'Emergency Medical Casualty Service',
      subtitle: 'Ambulance & Trauma Evacuation',
      purpose: 'Evacuation of elderly, hypothermia patients, flood injuries, emergency medical transport',
      primaryNumber: '108',
      altNumber: '102',
      icon: HeartPulse,
      color: 'border-emerald-400 bg-emerald-50/50',
      badgeColor: 'bg-emerald-600 text-white',
      badgeText: 'MEDICAL SOS',
      available: 'State Emergency Ambulance',
      priority: false,
    },
    {
      id: 'msedcl-electric',
      title: 'MSEDCL Electric Hazard SOS',
      subtitle: 'Substation Water Submergence & Cutoff',
      purpose: 'Report submerged electrical transformers, exposed high-voltage wires, electric shock hazards',
      primaryNumber: '1912',
      altNumber: '1800-212-3435',
      icon: Zap,
      color: 'border-yellow-400 bg-yellow-50/50',
      badgeColor: 'bg-yellow-600 text-white',
      badgeText: 'ELECTRICAL HAZARD',
      available: '24x7 Power Emergency Desk',
      priority: false,
    },
    {
      id: 'pcmc-control',
      title: 'PCMC Disaster Management Cell',
      subtitle: 'Pimpri-Chinchwad Flood Control',
      purpose: 'Disaster response for Wakad, Pimple Saudagar, Sangvi, and Dapodi riverbank sectors',
      primaryNumber: '020-27425555',
      altNumber: '020-27425556',
      icon: LifeBuoy,
      color: 'border-teal-400 bg-teal-50/50',
      badgeColor: 'bg-teal-700 text-white',
      badgeText: 'PCMC JURISDICTION',
      available: '24x7 Municipal Desk',
      priority: false,
    },
    {
      id: 'animal-rescue',
      title: 'RESQ Wildlife & Animal Flood Rescue',
      subtitle: 'Snake & Stranded Animal Extraction',
      purpose: 'Rescue of stranded dogs, cattle, and venomous snake extractions during flood water entry',
      primaryNumber: '+919370005070',
      altNumber: '+919890595222',
      icon: HeartPulse,
      color: 'border-purple-300 bg-purple-50/40',
      badgeColor: 'bg-purple-600 text-white',
      badgeText: 'WILDLIFE / PETS',
      available: 'Pune Volunteer Network',
      priority: false,
    },
    {
      id: 'traffic-police',
      title: 'Pune City Traffic Police Control',
      subtitle: 'Road Diversions & Underpass Status',
      purpose: 'Reports on submerged underpasses, tree falls blocking key arterial roads, bypass guidance',
      primaryNumber: '020-26208225',
      altNumber: '020-26122880',
      icon: Truck,
      color: 'border-slate-300 bg-slate-50',
      badgeColor: 'bg-slate-700 text-white',
      badgeText: 'TRAFFIC HELPLINE',
      available: 'Traffic Control Room',
      priority: false,
    },
  ];

  // Ward-Wise Disaster Control Officers
  const wardOfficers = [
    { ward: 'Zone 1: Shivajinagar - Deccan - Ghole Rd', officer: 'Er. S. M. Kulkarni', contact: '020-25501301', cell: '9881102341' },
    { ward: 'Zone 2: Baner - Balewadi - Aundh - Pashan', officer: 'Er. R. D. Shinde', contact: '020-25656114', cell: '9881102342' },
    { ward: 'Zone 3: Sinhagad Road - Vadgaon - Dhayari', officer: 'Er. P. B. Mane', contact: '020-24351122', cell: '9881102343' },
    { ward: 'Zone 4: Kothrud - Karve Road - Warje', officer: 'Er. A. T. Joshi', contact: '020-25443311', cell: '9881102344' },
    { ward: 'Zone 5: Hadapsar - Mundhwa - Magarpatta', officer: 'Er. V. K. Jagtap', contact: '020-26871022', cell: '9881102345' },
    { ward: 'Zone 6: Yerwada - Sangamwadi - Nagar Rd', officer: 'Er. N. G. Gaikwad', contact: '020-26685511', cell: '9881102346' },
  ];

  const generatedSosText = `🚨 EMERGENCY FLOOD RESCUE SOS - PUNE\nLocation: ${sosLocation}\nSituation: ${selectedSosIssue}\nNumber of People: ${sosPeopleCount}\nCity Risk Level: ${currentMetrics.overallRisk}\nPlease dispatch municipal rescue/dewatering unit immediately. (Ref: JalDrishti Citizen SOS)`;

  const handleCopySos = () => {
    navigator.clipboard.writeText(generatedSosText);
    setIsCopiedSos(true);
    setTimeout(() => setIsCopiedSos(false), 2500);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Animated Beacon */}
      <div className="bg-gradient-to-r from-[#075985] via-[#0284C7] to-[#0369A1] rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        {/* Subtle glowing beacon background */}
        <div className="absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none flex items-center pr-6">
          <div className="w-48 h-48 rounded-full border-4 border-white animate-radar-pulse-1" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs text-sky-100">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span>24x7 Pune Disaster Emergency Assistance</span>
              <span>·</span>
              <span className="text-white">Active Monsoon Ops</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Emergency Flood Helplines &amp; SOS Directory
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              Direct hotlines for the Pune Municipal Corporation (PMC) Central Disaster Cell, Fire Brigade Rescue Boats, Police, Medical Evacuation, and Electricity Substation Cutoffs.
            </p>
          </div>

          {/* Quick SOS Highlight Badge */}
          <div className="p-3 bg-red-600/90 border border-red-300/40 rounded-xl text-center shrink-0 shadow-md animate-sos-halo">
            <span className="text-[10px] font-extrabold uppercase tracking-wider block text-red-200">
              In Extreme Danger?
            </span>
            <a
              href="tel:112"
              className="text-xl sm:text-2xl font-black text-white font-mono block hover:underline"
            >
              DIAL 112 / 101
            </a>
            <span className="text-[10px] text-white/90 font-medium block mt-0.5">
              Immediate Police &amp; Fire Rescue
            </span>
          </div>
        </div>
      </div>

      {/* Directory Tabs */}
      <div className="flex items-center gap-2 border-b border-[#BAE6FD] pb-2">
        <button
          onClick={() => setActiveDirectoryTab('central')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
            activeDirectoryTab === 'central'
              ? 'bg-[#0284C7] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#075985] bg-[#F0FDFA]'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Priority Emergency Helplines ({emergencyHotlines.length})</span>
        </button>

        <button
          onClick={() => setActiveDirectoryTab('wards')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
            activeDirectoryTab === 'wards'
              ? 'bg-[#0284C7] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#075985] bg-[#F0FDFA]'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Zonal Ward Officers Directory</span>
        </button>
      </div>

      {/* 2. Priority Hotlines Grid */}
      {activeDirectoryTab === 'central' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyHotlines.map(contact => {
            const Icon = contact.icon;
            const isCopied = copiedNumber === contact.id;

            return (
              <div
                key={contact.id}
                className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs transition-all hover:shadow-md space-y-3.5 flex flex-col justify-between ${
                  contact.priority ? 'border-sky-300 ring-1 ring-sky-200' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${contact.color}`}>
                        <Icon className="w-5 h-5 text-[#075985]" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-[#0F172A] leading-tight">
                          {contact.title}
                        </h3>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{contact.subtitle}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded shadow-2xs ${contact.badgeColor}`}>
                      {contact.badgeText}
                    </span>
                  </div>

                  <p className="text-xs text-[#475569] mt-3 leading-relaxed">
                    {contact.purpose}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#64748B] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#10B981]" />
                      <span>{contact.available}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      Alt: {contact.altNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${contact.primaryNumber.replace(/[^0-9]/g, '')}`}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-[#075985] to-[#0284C7] hover:from-[#0369A1] hover:to-[#0284C7] text-white rounded-lg font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-xs transition-transform hover:scale-[1.01]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {contact.primaryNumber}</span>
                    </a>

                    <button
                      onClick={() => copyToClipboard(contact.primaryNumber, contact.id)}
                      className="p-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
                      title="Copy phone number"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ward Officers Directory */}
      {activeDirectoryTab === 'wards' && (
        <div className="bg-white border border-[#BAE6FD] rounded-xl overflow-hidden shadow-xs space-y-2 p-4">
          <div className="pb-2 border-b border-sky-100">
            <h3 className="font-bold text-sm text-[#0F172A]">
              PMC Zonal Stormwater &amp; Evacuation Executive Engineers
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Direct cell numbers for zonal duty officers responsible for local dewatering and rescue in each Pune sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {wardOfficers.map(officer => (
              <div
                key={officer.ward}
                className="p-3 bg-[#F0FDFA]/60 border border-[#BAE6FD] rounded-lg space-y-1.5"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-xs text-[#0F172A]">{officer.ward}</span>
                  <span className="text-[10px] font-semibold bg-white border border-sky-200 text-[#075985] px-1.5 py-0.5 rounded">
                    PMC Zone
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">Officer: <strong>{officer.officer}</strong></p>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-sky-100 font-mono">
                  <span>Landline: {officer.contact}</span>
                  <a
                    href={`tel:${officer.cell}`}
                    className="font-bold text-[#0284C7] hover:underline"
                  >
                    Mobile: {officer.cell}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Interactive Quick Distress SOS Generator (SMS / WhatsApp) */}
      <div className="bg-white border border-[#BAE6FD] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-sky-100">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#0284C7]" />
              <span>Instant Distress SOS Message Dispatcher</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Generate a formatted emergency distress message with your exact location and details to send via WhatsApp, SMS, or control room email.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#075985] bg-[#E0F7FA] px-2 py-0.5 rounded font-semibold hidden sm:inline-block">
            Auto-GPS Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Your Exact Location / Landmark</label>
            <input
              type="text"
              value={sosLocation}
              onChange={e => setSosLocation(e.target.value)}
              placeholder="e.g. Anandnagar Bridge, Sinhagad Road"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] text-[#0F172A]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Emergency Nature</label>
            <select
              value={selectedSosIssue}
              onChange={e => setSelectedSosIssue(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] text-[#0F172A]"
            >
              <option value="Water entered house ground floor">Water entered house ground floor</option>
              <option value="Car stalled in submerged underpass">Car stalled in submerged underpass</option>
              <option value="Elderly / Patient requires stretcher evacuation">Elderly / Patient requires stretcher evacuation</option>
              <option value="Submerged transformer sparking / electric shock risk">Submerged transformer sparking / electric risk</option>
              <option value="River backwater rising rapidly over society wall">River backwater rising rapidly over society wall</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">People / Pets Trapped</label>
            <input
              type="number"
              min="1"
              max="50"
              value={sosPeopleCount}
              onChange={e => setSosPeopleCount(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0284C7] text-[#0F172A]"
            />
          </div>
        </div>

        {/* Pre-Formatted Message Box */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-[#0F172A] relative">
          <pre className="whitespace-pre-wrap">{generatedSosText}</pre>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-[#64748B]">
            Include landmark name so rescue boats can locate you quickly.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySos}
              className="px-4 py-2 text-xs font-bold text-[#075985] bg-[#F0FDFA] hover:bg-[#E0F7FA] border border-[#BAE6FD] rounded-lg transition-colors flex items-center gap-1.5"
            >
              {isCopiedSos ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopiedSos ? 'Copied to Clipboard!' : 'Copy SOS Text'}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(generatedSosText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share to WhatsApp / Contacts</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4. What to Say When Calling Control Room (Caller Guidance Protocol) */}
      <div className="bg-white border border-[#BAE6FD] rounded-xl p-5 shadow-xs space-y-4">
        <div className="pb-2 border-b border-sky-100">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-[#0284C7]" />
            <span>Caller Guidance: What to Say When Calling PMC Control Room</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Clear communication helps the dispatch operator deploy the right rescue asset without delay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#F0FDFA] rounded-lg border border-sky-100 space-y-1">
            <span className="w-6 h-6 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h4 className="font-bold text-[#0F172A] pt-1">Exact Landmark</h4>
            <p className="text-[#64748B] text-[11px]">
              Name the society, road junction, or nearby petrol pump rather than only sector name.
            </p>
          </div>

          <div className="p-3 bg-[#F0FDFA] rounded-lg border border-sky-100 space-y-1">
            <span className="w-6 h-6 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h4 className="font-bold text-[#0F172A] pt-1">Water Depth Level</h4>
            <p className="text-[#64748B] text-[11px]">
              Specify whether water is at Ankle, Knee, Waist, or Vehicle Exhaust level.
            </p>
          </div>

          <div className="p-3 bg-[#F0FDFA] rounded-lg border border-sky-100 space-y-1">
            <span className="w-6 h-6 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h4 className="font-bold text-[#0F172A] pt-1">Vulnerable Persons</h4>
            <p className="text-[#64748B] text-[11px]">
              Inform if infants, elderly, pregnant women, or sick individuals require stretcher aid.
            </p>
          </div>

          <div className="p-3 bg-[#F0FDFA] rounded-lg border border-sky-100 space-y-1">
            <span className="w-6 h-6 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center text-xs">
              4
            </span>
            <h4 className="font-bold text-[#0F172A] pt-1">Electrical Hazards</h4>
            <p className="text-[#64748B] text-[11px]">
              Warn if a roadside transformer or meter box is touching water so power can be cut off first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
