import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Shield, 
  ShieldCheck, 
  Users, 
  Fuel, 
  Gauge, 
  Calendar as CalendarIcon, 
  Check, 
  Heart, 
  Share2, 
  Phone, 
  Clock, 
  Car, 
  Info, 
  Sparkles, 
  FileText,
  Lock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { CarListing } from '../../types';
import { allCarsData } from '../../data/carsData';

interface VehicleProfileViewProps {
  car: CarListing;
  pickupDate?: string;
  returnDate?: string;
  location?: string;
  onBackToSearch: () => void;
  onSelectAnotherCar: (car: CarListing) => void;
  onBookNow: (car: CarListing, totalDays: number, totalAmount: number) => void;
  onSelectPartner?: (partnerId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const VehicleProfileView: React.FC<VehicleProfileViewProps> = ({
  car,
  pickupDate = '2026-09-07',
  returnDate = '2026-09-11',
  location = 'Tetouan',
  onBackToSearch,
  onSelectAnotherCar,
  onBookNow,
  onSelectPartner,
  onNavigateTab
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  // Editable dates
  const [selectedPickup, setSelectedPickup] = useState(pickupDate);
  const [selectedReturn, setSelectedReturn] = useState(returnDate);
  const [deliveryOption, setDeliveryOption] = useState<'agency' | 'airport' | 'hotel'>('agency');
  const [insurancePlan, setInsurancePlan] = useState<'standard' | 'premium'>('standard');
  const [showBookingSuccessModal, setShowBookingSuccessModal] = useState(false);

  // Rental days calculation
  const rentalDays = useMemo(() => {
    try {
      const start = new Date(selectedPickup);
      const end = new Date(selectedReturn);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 4;
    } catch {
      return 4;
    }
  }, [selectedPickup, selectedReturn]);

  // Delivery fee
  const deliveryFee = deliveryOption === 'airport' ? 100 : deliveryOption === 'hotel' ? 150 : 0;
  // Insurance fee
  const insuranceFee = insurancePlan === 'premium' ? 120 * rentalDays : 0;
  // Base rental price
  const baseRentalPrice = car.dailyRate * rentalDays;
  // Grand total
  const grandTotal = baseRentalPrice + deliveryFee + insuranceFee;

  // Similar vehicles in same city
  const similarCars = useMemo(() => {
    return allCarsData.filter((c) => c.id !== car.id && c.city.toLowerCase() === car.city.toLowerCase()).slice(0, 3);
  }, [car]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleConfirmReservation = () => {
    setShowBookingSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1a1412] font-sans selection:bg-[#f95721] selection:text-white">
      
      {/* ── BREADCRUMB HEADER BAR ── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#EAE3D9] px-4 sm:px-8 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <button
            type="button"
            onClick={onBackToSearch}
            className="flex items-center gap-2 text-xs font-bold text-[#5A4E46] hover:text-[#1a1412] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#f95721] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Search results ({location})</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full bg-[#FAF8F5] hover:bg-[#EDE6DC] border border-[#E0D7CC] text-xs text-[#3D332D] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedUrl ? 'Copied link!' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-full bg-[#FAF8F5] hover:bg-[#EDE6DC] border border-[#E0D7CC] text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                isSaved ? 'text-[#f95721]' : 'text-[#3D332D]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#f95721] text-[#f95721]' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* ── 1. VEHICLE TITLE & HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#f95721]/10 border border-[#f95721]/20 text-[#f95721]">
                {car.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Dahir Fleet</span>
              </span>
            </div>
            
            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1412] tracking-tight">
              {car.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B5E55] mt-2">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{car.rating > 0 ? car.rating.toFixed(2) : '5.0'}</span>
                <span className="text-[#8C7E74] font-normal">({car.reviewsCount > 0 ? car.reviewsCount : 'New 2026 Model'})</span>
              </div>
              <span className="text-[#C4B9AC]">·</span>
              <div className="flex items-center gap-1 text-[#3D332D]">
                <MapPin className="w-3.5 h-3.5 text-[#f95721]" />
                <span>{car.location}, Morocco</span>
              </div>
              <span className="text-[#C4B9AC]">·</span>
              <div className="text-[#3D332D]">
                Agency: <strong className="text-[#1a1412] font-semibold">{car.agency.name}</strong>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right">
            <div className="text-xs text-[#6B5E55]">Daily rental price</div>
            <div className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#1a1412] tracking-tight">
              {car.dailyRate.toFixed(2)} <span className="text-[#f95721] font-serif text-2xl">{car.currency}</span>
              <span className="text-xs text-[#8C7E74] font-normal">/day</span>
            </div>
          </div>
        </div>

        {/* ── 2. HIGH RES IMAGE GALLERY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-10">
          
          {/* Main Large Hero Image */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden bg-[#F7F4EE] border border-[#EAE3D9] relative aspect-16/10 shadow-xs">
            <img
              src={car.images[activeImageIndex] || car.images[0]}
              alt={car.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono text-white flex items-center gap-2">
              <span>Photo {activeImageIndex + 1} of {car.images.length}</span>
            </div>
          </div>

          {/* Side Thumbnail Stack */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
            {car.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`rounded-2xl overflow-hidden border-2 transition-all cursor-pointer relative aspect-16/10 shadow-xs ${
                  activeImageIndex === idx
                    ? 'border-[#f95721] ring-2 ring-[#f95721]/30'
                    : 'border-[#E0D7CC] hover:border-[#D6CCC0] opacity-85 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${car.name} photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

        </div>

        {/* ── 3. TWO COLUMN LAYOUT: DETAILS ON LEFT, BOOKING WIDGET ON RIGHT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTENT (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Specs Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-4 shadow-xs">
              <h2 className="font-serif-display text-xl font-bold text-[#1a1412]">
                Vehicle Specifications
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CC] space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#6B5E55] font-semibold">Transmission</div>
                  <div className="font-bold text-[#1a1412] text-sm capitalize">{car.transmission}</div>
                  <div className="text-[10px] text-[#8C7E74] font-mono">9-Speed Gearbox</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CC] space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#6B5E55] font-semibold">Fuel & Engine</div>
                  <div className="font-bold text-[#1a1412] text-sm capitalize">{car.fuel}</div>
                  <div className="text-[10px] text-[#8C7E74] font-mono">6.2L / 100km avg</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CC] space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#6B5E55] font-semibold">Capacity</div>
                  <div className="font-bold text-[#1a1412] text-sm">{car.seats} Adults</div>
                  <div className="text-[10px] text-[#8C7E74] font-mono">4 Large Luggage</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CC] space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#6B5E55] font-semibold">Mileage</div>
                  <div className="font-bold text-[#1a1412] text-sm">Unlimited</div>
                  <div className="text-[10px] text-[#8C7E74] font-mono">No extra km charge</div>
                </div>
              </div>
            </div>

            {/* Description & Features */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-xs">
              <div>
                <h2 className="font-serif-display text-xl font-bold text-[#1a1412] mb-3">
                  About this Vehicle
                </h2>
                <p className="text-sm text-[#4A3E37] leading-relaxed">
                  {car.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE3D9]">
                <h3 className="font-serif-display text-base font-bold text-[#1a1412] mb-3">
                  Equipped Features & Comfort
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {car.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-[#2C2420]">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Moroccan Insurance & Protection Packages */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-display text-xl font-bold text-[#1a1412]">
                    Protection & Deposit Options
                  </h2>
                  <p className="text-xs text-[#6B5E55] mt-1">
                    Pre-authorized security hold held on card via Moroccan CMI. No cash deduction.
                  </p>
                </div>
                <ShieldCheck className="w-6 h-6 text-[#f95721]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard Plan */}
                <div 
                  onClick={() => setInsurancePlan('standard')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    insurancePlan === 'standard'
                      ? 'bg-[#FFFDFB] border-[#f95721] ring-2 ring-[#f95721]/20 shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E0D7CC] hover:bg-[#F2ECE4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1a1412] text-sm">Standard Protection</span>
                    <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Included</span>
                  </div>
                  <p className="text-xs text-[#6B5E55]">
                    Third-party liability and comprehensive Moroccan motor coverage.
                  </p>
                  <div className="pt-2 border-t border-[#EAE3D9] text-xs text-[#4A3E37]">
                    Deposit hold: <strong className="text-[#1a1412] font-mono">{car.depositAmount.toLocaleString()} DH</strong>
                  </div>
                </div>

                {/* Premium Zero-Deductible */}
                <div 
                  onClick={() => setInsurancePlan('premium')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    insurancePlan === 'premium'
                      ? 'bg-[#FFFDFB] border-[#f95721] ring-2 ring-[#f95721]/20 shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E0D7CC] hover:bg-[#F2ECE4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1a1412] text-sm">Wafa Zero-Deductible</span>
                    <span className="text-xs font-mono text-[#f95721] font-bold bg-[#f95721]/10 px-2 py-0.5 rounded-md border border-[#f95721]/20">+120 DH / day</span>
                  </div>
                  <p className="text-xs text-[#6B5E55]">
                    Zero financial liability for windshield, tire punctures, and body scratches.
                  </p>
                  <div className="pt-2 border-t border-[#EAE3D9] text-xs text-[#4A3E37]">
                    Reduced deposit: <strong className="text-[#1a1412] font-mono">1,500 DH</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery & Pick-up Locations */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-4 shadow-xs">
              <h2 className="font-serif-display text-xl font-bold text-[#1a1412]">
                Pick-up & Drop-off Location
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryOption('agency')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    deliveryOption === 'agency'
                      ? 'bg-[#FFFDFB] border-[#f95721] ring-2 ring-[#f95721]/20 text-[#1a1412] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E0D7CC] text-[#3D332D] hover:bg-[#F2ECE4]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#1a1412]">Agency Office</div>
                  <div className="text-[11px] text-[#6B5E55] mt-1">{car.agency.address}</div>
                  <div className="text-xs font-mono text-emerald-700 font-bold mt-2">Free</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryOption('airport')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    deliveryOption === 'airport'
                      ? 'bg-[#FFFDFB] border-[#f95721] ring-2 ring-[#f95721]/20 text-[#1a1412] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E0D7CC] text-[#3D332D] hover:bg-[#F2ECE4]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#1a1412]">Tetouan Airport</div>
                  <div className="text-[11px] text-[#6B5E55] mt-1">Sania Ramel (TTU) Arrivals</div>
                  <div className="text-xs font-mono text-[#f95721] font-bold mt-2">+100 DH</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryOption('hotel')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    deliveryOption === 'hotel'
                      ? 'bg-[#FFFDFB] border-[#f95721] ring-2 ring-[#f95721]/20 text-[#1a1412] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E0D7CC] text-[#3D332D] hover:bg-[#F2ECE4]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#1a1412]">Hotel / Villa Delivery</div>
                  <div className="text-[11px] text-[#6B5E55] mt-1">Any address in Tetouan/Martil</div>
                  <div className="text-xs font-mono text-[#f95721] font-bold mt-2">+150 DH</div>
                </button>
              </div>
            </div>

            {/* Agency Verification Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CC] flex items-center justify-center text-xl font-serif-display font-bold text-[#f95721] shadow-xs">
                  {car.agency.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-display font-bold text-lg text-[#1a1412]">{car.agency.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xs text-[#6B5E55] mt-0.5">
                    {car.agency.completedTrips} completed rentals · Member since 2023
                  </div>
                  <div className="text-xs text-amber-500 font-bold mt-1">
                    ★ {car.agency.rating} agency rating
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectPartner) {
                      onSelectPartner(car.agency.id || '5');
                    } else if (onNavigateTab) {
                      onNavigateTab('partner-profile');
                    }
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <span>View Partner Profile &amp; Fleet</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`tel:${car.agency.phone}`}
                  className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#EDE6DC] border border-[#E0D7CC] text-xs font-semibold text-[#1a1412] flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#f95721]" />
                  <span>Call Agency</span>
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR: STICKY BOOKING CARD (lg:col-span-4) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-lg space-y-6">
              
              {/* Header Rate */}
              <div className="flex items-baseline justify-between border-b border-[#EAE3D9] pb-4">
                <div>
                  <div className="text-xs text-[#6B5E55]">Total rate for {rentalDays} days</div>
                  <div className="font-serif-display text-3xl font-bold text-[#1a1412] tracking-tight">
                    {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {car.currency}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-[#f95721] font-bold">
                    {car.dailyRate.toFixed(2)} DH / day
                  </div>
                </div>
              </div>

              {/* Date Selectors */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CC] space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E55]">
                      Pick-up Date
                    </label>
                    <input
                      type="date"
                      value={selectedPickup}
                      onChange={(e) => setSelectedPickup(e.target.value)}
                      className="bg-transparent text-[#1a1412] border-none outline-none text-xs font-mono w-full cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CC] space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5E55]">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={selectedReturn}
                      onChange={(e) => setSelectedReturn(e.target.value)}
                      className="bg-transparent text-[#1a1412] border-none outline-none text-xs font-mono w-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between text-[#4A3E37]">
                  <span>{car.dailyRate} DH × {rentalDays} days</span>
                  <span className="font-mono font-semibold text-[#1a1412]">{baseRentalPrice.toLocaleString()} DH</span>
                </div>

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-[#4A3E37]">
                    <span>Delivery ({deliveryOption})</span>
                    <span className="font-mono font-semibold text-[#1a1412]">+{deliveryFee} DH</span>
                  </div>
                )}

                {insuranceFee > 0 && (
                  <div className="flex justify-between text-[#4A3E37]">
                    <span>Wafa Zero-Deductible</span>
                    <span className="font-mono font-semibold text-[#1a1412]">+{insuranceFee} DH</span>
                  </div>
                )}

                <div className="flex justify-between text-[#6B5E55] text-[11px] pt-1 border-t border-[#EAE3D9]">
                  <span>Refundable deposit hold</span>
                  <span className="font-mono font-semibold text-[#1a1412]">{insurancePlan === 'premium' ? '1,500 DH' : `${car.depositAmount.toLocaleString()} DH`}</span>
                </div>

                <div className="flex justify-between text-[#1a1412] font-bold text-sm pt-2 border-t border-[#EAE3D9]">
                  <span>Total amount to pay</span>
                  <span className="font-serif-display font-extrabold text-base text-[#f95721]">
                    {grandTotal.toLocaleString()} DH
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={handleConfirmReservation}
                className="w-full py-3.5 px-6 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Lock className="w-4 h-4" />
                <span>Reserve this Vehicle</span>
              </button>

              <div className="text-center space-y-1.5 pt-2">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6B5E55]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free cancellation up to 48 hours before pickup</span>
                </div>
                <div className="text-[10px] text-[#8C7E74]">
                  Complies with Moroccan Dahir 2026 contract standards
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── 4. SIMILAR CARS IN TETOUAN ── */}
        {similarCars.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#EAE3D9] space-y-6">
            <h2 className="font-serif-display text-2xl font-bold text-[#1a1412]">
              Similar Vehicles Available in {car.city}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similarCars.map((simCar) => (
                <div
                  key={simCar.id}
                  onClick={() => onSelectAnotherCar(simCar)}
                  className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden hover:border-[#f95721] transition-all cursor-pointer group shadow-xs hover:shadow-md"
                >
                  <div className="aspect-16/10 relative overflow-hidden bg-[#F7F4EE]">
                    <img
                      src={simCar.images[0]}
                      alt={simCar.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif-display font-bold text-[#1a1412] text-base group-hover:text-[#f95721] transition-colors">
                      {simCar.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-[#6B5E55]">
                      <span>{simCar.transmission} · {simCar.seats} seats</span>
                      <span className="font-serif-display font-extrabold text-[#1a1412]">
                        {simCar.dailyRate} DH / day
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── BOOKING CONFIRMATION MODAL ── */}
      {showBookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#E0D7CC] rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl text-[#1a1412] text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-display text-2xl font-bold text-[#1a1412]">
                Reservation Confirmed!
              </h3>
              <p className="text-xs text-[#6B5E55] leading-relaxed">
                Your reservation for the <strong className="text-[#1a1412]">{car.name}</strong> with {car.agency.name} has been pre-confirmed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CC] text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B5E55]">Pick-up Location:</span>
                <span className="text-[#1a1412] font-semibold">{deliveryOption === 'airport' ? 'Tetouan Sania Ramel Airport' : car.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5E55]">Dates:</span>
                <span className="text-[#1a1412] font-semibold">{selectedPickup} → {selectedReturn} ({rentalDays} days)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5E55]">Total Price:</span>
                <span className="text-[#f95721] font-bold font-mono">{grandTotal.toLocaleString()} DH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5E55]">Contract Standard:</span>
                <span className="text-emerald-700 font-semibold">Dahir 2026 E-Sign</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowBookingSuccessModal(false);
                  onBookNow(car, rentalDays, grandTotal);
                }}
                className="w-full py-3 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
              >
                View Contract & Digital Key
              </button>

              <button
                type="button"
                onClick={() => setShowBookingSuccessModal(false)}
                className="w-full py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#EDE6DC] text-[#6B5E55] hover:text-[#1a1412] text-xs font-semibold transition-all cursor-pointer"
              >
                Keep Browsing Cars
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
