import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  FileSignature, 
  Eye, 
  Download, 
  ShieldCheck, 
  DollarSign, 
  CreditCard, 
  MessageSquare, 
  MapPin, 
  Car, 
  User, 
  ExternalLink, 
  Check, 
  ZoomIn,
  Sparkles,
  Phone,
  Mail,
  RotateCw
} from 'lucide-react';
import { PartnerBooking } from '../../types/partner';
import { DriverLicenseVisualCard } from '../common/DriverLicenseVisualCard';

interface PartnerBookingDetailsModalProps {
  booking: PartnerBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onSendContract: (bookingId: string) => void;
  onOpenContractPdf: (contractId?: string) => void;
  onOpenChatWithRenter?: (renterId: string) => void;
}

type ModalTab = 'overview' | 'timeline' | 'details' | 'documents';

export const PartnerBookingDetailsModal: React.FC<PartnerBookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSendContract,
  onOpenContractPdf,
  onOpenChatWithRenter,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [docSubTab, setDocSubTab] = useState<'documents' | 'personal_info'>('documents');
  const [contractSent, setContractSent] = useState(booking?.contractSent || false);
  const [contractSigned, setContractSigned] = useState(booking?.contractSigned || false);
  const [paymentStatus, setPaymentStatus] = useState<'Pending' | 'Paid'>('Pending');
  const [previewDocModal, setPreviewDocModal] = useState<{ title: string; side: 'front' | 'back' } | null>(null);

  if (!isOpen || !booking) return null;

  // Calculate duration in days
  const pickupDateObj = new Date(booking.pickupDate);
  const returnDateObj = new Date(booking.returnDate);
  const diffTime = Math.abs(returnDateObj.getTime() - pickupDateObj.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 3;
  const dailyRateCalculated = Math.round(booking.totalMAD / diffDays);

  const handleSend = () => {
    setContractSent(true);
    onSendContract(booking.id);
  };

  const handleMarkSigned = () => {
    setContractSigned(true);
  };

  const handlePaymentReceived = () => {
    setPaymentStatus('Paid');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#140e0b] border border-[#2b2018] rounded-3xl max-w-4xl w-full text-[#f5efe8] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* ======================================================== */}
        {/* MODAL HEADER matching Document booking.png */}
        {/* ======================================================== */}
        <div className="p-5 sm:p-6 bg-[#18110d] border-b border-[#261d16] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#f5efe8]">
                  Booking Details
                </h2>
                <span className="text-xs font-mono font-bold text-[#9c8e82] bg-[#221813] px-2 py-0.5 rounded-lg border border-[#30241b]">
                  Booking ID: #{booking.bookingNumber.replace('AC-', '') || '48'}
                </span>
                <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                  {booking.status}
                </span>
              </div>
              <p className="text-xs text-[#8d7e73] mt-0.5">
                {booking.vehicle.name} • Customer: <strong className="text-[#f5efe8]">{booking.renter.fullName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-[#241b15] text-[#9c8e82] hover:text-white hover:bg-[#30241d] transition-all cursor-pointer border border-[#382b21]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* NAVIGATION TABS matching Document booking.png */}
        {/* ======================================================== */}
        <div className="px-6 bg-[#18110d] border-b border-[#261d16] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#f95721] text-[#f95721]'
                : 'border-transparent text-[#8d7e73] hover:text-white'
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-[#f95721] text-[#f95721]'
                : 'border-transparent text-[#8d7e73] hover:text-white'
            }`}
          >
            Timeline
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-[#f95721] text-[#f95721]'
                : 'border-transparent text-[#8d7e73] hover:text-white'
            }`}
          >
            Details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'border-[#f95721] text-[#f95721]'
                : 'border-transparent text-[#8d7e73] hover:text-white'
            }`}
          >
            <span>Customer Documents</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              2
            </span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB CONTENTS */}
        {/* ======================================================== */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">

          {/* ---------------------------------------------------- */}
          {/* TAB 1: OVERVIEW matching Document booking.png */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              
              {/* Top 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#1a130f] rounded-2xl p-4 border border-[#2b2018] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8d7e73]">Total Price</span>
                  <div className="text-xl font-bold font-mono text-[#f95721]">
                    {booking.totalMAD} MAD
                  </div>
                  <span className="text-[10px] text-amber-400 block font-semibold">
                    {paymentStatus === 'Paid' ? 'Paid in Full' : 'Pending'}
                  </span>
                </div>

                <div className="bg-[#1a130f] rounded-2xl p-4 border border-[#2b2018] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8d7e73]">Duration</span>
                  <div className="text-xl font-bold text-[#f5efe8]">
                    {diffDays} days
                  </div>
                  <span className="text-[10px] text-[#8d7e73] block">
                    {booking.pickupDate} → {booking.returnDate}
                  </span>
                </div>

                <div className="bg-[#1a130f] rounded-2xl p-4 border border-[#2b2018] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8d7e73]">Daily Rate</span>
                  <div className="text-xl font-bold font-mono text-[#f5efe8]">
                    {dailyRateCalculated} MAD
                  </div>
                  <span className="text-[10px] text-[#8d7e73] block">Base rate per day</span>
                </div>

                <div className="bg-[#1a130f] rounded-2xl p-4 border border-[#2b2018] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8d7e73]">Created</span>
                  <div className="text-sm font-bold text-[#f5efe8] truncate">
                    {booking.createdAt || 'Aug 26, 2026'}
                  </div>
                  <span className="text-[10px] text-[#8d7e73] block">Web Reservation</span>
                </div>
              </div>

              {/* Lifecycle Section */}
              <div className="bg-[#1a130f] rounded-2xl p-5 border border-[#2b2018] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#261d16]">
                  <div>
                    <h3 className="font-bold text-sm text-[#f5efe8]">Lifecycle</h3>
                    <p className="text-[11px] text-[#8d7e73]">Contract + payment flow</p>
                  </div>
                  <span className="bg-amber-500/15 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-amber-500/30">
                    {contractSigned ? 'Contract signed' : contractSent ? 'Awaiting customer signature' : 'Awaiting contract'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#221813] border border-[#2d2119] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8d7e73] block">Contract</span>
                      <span className="text-xs font-semibold text-[#f5efe8]">Client agreement</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      contractSigned
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>
                      {contractSigned ? 'Signed' : 'Awaiting contract'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#221813] border border-[#2d2119] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8d7e73] block">Payment</span>
                      <span className="text-xs font-semibold text-[#f5efe8]">Manual review</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      paymentStatus === 'Paid'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>
                      {paymentStatus === 'Paid' ? 'Verified / Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* E-CONTRACT PREVIEW Card */}
              <div className="bg-[#1a130f] rounded-2xl p-5 border border-[#2b2018] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#261d16]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#f95721] block">E-Contract Preview</span>
                    <h3 className="font-serif-display font-bold text-base text-[#f5efe8]">
                      Airbcar rental agreement
                    </h3>
                  </div>
                  <span className="bg-amber-500/15 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-amber-500/30">
                    {contractSigned ? 'SIGNED & ACTIVE' : 'PENDING SIGNATURE'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-3 text-xs leading-relaxed text-[#c9b8ab]">
                    <div className="font-bold text-[#f5efe8] text-sm">
                      Booking #{booking.bookingNumber} • {booking.createdAt || 'Aug 26, 2026'}
                    </div>
                    <p>
                      This agreement covers the rental of <strong className="text-[#f5efe8]">{booking.vehicle.name}</strong> from <strong className="text-[#f5efe8]">{booking.pickupLocation}</strong> to <strong className="text-[#f5efe8]">{booking.deliveryLocation}</strong>.
                    </p>
                    <div className="space-y-1 py-1">
                      <div>Customer: <strong className="text-[#f5efe8]">{booking.renter.fullName}</strong></div>
                      <div>Rental dates: <strong className="text-[#f5efe8]">{booking.pickupDate} → {booking.returnDate}</strong></div>
                      <div>Total: <strong className="text-[#f95721] font-mono">{booking.totalMAD} MAD</strong></div>
                      <div>Security Deposit: <strong className="text-[#f5efe8]">{booking.depositMAD} MAD</strong></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenContractPdf(booking.bookingNumber)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#f95721] hover:underline cursor-pointer font-semibold pt-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Full PDF Agreement</span>
                    </button>
                  </div>

                  {/* Right Column: Next Step Checklist */}
                  <div className="bg-[#201813] rounded-xl p-4 border border-[#2c2019] space-y-3">
                    <span className="text-[10px] uppercase font-bold text-[#8d7e73] tracking-wider block">
                      Next Step
                    </span>
                    <div className="font-bold text-xs text-[#f5efe8]">
                      {contractSigned ? 'Ready for Handover & Vehicle Inspection' : 'Awaiting contract and payment review'}
                    </div>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Booking request confirmed</span>
                      </div>
                      <div className={`flex items-center gap-2 ${contractSent ? 'text-emerald-400' : 'text-[#8d7e73]'}`}>
                        {contractSent ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-[#443326] shrink-0" />}
                        <span>Contract sent to customer</span>
                      </div>
                      <div className={`flex items-center gap-2 ${contractSigned ? 'text-emerald-400' : 'text-[#8d7e73]'}`}>
                        {contractSigned ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-[#443326] shrink-0" />}
                        <span>Customer reviewed + signed</span>
                      </div>
                      <div className={`flex items-center gap-2 ${paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-[#8d7e73]'}`}>
                        {paymentStatus === 'Paid' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-[#443326] shrink-0" />}
                        <span>Manual payment review complete</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: TIMELINE matching Document booking3.png */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'timeline' && (
            <div className="bg-[#1a130f] rounded-2xl p-6 border border-[#2b2018] space-y-6">
              <div className="pb-3 border-b border-[#261d16]">
                <h3 className="font-serif-display font-bold text-base text-[#f5efe8]">
                  Booking Timeline
                </h3>
                <p className="text-xs text-[#8d7e73]">
                  Chronological event audit trail for reservation #{booking.bookingNumber}
                </p>
              </div>

              {/* Vertical Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2b2018]">
                
                {/* Event 1: Booking Created */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                    <Clock className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#f5efe8]">Booking Created</div>
                    <div className="text-[11px] text-[#9c8e82]">Booking request was submitted</div>
                    <div className="text-[10px] text-[#7d6e63] font-mono mt-0.5">Aug 26, 2026, 09:56 PM</div>
                  </div>
                </div>

                {/* Event 2: Requested */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                    <Clock className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#f5efe8]">Requested</div>
                    <div className="text-[11px] text-[#9c8e82]">Booking request was sent to Mayache agency dispatcher</div>
                    <div className="text-[10px] text-[#7d6e63] font-mono mt-0.5">Aug 26, 2026, 09:56 PM</div>
                  </div>
                </div>

                {/* Event 3: Contract Dispatched */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400">
                    <FileText className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#f5efe8]">Contract Dispatched</div>
                    <div className="text-[11px] text-[#9c8e82]">Digital rental agreement generated and SMS signature link sent</div>
                    <div className="text-[10px] text-[#7d6e63] font-mono mt-0.5">Aug 26, 2026, 09:57 PM</div>
                  </div>
                </div>

                {/* Event 4: Last Updated */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#f5efe8]">Last Updated</div>
                    <div className="text-[11px] text-[#9c8e82]">Booking information and driver license documents verified</div>
                    <div className="text-[10px] text-[#7d6e63] font-mono mt-0.5">Aug 26, 2026, 09:58 PM</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 3: DETAILS */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              
              {/* Vehicle & Pickup Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Vehicle Specs */}
                <div className="bg-[#1a130f] rounded-2xl p-5 border border-[#2b2018] space-y-3">
                  <h3 className="font-bold text-xs text-[#f95721] uppercase tracking-wider flex items-center gap-2">
                    <Car className="w-4 h-4" /> Vehicle Information
                  </h3>
                  <div className="flex gap-3 items-center">
                    <img
                      src={booking.vehicle.image}
                      alt={booking.vehicle.name}
                      className="w-20 h-14 object-cover rounded-xl border border-white/10"
                    />
                    <div>
                      <span className="font-bold text-[#f5efe8] block text-sm">{booking.vehicle.name}</span>
                      <span className="text-[10px] text-[#f95721] font-mono font-bold block">{booking.vehicle.plate}</span>
                      <span className="text-[11px] text-[#8d7e73]">Model year: {booking.vehicle.year}</span>
                    </div>
                  </div>
                </div>

                {/* Pickup & Delivery */}
                <div className="bg-[#1a130f] rounded-2xl p-5 border border-[#2b2018] space-y-3">
                  <h3 className="font-bold text-xs text-[#f95721] uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Pickup & Dropoff
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-[#8d7e73] block uppercase font-bold">Pickup Location & Date</span>
                      <span className="font-semibold text-[#f5efe8] block">{booking.pickupLocation}</span>
                      <span className="text-[#f95721] font-mono text-[11px]">{booking.pickupDate} at {booking.pickupTime}</span>
                    </div>
                    <div className="pt-1 border-t border-[#261d16]">
                      <span className="text-[10px] text-[#8d7e73] block uppercase font-bold">Dropoff Location & Date</span>
                      <span className="font-semibold text-[#f5efe8] block">{booking.deliveryLocation}</span>
                      <span className="text-[#f95721] font-mono text-[11px]">{booking.returnDate} at {booking.returnTime}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Financial Itemization */}
              <div className="bg-[#1a130f] rounded-2xl p-5 border border-[#2b2018] space-y-3">
                <h3 className="font-bold text-xs text-[#f95721] uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Financial Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-[#8d7e73]">
                    <span>Base Daily Rate:</span>
                    <span className="text-[#f5efe8] font-mono">{dailyRateCalculated} MAD × {diffDays} days</span>
                  </div>
                  <div className="flex justify-between text-[#8d7e73]">
                    <span>Subtotal:</span>
                    <span className="text-[#f5efe8] font-mono">{Math.round(booking.totalMAD * 0.92)} MAD</span>
                  </div>
                  <div className="flex justify-between text-[#8d7e73]">
                    <span>Mandatory Moroccan VAT & Fees (8%):</span>
                    <span className="text-[#f5efe8] font-mono">{Math.round(booking.totalMAD * 0.08)} MAD</span>
                  </div>
                  <div className="flex justify-between text-[#8d7e73]">
                    <span>Security Deposit (Pre-Authorized):</span>
                    <span className="text-[#f5efe8] font-mono">{booking.depositMAD} MAD</span>
                  </div>
                  <div className="pt-2 border-t border-[#261d16] flex justify-between text-sm font-bold">
                    <span className="text-[#f5efe8]">Total Rental Price:</span>
                    <span className="text-[#f95721] font-mono text-base">{booking.totalMAD} MAD</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 4: CUSTOMER DOCUMENTS matching Document booking2.png */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'documents' && (
            <div className="space-y-5">
              
              {/* Subtabs: Documents vs Personal Info */}
              <div className="flex items-center gap-2 bg-[#1a130f] p-1.5 rounded-2xl border border-[#2b2018] w-fit">
                <button
                  type="button"
                  onClick={() => setDocSubTab('documents')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    docSubTab === 'documents'
                      ? 'bg-[#f95721] text-white shadow-xs'
                      : 'text-[#8d7e73] hover:text-white'
                  }`}
                >
                  Documents
                </button>
                <button
                  type="button"
                  onClick={() => setDocSubTab('personal_info')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    docSubTab === 'personal_info'
                      ? 'bg-[#f95721] text-white shadow-xs'
                      : 'text-[#8d7e73] hover:text-white'
                  }`}
                >
                  Personal Info
                </button>
              </div>

              {docSubTab === 'documents' ? (
                <div className="space-y-4">
                  {/* Green Banner matching Document booking2.png */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 flex items-center gap-2 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>2 documents available • Driver License Verified</span>
                  </div>

                  {/* Documents Grid with Realistic Driver License Front & Back */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Front License Card */}
                    <div className="bg-[#1a130f] rounded-2xl border border-[#2b2018] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-[#f5efe8]">Driver License (Front / Recto)</h4>
                          <span className="text-[10px] text-[#8d7e73]">Source: Verified Client Profile</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewDocModal({ title: "Driver's License (Front)", side: 'front' })}
                            className="p-1.5 rounded-lg bg-[#241b15] hover:bg-[#30241d] text-[#8d7e73] hover:text-white transition-colors cursor-pointer"
                            title="Preview Full Resolution"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Visual License Front Card */}
                      <DriverLicenseVisualCard
                        licenseNumber="02/981249"
                        driverName={booking.renter.fullName}
                        driverCountry={booking.renter.country}
                        driverFlag="🇲🇦"
                        driverCinOrPassport="BE849102"
                        defaultSide="front"
                        onZoom={(side) => setPreviewDocModal({ title: `Driver's License (${side === 'front' ? 'Front' : 'Back'})`, side })}
                      />
                    </div>

                    {/* Back License Card */}
                    <div className="bg-[#1a130f] rounded-2xl border border-[#2b2018] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-[#f5efe8]">Driver License (Back / Verso)</h4>
                          <span className="text-[10px] text-[#8d7e73]">Source: Endorsements & NARSA Matrix</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewDocModal({ title: "Driver's License (Back)", side: 'back' })}
                            className="p-1.5 rounded-lg bg-[#241b15] hover:bg-[#30241d] text-[#8d7e73] hover:text-white transition-colors cursor-pointer"
                            title="Preview Full Resolution"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Visual License Back Card */}
                      <DriverLicenseVisualCard
                        licenseNumber="02/981249"
                        driverName={booking.renter.fullName}
                        driverCountry={booking.renter.country}
                        driverFlag="🇲🇦"
                        driverCinOrPassport="BE849102"
                        defaultSide="back"
                        onZoom={(side) => setPreviewDocModal({ title: `Driver's License (${side === 'front' ? 'Front' : 'Back'})`, side })}
                      />
                    </div>

                  </div>
                </div>
              ) : (
                /* Personal Info Tab */
                <div className="bg-[#1a130f] rounded-2xl border border-[#2b2018] p-5 space-y-4">
                  <h4 className="font-bold text-xs text-[#f95721] uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> Verified Renter Profile
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#8d7e73] block text-[10px] uppercase font-bold">Full Name</span>
                      <span className="font-semibold text-[#f5efe8]">{booking.renter.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[#8d7e73] block text-[10px] uppercase font-bold">Phone Number</span>
                      <span className="font-semibold text-[#f5efe8]">{booking.renter.phone}</span>
                    </div>
                    <div>
                      <span className="text-[#8d7e73] block text-[10px] uppercase font-bold">Email Address</span>
                      <span className="font-semibold text-[#f5efe8]">{booking.renter.email || 'customer@airbcar.com'}</span>
                    </div>
                    <div>
                      <span className="text-[#8d7e73] block text-[10px] uppercase font-bold">Country of Residence</span>
                      <span className="font-semibold text-[#f5efe8]">{booking.renter.country}</span>
                    </div>
                    <div>
                      <span className="text-[#8d7e73] block text-[10px] uppercase font-bold">National ID / Passport Number</span>
                      <span className="font-semibold text-[#f5efe8] font-mono">BE882910</span>
                    </div>
                    <div>
                      <span className="text-[#8d7e73] block text-[10px] uppercase font-bold">Driver License Number</span>
                      <span className="font-semibold text-[#f95721] font-mono">02/981249</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* MODAL FOOTER ACTIONS matching Document booking.png */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 bg-[#18110d] border-t border-[#261d16] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold text-[#8d7e73] hover:text-white bg-[#221813] hover:bg-[#2c2019] border border-[#34261e] cursor-pointer"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            {/* Open Chat */}
            {onOpenChatWithRenter && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChatWithRenter(booking.renter.id);
                }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Chat</span>
              </button>
            )}

            {/* Payment Received */}
            <button
              type="button"
              onClick={handlePaymentReceived}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                paymentStatus === 'Paid'
                  ? 'bg-purple-950/40 text-purple-400 border border-purple-800/40 cursor-default'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{paymentStatus === 'Paid' ? 'Payment Verified' : 'Payment Received'}</span>
            </button>

            {/* Mark Signed */}
            <button
              type="button"
              onClick={handleMarkSigned}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                contractSigned
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{contractSigned ? 'Signed' : 'Mark Signed'}</span>
            </button>

            {/* Send Contract */}
            <button
              type="button"
              onClick={handleSend}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                contractSent
                  ? 'bg-[#2b2018] text-[#8d7e73] border border-[#382b21] cursor-default'
                  : 'bg-[#f95721] hover:bg-[#e04a17] text-white shadow-md'
              }`}
            >
              <FileSignature className="w-3.5 h-3.5" />
              <span>{contractSent ? 'Contract Sent' : 'Send Contract'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Document Lightbox / Zoom Modal */}
      {previewDocModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <div className="bg-[#1a130f] rounded-3xl border border-[#2b2018] max-w-xl w-full p-6 space-y-4 shadow-2xl text-[#f5efe8]">
            <div className="flex items-center justify-between pb-2 border-b border-[#261d16]">
              <h3 className="font-serif-display font-bold text-base text-[#f5efe8]">
                {previewDocModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="p-1 rounded-full text-[#8d7e73] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Driver License Inspection in Full Zoom Modal */}
            <div className="space-y-3">
              <DriverLicenseVisualCard
                licenseNumber="02/981249"
                driverName={booking.renter.fullName}
                driverCountry={booking.renter.country}
                driverFlag="🇲🇦"
                driverCinOrPassport="BE849102"
                defaultSide={previewDocModal.side}
              />
              
              <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f95721] block">
                  Verification Audit Status:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Biometric Face Matched (99.4%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>MRZ Checksum Validated</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>NARSA Central Registry Synced</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid Cat. B for Tourism Vehicles</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="px-5 py-2 rounded-full text-xs font-bold bg-[#f95721] hover:bg-[#e04a17] text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
