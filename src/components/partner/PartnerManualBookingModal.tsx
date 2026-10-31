import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft, 
  Car, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  DollarSign, 
  CreditCard, 
  FileText, 
  FileSignature, 
  Check, 
  Sparkles,
  Info,
  RotateCw,
  Eye,
  CheckCircle2,
  Lock,
  Download
} from 'lucide-react';
import { PartnerVehicle, PartnerBooking } from '../../types/partner';
import { DriverLicenseVisualCard } from '../common/DriverLicenseVisualCard';

interface PartnerManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: PartnerVehicle[];
  onCreateBooking: (newBooking: PartnerBooking) => void;
  onOpenContractPdf?: (contractId?: string) => void;
}

export const PartnerManualBookingModal: React.FC<PartnerManualBookingModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onCreateBooking,
  onOpenContractPdf,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  
  // Client Information
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [email, setEmail] = useState('sarah.jenkins@gmail.com');
  const [phone, setPhone] = useState('+1 (305) 555-2941');
  const [idPassport, setIdPassport] = useState('A48931221');
  const [driversLicense, setDriversLicense] = useState('FL-29184892-0');

  // Vehicle Details
  const [pickupDate, setPickupDate] = useState('2026-10-12');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('2026-10-15');
  const [returnTime, setReturnTime] = useState('16:00');
  const [pickupLocation, setPickupLocation] = useState('Casablanca Mohammed V Airport (CMN)');
  const [dropoffLocation, setDropoffLocation] = useState('Casablanca Mohammed V Airport (CMN)');

  // Selected vehicle object
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Pricing
  const [dailyRate, setDailyRate] = useState<number>(selectedVehicle?.dailyRate || 450);
  const [securityDeposit, setSecurityDeposit] = useState<number>(selectedVehicle?.depositAmount || 2000);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Visa/Mastercard)');
  const [paymentStatus, setPaymentStatus] = useState('Authorized & Escrowed');

  // Additional Options
  const [insurancePackage, setInsurancePackage] = useState('Premium Comprehensive Cover (Included)');
  const [extraDrivers, setExtraDrivers] = useState(false);
  const [curbsideDelivery, setCurbsideDelivery] = useState(true);
  const [internalNotes, setInternalNotes] = useState('VIP Handover at Terminal 1. Client requested clean child booster seat if available.');

  // Documents & Contract in Booking Flow
  const [licenseSide, setLicenseSide] = useState<'front' | 'back'>('front');
  const [licenseVerificationStatus, setLicenseVerificationStatus] = useState<'Verified' | 'Pending' | 'VIP Exempt'>('Verified');
  const [dispatchContractVia, setDispatchContractVia] = useState<'whatsapp_sms' | 'email' | 'printed'>('whatsapp_sms');
  const [requireRenterSignature, setRequireRenterSignature] = useState(true);
  const [includeEscrowDepositClause, setIncludeEscrowDepositClause] = useState(true);
  const [contractNumber] = useState(`CTR-2026-MA-${Math.floor(1000 + Math.random() * 9000)}`);

  // Update daily rate & deposit when selected vehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      setDailyRate(selectedVehicle.dailyRate);
      setSecurityDeposit(selectedVehicle.depositAmount);
    }
  }, [selectedVehicleId]);

  // Calculations
  const calculateDays = () => {
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();
    const diff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return isNaN(diff) ? 3 : diff;
  };

  const rentalDays = calculateDays();
  const subtotal = dailyRate * rentalDays;
  const taxesAndFees = Math.round(subtotal * 0.08); // 8% mandatory tax & fees
  const totalAmountDue = subtotal + taxesAndFees;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const newBooking: PartnerBooking = {
      id: `booking-${Date.now()}`,
      bookingNumber: `AC-${Math.floor(1000 + Math.random() * 9000)}`,
      renter: {
        id: `renter-${Date.now()}`,
        fullName: fullName.trim() || 'Client',
        avatarInitials: fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CL',
        country: 'United States / Walk-in',
        tripsCount: 1,
        phone: phone.trim(),
        email: email.trim(),
        licenseStatus: 'Verified',
        licenseVerifiedDate: 'Today',
        languages: 'EN • FR',
      },
      vehicle: {
        id: selectedVehicle.id,
        name: `${selectedVehicle.make} ${selectedVehicle.model}`,
        year: selectedVehicle.year,
        plate: selectedVehicle.plate,
        image: selectedVehicle.image,
      },
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupLocation,
      deliveryLocation: dropoffLocation,
      totalMAD: totalAmountDue,
      depositMAD: securityDeposit,
      status: 'confirmed',
      contractSent: true,
      contractSigned: false,
      deliveryConfirmed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 overflow-y-auto p-3 sm:p-6 lg:p-10 flex justify-center items-start">
      <div className="bg-[#140e0b] border border-[#2b2018] rounded-3xl max-w-5xl w-full text-[#f5efe8] shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header Bar */}
        <div className="p-6 sm:p-8 bg-[#18110d] border-b border-[#261d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-[#9c8e82] hover:text-[#f5efe8] flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#f95721]" />
                <span>Back to Bookings Hub</span>
              </button>
              <span className="text-xs text-[#52443a]">/</span>
              <span className="bg-[#f95721]/15 text-[#f95721] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#f95721]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> DRAFT MODE
              </span>
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#f5efe8] mt-2 tracking-tight">
              New Manual Booking
            </h1>
            <p className="text-xs sm:text-sm text-[#9c8e82] mt-0.5">
              Create an on-system manual reservation, configure rates, and schedule pickup details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="self-start sm:self-center p-2 rounded-full bg-[#241b15] text-[#9c8e82] hover:text-white hover:bg-[#30241d] transition-all cursor-pointer border border-[#382b21]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* CARD 1: Client Information */}
            <div className="bg-[#1a130f] rounded-2xl border border-[#2b2018] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#261d16]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#f95721] flex items-center gap-2">
                  <User className="w-4 h-4" /> Client Information
                </h3>
                <span className="text-[10px] text-[#8d7e73]">Primary Renter</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.jenkins@gmail.com"
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (305) 555-2941"
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">ID / Passport Number</label>
                  <input
                    type="text"
                    value={idPassport}
                    onChange={(e) => setIdPassport(e.target.value)}
                    placeholder="A48931221"
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Driver's License ID *</label>
                  <input
                    type="text"
                    required
                    value={driversLicense}
                    onChange={(e) => setDriversLicense(e.target.value)}
                    placeholder="FL-29184892-0"
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: Vehicle Details */}
            <div className="bg-[#1a130f] rounded-2xl border border-[#2b2018] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#261d16]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#f95721] flex items-center gap-2">
                  <Car className="w-4 h-4" /> Vehicle Details
                </h3>
                <span className="text-[10px] text-[#8d7e73]">Fleet Allocation</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Assigned Vehicle *</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none transition-colors"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.plate}) • {v.dailyRate} MAD/day
                    </option>
                  ))}
                </select>
                {selectedVehicle && (
                  <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-[#241b15] border border-[#30241b]">
                    <img
                      src={selectedVehicle.image}
                      alt={selectedVehicle.model}
                      className="w-14 h-10 object-cover rounded-lg"
                    />
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold text-[#f5efe8] block">{selectedVehicle.make} {selectedVehicle.model}</span>
                      <span className="text-[#8d7e73]">{selectedVehicle.transmission} • {selectedVehicle.fuelType} • Plate: {selectedVehicle.plate}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Pickup Date & Time *</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="date"
                      required
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="col-span-2 bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                    />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="bg-[#241b15] border border-[#382b21] rounded-xl px-2 py-2 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none text-center"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Return Date & Time *</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="date"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="col-span-2 bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                    />
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="bg-[#241b15] border border-[#382b21] rounded-xl px-2 py-2 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Pickup Location *</label>
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Casablanca Mohammed V Airport"
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Dropoff Location *</label>
                  <input
                    type="text"
                    required
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    placeholder="Casablanca Mohammed V Airport"
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CARD 3: Pricing & Payment */}
            <div className="bg-[#1a130f] rounded-2xl border border-[#2b2018] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#261d16]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#f95721] flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Pricing & Payment
                </h3>
                <span className="text-[10px] text-[#8d7e73]">Financial Breakdown</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Daily Rate (MAD) *</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Rental Duration</label>
                  <div className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] font-bold">
                    {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}
                  </div>
                </div>
              </div>

              {/* Itemized summary */}
              <div className="p-3.5 rounded-xl bg-[#201813] border border-[#2c2019] space-y-2 text-xs">
                <div className="flex justify-between text-[#8d7e73]">
                  <span>Subtotal ({dailyRate} MAD × {rentalDays} days)</span>
                  <span className="text-[#f5efe8] font-semibold">{subtotal} MAD</span>
                </div>
                <div className="flex justify-between text-[#8d7e73]">
                  <span>Mandatory Taxes & Fees (8%)</span>
                  <span className="text-[#f5efe8] font-semibold">{taxesAndFees} MAD</span>
                </div>
                <div className="pt-2 border-t border-[#2d221b] flex justify-between items-center text-sm font-bold">
                  <span className="text-[#f5efe8]">Total Amount Due</span>
                  <span className="text-[#f95721] font-mono text-base">{totalAmountDue} MAD</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Security Deposit *</label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    placeholder="2000"
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  >
                    <option value="Credit Card (Visa/Mastercard)">Credit Card (Visa/Mastercard)</option>
                    <option value="Cash on Delivery">Cash on Delivery / Agadir Office</option>
                    <option value="Bank Wire / CMI">Bank Wire / CMI Terminal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Payment Status *</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                >
                  <option value="Authorized & Escrowed">Authorized & Escrowed</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Paid in Full">Paid in Full (Cash or Pos)</option>
                  <option value="Deposit Only">Deposit Only Received</option>
                </select>
              </div>
            </div>

            {/* CARD 4: Additional Options */}
            <div className="bg-[#1a130f] rounded-2xl border border-[#2b2018] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#261d16]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#f95721] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Additional Options
                </h3>
                <span className="text-[10px] text-[#8d7e73]">Add-ons & Notes</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Insurance Package</label>
                <select
                  value={insurancePackage}
                  onChange={(e) => setInsurancePackage(e.target.value)}
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                >
                  <option value="Premium Comprehensive Cover (Included)">Premium Comprehensive Cover (Included)</option>
                  <option value="Basic Third Party (Standard)">Basic Third Party (Standard)</option>
                  <option value="Zero Excess Protection (+150 MAD/day)">Zero Excess Protection (+150 MAD/day)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#221813] border border-[#2e221a]">
                  <div>
                    <span className="text-xs font-semibold text-[#f5efe8] block">Register Extra Driver(s)</span>
                    <span className="text-[10px] text-[#8d7e73]">Free of charge on direct manual bookings</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExtraDrivers(!extraDrivers)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      extraDrivers ? 'bg-[#f95721]' : 'bg-[#33261e]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        extraDrivers ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#221813] border border-[#2e221a]">
                  <div>
                    <span className="text-xs font-semibold text-[#f5efe8] block">Airport Curbside Delivery</span>
                    <span className="text-[10px] text-[#8d7e73]">Meet agent at arrival hall with name sign</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurbsideDelivery(!curbsideDelivery)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      curbsideDelivery ? 'bg-[#f95721]' : 'bg-[#33261e]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        curbsideDelivery ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Internal Operations Notes</label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add specific client requests, delivery instructions, or special vehicle setup alerts here..."
                  className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* CARD 5: Client Documents & Driver's License (Front & Back) */}
            <div className="bg-[#1a130f] rounded-2xl border border-[#2b2018] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#261d16]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#f95721] flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Client Documents &amp; Verification
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLicenseSide(prev => prev === 'front' ? 'back' : 'front')}
                    className="px-2.5 py-1 rounded-full bg-[#241b15] hover:bg-[#30241b] text-[#f95721] text-[11px] font-semibold flex items-center gap-1.5 transition-colors border border-[#382b21] cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Flip License ({licenseSide === 'front' ? 'Recto' : 'Verso'})</span>
                  </button>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                    CNDP Approved
                  </span>
                </div>
              </div>

              {/* License Interactive Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#8d7e73]">
                    Driver's License Visual Scan · {licenseSide === 'front' ? 'Front Side (Recto)' : 'Back Side (Verso)'}
                  </span>
                  <span className="font-mono text-[#f5efe8] text-[11px]">
                    No. {driversLicense || 'Pending Input'}
                  </span>
                </div>

                <DriverLicenseVisualCard
                  licenseNumber={driversLicense || 'FL-29184892-0'}
                  driverName={fullName || 'Sarah Jenkins'}
                  driverCountry="United States / International"
                  driverFlag="🇺🇸"
                  driverCinOrPassport={idPassport || 'A48931221'}
                  birthDate="22.08.1991"
                  issueDate="15.03.2019"
                  expiryDate="15.03.2029"
                  categories={['B', 'AM']}
                  defaultSide={licenseSide}
                />
              </div>

              {/* Verification & Compliance Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Documentation Verification Status</label>
                  <select
                    value={licenseVerificationStatus}
                    onChange={(e) => setLicenseVerificationStatus(e.target.value as any)}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  >
                    <option value="Verified">Verified &amp; CNDP Registered (Ready for Handover)</option>
                    <option value="Pending">Pending In-Person Physical Check at Arrival</option>
                    <option value="VIP Exempt">VIP / Corporate Pre-Approved Renter</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-[#201813] border border-[#2c2019] flex items-center gap-3 text-xs text-[#8d7e73]">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[#f5efe8] font-semibold block">Passport / CIN ID Registered</span>
                    <span>{idPassport || 'A48931221'} · Identity verified via Airbcar Trust</span>
                  </div>
                </div>
              </div>

              {extraDrivers && (
                <div className="p-3.5 rounded-xl bg-[#241b15] border border-[#382b21] space-y-2">
                  <div className="text-xs font-bold text-[#f5efe8] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#f95721]" /> Second Driver Documents
                  </div>
                  <p className="text-[11px] text-[#8d7e73]">
                    Second driver licence must be presented and counter-signed on the rental agreement prior to vehicle departure.
                  </p>
                </div>
              )}
            </div>

            {/* CARD 6: Moroccan Rental Contract & Escrow Protocol */}
            <div className="bg-[#1a130f] rounded-2xl border border-[#2b2018] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#261d16]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#f95721] flex items-center gap-2">
                  <FileSignature className="w-4 h-4" /> Rental Contract &amp; Escrow Dispatch
                </h3>
                <span className="font-mono text-xs font-bold text-[#f95721] bg-[#f95721]/15 px-2.5 py-1 rounded-full border border-[#f95721]/30">
                  {contractNumber}
                </span>
              </div>

              {/* Summary of Contract Specifications */}
              <div className="p-3.5 rounded-xl bg-[#201813] border border-[#2c2019] space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#8d7e73]">
                  <span>Contract Specification:</span>
                  <span className="text-[#f5efe8] font-semibold">Standard Moroccan Ministry Agreement (Bilingual FR/AR)</span>
                </div>
                <div className="flex justify-between items-center text-[#8d7e73]">
                  <span>Security Escrow Deposit:</span>
                  <span className="text-emerald-400 font-semibold">{securityDeposit} MAD (Pre-authorized hold)</span>
                </div>
                <div className="flex justify-between items-center text-[#8d7e73]">
                  <span>Insurance Policy:</span>
                  <span className="text-[#f5efe8] font-semibold">{insurancePackage}</span>
                </div>
              </div>

              {/* Contract Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8d7e73] mb-1">Contract Dispatch Method</label>
                  <select
                    value={dispatchContractVia}
                    onChange={(e) => setDispatchContractVia(e.target.value as any)}
                    className="w-full bg-[#241b15] border border-[#382b21] rounded-xl px-3.5 py-2.5 text-xs text-[#f5efe8] focus:border-[#f95721] focus:outline-none"
                  >
                    <option value="whatsapp_sms">Instant WhatsApp &amp; SMS Digital Link</option>
                    <option value="email">Direct Email with PDF Attachment</option>
                    <option value="printed">Physical Paper Print at Counter</option>
                  </select>
                </div>

                <div className="flex items-end">
                  {onOpenContractPdf ? (
                    <button
                      type="button"
                      onClick={() => onOpenContractPdf(contractNumber)}
                      className="w-full bg-[#261d16] hover:bg-[#34271f] border border-[#3d2e24] text-[#f5efe8] text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#f95721]" />
                      <span>Preview Draft Contract PDF</span>
                    </button>
                  ) : (
                    <div className="text-xs text-[#8d7e73] flex items-center gap-2 p-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Contract auto-generated upon submission</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#221813] border border-[#2e221a]">
                  <div>
                    <span className="text-xs font-semibold text-[#f5efe8] block">Require Electronic Signature Prior to Handover</span>
                    <span className="text-[10px] text-[#8d7e73]">Client must e-sign on mobile before car keys can be unlocked</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequireRenterSignature(!requireRenterSignature)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      requireRenterSignature ? 'bg-[#f95721]' : 'bg-[#33261e]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        requireRenterSignature ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#221813] border border-[#2e221a]">
                  <div>
                    <span className="text-xs font-semibold text-[#f5efe8] block">Bank Escrow Security Deposit Clause</span>
                    <span className="text-[10px] text-[#8d7e73]">Guaranteed release within 24h of return without arbitrary deductions</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeEscrowDepositClause(!includeEscrowDepositClause)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      includeEscrowDepositClause ? 'bg-[#f95721]' : 'bg-[#33261e]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        includeEscrowDepositClause ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4 border-t border-[#261d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#9c8e82] hover:text-[#f5efe8] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>&lt; Back to Bookings Hub</span>
            </button>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#a89b90] hover:text-white bg-[#221813] hover:bg-[#2c2019] border border-[#34261e] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 rounded-full text-xs font-bold text-white bg-[#f95721] hover:bg-[#e04a17] transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Create Booking</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
