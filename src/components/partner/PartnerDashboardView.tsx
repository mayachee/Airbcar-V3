import React from 'react';
import { 
  Car, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  FileSignature, 
  Plus
} from 'lucide-react';
import { PartnerProfile, PartnerBooking, PartnerVehicle } from '../../types/partner';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface PartnerDashboardViewProps {
  partnerProfile: PartnerProfile;
  bookings: PartnerBooking[];
  vehicles: PartnerVehicle[];
  onNavigateTab: (tab: any) => void;
  onSendContract: (bookingId: string) => void;
  onOpenManualBooking: () => void;
  onOpenContractPdf: (contractId?: string) => void;
}

export const PartnerDashboardView: React.FC<PartnerDashboardViewProps> = ({
  partnerProfile,
  bookings,
  vehicles,
  onNavigateTab,
  onSendContract,
  onOpenManualBooking,
  onOpenContractPdf,
}) => {
  const { isLight, formatPrice, t } = useAccountSettings();

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'on_trip');
  const availableVehicles = vehicles.filter(v => v.status === 'available');

  return (
    <div className={`p-6 lg:p-9 space-y-8 min-h-screen transition-colors duration-200 ${
      isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'
    }`}>
      
      {/* Top Banner: Welcome & Quick Action */}
      <div className={`rounded-3xl p-6 sm:p-8 border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs transition-colors ${
        isLight 
          ? 'bg-white border-neutral-200 text-[#181311]' 
          : 'bg-[#1e1612] border-[#2e231c] text-[#f5efe8]'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f95721] bg-[#f95721]/15 px-3 py-1 rounded-full border border-[#f95721]/30">
              Agency Active • {partnerProfile.city}
            </span>
            <span className={`text-xs font-medium ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              Licence: {partnerProfile.licenseNumber}
            </span>
          </div>
          <h2 className={`font-serif-display text-2xl sm:text-3xl font-bold mt-2 tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {t('welcomeBack', 'Welcome back')}, {partnerProfile.ownerName}
          </h2>
          <p className={`text-xs sm:text-sm mt-1 max-w-xl ${
            isLight ? 'text-neutral-600' : 'text-[#9c8e82]'
          }`}>
            You have {pendingBookings.length} booking request awaiting approval and 1 delivery scheduled today at Al Massira Airport.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenManualBooking}
            className="px-5 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04a17] text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('manualBooking', 'Manual Booking')}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('messages')}
            className={`px-5 py-2.5 rounded-full border font-semibold text-xs transition-all active:scale-95 cursor-pointer ${
              isLight
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                : 'bg-[#261d16] hover:bg-[#32261d] text-[#f5efe8] border-[#382b21]'
            }`}
          >
            {t('messages', 'Go to Inbox')} (3)
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* KPI 1 */}
        <div className={`rounded-2xl p-5 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#281e18]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              {t('monthlyNetPayout', 'Monthly Net Payout')}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[#f95721] ${
              isLight ? 'bg-neutral-100' : 'bg-[#281e18]'
            }`}>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-bold mt-2 tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {formatPrice(41012.5)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-500 font-medium">
            <span>+14.2% vs last month</span>
            <span className={isLight ? 'text-neutral-400' : 'text-[#8d7e73]'}>• Payout 31 Aug</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`rounded-2xl p-5 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#281e18]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              {t('activeFleetOnTrip', 'Active Fleet on Trip')}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[#f95721] ${
              isLight ? 'bg-neutral-100' : 'bg-[#281e18]'
            }`}>
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-bold mt-2 tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {activeBookings.length + 3} / {vehicles.length}
          </div>
          <div className={`text-[11px] mt-2 font-medium ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
            {availableVehicles.length} vehicles available in Agadir
          </div>
        </div>

        {/* KPI 3 */}
        <div className={`rounded-2xl p-5 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#281e18]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              {t('pendingRequests', 'Pending Requests')}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-amber-500 ${
              isLight ? 'bg-neutral-100' : 'bg-[#281e18]'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-bold mt-2 tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {pendingBookings.length}
          </div>
          <div className="text-[11px] text-amber-500 mt-2 font-medium">
            Requires agency confirmation
          </div>
        </div>

        {/* KPI 4 */}
        <div className={`rounded-2xl p-5 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#281e18]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
              Response SLA
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[#f95721] ${
              isLight ? 'bg-neutral-100' : 'bg-[#281e18]'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#f95721] mt-2 tracking-tight">
            {partnerProfile.replySpeedMinutes} min
          </div>
          <div className={`text-[11px] mt-2 font-medium ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
            {partnerProfile.replySpeedRank}
          </div>
        </div>

      </div>

      {/* Two Column Section: Pending Approvals & Scheduled Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Pending Bookings needing Action (7 cols) */}
        <div className={`lg:col-span-7 rounded-3xl p-6 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#281e18]'
        }`}>
          <div className={`flex items-center justify-between pb-4 border-b ${
            isLight ? 'border-neutral-100' : 'border-[#261d16]'
          }`}>
            <div>
              <h3 className={`font-serif-display text-lg font-bold ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                Pending Booking Requests
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                Direct DRF endpoint: <code className="text-[#f95721] text-[10px]">/bookings/pending-requests/</code>
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('bookings')}
              className="text-xs text-[#f95721] hover:underline font-semibold cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {pendingBookings.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#8d7e73]">
                No pending requests. All bookings confirmed!
              </div>
            ) : pendingBookings.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isLight 
                    ? 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100/80' 
                    : 'bg-[#221813] border-[#34261e] hover:bg-[#281d17]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#f95721] font-mono">
                      #{b.bookingReference}
                    </span>
                    <span className={`text-xs font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                      {b.renterName} ({b.renterCountry})
                    </span>
                  </div>
                  <div className={`text-xs mt-1 ${isLight ? 'text-neutral-600' : 'text-[#a89b90]'}`}>
                    {b.vehicleName} • {b.startDate} to {b.endDate}
                  </div>
                  <div className="text-xs font-bold text-[#f95721] mt-1">
                    {formatPrice(b.totalMAD)} • Deposit: {formatPrice(b.depositMAD)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSendContract(b.id)}
                    className="px-3.5 py-1.5 rounded-full bg-[#f95721] hover:bg-[#e04a17] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    <span>Send Contract</span>
                  </button>
                  <button
                    type="button"
                    className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                      isLight 
                        ? 'bg-neutral-100 hover:bg-red-50 text-red-500 border-red-200' 
                        : 'bg-[#241b15] hover:bg-red-950/40 text-red-400 border-red-900/30'
                    }`}
                    title="Reject Booking"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Today's Airport Deliveries & Returns (5 cols) */}
        <div className={`lg:col-span-5 rounded-3xl p-6 border shadow-xs transition-colors ${
          isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#281e18]'
        }`}>
          <div className={`flex items-center justify-between pb-4 border-b ${
            isLight ? 'border-neutral-100' : 'border-[#261d16]'
          }`}>
            <div>
              <h3 className={`font-serif-display text-lg font-bold ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                Today's Operations
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                Agadir Al Massira Airport arrivals
              </p>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
              1 Scheduled
            </span>
          </div>

          <div className={`mt-4 p-4 rounded-2xl border space-y-3 transition-colors ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#221813] border-[#34261e]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#f95721]">PICKUP • 10:00 AM</span>
              <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Contract Signed
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80" alt="VW Golf" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className={`text-xs font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                  Camille Dubois (France)
                </h4>
                <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-[#9c8e82]'}`}>
                  VW Golf • Plate 4218-A-6
                </p>
                <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-[#9c8e82]'}`}>
                  Location: Terminal 1 Arrivals
                </p>
              </div>
            </div>

            <div className={`flex items-center justify-between pt-2 border-t text-xs ${
              isLight ? 'border-neutral-200' : 'border-[#2e221b]'
            }`}>
              <button
                type="button"
                onClick={() => onOpenContractPdf('AC-2418')}
                className="text-[#f95721] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View signed agreement</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('messages')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isLight
                    ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900'
                    : 'bg-[#2a2019] hover:bg-[#34271e] text-[#f5efe8]'
                }`}
              >
                Message Camille
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
