import React, { useState } from 'react';
import { AdminAgency } from '../../types/admin';
import { 
  X, Building2, ShieldCheck, MapPin, Phone, Mail, FileText, 
  CreditCard, Car, Award, AlertTriangle, CheckCircle, ExternalLink,
  Clock, User, Hash, Briefcase, Landmark, Star, Shield, ArrowUpRight
} from 'lucide-react';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface AdminAgencyDetailModalProps {
  agency: AdminAgency;
  onClose: () => void;
  onVerifyAgency: (agencyId: string) => void;
  onSuspendAgency: (agencyId: string, reason: string) => void;
  onUpdateCommission: (agencyId: string, newRate: number) => void;
  onViewFleet: (agencyId: string) => void;
}

export const AdminAgencyDetailModal: React.FC<AdminAgencyDetailModalProps> = ({
  agency,
  onClose,
  onVerifyAgency,
  onSuspendAgency,
  onUpdateCommission,
  onViewFleet,
}) => {
  const { isLight } = useAccountSettings();
  const [activeTab, setActiveTab] = useState<'overview' | 'legal' | 'banking' | 'fleet_stats' | 'documents'>('overview');
  const [commissionInput, setCommissionInput] = useState(agency.commissionRatePct);
  const [isEditingCommission, setIsEditingCommission] = useState(false);

  const formatMAD = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
        isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#18120d] border-[#2e231c] text-[#f5efe8]'
      }`}>
        
        {/* Modal Header */}
        <div className={`p-6 border-b flex items-start justify-between ${
          isLight ? 'bg-neutral-50/70 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#f95721] to-[#e04a17] text-white flex items-center justify-center font-black text-2xl shadow-md">
              {agency.agencyName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight">{agency.agencyName}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  agency.status === 'verified' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  agency.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  agency.status === 'under_review' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                  'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                }`}>
                  {agency.status.replace('_', ' ')}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-200/60 dark:bg-white/10 font-semibold">
                  ICE: {agency.ice}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
                <span>{agency.legalName}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#f95721]" /> {agency.city}</span>
                <span>•</span>
                <span>Partner since {agency.joinedDate}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex border-b px-6 gap-2 overflow-x-auto ${
          isLight ? 'bg-neutral-100/50 border-neutral-200' : 'bg-[#150f0b] border-[#2e231c]'
        }`}>
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: Award },
            { id: 'legal', label: 'Legal & Accreditations', icon: FileText },
            { id: 'banking', label: 'Bank Account & RIB', icon: Landmark },
            { id: 'fleet_stats', label: 'Fleet & Service Area', icon: Car },
            { id: 'documents', label: `Dossier (${agency.kycDocuments.length})`, icon: ShieldCheck },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'border-[#f95721] text-[#f95721]' 
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: OVERVIEW & PERFORMANCE */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <p className="text-xs text-neutral-400 font-medium">Lifetime GMV</p>
                  <p className="text-lg font-bold text-[#f95721] mt-1">{formatMAD(agency.totalVolumeMAD)}</p>
                  <p className="text-[11px] text-neutral-500 mt-1">Total customer rentals</p>
                </div>
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <p className="text-xs text-neutral-400 font-medium">Total Paid Out</p>
                  <p className="text-lg font-bold text-emerald-500 mt-1">{formatMAD(agency.totalPaidOutMAD)}</p>
                  <p className="text-[11px] text-neutral-500 mt-1">Disbursed to partner</p>
                </div>
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <p className="text-xs text-neutral-400 font-medium">Pending Payout</p>
                  <p className="text-lg font-bold text-amber-500 mt-1">{formatMAD(agency.pendingPayoutMAD)}</p>
                  <p className="text-[11px] text-neutral-500 mt-1">Current settlement cycle</p>
                </div>
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <p className="text-xs text-neutral-400 font-medium">Take-Rate Commission</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-bold">{agency.commissionRatePct}%</p>
                    <button
                      type="button"
                      onClick={() => setIsEditingCommission(!isEditingCommission)}
                      className="text-[11px] text-[#f95721] hover:underline font-semibold cursor-pointer"
                    >
                      Adjust
                    </button>
                  </div>
                  {isEditingCommission && (
                    <div className="mt-2 flex items-center gap-2">
                      <input 
                        type="number" 
                        min="5" 
                        max="30"
                        value={commissionInput} 
                        onChange={(e) => setCommissionInput(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs rounded border bg-transparent"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          onUpdateCommission(agency.id, commissionInput);
                          setIsEditingCommission(false);
                        }}
                        className="px-2 py-1 text-xs bg-[#f95721] text-white rounded font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quality & SLA Metrics */}
              <div className={`p-5 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Operational Quality & Customer Feedback</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-neutral-400">Customer Rating</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-base font-bold">{agency.rating}</span>
                      <span className="text-xs text-neutral-400">({agency.reviewCount})</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400">Avg. Response Time</span>
                    <p className="text-base font-bold mt-1 text-emerald-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {agency.avgResponseTimeMinutes} mins
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400">Cancellation Rate</span>
                    <p className="text-base font-bold mt-1">{agency.cancellationRatePct}%</p>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400">Dispute Rate</span>
                    <p className={`text-base font-bold mt-1 ${agency.disputeRatePct > 1 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {agency.disputeRatePct}%
                    </p>
                  </div>
                </div>

                {/* Star rating breakdown */}
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400">Cleanliness</span>
                    <p className="font-semibold">{agency.reviewsBreakdown.cleanliness} / 5.0</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Communication</span>
                    <p className="font-semibold">{agency.reviewsBreakdown.communication} / 5.0</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Car Condition</span>
                    <p className="font-semibold">{agency.reviewsBreakdown.carCondition} / 5.0</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Punctuality</span>
                    <p className="font-semibold">{agency.reviewsBreakdown.punctuality} / 5.0</p>
                  </div>
                </div>
              </div>

              {/* Direct Contacts & Manager */}
              <div className={`p-5 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Direct Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <p><strong className="text-neutral-400">Primary Phone:</strong> <a href={`tel:${agency.phone}`} className="text-[#f95721] hover:underline font-semibold ml-1">{agency.phone}</a></p>
                    <p><strong className="text-neutral-400">Secondary / Landline:</strong> <span className="ml-1 font-semibold">{agency.secondaryPhone}</span></p>
                    <p><strong className="text-neutral-400">Direct WhatsApp:</strong> <a href={`https://wa.me/${agency.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline font-semibold ml-1">{agency.whatsappNumber}</a></p>
                    <p><strong className="text-neutral-400">Official Email:</strong> <a href={`mailto:${agency.email}`} className="text-[#f95721] hover:underline ml-1">{agency.email}</a></p>
                  </div>
                  <div className="space-y-2">
                    <p><strong className="text-neutral-400">Owner / Legal Rep:</strong> <span className="ml-1 font-semibold">{agency.ownerName} (CIN: {agency.ownerCin})</span></p>
                    <p><strong className="text-neutral-400">Operations Manager:</strong> <span className="ml-1 font-semibold">{agency.managerName}</span></p>
                    <p><strong className="text-neutral-400">Manager Mobile:</strong> <a href={`tel:${agency.managerPhone}`} className="ml-1 text-[#f95721] hover:underline">{agency.managerPhone}</a></p>
                    <p><strong className="text-neutral-400">Business Hours:</strong> <span className="ml-1">{agency.operatingHours}</span></p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {agency.notes && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                  <strong>HQ Admin Internal Note:</strong> {agency.notes}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: LEGAL & ACCREDITATIONS */}
          {activeTab === 'legal' && (
            <div className="space-y-4 animate-fadeIn">
              <div className={`p-5 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Official Moroccan Legal Registrations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="text-neutral-400 block mb-1">Corporate Legal Entity</span>
                    <span className="font-mono font-bold text-sm">{agency.legalName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-1">Identifiant Commun de l'Entreprise (ICE)</span>
                    <span className="font-mono font-bold text-sm text-[#f95721] bg-[#f95721]/10 px-2 py-0.5 rounded inline-block">
                      {agency.ice}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-1">Registre du Commerce (RC)</span>
                    <span className="font-mono font-bold text-sm">{agency.commercialRegisterRc}</span>
                    <span className="text-neutral-400 block text-[11px] mt-0.5">Greffe: {agency.courtTribunal}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-1">Identifiant Fiscal (IF)</span>
                    <span className="font-mono font-bold text-sm">{agency.taxIdIf}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-1">Taxe Professionnelle / Patente</span>
                    <span className="font-mono font-bold text-sm">{agency.patenteNumber}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-1">Affiliation CNSS (Salariés)</span>
                    <span className="font-mono font-bold text-sm">{agency.cnssNumber}</span>
                  </div>
                  <div className="sm:col-span-2 pt-3 border-t border-neutral-200 dark:border-white/10">
                    <span className="text-neutral-400 block mb-1">Agrément Ministère du Tourisme et du Transport</span>
                    <span className="font-mono font-bold text-sm text-emerald-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> {agency.tourismMinistryLicense}
                    </span>
                    <span className="text-neutral-400 block text-[11px] mt-0.5">Autorisation d'exploitation de voitures de location sans chauffeur (Catégorie A / Véhicules de Tourisme).</span>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Headquarters & Branch Addresses</h3>
                <div className="space-y-2 text-xs">
                  <p><strong className="text-neutral-400">Headquarters (Siège Social):</strong> <span className="ml-1">{agency.headquartersAddress}</span></p>
                  <p><strong className="text-neutral-400">Local Agency Desk:</strong> <span className="ml-1">{agency.address}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BANKING & RIB */}
          {activeTab === 'banking' && (
            <div className="space-y-4 animate-fadeIn">
              <div className={`p-6 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-[#f95721]" />
                    <h3 className="text-sm font-bold">Interbank Payout Account (RIB Maroc)</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                    Active & Verified
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2 font-mono">
                    <p className="text-neutral-400 text-[11px]">24-DIGIT RELEVÉ D'IDENTITÉ BANCAIRE (RIB)</p>
                    <p className="text-base font-bold text-amber-400 tracking-wider select-all">{agency.bankAccount.rib}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-neutral-400 block mb-0.5">Bank Institution</span>
                      <span className="font-bold text-sm">{agency.bankAccount.bankName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-0.5">Branch City</span>
                      <span className="font-bold text-sm">{agency.bankAccount.branchCity}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-0.5">Account Beneficiary</span>
                      <span className="font-bold text-sm">{agency.bankAccount.accountHolder}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-0.5">SWIFT / BIC Code</span>
                      <span className="font-mono font-bold text-sm">{agency.bankAccount.swiftBic}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-xl border text-xs text-neutral-400 ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <p><strong>Settlement Protocol:</strong> Payouts are executed weekly every Monday via Bank Al-Maghrib automated interbank clearing system (SRBM/SIMT). Platform take-rate of {agency.commissionRatePct}% is automatically deducted at payout batch creation.</p>
              </div>
            </div>
          )}

          {/* TAB 4: FLEET & SERVICE AREA */}
          {activeTab === 'fleet_stats' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-4 rounded-xl border text-center ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <p className="text-xs text-neutral-400">Economy Cars</p>
                  <p className="text-xl font-bold mt-1">{agency.fleetBreakdown.economy}</p>
                </div>
                <div className={`p-4 rounded-xl border text-center ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <p className="text-xs text-neutral-400">Sedans</p>
                  <p className="text-xl font-bold mt-1">{agency.fleetBreakdown.sedan}</p>
                </div>
                <div className={`p-4 rounded-xl border text-center ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <p className="text-xs text-neutral-400">SUVs & 4x4</p>
                  <p className="text-xl font-bold mt-1">{agency.fleetBreakdown.suv}</p>
                </div>
                <div className={`p-4 rounded-xl border text-center ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <p className="text-xs text-neutral-400">Luxury Fleet</p>
                  <p className="text-xl font-bold mt-1 text-[#f95721]">{agency.fleetBreakdown.luxury}</p>
                </div>
              </div>

              <div className={`p-5 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Authorized Airport & City Delivery Points</h3>
                <ul className="space-y-2 text-xs">
                  {agency.airportDeliveryPoints.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-black/10 dark:bg-white/5">
                      <MapPin className="w-3.5 h-3.5 text-[#f95721]" />
                      <span className="font-semibold">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewFleet(agency.id);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white transition-all shadow-xs cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>View All {agency.fleetCount} Vehicles in Master Fleet</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: STATUTORY DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agency.kycDocuments.map(doc => (
                  <div 
                    key={doc.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#f95721]" />
                          <h4 className="text-xs font-bold">{doc.name}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          doc.status === 'verified' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          doc.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-2">Uploaded on: {doc.uploadedAt}</p>
                      {doc.notes && (
                        <p className="text-[11px] text-amber-400 mt-1 italic">{doc.notes}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-neutral-400">PDF / Verified Archival</span>
                      <button 
                        type="button" 
                        onClick={() => alert(`Viewing document: ${doc.name} (Ref: ${doc.id})`)}
                        className="text-[#f95721] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Inspect Document
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className={`p-4 border-t flex items-center justify-between gap-4 ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
        }`}>
          <div className="flex items-center gap-2">
            {agency.status !== 'verified' && (
              <button
                type="button"
                onClick={() => {
                  onVerifyAgency(agency.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve & Verify Agency</span>
              </button>
            )}

            {agency.status !== 'suspended' ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to suspend agency "${agency.agencyName}"?`)) {
                    onSuspendAgency(agency.id, 'Admin manual sanction');
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Suspend Agency</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onVerifyAgency(agency.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 transition-all cursor-pointer"
              >
                <span>Re-activate Agency</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-white/10 hover:bg-white/5 transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
