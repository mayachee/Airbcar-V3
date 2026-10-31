import React, { useState } from 'react';
import { AdminBooking } from '../../types/admin';
import { 
  X, CheckCircle, Clock, AlertTriangle, ShieldCheck, Car, 
  MapPin, Calendar, CreditCard, FileText, User, ExternalLink, 
  ArrowRight, Smartphone, Globe, Camera, Lock, RefreshCw
} from 'lucide-react';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { AdminContractDocumentViewer } from './AdminContractDocumentViewer';

interface AdminBookingDetailModalProps {
  booking: AdminBooking;
  onClose: () => void;
  onReleaseEscrow: (bookingId: string) => void;
  onFreezeEscrow: (bookingId: string) => void;
  onSelectAgency?: (agencyId: string) => void;
  onSelectClient?: (clientId: string) => void;
}

export const AdminBookingDetailModal: React.FC<AdminBookingDetailModalProps> = ({
  booking,
  onClose,
  onReleaseEscrow,
  onFreezeEscrow,
  onSelectAgency,
  onSelectClient
}) => {
  const { isLight } = useAccountSettings();
  const [activeTab, setActiveTab] = useState<'flow' | 'financial' | 'inspection' | 'contract' | 'telemetry'>('flow');

  const formatMAD = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
        isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#18120d] border-[#2e231c] text-[#f5efe8]'
      }`}>
        
        {/* Header */}
        <div className={`p-6 border-b flex items-start justify-between ${
          isLight ? 'bg-neutral-50/70 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
        }`}>
          <div className="flex items-center gap-4">
            <img 
              src={booking.vehicleImage} 
              alt={booking.vehicleName} 
              className="w-16 h-14 rounded-xl object-cover border border-[#f95721] shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight">Booking #{booking.bookingNumber}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                  booking.status === 'on_trip' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  booking.status === 'completed' ? 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20' :
                  'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                }`}>
                  {booking.status.replace('_', ' ')}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.escrowStatus === 'held' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  booking.escrowStatus === 'released_to_renter' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                }`}>
                  Escrow: {booking.escrowStatus.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
                <span>{booking.vehicleName} ({booking.vehiclePlate})</span>
                <span>•</span>
                <span>Partner: <strong>{booking.agencyName}</strong></span>
                <span>•</span>
                <span>Renter: <strong>{booking.renterName}</strong> {booking.renterFlag}</span>
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
            { id: 'flow', label: 'End-to-End Booking Flow', icon: RefreshCw },
            { id: 'contract', label: 'Documents & Contract (PDF)', icon: FileText, badge: '4 Docs' },
            { id: 'financial', label: 'Financial & Escrow Ledger', icon: CreditCard },
            { id: 'inspection', label: 'Check-In / Out Inspections', icon: Camera },
            { id: 'telemetry', label: 'Device & IP Telemetry', icon: Globe },
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
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-[#f95721]/20 text-[#f95721]' : 'bg-white/10 text-neutral-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: BOOKING FLOW LIFECYCLE */}
          {activeTab === 'flow' && (
            <div className="space-y-6 animate-fadeIn">

              {/* Documentation Quick Access Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isLight ? 'bg-orange-50/70 border-orange-200' : 'bg-[#221610] border-[#382318]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f95721]/15 text-[#f95721] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold flex items-center gap-2">
                      <span>Certified Booking Documentation Dossier</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                        ✓ 4 Certified Documents
                      </span>
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Standard Moroccan Ministry Contract, Government CIN/Passport, Driver's License & Insurance Policy.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('contract')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Contract & Documents</span>
                  </button>
                </div>
              </div>
              
              {/* Stepper Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Step-by-Step Lifecycle Telemetry (8 Phases)
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-white/10">
                  {booking.flowTimeline.map((step) => {
                    const isCompleted = step.status === 'completed';
                    const isInProgress = step.status === 'in_progress';
                    const isDisputed = step.status === 'disputed';

                    return (
                      <div key={step.step} className="relative group">
                        {/* Dot indicator */}
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                          isCompleted ? 'bg-emerald-500 border-emerald-400 text-white' :
                          isInProgress ? 'bg-[#f95721] border-[#f95721] text-white animate-pulse' :
                          isDisputed ? 'bg-rose-500 border-rose-400 text-white' :
                          isLight ? 'bg-neutral-200 border-neutral-300 text-neutral-500' : 'bg-[#201813] border-[#2e231c] text-neutral-500'
                        }`}>
                          {isCompleted ? '✓' : step.step}
                        </div>

                        {/* Step Card */}
                        <div className={`p-4 rounded-xl border ${
                          isInProgress ? 'border-[#f95721]/50 bg-[#f95721]/5' :
                          isDisputed ? 'border-rose-500/50 bg-rose-500/5' :
                          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">{step.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold bg-black/10 dark:bg-white/5 text-neutral-400">
                                Actor: {step.actor.replace('_', ' ')}
                              </span>
                            </div>
                            <span className="text-[11px] text-neutral-400 font-mono">{step.timestamp}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">{step.description}</p>

                          {/* Step 1: Document quick-action for Client KYC */}
                          {step.step === 1 && (
                            <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-white/10 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveTab('contract')}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Inspect Renter ID (CIN / Passport) & Permis</span>
                              </button>
                            </div>
                          )}

                          {/* Step 4: Direct Interactive Button for Contract & Signatures */}
                          {step.step === 4 && (
                            <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-white/10 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveTab('contract')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#f95721] text-white hover:bg-[#e04a17] transition-all cursor-pointer shadow-xs"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>View Official Signed Contract (PDF)</span>
                              </button>
                              <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                                <Lock className="w-3 h-3 text-emerald-500" />
                                SHA-256: {booking.digitalContract.sha256Hash.substring(0, 16)}...
                              </span>
                            </div>
                          )}

                          {/* Step 5: Direct Inspection Handover Button */}
                          {step.step === 5 && (
                            <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-white/10 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveTab('inspection')}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer"
                              >
                                <Camera className="w-3.5 h-3.5 text-[#f95721]" />
                                <span>View Check-In Handover Photos & Mileage</span>
                              </button>
                            </div>
                          )}

                          {/* Step 7: Return Inspection Report */}
                          {step.step === 7 && booking.checkOutInspection && (
                            <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-white/10 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveTab('inspection')}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer"
                              >
                                <Camera className="w-3.5 h-3.5 text-emerald-500" />
                                <span>View Return Inspection Checklist</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trip Logistics Summary */}
              <div className={`p-5 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Delivery & Return Itinerary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-neutral-400 flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Pickup Point & Schedule
                    </span>
                    <p className="font-bold">{booking.pickupLocation}</p>
                    <p className="text-neutral-400">{booking.pickupDate} at {booking.pickupTime}</p>
                    {booking.flightNumber && (
                      <p className="text-emerald-500 font-semibold">Incoming Flight: {booking.flightNumber}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-neutral-400 flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#f95721]" /> Return Point & Schedule
                    </span>
                    <p className="font-bold">{booking.returnLocation}</p>
                    <p className="text-neutral-400">{booking.returnDate} at {booking.returnTime}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FINANCIAL & ESCROW LEDGER */}
          {activeTab === 'financial' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Financial Split Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <span className="text-xs text-neutral-400">Total Rental Volume</span>
                  <p className="text-xl font-bold text-[#f95721] mt-1">{formatMAD(booking.totalAmountMAD)}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Customer Gross Payment</p>
                </div>
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <span className="text-xs text-neutral-400">Escrow Security Deposit</span>
                  <p className="text-xl font-bold text-amber-500 mt-1">{formatMAD(booking.escrowDepositMAD)}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Isolated in Escrow Vault</p>
                </div>
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <span className="text-xs text-neutral-400">Platform Take-Rate (15%)</span>
                  <p className="text-xl font-bold text-blue-500 mt-1">{formatMAD(booking.platformCommissionMAD)}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Airbcar Net Commission</p>
                </div>
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                  <span className="text-xs text-neutral-400">Agency Net Payout</span>
                  <p className="text-xl font-bold text-emerald-500 mt-1">{formatMAD(booking.agencyNetMAD)}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Disbursed via RIB Batch</p>
                </div>
              </div>

              {/* Payment Gateway Details */}
              <div className={`p-5 rounded-xl border space-y-3 ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#f95721]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">CMI Morocco Interbank Authorization</h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                    Captured & Authenticated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Transaction ID:</span>
                    <span className="font-bold">{booking.paymentDetails.gatewayTransactionId}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Approval Auth Code:</span>
                    <span className="font-bold text-emerald-500">{booking.paymentDetails.authCode}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Payment Card:</span>
                    <span className="font-bold">{booking.paymentDetails.cardBrand} (•••• {booking.paymentDetails.cardLast4})</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Escrow Account Ref:</span>
                    <span className="font-bold text-amber-400">{booking.paymentDetails.escrowAccountNumber}</span>
                  </div>
                </div>
              </div>

              {/* Escrow Release Controls */}
              <div className={`p-5 rounded-xl border space-y-3 ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Escrow Security Deposit Controls</h3>
                  <span className="text-xs text-neutral-400">Current state: <strong>{booking.escrowStatus}</strong></span>
                </div>

                <p className="text-xs text-neutral-400">
                  Under Bank Al-Maghrib trust regulations, security deposits are held in an isolated non-operating fiduciary account. Admins can manually release or freeze the deposit:
                </p>

                <div className="flex items-center gap-3 pt-1">
                  {booking.escrowStatus !== 'released_to_renter' && (
                    <button
                      type="button"
                      onClick={() => onReleaseEscrow(booking.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Release Full Deposit ({formatMAD(booking.escrowDepositMAD)}) to Renter</span>
                    </button>
                  )}

                  {booking.escrowStatus !== 'disputed_freeze' && (
                    <button
                      type="button"
                      onClick={() => onFreezeEscrow(booking.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 border border-rose-500/20 transition-all cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Freeze Deposit in Escrow (Open Dispute)</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: INSPECTIONS */}
          {activeTab === 'inspection' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Check-In */}
              <div className={`p-5 rounded-xl border space-y-4 ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Check-In Handover Inspection
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">{booking.checkInInspection.completedAt}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400">Inspecting Agent:</span>
                    <p className="font-bold">{booking.checkInInspection.agentName}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Initial Mileage:</span>
                    <p className="font-bold font-mono">{booking.checkInInspection.initialMileageKm.toLocaleString()} km</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Initial Fuel:</span>
                    <p className="font-bold text-emerald-500">{booking.checkInInspection.initialFuelLevel}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Walkaround Photos:</span>
                    <p className="font-bold">{booking.checkInInspection.photos.length} Captured</p>
                  </div>
                </div>

                {booking.checkInInspection.notes && (
                  <p className="text-xs p-3 rounded-lg bg-black/10 dark:bg-white/5 text-neutral-300">
                    <strong>Handover notes:</strong> {booking.checkInInspection.notes}
                  </p>
                )}

                {/* Photos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {booking.checkInInspection.photos.map((p, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden border border-neutral-200 dark:border-white/10">
                      <img src={p.url} alt={p.angle} className="w-full h-28 object-cover" />
                      <p className="p-2 text-[10px] text-neutral-400 truncate">{p.angle}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Check-Out */}
              <div className={`p-5 rounded-xl border space-y-4 ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#f95721] flex items-center gap-1.5">
                    <Car className="w-4 h-4" /> Check-Out Return Inspection
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    {booking.checkOutInspection ? booking.checkOutInspection.completedAt : 'Trip Ongoing (Not Yet Returned)'}
                  </span>
                </div>

                {booking.checkOutInspection ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-neutral-400">Return Agent:</span>
                        <p className="font-bold">{booking.checkOutInspection.agentName}</p>
                      </div>
                      <div>
                        <span className="text-neutral-400">Return Mileage:</span>
                        <p className="font-bold font-mono">{booking.checkOutInspection.returnMileageKm?.toLocaleString()} km</p>
                      </div>
                      <div>
                        <span className="text-neutral-400">Return Fuel:</span>
                        <p className="font-bold text-emerald-500">{booking.checkOutInspection.returnFuelLevel}</p>
                      </div>
                      <div>
                        <span className="text-neutral-400">Condition Verdict:</span>
                        <p className={`font-bold ${booking.checkOutInspection.conditionVerdict === 'clean_perfect' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {booking.checkOutInspection.conditionVerdict?.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {booking.checkOutInspection.notes && (
                      <p className="text-xs p-3 rounded-lg bg-black/10 dark:bg-white/5 text-neutral-300">
                        <strong>Return notes:</strong> {booking.checkOutInspection.notes}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-neutral-400 italic">
                    Vehicle is currently on road. Inspection checklist will automatically generate once the return handover is completed by {booking.agencyName}.
                  </p>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: DIGITAL CONTRACT & ATTACHED DOCUMENTS */}
          {activeTab === 'contract' && (
            <div className="animate-fadeIn">
              <AdminContractDocumentViewer booking={booking} />
            </div>
          )}

          {/* TAB 5: TELEMETRY & DEVICE */}
          {activeTab === 'telemetry' && (
            <div className="space-y-4 animate-fadeIn">
              <div className={`p-5 rounded-xl border space-y-3 ${isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Client Device & IP Metadata</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-400 block">Reservation Channel:</span>
                    <span className="font-bold uppercase text-[#f95721]">{booking.deviceInfo.channel.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Origin IP Address & ISP:</span>
                    <span className="font-mono font-bold">{booking.deviceInfo.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">User-Agent / Device Signature:</span>
                    <span className="font-mono text-neutral-300 break-all">{booking.deviceInfo.userAgent}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Geo-Location:</span>
                    <span className="font-semibold">{booking.deviceInfo.geoCity}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between gap-4 ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
        }`}>
          <div className="flex items-center gap-2">
            {onSelectAgency && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectAgency(booking.agencyId);
                }}
                className="text-xs text-[#f95721] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Agency ({booking.agencyName})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-white/10 hover:bg-white/5 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
