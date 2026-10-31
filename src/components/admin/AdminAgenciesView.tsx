import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  Percent, 
  Phone, 
  Mail, 
  MapPin, 
  Car, 
  Star, 
  X,
  ChevronRight,
  Download
} from 'lucide-react';
import { AdminAgency, AdminKYCDoc } from '../../types/admin';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { AdminAgencyDetailModal } from './AdminAgencyDetailModal';

interface AdminAgenciesViewProps {
  agencies: AdminAgency[];
  onVerifyAgency: (agencyId: string) => void;
  onSuspendAgency: (agencyId: string, reason: string) => void;
  onUpdateCommission: (agencyId: string, newRate: number) => void;
  onViewAgencyFleet: (agencyId: string) => void;
  selectedAgencyForKYC: AdminAgency | null;
  onCloseKYCModal: () => void;
  onOpenKYCModal: (agency: AdminAgency) => void;
}

export const AdminAgenciesView: React.FC<AdminAgenciesViewProps> = ({
  agencies,
  onVerifyAgency,
  onSuspendAgency,
  onUpdateCommission,
  onViewAgencyFleet,
  selectedAgencyForKYC,
  onCloseKYCModal,
  onOpenKYCModal,
}) => {
  const { isLight, formatPrice } = useAccountSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'under_review' | 'suspended'>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [commissionModalAgency, setCommissionModalAgency] = useState<AdminAgency | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(15);
  const [detailedAgency, setDetailedAgency] = useState<AdminAgency | null>(null);

  // Filtered agencies
  const filteredAgencies = agencies.filter((agency) => {
    const matchesSearch = 
      agency.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.commercialRegisterRc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || agency.status === statusFilter;
    const matchesCity = cityFilter === 'all' || agency.city.toLowerCase().includes(cityFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCity;
  });

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (commissionModalAgency) {
      onUpdateCommission(commissionModalAgency.id, newCommissionRate);
      setCommissionModalAgency(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">
            Partner Fleet Operations
          </span>
          <h1 className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            Rental Agencies & Legal KYC Management
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
            Supervise accredited rental companies across Morocco, verify official business registries, and adjust platform take rates.
          </p>
        </div>

        {/* Agency count summary */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
            isLight ? 'bg-white border-neutral-200 text-neutral-700' : 'bg-[#1e1612] border-[#31241b] text-[#c5b8ad]'
          }`}>
            {agencies.length} Total Agencies • {agencies.filter(a => a.status === 'verified').length} Verified
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
      }`}>
        {/* Search */}
        <div className={`relative w-full md:max-w-md rounded-2xl border flex items-center ${
          isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-[#221813] border-[#36271e]'
        }`}>
          <Search className="w-4 h-4 text-[#8d7e73] ml-3.5" />
          <input
            type="text"
            placeholder="Search by agency name, owner, city, RC number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-2 text-xs focus:outline-none placeholder:text-neutral-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="mr-3 text-xs text-[#8d7e73] hover:text-white">
              ✕
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['all', 'verified', 'pending', 'under_review', 'suspended'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === st
                  ? 'bg-[#f95721] text-white shadow-xs'
                  : isLight
                  ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  : 'bg-[#241a14] text-[#8d7e73] hover:text-white'
              }`}
            >
              {st === 'all' ? 'All' : st === 'verified' ? 'Verified' : st === 'pending' ? 'Pending KYC' : st === 'under_review' ? 'Under Review' : 'Suspended'}
              {st === 'pending' && agencies.filter(a => a.status === 'pending').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500 text-white font-bold">
                  {agencies.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Agencies Table / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAgencies.map((agency) => {
          const isPending = agency.status === 'pending' || agency.status === 'under_review';
          const isSuspended = agency.status === 'suspended';

          return (
            <div
              key={agency.id}
              className={`p-5 rounded-3xl border transition-all ${
                isPending 
                  ? isLight ? 'bg-amber-50/40 border-amber-300 shadow-sm' : 'bg-amber-950/10 border-amber-800/50 shadow-sm'
                  : isSuspended
                  ? isLight ? 'bg-rose-50/40 border-rose-300 opacity-75' : 'bg-rose-950/10 border-rose-800/40 opacity-75'
                  : isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Agency Basic Info */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="font-serif-display text-lg font-bold tracking-tight">
                      {agency.agencyName}
                    </h2>
                    
                    {/* Status badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      agency.status === 'verified'
                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        : agency.status === 'pending'
                        ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        : agency.status === 'under_review'
                        ? 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                        : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    }`}>
                      {agency.status === 'verified' ? <CheckCircle2 className="w-3 h-3" /> :
                       agency.status === 'pending' ? <Clock className="w-3 h-3" /> :
                       agency.status === 'under_review' ? <FileText className="w-3 h-3" /> :
                       <XCircle className="w-3 h-3" />}
                      <span>{agency.status.replace('_', ' ')}</span>
                    </span>

                    {/* Commission Pill */}
                    <button
                      type="button"
                      onClick={() => {
                        setCommissionModalAgency(agency);
                        setNewCommissionRate(agency.commissionRatePct);
                      }}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f95721]/15 text-[#f95721] border border-[#f95721]/30 hover:bg-[#f95721]/25 transition-colors cursor-pointer flex items-center gap-1"
                      title="Click to adjust platform commission"
                    >
                      <Percent className="w-2.5 h-2.5" />
                      <span>{agency.commissionRatePct}% Commission</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#8d7e73] flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#f95721]" />
                      <strong className={isLight ? 'text-neutral-800' : 'text-[#f5efe8]'}>{agency.city}</strong>
                    </span>
                    <span>•</span>
                    <span>Owner: <strong className={isLight ? 'text-neutral-800' : 'text-[#f5efe8]'}>{agency.ownerName}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{agency.commercialRegisterRc}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{agency.taxIdIf}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#8d7e73] flex-wrap pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {agency.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {agency.email}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <strong>{agency.rating.toFixed(2)}</strong> ({agency.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Performance Numbers */}
                <div className={`grid grid-cols-3 gap-3 p-3 rounded-2xl border text-center text-xs min-w-[280px] ${
                  isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#31241a]'
                }`}>
                  <div>
                    <span className="text-[10px] text-[#8d7e73] block">Fleet Size</span>
                    <span className="font-bold text-sm">{agency.fleetCount} cars</span>
                    <span className="text-[9px] text-emerald-500 block">{agency.activeRentals} on trip</span>
                  </div>
                  <div className="border-x border-neutral-500/20 px-1">
                    <span className="text-[10px] text-[#8d7e73] block">Total Volume</span>
                    <span className="font-bold font-mono text-xs">{formatPrice(agency.totalVolumeMAD)}</span>
                    <span className="text-[9px] text-[#8d7e73] block">Platform GMV</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8d7e73] block">Pending Payout</span>
                    <span className="font-bold font-mono text-xs text-[#f95721]">{formatPrice(agency.pendingPayoutMAD)}</span>
                    <span className="text-[9px] text-blue-400 block">Bank Ready</span>
                  </div>
                </div>

                {/* Actions Button Group */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full lg:w-auto justify-end">
                  
                  {/* Full Dossier & Legal Details Button */}
                  <button
                    type="button"
                    onClick={() => setDetailedAgency(agency)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Inspect complete legal, banking, contact, and fleet dossier"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Full Dossier</span>
                  </button>

                  {/* View KYC Docs button */}
                  <button
                    type="button"
                    onClick={() => onOpenKYCModal(agency)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isPending
                        ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                        : isLight
                        ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                        : 'bg-[#221813] hover:bg-[#2c2018] text-[#f5efe8] border-[#382b21]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isPending ? 'Inspect & Approve KYC' : 'View KYC Docs'}</span>
                  </button>

                  {/* View Fleet button */}
                  <button
                    type="button"
                    onClick={() => onViewAgencyFleet(agency.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-500/15 hover:bg-neutral-500/25 text-[#f5efe8] cursor-pointer transition-colors flex items-center gap-1"
                    title="View all cars belonging to this agency"
                  >
                    <Car className="w-3.5 h-3.5 text-[#f95721]" />
                    <span>Fleet ({agency.fleetCount})</span>
                  </button>

                  {/* Suspend or Unsuspend */}
                  {agency.status !== 'suspended' ? (
                    <button
                      type="button"
                      onClick={() => onSuspendAgency(agency.id, 'Legal compliance audit')}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Suspend agency from accepting new bookings"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onVerifyAgency(agency.id)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    >
                      Re-activate
                    </button>
                  )}

                </div>

              </div>

              {/* Bank RIB Preview */}
              <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] text-[#8d7e73] flex-wrap gap-2 ${
                isLight ? 'border-neutral-200' : 'border-[#261d16]'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-500">Bank RIB:</span>
                  <span className="font-mono">{agency.bankAccount.rib}</span>
                  <span>({agency.bankAccount.bankName})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Accreditation: <strong className={isLight ? 'text-neutral-700' : 'text-[#f5efe8]'}>{agency.tourismMinistryLicense}</strong></span>
                  <span>•</span>
                  <span>Joined {agency.joinedDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODAL: KYC INSPECTION & DOCUMENT APPROVAL                 */}
      {/* ======================================================== */}
      {selectedAgencyForKYC && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`rounded-3xl border max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto ${
            isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#1a130f] border-[#2b2018] text-[#f5efe8]'
          }`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between pb-4 border-b ${
              isLight ? 'border-neutral-200' : 'border-[#261d16]'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">
                    Moroccan Regulatory Compliance
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedAgencyForKYC.status === 'verified' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                  }`}>
                    Status: {selectedAgencyForKYC.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold">
                  {selectedAgencyForKYC.agencyName} • KYC Dossier
                </h3>
                <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                  Verification of Commercial Register, Patente, Ministry License, and Fleet Insurance.
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseKYCModal}
                className="p-2 rounded-full bg-neutral-500/20 hover:bg-neutral-500/30 text-[#8d7e73] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Moroccan Registries */}
            <div className={`p-4 rounded-2xl border space-y-3 text-xs ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#31241a]'
            }`}>
              <h4 className="font-bold flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#f95721]" />
                <span>Statutory Registrations</span>
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] text-[#8d7e73] block">Registre de Commerce</span>
                  <span className="font-mono font-bold text-xs">{selectedAgencyForKYC.commercialRegisterRc}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8d7e73] block">Patente Professionnelle</span>
                  <span className="font-mono font-bold text-xs">{selectedAgencyForKYC.patenteNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8d7e73] block">Identifiant Fiscal (IF)</span>
                  <span className="font-mono font-bold text-xs">{selectedAgencyForKYC.taxIdIf}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8d7e73] block">Agrément Tourisme</span>
                  <span className="font-mono font-bold text-xs">{selectedAgencyForKYC.tourismMinistryLicense}</span>
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs flex items-center justify-between">
                <span>Submitted KYC Documents ({selectedAgencyForKYC.kycDocuments.length})</span>
                <span className="text-[11px] text-[#8d7e73]">Validated under Moroccan Law</span>
              </h4>

              <div className="space-y-2">
                {selectedAgencyForKYC.kycDocuments.map((doc) => (
                  <div 
                    key={doc.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#1e1612] border-[#2f221a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        doc.status === 'verified' ? 'bg-emerald-500/15 text-emerald-500' :
                        doc.status === 'pending' ? 'bg-amber-500/15 text-amber-500' : 'bg-rose-500/15 text-rose-500'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold block">{doc.name}</span>
                        <span className="text-[10px] text-[#8d7e73]">
                          Uploaded on {doc.uploadedAt} • {doc.type.toUpperCase()}
                        </span>
                        {doc.notes && (
                          <span className="text-[10px] text-amber-500 block font-semibold">{doc.notes}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        doc.status === 'verified' ? 'bg-emerald-500/15 text-emerald-500' :
                        doc.status === 'pending' ? 'bg-amber-500/15 text-amber-500' : 'bg-rose-500/15 text-rose-500'
                      }`}>
                        {doc.status}
                      </span>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg bg-neutral-500/20 hover:bg-neutral-500/30 text-xs cursor-pointer"
                        title="View document scan"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank RIB Settlement Verification */}
            <div className={`p-4 rounded-2xl border space-y-1 text-xs ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#31241a]'
            }`}>
              <span className="text-[10px] text-[#8d7e73] block uppercase font-bold">Designated Settlement RIB</span>
              <div className="font-mono font-bold text-sm text-[#f95721]">
                {selectedAgencyForKYC.bankAccount.rib}
              </div>
              <p className="text-[11px] text-[#8d7e73]">
                {selectedAgencyForKYC.bankAccount.bankName} • Account Holder: {selectedAgencyForKYC.bankAccount.accountHolder}
              </p>
            </div>

            {/* Decision Actions */}
            <div className={`flex items-center justify-between pt-4 border-t ${
              isLight ? 'border-neutral-200' : 'border-[#261d16]'
            }`}>
              <button
                type="button"
                onClick={onCloseKYCModal}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#8d7e73] hover:text-white cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSuspendAgency(selectedAgencyForKYC.id, 'Document rejection');
                    onCloseKYCModal();
                  }}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 cursor-pointer"
                >
                  Reject & Request Resubmission
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onVerifyAgency(selectedAgencyForKYC.id);
                    onCloseKYCModal();
                  }}
                  className="px-6 py-2 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Verify Agency</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADJUST COMMISSION TIER                             */}
      {/* ======================================================== */}
      {commissionModalAgency && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl border max-w-md w-full p-6 shadow-2xl space-y-4 ${
            isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#1a130f] border-[#2b2018] text-[#f5efe8]'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#f95721] font-bold uppercase tracking-wider block">
                  Commercial Pricing Tier
                </span>
                <h3 className="font-serif-display text-lg font-bold">
                  Adjust Commission: {commissionModalAgency.agencyName}
                </h3>
              </div>
              <button onClick={() => setCommissionModalAgency(null)} className="text-[#8d7e73] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCommission} className="space-y-4 text-xs">
              <p className={`text-[11px] ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
                Standard Morocco Drive take-rate is 15%. High-volume fleet partners (20+ cars) qualify for 12–13%.
              </p>

              <div>
                <label className="block font-semibold mb-1">Commission Rate (%)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={8}
                    max={25}
                    step={1}
                    value={newCommissionRate}
                    onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                    className="flex-1 accent-[#f95721]"
                  />
                  <span className="font-mono font-bold text-base text-[#f95721] w-12 text-right">
                    {newCommissionRate}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCommissionModalAgency(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#8d7e73] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-md cursor-pointer"
                >
                  Update Commission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive Full Agency Dossier Modal */}
      {detailedAgency && (
        <AdminAgencyDetailModal
          agency={detailedAgency}
          onClose={() => setDetailedAgency(null)}
          onVerifyAgency={onVerifyAgency}
          onSuspendAgency={onSuspendAgency}
          onUpdateCommission={onUpdateCommission}
          onViewFleet={onViewAgencyFleet}
        />
      )}

    </div>
  );
};
