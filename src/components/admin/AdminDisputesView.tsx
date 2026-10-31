import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  ShieldAlert, 
  Car, 
  User, 
  Building2, 
  Clock, 
  Scale, 
  FileImage, 
  DollarSign, 
  ArrowRight,
  MessageSquare,
  Check,
  X
} from 'lucide-react';
import { AdminDispute } from '../../types/admin';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface AdminDisputesViewProps {
  disputes: AdminDispute[];
  onResolveDispute: (
    disputeId: string, 
    verdict: 'refund_renter' | 'release_to_agency' | 'split_50_50', 
    notes: string
  ) => void;
  selectedDisputeId?: string;
}

export const AdminDisputesView: React.FC<AdminDisputesViewProps> = ({
  disputes,
  onResolveDispute,
  selectedDisputeId,
}) => {
  const { isLight, formatPrice } = useAccountSettings();

  const [activeDispute, setActiveDispute] = useState<AdminDispute>(() => {
    if (selectedDisputeId) {
      const match = disputes.find(d => d.id === selectedDisputeId);
      if (match) return match;
    }
    return disputes[0];
  });

  const [verdictNotes, setVerdictNotes] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState<'refund_renter' | 'release_to_agency' | 'split_50_50'>('refund_renter');

  const openCasesCount = disputes.filter(d => d.status === 'open' || d.status === 'under_investigation').length;

  const handleSubmitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDispute) return;
    onResolveDispute(
      activeDispute.id, 
      selectedVerdict, 
      verdictNotes || `Settled by HQ Admin via ${selectedVerdict.replace(/_/g, ' ')}.`
    );
    setVerdictNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">
            Arbitration & Trust Protection
          </span>
          <h1 className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            Dispute Desk & Escrow Arbitration
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
            Independent HQ review for deposit withholdings, scratch claims, and late return surcharges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{openCasesCount} Open Cases Requiring Verdict</span>
          </span>
        </div>
      </div>

      {/* Main Layout: Left list of disputes, Right active arbitration case */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Dispute List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8d7e73] px-1">
            Cases In Docket
          </div>

          <div className="space-y-2.5">
            {disputes.map((d) => {
              const isSelected = activeDispute?.id === d.id;
              const isResolved = d.status === 'resolved';

              return (
                <div
                  key={d.id}
                  onClick={() => setActiveDispute(d)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#f95721] ring-2 ring-[#f95721]/30 ' + (isLight ? 'bg-orange-50/50' : 'bg-[#251913]')
                      : isLight ? 'bg-white border-neutral-200 hover:border-neutral-300' : 'bg-[#1a130f] border-[#2c2018] hover:border-[#382b21]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#f95721]">
                      {d.disputeNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      isResolved ? 'bg-emerald-500/15 text-emerald-500' :
                      d.status === 'open' ? 'bg-rose-500/15 text-rose-500' : 'bg-amber-500/15 text-amber-500'
                    }`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-1.5 font-bold text-xs truncate">
                    {d.renterName} vs {d.agencyName}
                  </div>

                  <div className="text-[11px] text-[#8d7e73] truncate mt-0.5">
                    {d.vehicleName} • {d.issueType.replace(/_/g, ' ')}
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-500/15 text-[11px]">
                    <span className="font-mono font-bold text-rose-500">
                      Dispute: {formatPrice(d.amountInDisputeMAD)}
                    </span>
                    <span className="text-[10px] text-[#8d7e73]">{d.dateOpened}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Deep Dive & Side-by-side Evidence (8 cols) */}
        {activeDispute ? (
          <div className={`lg:col-span-8 p-6 rounded-3xl border space-y-6 ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
          }`}>
            
            {/* Case Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-neutral-500/15">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#f95721]">
                    {activeDispute.disputeNumber}
                  </span>
                  <span className="text-xs font-mono text-[#8d7e73]">
                    (Booking ref: {activeDispute.bookingNumber})
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    activeDispute.status === 'resolved' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'
                  }`}>
                    {activeDispute.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="font-serif-display text-xl font-bold mt-1">
                  Issue: {activeDispute.issueType.replace(/_/g, ' ').toUpperCase()}
                </h2>
                <p className="text-xs text-[#8d7e73]">
                  Vehicle: <strong className={isLight ? 'text-neutral-800' : 'text-[#f5efe8]'}>{activeDispute.vehicleName}</strong> ({activeDispute.vehiclePlate})
                </p>
              </div>

              {/* Amount in dispute */}
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-right">
                <span className="text-[10px] text-rose-400 block font-semibold uppercase">Frozen Deposit Amount</span>
                <span className="font-mono font-bold text-xl text-rose-500">
                  {formatPrice(activeDispute.amountInDisputeMAD)}
                </span>
              </div>
            </div>

            {/* Side by side claims */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Renter Claim */}
              <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                isLight ? 'bg-blue-50/50 border-blue-200' : 'bg-[#191e28]/50 border-blue-900/40'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-blue-400">
                    <User className="w-4 h-4" />
                    <span>Customer Claim</span>
                  </div>
                  <span className="text-[10px] text-[#8d7e73]">{activeDispute.renterEmail}</span>
                </div>
                <div className="font-bold text-xs">{activeDispute.renterName}</div>
                <p className="text-[11px] leading-relaxed italic text-[#c5b8ad]">
                  "{activeDispute.renterClaim}"
                </p>
              </div>

              {/* Agency Claim */}
              <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-[#251e18]/50 border-amber-900/40'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-500">
                    <Building2 className="w-4 h-4" />
                    <span>Agency Defense</span>
                  </div>
                  <span className="text-[10px] text-[#8d7e73]">{activeDispute.agencyName}</span>
                </div>
                <div className="font-bold text-xs">{activeDispute.agencyName} Staff</div>
                <p className="text-[11px] leading-relaxed italic text-[#c5b8ad]">
                  "{activeDispute.agencyClaim}"
                </p>
              </div>

            </div>

            {/* Evidence Photos */}
            {activeDispute.evidencePhotos.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-xs flex items-center gap-1.5">
                  <FileImage className="w-4 h-4 text-[#f95721]" />
                  <span>Submitted Photo & Video Evidence ({activeDispute.evidencePhotos.length})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeDispute.evidencePhotos.map((photo, idx) => (
                    <div 
                      key={idx}
                      className={`rounded-2xl border overflow-hidden text-xs space-y-2 p-2 ${
                        isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#31241a]'
                      }`}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.caption} 
                        className="w-full h-36 object-cover rounded-xl"
                      />
                      <div className="px-1 text-[11px]">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold mr-1.5 ${
                          photo.uploadedBy === 'renter' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-500'
                        }`}>
                          {photo.uploadedBy.toUpperCase()}
                        </span>
                        <span className="text-[#8d7e73]">{photo.caption}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Verdict or Form to Settle */}
            {activeDispute.status === 'resolved' ? (
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Case Resolved & Settled: {activeDispute.verdict?.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                <p className="text-xs">{activeDispute.resolutionNotes}</p>
                <div className="text-[10px] text-neutral-500 pt-1">
                  Resolved on {activeDispute.resolvedAt} by {activeDispute.resolvedBy}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitResolution} className={`p-4 rounded-2xl border space-y-4 text-xs ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#31241a]'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs text-[#f95721]">
                  <Scale className="w-4 h-4" />
                  <span>Issue Official Headquarter Arbitration Ruling</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label 
                    onClick={() => setSelectedVerdict('refund_renter')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                      selectedVerdict === 'refund_renter' 
                        ? 'border-blue-500 bg-blue-500/15 text-blue-400 font-bold' 
                        : 'border-neutral-500/20 text-[#8d7e73] hover:text-white'
                    }`}
                  >
                    <span className="block font-bold">Refund Renter 100%</span>
                    <span className="text-[10px] opacity-75">Customer proof valid</span>
                  </label>

                  <label 
                    onClick={() => setSelectedVerdict('release_to_agency')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                      selectedVerdict === 'release_to_agency' 
                        ? 'border-amber-500 bg-amber-500/15 text-amber-500 font-bold' 
                        : 'border-neutral-500/20 text-[#8d7e73] hover:text-white'
                    }`}
                  >
                    <span className="block font-bold">Release to Agency</span>
                    <span className="text-[10px] opacity-75">Legitimate damage fee</span>
                  </label>

                  <label 
                    onClick={() => setSelectedVerdict('split_50_50')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                      selectedVerdict === 'split_50_50' 
                        ? 'border-[#f95721] bg-[#f95721]/15 text-[#f95721] font-bold' 
                        : 'border-neutral-500/20 text-[#8d7e73] hover:text-white'
                    }`}
                  >
                    <span className="block font-bold">Split 50 / 50</span>
                    <span className="text-[10px] opacity-75">Fair compromise</span>
                  </label>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[11px]">Arbitration Ruling Notes & Justification</label>
                  <textarea
                    rows={2}
                    placeholder="Enter official verdict notes sent to both parties..."
                    value={verdictNotes}
                    onChange={(e) => setVerdictNotes(e.target.value)}
                    className={`w-full rounded-xl border p-2.5 text-xs focus:outline-none ${
                      isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-[#18110e] border-[#36271e] text-[#f5efe8]'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Execute Arbitration & Release Escrow</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-xs text-[#8d7e73]">
            Select a dispute from the list to begin arbitration.
          </div>
        )}

      </div>

    </div>
  );
};
