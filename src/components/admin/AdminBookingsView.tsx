import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Car, 
  Building2, 
  User, 
  Calendar, 
  DollarSign,
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { AdminBooking } from '../../types/admin';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { AdminBookingDetailModal } from './AdminBookingDetailModal';

interface AdminBookingsViewProps {
  bookings: AdminBooking[];
  onReleaseEscrow: (bookingId: string) => void;
  onFreezeEscrow: (bookingId: string) => void;
  onOpenContractPdf?: (bookingId: string) => void;
  onSelectAgency?: (agencyId: string) => void;
  onSelectClient?: (clientId: string) => void;
}

export const AdminBookingsView: React.FC<AdminBookingsViewProps> = ({
  bookings,
  onReleaseEscrow,
  onFreezeEscrow,
  onOpenContractPdf,
  onSelectAgency,
  onSelectClient,
}) => {
  const { isLight, formatPrice } = useAccountSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'on_trip' | 'completed' | 'disputed'>('all');
  const [escrowFilter, setEscrowFilter] = useState<'all' | 'held' | 'released_to_renter' | 'disputed_freeze'>('all');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<AdminBooking | null>(null);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.renterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesEscrow = escrowFilter === 'all' || b.escrowStatus === escrowFilter;

    return matchesSearch && matchesStatus && matchesEscrow;
  });

  const totalEscrowHeld = bookings
    .filter(b => b.escrowStatus === 'held' || b.escrowStatus === 'disputed_freeze')
    .reduce((sum, b) => sum + b.escrowDepositMAD, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">
            Escrow & Transactions
          </span>
          <h1 className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            Platform Bookings & Escrow Supervisor
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
            Monitoring rental agreements, customer deposits in escrow, and platform commission splits.
          </p>
        </div>

        {/* Escrow summary badge */}
        <div className={`p-3 px-4 rounded-2xl border flex items-center gap-3 ${
          isLight ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-blue-950/20 border-blue-900/40 text-blue-200'
        }`}>
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <div className="text-left">
            <span className="text-[10px] opacity-80 block uppercase font-bold">Secured In Escrow</span>
            <span className="font-mono font-bold text-base">{formatPrice(totalEscrowHeld)}</span>
          </div>
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
            placeholder="Search booking # (e.g. AC-2418), renter, agency, car..."
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

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {(['all', 'confirmed', 'on_trip', 'completed', 'disputed'] as const).map((st) => (
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
              {st === 'all' ? 'All Bookings' : st === 'confirmed' ? 'Confirmed' : st === 'on_trip' ? 'On Trip' : st === 'completed' ? 'Completed' : 'Disputed'}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((b) => {
          const isDisputed = b.status === 'disputed' || b.escrowStatus === 'disputed_freeze';
          const isHeld = b.escrowStatus === 'held';

          return (
            <div
              key={b.id}
              className={`p-5 rounded-3xl border transition-all ${
                isDisputed 
                  ? isLight ? 'bg-rose-50/50 border-rose-300' : 'bg-rose-950/20 border-rose-800/40'
                  : isLight ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#1a130f] border-[#2c2018]'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Left: Booking & Renter info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-bold text-sm text-[#f95721]">
                      {b.bookingNumber}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'on_trip' ? 'bg-blue-500/15 text-blue-500 border border-blue-500/30' :
                      b.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30' :
                      b.status === 'completed' ? 'bg-neutral-500/15 text-neutral-400 border border-neutral-500/30' :
                      'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    }`}>
                      {b.status.replace('_', ' ')}
                    </span>

                    {/* Escrow status tag */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      b.escrowStatus === 'held' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                      b.escrowStatus === 'released_to_renter' ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30' :
                      'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      <span>Deposit: {b.escrowStatus.replace(/_/g, ' ')}</span>
                    </span>
                  </div>

                  {/* Vehicle & dates */}
                  <div className="flex items-center gap-3 text-xs flex-wrap">
                    <span className="font-bold">{b.vehicleName}</span>
                    <span className="font-mono text-[#8d7e73] bg-neutral-500/15 px-1.5 py-0.5 rounded text-[11px]">{b.vehiclePlate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#8d7e73]">
                      <Calendar className="w-3 h-3" />
                      {b.pickupDate} → {b.returnDate}
                    </span>
                    <span>•</span>
                    <span className="text-[#8d7e73]">{b.city}</span>
                  </div>

                  {/* Renter & Agency names */}
                  <div className="flex items-center gap-4 text-xs text-[#8d7e73] flex-wrap pt-1">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#f95721]" />
                      <span>Renter: <strong className={isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}>{b.renterName}</strong> ({b.renterCountry})</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-blue-400" />
                      <span>Agency: <strong className={isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}>{b.agencyName}</strong></span>
                    </span>
                  </div>
                </div>

                {/* Center: Financial Split (GMV, Escrow, 15% Platform Commission, Net) */}
                <div className={`p-3 rounded-2xl border grid grid-cols-4 gap-3 text-center text-xs min-w-[320px] ${
                  isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#31241a]'
                }`}>
                  <div>
                    <span className="text-[10px] text-[#8d7e73] block">Gross Total</span>
                    <span className="font-mono font-bold text-xs">{formatPrice(b.totalAmountMAD)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-400 block font-semibold">Deposit Escrow</span>
                    <span className="font-mono font-bold text-xs text-blue-400">{formatPrice(b.escrowDepositMAD)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#f95721] block font-semibold">Fee (15%)</span>
                    <span className="font-mono font-bold text-xs text-[#f95721]">{formatPrice(b.platformCommissionMAD)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-500 block font-semibold">Agency Net</span>
                    <span className="font-mono font-bold text-xs text-emerald-500">{formatPrice(b.agencyNetMAD)}</span>
                  </div>
                </div>

                {/* Right: Escrow Controls & Flow Inspector */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full lg:w-auto justify-end">
                  
                  {/* Inspect Booking Flow & Contract Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForDetails(b)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                    title="View booking flow, official rental contract, identity papers, and inspections"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Flow & Contract</span>
                  </button>

                  {isHeld && (
                    <button
                      type="button"
                      onClick={() => onReleaseEscrow(b.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-colors"
                      title="Release deposit back to renter upon return verification"
                    >
                      Release Deposit
                    </button>
                  )}

                  {!isDisputed ? (
                    <button
                      type="button"
                      onClick={() => onFreezeEscrow(b.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Hold deposit in escrow due to dispute or claim"
                    >
                      Freeze Deposit
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-rose-500 px-2">Dispute Active</span>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Booking Flow & Telemetry Modal */}
      {selectedBookingForDetails && (
        <AdminBookingDetailModal
          booking={selectedBookingForDetails}
          onClose={() => setSelectedBookingForDetails(null)}
          onReleaseEscrow={onReleaseEscrow}
          onFreezeEscrow={onFreezeEscrow}
          onSelectAgency={onSelectAgency}
          onSelectClient={onSelectClient}
        />
      )}

    </div>
  );
};
