import React, { useState } from 'react';
import { 
  Search, 
  FileSignature, 
  ExternalLink, 
  Plus,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { PartnerBooking } from '../../types/partner';
import { PartnerBookingDetailsModal } from './PartnerBookingDetailsModal';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface PartnerBookingsViewProps {
  bookings: PartnerBooking[];
  onSendContract: (bookingId: string) => void;
  onOpenContractPdf: (contractId?: string) => void;
  onOpenManualBooking: () => void;
  onOpenChatWithRenter?: (renterId: string) => void;
}

export const PartnerBookingsView: React.FC<PartnerBookingsViewProps> = ({
  bookings: initialBookings,
  onSendContract,
  onOpenContractPdf,
  onOpenManualBooking,
  onOpenChatWithRenter,
}) => {
  const { isLight, formatPrice, t } = useAccountSettings();

  const [bookings, setBookings] = useState<PartnerBooking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sentContracts, setSentContracts] = useState<Record<string, boolean>>({});
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<PartnerBooking | null>(null);

  // Sync with prop if initialBookings updates (e.g. from manual booking)
  React.useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.renter.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSendContractClick = (bookingId: string) => {
    setSentContracts(prev => ({ ...prev, [bookingId]: true }));
    onSendContract(bookingId);
  };

  return (
    <div className={`p-6 lg:p-9 space-y-7 min-h-screen transition-colors duration-200 ${
      isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-serif-display text-2xl font-bold tracking-tight ${
            isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
          }`}>
            {t('bookings', 'Bookings & Reservations')}
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${
            isLight ? 'text-neutral-500' : 'text-[#9c8e82]'
          }`}>
            DRF Endpoints: <code className="text-[#f95721] text-[10px]">/api/agency/bookings/</code> and <code className="text-[#f95721] text-[10px]">/api/agency/bookings/&lt;id&gt;/send-contract/</code>
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenManualBooking}
          className="px-5 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04a17] text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('manualBooking', 'New Manual Booking')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
        isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
      }`}>
        <div className="relative w-full md:w-80">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
            isLight ? 'text-neutral-400' : 'text-[#8d7e73]'
          }`} />
          <input
            type="text"
            placeholder="Search by renter, vehicle, or #AC-..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full text-xs pl-9 pr-4 py-2 rounded-xl border focus:outline-none focus:border-[#f95721] ${
              isLight 
                ? 'bg-neutral-50 text-neutral-900 border-neutral-200 placeholder-neutral-400' 
                : 'bg-[#241b15] text-[#f5efe8] border-[#382b21] placeholder-[#7d6e63]'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          {['all', 'pending', 'confirmed', 'completed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === status
                  ? 'bg-[#f95721] text-white shadow-xs'
                  : isLight
                  ? 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
                  : 'text-[#8d7e73] hover:text-white bg-[#241b15]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table / Card List */}
      <div className={`rounded-3xl border overflow-hidden shadow-xs transition-colors ${
        isLight ? 'bg-white border-neutral-200' : 'bg-[#1a130f] border-[#2b2018]'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`text-[10px] uppercase font-bold tracking-wider border-b ${
              isLight 
                ? 'bg-neutral-50 text-neutral-500 border-neutral-200' 
                : 'bg-[#201813] text-[#8d7e73] border-[#281e18]'
            }`}>
              <tr>
                <th className="px-6 py-3.5">Booking / Vehicle</th>
                <th className="px-6 py-3.5">Renter Details</th>
                <th className="px-6 py-3.5">Dates & Pickup</th>
                <th className="px-6 py-3.5">Financials</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-neutral-100' : 'divide-[#261d16]'}`}>
              {filteredBookings.map((booking) => {
                const isContractSent = booking.contractSent || sentContracts[booking.id];
                return (
                  <tr key={booking.id} className={`transition-colors ${
                    isLight ? 'hover:bg-neutral-50/80 text-neutral-800' : 'hover:bg-[#201813] text-[#a89b90]'
                  }`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-10 rounded-xl overflow-hidden shrink-0 border ${
                          isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#241b15] border-white/10'
                        }`}>
                          <img src={booking.vehicle.image} alt={booking.vehicle.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className={`font-bold block ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                            {booking.vehicle.name}
                          </span>
                          <span className="text-[10px] text-[#f95721] font-mono">{booking.bookingNumber}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                        {booking.renter.fullName}
                      </div>
                      <div className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                        {booking.renter.country} • {booking.renter.phone}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-500 mt-0.5">
                        <ShieldCheck className="w-3 h-3" /> Licence Verified
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                        {booking.pickupDate} ({booking.pickupTime})
                      </div>
                      <div className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                        until {booking.returnDate}
                      </div>
                      <div className="text-[10px] text-[#f95721] mt-0.5">{booking.deliveryLocation}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className={`font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                        {formatPrice(booking.totalMAD)}
                      </div>
                      <div className={`text-[10px] ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                        Deposit: {formatPrice(booking.depositMAD)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : booking.status === 'pending'
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* VIEW ACTION BUTTON */}
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForDetails(booking)}
                          className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            isLight
                              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200 hover:border-[#f95721]'
                              : 'bg-[#241b15] hover:bg-[#2e231b] text-[#f5efe8] border-[#382b21] hover:border-[#f95721]'
                          }`}
                          title="View Booking Details & Documents"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>View</span>
                        </button>

                        {booking.contractSigned ? (
                          <button
                            type="button"
                            onClick={() => onOpenContractPdf(booking.bookingNumber)}
                            className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                              isLight
                                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                                : 'bg-[#241b15] hover:bg-[#2e231b] text-[#f5efe8] border-[#382b21]'
                            }`}
                          >
                            <span>Agreement</span>
                            <ExternalLink className="w-3 h-3 text-[#f95721]" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendContractClick(booking.id)}
                            disabled={isContractSent}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              isContractSent 
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' 
                                : 'bg-[#f95721] hover:bg-[#e04a17] text-white shadow-xs'
                            }`}
                          >
                            <FileSignature className="w-3 h-3" />
                            <span>{isContractSent ? 'Contract Sent' : 'Send Contract'}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal with 4 Tabs: Overview, Timeline, Details, Customer Documents */}
      <PartnerBookingDetailsModal
        booking={selectedBookingForDetails}
        isOpen={!!selectedBookingForDetails}
        onClose={() => setSelectedBookingForDetails(null)}
        onSendContract={handleSendContractClick}
        onOpenContractPdf={onOpenContractPdf}
        onOpenChatWithRenter={onOpenChatWithRenter}
      />
    </div>
  );
};
