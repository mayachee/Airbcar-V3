import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Car, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  MapPin, 
  FileText,
  Users,
  ChevronRight
} from 'lucide-react';
import { 
  AdminAgency, 
  AdminVehicle, 
  AdminBooking, 
  AdminDispute, 
  AdminTab 
} from '../../types/admin';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';

interface AdminOverviewViewProps {
  agencies: AdminAgency[];
  vehicles: AdminVehicle[];
  bookings: AdminBooking[];
  disputes: AdminDispute[];
  contracts?: any[];
  onNavigateTab: (tab: AdminTab) => void;
  onSelectAgencyForKYC: (agency: AdminAgency) => void;
  onSelectDispute: (dispute: AdminDispute) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  agencies,
  vehicles,
  bookings,
  disputes,
  contracts = [],
  onNavigateTab,
  onSelectAgencyForKYC,
  onSelectDispute,
}) => {
  const { isLight, formatPrice } = useAccountSettings();

  // Calculations
  const totalVolumeMAD = bookings.reduce((sum, b) => sum + b.totalAmountMAD, 0) + 1485000;
  const platformCommissionMAD = totalVolumeMAD * 0.15;
  const activeRentalsCount = vehicles.filter(v => v.status === 'on_trip').length;
  const totalFleetCount = vehicles.length + 42; // total registered across network
  const pendingAgencies = agencies.filter(a => a.status === 'pending' || a.status === 'under_review');
  const openDisputes = disputes.filter(d => d.status === 'open' || d.status === 'under_investigation');
  const totalEscrowHeldMAD = bookings.reduce((sum, b) => (b.escrowStatus === 'held' || b.escrowStatus === 'disputed_freeze') ? sum + b.escrowDepositMAD : sum, 0) + 142000;

  // City volume distribution
  const cityStats = [
    { city: 'Marrakech', share: 38, gmvMAD: 564300, agenciesCount: 14, growth: '+18.4%' },
    { city: 'Casablanca', share: 26, gmvMAD: 386100, agenciesCount: 12, growth: '+12.1%' },
    { city: 'Agadir', share: 18, gmvMAD: 267300, agenciesCount: 9, growth: '+24.5%' },
    { city: 'Tangier', share: 12, gmvMAD: 178200, agenciesCount: 8, growth: '+9.8%' },
    { city: 'Rabat', share: 6, gmvMAD: 89100, agenciesCount: 6, growth: '+7.2%' }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">
            Executive Command & Oversight
          </span>
          <h1 className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            Platform Operations Dashboard
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#8d7e73]'}`}>
            Live overview of Moroccan rental agencies, escrow deposits, active fleet, and legal compliance.
          </p>
        </div>

        {/* Quick batch export & analytics shortcut */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab('analytics')}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              isLight 
                ? 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 shadow-xs' 
                : 'bg-[#1e1510] border-[#38261b] text-[#f5efe8] hover:bg-[#281c15]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#f95721]" />
            <span>Full Analytics Hub</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('payouts')}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Process Weekly Payouts</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Gross Platform GMV */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              Gross Merchandise Value (GMV)
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-bold mt-2 font-mono ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
            {formatPrice(totalVolumeMAD)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-500 font-semibold">
            <span>+16.8%</span>
            <span className={`text-[10px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>vs previous 30 days</span>
          </div>
        </div>

        {/* Card 2: Net Platform Revenue (15% take rate) */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              Platform Net Commission (15%)
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#f95721]/15 text-[#f95721] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-bold mt-2 font-mono ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
            {formatPrice(platformCommissionMAD)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-[#f95721] font-semibold">
            <span>Standard Tier (13–15%)</span>
          </div>
        </div>

        {/* Card 3: Escrow Held Balance */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              Escrow Deposits Secured
            </span>
            <div className="w-7 h-7 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-bold mt-2 font-mono ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
            {formatPrice(totalEscrowHeldMAD)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-blue-400 font-semibold">
            <span>Bank Al-Maghrib Compliant</span>
          </div>
        </div>

        {/* Card 4: Active Agencies & Fleet */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              Verified Agencies & Fleet
            </span>
            <div className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-bold mt-2 ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
            {agencies.filter(a => a.status === 'verified').length} <span className="text-sm font-normal opacity-70">agencies</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8d7e73]">
            <span>{totalFleetCount} total cars</span>
            <span>•</span>
            <span className="text-emerald-500 font-semibold">{activeRentalsCount} on trip now</span>
          </div>
        </div>
      </div>

      {/* Urgent Action Queue (Pending KYC & Open Disputes) */}
      {(pendingAgencies.length > 0 || openDisputes.length > 0) && (
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isLight ? 'bg-amber-50/70 border-amber-200/80 text-neutral-900' : 'bg-amber-950/20 border-amber-900/40 text-[#f5efe8]'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="font-serif-display text-base sm:text-lg font-bold">
                Urgent Action Queue ({pendingAgencies.length + openDisputes.length} Items Requiring Headquarters Decision)
              </h2>
            </div>
            <span className="text-[11px] text-amber-600 font-medium">
              Immediate attention protects renter safety and agency payouts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Pending Agency KYC */}
            {pendingAgencies.map((agency) => (
              <div 
                key={agency.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  isLight ? 'bg-white border-amber-200' : 'bg-[#1e1612] border-[#36271e]'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30">
                      KYC Review
                    </span>
                    <h3 className="font-bold text-xs truncate">{agency.agencyName}</h3>
                  </div>
                  <p className="text-[11px] text-[#8d7e73] truncate">
                    {agency.ownerName} • {agency.city} • {agency.fleetCount} vehicles
                  </p>
                  <p className="text-[10px] text-[#8d7e73]">
                    Uploaded: RC & Patente • Pending validation
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('agencies');
                    onSelectAgencyForKYC(agency);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Review KYC</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Open Dispute */}
            {openDisputes.map((dispute) => (
              <div 
                key={dispute.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  isLight ? 'bg-white border-rose-200' : 'bg-[#1e1612] border-[#36271e]'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-500/15 text-rose-500 border border-rose-500/30">
                      Dispute {dispute.disputeNumber}
                    </span>
                    <span className="font-mono font-bold text-xs text-rose-500">
                      {formatPrice(dispute.amountInDisputeMAD)}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs truncate">
                    {dispute.renterName} vs {dispute.agencyName}
                  </h3>
                  <p className="text-[10px] text-[#8d7e73] truncate">
                    {dispute.vehicleName} • Scratch deposit deduction claim
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('disputes');
                    onSelectDispute(dispute);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Arbitrate</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Interactive Telemetry & Recharts Visualizations Dashboard */}
      <AdminAnalyticsDashboard
        bookings={bookings}
        contracts={contracts}
        onNavigateTab={onNavigateTab}
      />

      {/* Main Two-Column Layout: City Breakdown & Live Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Moroccan City Breakdown & Volume */}
        <div className={`lg:col-span-2 p-5 rounded-3xl border space-y-4 ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`font-serif-display text-base sm:text-lg font-bold ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                Morocco City Hubs & Rental Volume
              </h2>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                Real-time booking volume and agency coverage by destination
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="text-xs text-[#f95721] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Cities</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {cityStats.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#f95721]" />
                    <span className={`font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                      {item.city}
                    </span>
                    <span className="text-[10px] text-[#8d7e73]">
                      ({item.agenciesCount} verified agencies)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold">{formatPrice(item.gmvMAD)}</span>
                    <span className="text-[11px] text-emerald-500 font-semibold">{item.growth}</span>
                    <span className="text-xs font-bold text-[#8d7e73] w-9 text-right">{item.share}%</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  isLight ? 'bg-neutral-100' : 'bg-[#261d16]'
                }`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#f95721] to-[#e04a17]"
                    style={{ width: `${item.share * 2.2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats bar */}
          <div className={`p-4 rounded-2xl border flex items-center justify-around text-center text-xs ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#322319]'
          }`}>
            <div>
              <span className={`block text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                Avg. Trip Duration
              </span>
              <span className="font-bold text-sm">6.2 Days</span>
            </div>
            <div className="w-px h-8 bg-neutral-500/20" />
            <div>
              <span className={`block text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                Avg. Daily Rate
              </span>
              <span className="font-bold text-sm">540 MAD</span>
            </div>
            <div className="w-px h-8 bg-neutral-500/20" />
            <div>
              <span className={`block text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                Repeat Renter Rate
              </span>
              <span className="font-bold text-sm text-emerald-500">41.8%</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Realtime Bookings & Escrow Monitor */}
        <div className={`p-5 rounded-3xl border space-y-4 ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2c2018]'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`font-serif-display text-base sm:text-lg font-bold ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                Live Bookings & Escrow
              </h2>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                Recent platform transactions
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('bookings')}
              className="text-xs text-[#f95721] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div 
                key={b.id}
                className={`p-3 rounded-2xl border text-xs space-y-1.5 transition-colors ${
                  isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#201813] border-[#2f221a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[11px] text-[#f95721]">
                      {b.bookingNumber}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      b.status === 'on_trip' ? 'bg-emerald-500/15 text-emerald-500' :
                      b.status === 'disputed' ? 'bg-rose-500/15 text-rose-500' :
                      b.status === 'completed' ? 'bg-blue-500/15 text-blue-500' : 'bg-neutral-500/15 text-neutral-400'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-mono font-bold">
                    {formatPrice(b.totalAmountMAD)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold truncate">{b.vehicleName}</span>
                  <span className="text-[#8d7e73]">{b.city}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#8d7e73] pt-1 border-t border-neutral-500/15">
                  <span>Agency: {b.agencyName}</span>
                  <span className="flex items-center gap-1 text-blue-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Escrow: {formatPrice(b.escrowDepositMAD)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-3 rounded-2xl border text-center ${
            isLight ? 'bg-rose-50/50 border-rose-200 text-neutral-800' : 'bg-[#241712] border-[#382318] text-[#f5efe8]'
          }`}>
            <span className="text-[11px] block font-bold text-rose-500">Weekly Settlement Scheduled</span>
            <p className="text-[10px] text-[#8d7e73] mt-0.5">
              Next batch includes 6 agencies with 318,400 MAD net disbursements.
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('payouts')}
              className="mt-2 text-xs text-[#f95721] font-bold hover:underline cursor-pointer"
            >
              Open Payouts Console →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
