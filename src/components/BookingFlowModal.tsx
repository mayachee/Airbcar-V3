import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Car, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  FileSignature, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Download, 
  Clock, 
  DollarSign, 
  CreditCard, 
  AlertCircle,
  AlertTriangle,
  Eye,
  RotateCw,
  Upload,
  Trash2,
  Camera,
  ShieldAlert,
  ZoomIn
} from 'lucide-react';
import { SavedCar, UserProfile } from '../types';
import { DriverLicenseVisualCard } from './common/DriverLicenseVisualCard';
import { useAuth } from '../context/AuthContext';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: SavedCar | null;
  userProfile: UserProfile;
  onBookingSuccess: (bookingData: {
    car: SavedCar;
    dates: string;
    totalAmount: number;
    contractNumber: string;
    paymentMethod?: string;
  }) => void;
  onOpenPdfModal?: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  car,
  userProfile,
  onBookingSuccess,
  onOpenPdfModal,
  onUpdateProfile,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Dates & Options
  const [pickupDate, setPickupDate] = useState('2026-10-14');
  const [returnDate, setReturnDate] = useState('2026-10-19');
  const [pickupLocation, setPickupLocation] = useState('Agadir Al Massira Airport (AGA)');
  const [insuranceTier, setInsuranceTier] = useState<'standard' | 'premium' | 'zero_excess'>('premium');
  const [hasSecondDriver, setHasSecondDriver] = useState(userProfile.hasSecondDriver || false);
  const [secondDriverName, setSecondDriverName] = useState(userProfile.secondDriverName || '');
  const [secondDriverLicence, setSecondDriverLicence] = useState(userProfile.secondDriverLicence || '');
  const [paymentMethod, setPaymentMethod] = useState<'cmi' | 'cash' | 'wafacash' | 'apple_pay'>('cmi');

  // Step 2: Strict Front & Back Driver License Validation
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const initialHasLicense = userProfile.hasLicenseUploaded !== false;
  const [licenseFrontImage, setLicenseFrontImage] = useState<string | null>(
    initialHasLicense 
      ? (userProfile.licenseFrontUrl || 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1000&q=85') 
      : null
  );
  const [licenseBackImage, setLicenseBackImage] = useState<string | null>(
    initialHasLicense 
      ? (userProfile.licenseBackUrl || 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1000&q=85') 
      : null
  );
  const [frontFileName, setFrontFileName] = useState<string | null>(
    initialHasLicense ? 'permis_conduire_maroc_recto_84291.jpg' : null
  );
  const [backFileName, setBackFileName] = useState<string | null>(
    initialHasLicense ? 'permis_conduire_maroc_verso_84291.jpg' : null
  );
  const [licenseSide, setLicenseSide] = useState<'front' | 'back'>('front');
  const [isDraggingFront, setIsDraggingFront] = useState(false);
  const [isDraggingBack, setIsDraggingBack] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Lightbox preview modal
  const [previewModalUrl, setPreviewModalUrl] = useState<{ url: string; title: string } | null>(null);

  // Step 3: Contract & Signature
  const [signatureText, setSignatureText] = useState(userProfile.fullName);
  const [agreedToContract, setAgreedToContract] = useState(false);
  const [agreedToEscrow, setAgreedToEscrow] = useState(false);
  const [contractNumber] = useState(`CTR-MA-${Math.floor(100000 + Math.random() * 900000)}`);
  const [signedDate] = useState(new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }));

  // Keep state synced with userProfile updates
  useEffect(() => {
    if (userProfile.hasLicenseUploaded === false) {
      setLicenseFrontImage(null);
      setLicenseBackImage(null);
      setFrontFileName(null);
      setBackFileName(null);
    } else if (userProfile.licenseFrontUrl && userProfile.licenseBackUrl) {
      setLicenseFrontImage(userProfile.licenseFrontUrl);
      setLicenseBackImage(userProfile.licenseBackUrl);
      setFrontFileName('permis_conduire_maroc_recto_84291.jpg');
      setBackFileName('permis_conduire_maroc_verso_84291.jpg');
    }
  }, [userProfile.hasLicenseUploaded, userProfile.licenseFrontUrl, userProfile.licenseBackUrl]);

  if (!isOpen || !car) return null;

  // License presence validation
  const hasFrontLicense = Boolean(licenseFrontImage && licenseFrontImage.trim().length > 0);
  const hasBackLicense = Boolean(licenseBackImage && licenseBackImage.trim().length > 0);
  const isLicenseComplete = hasFrontLicense && hasBackLicense;

  // Calculation
  const start = new Date(pickupDate).getTime();
  const end = new Date(returnDate).getTime();
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24))) || 5;
  const insurancePricePerDay = insuranceTier === 'zero_excess' ? 120 : insuranceTier === 'premium' ? 45 : 0;
  const subtotal = car.dailyRate * days;
  const insuranceTotal = insurancePricePerDay * days;
  const serviceFee = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + insuranceTotal + serviceFee;
  const depositHold = 2000;

  // Upload handler
  const handleFileUpload = (file: File, side: 'front' | 'back') => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      setValidationError('Please upload a valid image file (JPG, PNG, WebP) or PDF.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    if (side === 'front') {
      setLicenseFrontImage(objectUrl);
      setFrontFileName(file.name);
      setValidationError(null);
      if (hasBackLicense || licenseBackImage) {
        onUpdateProfile?.({
          ...userProfile,
          hasLicenseUploaded: true,
          licenseStatus: 'verified',
          isVerified: true,
          licenseFrontUrl: objectUrl,
        });
      }
    } else {
      setLicenseBackImage(objectUrl);
      setBackFileName(file.name);
      setValidationError(null);
      if (hasFrontLicense || licenseFrontImage) {
        onUpdateProfile?.({
          ...userProfile,
          hasLicenseUploaded: true,
          licenseStatus: 'verified',
          isVerified: true,
          licenseBackUrl: objectUrl,
        });
      }
    }
  };

  const handleRemoveLicense = (side: 'front' | 'back') => {
    if (side === 'front') {
      setLicenseFrontImage(null);
      setFrontFileName(null);
      if (frontInputRef.current) frontInputRef.current.value = '';
    } else {
      setLicenseBackImage(null);
      setBackFileName(null);
      if (backInputRef.current) backInputRef.current.value = '';
    }
    setValidationError(null);
    onUpdateProfile?.({
      ...userProfile,
      hasLicenseUploaded: false,
      licenseStatus: 'missing',
      isVerified: false,
      ...(side === 'front' ? { licenseFrontUrl: null } : { licenseBackUrl: null }),
    });
  };

  const handleLoadSampleLicense = () => {
    const sampleFront = 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1000&q=85';
    const sampleBack = 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1000&q=85';
    setLicenseFrontImage(sampleFront);
    setLicenseBackImage(sampleBack);
    setFrontFileName('permis_conduire_maroc_recto_84291.jpg');
    setBackFileName('permis_conduire_maroc_verso_84291.jpg');
    setValidationError(null);
    onUpdateProfile?.({
      ...userProfile,
      hasLicenseUploaded: true,
      licenseStatus: 'verified',
      isVerified: true,
      drivingLicenceNumber: 'FR-9204812',
      licenseFrontUrl: sampleFront,
      licenseBackUrl: sampleBack,
    });
  };

  const handleClearLicense = () => {
    setLicenseFrontImage(null);
    setLicenseBackImage(null);
    setFrontFileName(null);
    setBackFileName(null);
    if (frontInputRef.current) frontInputRef.current.value = '';
    if (backInputRef.current) backInputRef.current.value = '';
    setValidationError("License images cleared. Moroccan Dahir law requires both front and back photos before rental submission.");
    onUpdateProfile?.({
      ...userProfile,
      hasLicenseUploaded: false,
      licenseStatus: 'missing',
      isVerified: false,
      licenseFrontUrl: null,
      licenseBackUrl: null,
    });
  };

  // Step 2 -> Step 3 Strict Validation Gate
  const validateAndProceedToContract = () => {
    if (!hasFrontLicense && !hasBackLicense) {
      setValidationError("Action Required: Both Front (Recto) and Back (Verso) photos of your driver's license are missing. Upload both sides to continue.");
      return;
    }
    if (!hasFrontLicense) {
      setValidationError("Action Required: Missing Front (Recto) photo of your driver's license. Please upload it to proceed.");
      return;
    }
    if (!hasBackLicense) {
      setValidationError("Action Required: Missing Back (Verso) photo of your driver's license. Please upload it to proceed.");
      return;
    }
    setValidationError(null);
    setCurrentStep(3);
  };

  // Step 3 -> Step 4 Final Submission with Strict Validation Guard
  const handleCompleteBooking = () => {
    if (!isLicenseComplete) {
      setValidationError("Strict Booking Validation Error: Rental submission requires verified front and back driver's license images under Moroccan law.");
      setCurrentStep(2);
      return;
    }
    if (!agreedToContract || !agreedToEscrow || !signatureText.trim()) {
      return;
    }
    const paymentLabel = 
      paymentMethod === 'cmi' ? 'Carte Bancaire CMI (3D Secure)' :
      paymentMethod === 'cash' ? 'Espèces à la Prise en Charge' :
      paymentMethod === 'wafacash' ? 'Virement CashPlus / Wafacash' : 'Apple Pay';

    onBookingSuccess({
      car,
      dates: `${pickupDate} to ${returnDate}`,
      totalAmount,
      contractNumber,
      paymentMethod: paymentLabel,
    });
    setCurrentStep(4);
  };

  return (
    <div className="fixed inset-0 bg-[#1a1412]/60 backdrop-blur-sm z-50 overflow-y-auto p-3 sm:p-6 lg:p-8 flex justify-center items-center">
      <div className="bg-[#FAF8F5] border border-[#EAE3D9] rounded-3xl max-w-4xl w-full text-[#1a1412] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-6 bg-white border-b border-[#EAE3D9] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6e5d53]">
              <span className="font-serif-display font-bold text-[#1a1412] tracking-wider">airbcar</span>
              <span>·</span>
              <span className="text-[#c43b0d] font-semibold">Morocco Rental Escrow</span>
              <span>·</span>
              <span className="font-mono text-[10px] text-[#4a3b32] bg-[#F7F4EE] px-2 py-0.5 rounded border border-[#EAE3D9]">{contractNumber}</span>
            </div>
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1a1412] mt-1">
              {currentStep === 1 && `Reserve ${car.name}`}
              {currentStep === 2 && 'Step 2: Verify Identity & Driver Documents'}
              {currentStep === 3 && 'Step 3: Review & Sign Moroccan Rental Contract'}
              {currentStep === 4 && 'Booking Confirmed & Contract Dispatched!'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-[#F7F4EE] text-[#6e5d53] hover:text-[#1a1412] hover:bg-[#EAE3D9] transition-all cursor-pointer border border-[#EAE3D9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {currentStep < 4 && (
          <div className="px-6 py-3 bg-[#F4EFEA] border-b border-[#EAE3D9] flex items-center justify-between text-xs font-semibold shrink-0">
            <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-[#c43b0d]' : currentStep > 1 ? 'text-emerald-700' : 'text-[#8d7e73]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 1 ? 'bg-[#c43b0d] text-white' : currentStep > 1 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-[#EAE3D9] text-[#6e5d53]'}`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span>Trip &amp; Vehicle</span>
            </div>
            <span className="text-[#b5a79c]">→</span>
            <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-[#c43b0d]' : currentStep > 2 ? 'text-emerald-700' : 'text-[#8d7e73]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 2 ? 'bg-[#c43b0d] text-white' : currentStep > 2 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-[#EAE3D9] text-[#6e5d53]'}`}>
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <span>Documents (Permis)</span>
            </div>
            <span className="text-[#b5a79c]">→</span>
            <div className={`flex items-center gap-2 ${currentStep === 3 ? 'text-[#c43b0d]' : 'text-[#8d7e73]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 3 ? 'bg-[#c43b0d] text-white' : 'bg-[#EAE3D9] text-[#6e5d53]'}`}>
                3
              </span>
              <span>Contract &amp; Signature</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#FAF8F5]">

          {/* STEP 1: TRIP DATES & VEHICLE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Car Card Preview */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs flex flex-col sm:flex-row items-center gap-5">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full sm:w-44 h-28 object-cover rounded-xl border border-[#EAE3D9]"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-[#1a1412]">{car.name}</h3>
                    <span className="text-xs font-bold text-[#c43b0d] bg-[#c43b0d]/10 px-3 py-1 rounded-full border border-[#c43b0d]/20">
                      {car.dailyRate} MAD / day
                    </span>
                  </div>
                  <p className="text-xs text-[#6e5d53] mt-1">
                    {car.location} · {car.transmission} · {car.seats} Seats · Verified Local Agency
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-[#6e5d53]">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Ministry Licensed
                    </span>
                    <span className="text-[#d5ccc1]">·</span>
                    <span>Clean Handover Guarantee</span>
                  </div>
                </div>
              </div>

              {/* OAuth Authentication Banner in Booking Flow */}
              {isAuthenticated && user ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-emerald-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-950">{user.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200/60 text-emerald-800 font-semibold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Verified Google Account
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800/80">{user.email} · Ready for Dahir 2026 digital signing</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline shrink-0 cursor-pointer"
                  >
                    Switch
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-950">Fast-Track Reservation with Google OAuth</span>
                    </div>
                    <p className="text-[11px] text-amber-800/90 mt-0.5">
                      Sign in to pre-populate driver details, CIN identification, and enable 1-click contract signing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs border border-amber-300 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </div>
              )}

              {/* Dates & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4a3b32] mb-1">Pick-up Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-white border border-[#D9CFC4] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1412] focus:border-[#c43b0d] focus:ring-1 focus:ring-[#c43b0d] focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a3b32] mb-1">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-white border border-[#D9CFC4] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1412] focus:border-[#c43b0d] focus:ring-1 focus:ring-[#c43b0d] focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4a3b32] mb-1">Handover &amp; Return Location</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Agadir Al Massira Airport (AGA)"
                  className="w-full bg-white border border-[#D9CFC4] rounded-xl px-3.5 py-2.5 text-xs text-[#1a1412] placeholder-[#a69688] focus:border-[#c43b0d] focus:ring-1 focus:ring-[#c43b0d] focus:outline-none shadow-2xs"
                />
              </div>

              {/* Insurance Tier Options */}
              <div>
                <label className="block text-xs font-semibold text-[#4a3b32] mb-2">Insurance &amp; Protection Tier</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setInsuranceTier('standard')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                      insuranceTier === 'standard' 
                        ? 'bg-[#FAF2EC] border-[#c43b0d] ring-1 ring-[#c43b0d]/20 text-[#1a1412]' 
                        : 'bg-white border-[#EAE3D9] text-[#4a3b32] hover:border-[#b5a79c]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#1a1412]">Basic Third-Party</div>
                    <div className="text-[10px] text-[#6e5d53] mt-1">Deductible: 5,000 MAD</div>
                    <div className="text-xs font-semibold text-emerald-700 mt-2">Included</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInsuranceTier('premium')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                      insuranceTier === 'premium' 
                        ? 'bg-[#FAF2EC] border-[#c43b0d] ring-1 ring-[#c43b0d]/20 text-[#1a1412]' 
                        : 'bg-white border-[#EAE3D9] text-[#4a3b32] hover:border-[#b5a79c]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#1a1412] flex items-center justify-between">
                      <span>Comprehensive</span>
                      <span className="text-[9px] bg-[#c43b0d] text-white px-1.5 py-0.5 rounded-sm">POPULAR</span>
                    </div>
                    <div className="text-[10px] text-[#6e5d53] mt-1">Deductible: 1,500 MAD · Glass &amp; Tires</div>
                    <div className="text-xs font-semibold text-[#c43b0d] mt-2">+45 MAD / day</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInsuranceTier('zero_excess')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                      insuranceTier === 'zero_excess' 
                        ? 'bg-[#FAF2EC] border-[#c43b0d] ring-1 ring-[#c43b0d]/20 text-[#1a1412]' 
                        : 'bg-white border-[#EAE3D9] text-[#4a3b32] hover:border-[#b5a79c]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#1a1412]">Zero Excess Peace</div>
                    <div className="text-[10px] text-[#6e5d53] mt-1">0 MAD Deductible · Full Escrow Shield</div>
                    <div className="text-xs font-semibold text-amber-700 mt-2">+120 MAD / day</div>
                  </button>
                </div>
              </div>

              {/* Moroccan Payment Method Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1a1412] uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#c43b0d]" />
                    Mode de Règlement (Morocco Payment Options)
                  </label>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    Dahir 2026 Escrow Protected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cmi')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                      paymentMethod === 'cmi'
                        ? 'bg-[#FAF2EC] border-[#c43b0d] ring-1 ring-[#c43b0d]/20 text-[#1a1412]'
                        : 'bg-white border-[#EAE3D9] text-[#4a3b32] hover:border-[#b5a79c]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1a1412]">Carte Bancaire CMI</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">3D SECURE</span>
                    </div>
                    <div className="text-[10px] text-[#6e5d53] mt-1">Visa, Mastercard, Attijariwafa, BCP, BMCE, CIH</div>
                    <div className="text-[11px] font-semibold text-[#c43b0d] mt-2">Zero frais de transaction</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                      paymentMethod === 'cash'
                        ? 'bg-[#FAF2EC] border-[#c43b0d] ring-1 ring-[#c43b0d]/20 text-[#1a1412]'
                        : 'bg-white border-[#EAE3D9] text-[#4a3b32] hover:border-[#b5a79c]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1a1412]">Espèces au Comptoir</span>
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">MAD CASH</span>
                    </div>
                    <div className="text-[10px] text-[#6e5d53] mt-1">Paiement à la remise des clés avec reçu fiscal</div>
                    <div className="text-[11px] font-semibold text-amber-700 mt-2">Prise en charge instantanée</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wafacash')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                      paymentMethod === 'wafacash'
                        ? 'bg-[#FAF2EC] border-[#c43b0d] ring-1 ring-[#c43b0d]/20 text-[#1a1412]'
                        : 'bg-white border-[#EAE3D9] text-[#4a3b32] hover:border-[#b5a79c]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1a1412]">CashPlus / Wafacash</span>
                      <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">RÉSEAU MAROC</span>
                    </div>
                    <div className="text-[10px] text-[#6e5d53] mt-1">Code de paiement dans 3,500 agences au Maroc</div>
                    <div className="text-[11px] font-semibold text-blue-700 mt-2">Réservation garantie 2h</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-[#FAF2EC] border-[#c43b0d] ring-1 ring-[#c43b0d]/20 text-[#1a1412]'
                        : 'bg-white border-[#EAE3D9] text-[#4a3b32] hover:border-[#b5a79c]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1a1412]">Apple Pay / Google Pay</span>
                      <span className="text-[9px] bg-neutral-100 text-neutral-800 font-bold px-1.5 py-0.5 rounded">1-TOUCH</span>
                    </div>
                    <div className="text-[10px] text-[#6e5d53] mt-1">Authentification biométrique instantanée</div>
                    <div className="text-[11px] font-semibold text-emerald-700 mt-2">Empreinte caution sécurisée</div>
                  </button>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 rounded-xl bg-white border border-[#EAE3D9] space-y-2 text-xs shadow-2xs">
                <div className="flex justify-between text-[#6e5d53]">
                  <span>Vehicle Rental ({car.dailyRate} MAD × {days} days)</span>
                  <span className="text-[#1a1412] font-medium">{subtotal} MAD</span>
                </div>
                {insuranceTotal > 0 && (
                  <div className="flex justify-between text-[#6e5d53]">
                    <span>Insurance Cover ({insurancePricePerDay} MAD × {days} days)</span>
                    <span className="text-[#1a1412] font-medium">+{insuranceTotal} MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6e5d53]">
                  <span>Airbcar Trust &amp; Escrow Fee (5%)</span>
                  <span className="text-[#1a1412] font-medium">{serviceFee} MAD</span>
                </div>
                <div className="pt-2 border-t border-[#EAE3D9] flex justify-between items-center text-sm font-bold">
                  <span className="text-[#1a1412]">Total Rental Amount</span>
                  <span className="text-[#c43b0d] font-mono text-base">{totalAmount} MAD</span>
                </div>
                <div className="text-[11px] text-[#6e5d53] flex items-center justify-between pt-1">
                  <span>Refundable Security Deposit (pre-authorized on card):</span>
                  <span className="font-semibold text-[#1a1412]">{depositHold} MAD</span>
                </div>
              </div>
            </div>
          )}

          {/* Hidden File Inputs for Strict License Validation */}
          <input
            ref={frontInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'front');
            }}
          />
          <input
            ref={backInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'back');
            }}
          />

          {/* STEP 2: DOCUMENTS & DRIVER LICENSE VERIFICATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Header Bar with Real-Time Validation Status */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#c43b0d] flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Required Rental Documents &amp; Verification
                  </div>
                  <p className="text-xs text-[#6e5d53] mt-0.5">
                    Moroccan traffic regulations (Dahir n° 1-10-07) mandate valid driving licence (both front &amp; back) and passport/CIN before contract signature.
                  </p>
                </div>
                <div>
                  {isLicenseComplete ? (
                    <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Both Sides Verified
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-full border border-rose-200 flex items-center gap-1.5 shrink-0 animate-pulse">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Action Required: Missing Images
                    </span>
                  )}
                </div>
              </div>

              {/* Validation Warning / Error Callout */}
              {(!isLicenseComplete || validationError) && (
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-2">
                        <span>Mandatory Physical Driver's License Validation</span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-mono px-2 py-0.5 rounded border border-rose-200">
                          Dahir n° 1-10-07 Enforced
                        </span>
                      </h4>
                      <p className="text-xs text-[#5c4a3e] leading-relaxed">
                        Under Moroccan transport law, a valid car rental contract CANNOT be executed without high-resolution photographic proof of <strong>both Front (Recto)</strong> and <strong>Back (Verso)</strong> of the renter's driver's license.
                      </p>
                    </div>
                  </div>

                  {/* Missing Side Indicator Checklist */}
                  <div className="pt-2 border-t border-rose-200/80 flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-[#6e5d53] font-medium">Status:</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      hasFrontLicense 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-100/80 text-rose-900 border border-rose-200'
                    }`}>
                      {hasFrontLicense ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                      Front Side (Recto): {hasFrontLicense ? 'Ready' : 'MISSING'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      hasBackLicense 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-100/80 text-rose-900 border border-rose-200'
                    }`}>
                      {hasBackLicense ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                      Back Side (Verso): {hasBackLicense ? 'Ready' : 'MISSING'}
                    </span>
                  </div>

                  {validationError && (
                    <div className="text-xs text-rose-700 font-medium pt-1 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>{validationError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Developer / Testing Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#F4EFEA] border border-[#EAE3D9] text-xs">
                <span className="text-[#6e5d53] font-medium text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c43b0d]" />
                  Quick Verification &amp; Testing Actions:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSampleLicense}
                    className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200 transition-colors cursor-pointer"
                  >
                    ⚡ Load Verified Sample Licences (1-Click)
                  </button>
                  <button
                    type="button"
                    onClick={handleClearLicense}
                    className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-[11px] border border-rose-200 transition-colors cursor-pointer"
                  >
                    ✕ Reset / Test Missing State
                  </button>
                </div>
              </div>

              {/* Front and Back License Upload & Preview Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1a1412] uppercase tracking-wider">
                    Physical License Uploads (Recto &amp; Verso Required)
                  </span>
                  <span className="text-[11px] text-[#6e5d53]">
                    Accepted: JPG, PNG, WebP or PDF · Max 10MB
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CARD 1: FRONT SIDE (RECTO) */}
                  <div 
                    className={`rounded-2xl border p-4 transition-all shadow-2xs ${
                      hasFrontLicense 
                        ? 'bg-white border-emerald-300 shadow-sm' 
                        : isDraggingFront
                          ? 'bg-[#FAF2EC] border-[#c43b0d] ring-2 ring-[#c43b0d]/30'
                          : 'bg-white border-dashed border-rose-200 hover:border-rose-400'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingFront(true); }}
                    onDragLeave={() => setIsDraggingFront(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFront(false);
                      if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0], 'front');
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#F4EFEA] text-[#c43b0d] font-bold text-[10px] flex items-center justify-center border border-[#EAE3D9]">
                          1
                        </span>
                        <span className="text-xs font-bold text-[#1a1412]">Front Side (Recto)</span>
                      </div>
                      {hasFrontLicense ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Validated
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> Required
                        </span>
                      )}
                    </div>

                    {hasFrontLicense && licenseFrontImage ? (
                      <div className="space-y-3">
                        <div className="relative group rounded-xl overflow-hidden border border-[#EAE3D9] bg-[#FAF8F5] aspect-[16/10] flex items-center justify-center">
                          <img
                            src={licenseFrontImage}
                            alt="Front License"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-[#1a1412]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewModalUrl({ url: licenseFrontImage, title: "Driver's License — Front (Recto)" })}
                              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors backdrop-blur-sm"
                            >
                              <ZoomIn className="w-4 h-4" />
                              <span>Enlarge</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => frontInputRef.current?.click()}
                              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors backdrop-blur-sm"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Replace</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#6e5d53]">
                          <span className="truncate max-w-[180px] font-mono text-[#1a1412]">
                            {frontFileName || 'license_front_photo.jpg'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLicense('front')}
                            className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 px-4 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                          <Camera className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#1a1412]">Upload Front (Recto) Photo</p>
                          <p className="text-[11px] text-[#6e5d53] mt-0.5">Drag &amp; drop or browse from device</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => frontInputRef.current?.click()}
                          className="px-4 py-2 rounded-xl bg-[#F7F4EE] hover:bg-[#EAE3D9] text-[#c43b0d] font-bold text-xs border border-[#EAE3D9] transition-colors cursor-pointer flex items-center gap-1.5 mx-auto shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Front Photo</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CARD 2: BACK SIDE (VERSO) */}
                  <div 
                    className={`rounded-2xl border p-4 transition-all shadow-2xs ${
                      hasBackLicense 
                        ? 'bg-white border-emerald-300 shadow-sm' 
                        : isDraggingBack
                          ? 'bg-[#FAF2EC] border-[#c43b0d] ring-2 ring-[#c43b0d]/30'
                          : 'bg-white border-dashed border-rose-200 hover:border-rose-400'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingBack(true); }}
                    onDragLeave={() => setIsDraggingBack(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingBack(false);
                      if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0], 'back');
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#F4EFEA] text-[#c43b0d] font-bold text-[10px] flex items-center justify-center border border-[#EAE3D9]">
                          2
                        </span>
                        <span className="text-xs font-bold text-[#1a1412]">Back Side (Verso)</span>
                      </div>
                      {hasBackLicense ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Validated
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> Required
                        </span>
                      )}
                    </div>

                    {hasBackLicense && licenseBackImage ? (
                      <div className="space-y-3">
                        <div className="relative group rounded-xl overflow-hidden border border-[#EAE3D9] bg-[#FAF8F5] aspect-[16/10] flex items-center justify-center">
                          <img
                            src={licenseBackImage}
                            alt="Back License"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-[#1a1412]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewModalUrl({ url: licenseBackImage, title: "Driver's License — Back (Verso)" })}
                              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors backdrop-blur-sm"
                            >
                              <ZoomIn className="w-4 h-4" />
                              <span>Enlarge</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => backInputRef.current?.click()}
                              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors backdrop-blur-sm"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Replace</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#6e5d53]">
                          <span className="truncate max-w-[180px] font-mono text-[#1a1412]">
                            {backFileName || 'license_back_photo.jpg'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLicense('back')}
                            className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 px-4 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                          <Camera className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#1a1412]">Upload Back (Verso) Photo</p>
                          <p className="text-[11px] text-[#6e5d53] mt-0.5">Category stamps &amp; serial code verification</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => backInputRef.current?.click()}
                          className="px-4 py-2 rounded-xl bg-[#F7F4EE] hover:bg-[#EAE3D9] text-[#c43b0d] font-bold text-xs border border-[#EAE3D9] transition-colors cursor-pointer flex items-center gap-1.5 mx-auto shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Back Photo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Driver License Visual Inspection Flip Component */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1a1412]">
                    Live Security Card Facsimile (Morocco &amp; International Recognition)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLicenseSide(prev => prev === 'front' ? 'back' : 'front')}
                      className="px-3 py-1 rounded-full bg-white hover:bg-[#F7F4EE] text-[#c43b0d] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#EAE3D9] shadow-2xs"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Flip to {licenseSide === 'front' ? 'Back (Verso)' : 'Front (Recto)'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Card */}
                <DriverLicenseVisualCard
                  licenseNumber={userProfile.drivingLicenceNumber || 'FR-9204812'}
                  driverName={userProfile.fullName}
                  driverCountry="France / Morocco Recognized"
                  driverFlag="🇲🇦"
                  driverCinOrPassport="BE-849102"
                  birthDate="14.05.1986"
                  issueDate="11.11.2016"
                  expiryDate="11.11.2026"
                  categories={['B', 'AM']}
                  defaultSide={licenseSide}
                />
              </div>

              {/* Passport & Identity Confirmation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#EAE3D9] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1a1412]">Passport / National CIN</span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">✓ Verified</span>
                  </div>
                  <p className="text-xs font-mono text-[#c43b0d] font-semibold">BE-849102 · Morocco / EU</p>
                  <p className="text-[11px] text-[#6e5d53]">
                    Biometric scan verified by Airbcar trust layer on 14 Mar 2026.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#EAE3D9] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1a1412]">Second Driver (Optional)</span>
                    <button
                      type="button"
                      onClick={() => setHasSecondDriver(!hasSecondDriver)}
                      className="text-xs text-[#c43b0d] font-semibold hover:underline cursor-pointer"
                    >
                      {hasSecondDriver ? 'Remove' : '+ Add Driver'}
                    </button>
                  </div>
                  {hasSecondDriver ? (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        placeholder="Second Driver Full Name"
                        value={secondDriverName}
                        onChange={(e) => setSecondDriverName(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D9CFC4] rounded-lg px-2.5 py-1.5 text-xs text-[#1a1412] focus:border-[#c43b0d] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Licence Number (e.g. 09/48291)"
                        value={secondDriverLicence}
                        onChange={(e) => setSecondDriverLicence(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D9CFC4] rounded-lg px-2.5 py-1.5 text-xs text-[#1a1412] focus:border-[#c43b0d] focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#6e5d53]">
                      No second driver registered. Driving by unauthorized third parties voids comprehensive insurance.
                    </p>
                  )}
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                isLicenseComplete
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {isLicenseComplete ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>All documents comply with Ministry of Transport standard circular and Dahir n° 1-10-07 for car rentals in Morocco.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>Upload both front and back photos of your driver's license above before you can proceed to the rental contract.</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: MOROCCAN RENTAL CONTRACT & DIGITAL SIGNATURE */}
          {currentStep === 3 && (
            <div className="space-y-6">
              
              {/* Contract Top Banner */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-[#c43b0d] flex items-center gap-1.5">
                    <FileSignature className="w-4 h-4" /> Contrat de Location Automobile Marocain
                  </div>
                  <h3 className="font-bold text-[#1a1412] text-base mt-0.5">
                    Official Bilingual Digital Contract #{contractNumber}
                  </h3>
                  <p className="text-xs text-[#6e5d53]">
                    Conforme au Dahir n° 1-10-07 et au cahier des charges du Ministère du Transport du Royaume du Maroc.
                  </p>
                </div>
                {onOpenPdfModal && (
                  <button
                    type="button"
                    onClick={onOpenPdfModal}
                    className="px-3.5 py-2 rounded-xl bg-[#F7F4EE] hover:bg-[#EAE3D9] border border-[#EAE3D9] text-xs font-semibold text-[#1a1412] flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#c43b0d]" />
                    <span>View Draft PDF</span>
                  </button>
                )}
              </div>

              {/* Hard Defensive Check in Step 3 if user somehow arrives without images */}
              {!isLicenseComplete && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <strong className="text-rose-950 font-bold block">License Verification Incomplete</strong>
                      Both Front (Recto) and Back (Verso) photos are strictly mandated to sign and execute this rental agreement.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-2xs"
                  >
                    Return to Step 2
                  </button>
                </div>
              )}

              {/* Live Contract Preview Box */}
              <div className="p-5 rounded-2xl bg-white border border-[#EAE3D9] font-mono text-xs space-y-4 max-h-72 overflow-y-auto leading-relaxed text-[#3d2e26] select-none border-l-4 border-l-[#c43b0d] shadow-2xs">
                <div className="text-center font-bold pb-2 border-b border-[#EAE3D9] text-[#1a1412]">
                  ROYAUME DU MAROC · MINISTÈRE DU TRANSPORT ET DE LA LOGISTIQUE
                  <div className="text-[10px] text-[#6e5d53] font-normal">CONTRAT DE LOCATION DE VÉHICULE SANS CHAUFFEUR N° {contractNumber}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <strong className="text-[#1a1412] block">LOCATAIRE (RENTER):</strong>
                    {userProfile.fullName}<br />
                    Tél: {userProfile.phone}<br />
                    Permis: {userProfile.drivingLicenceNumber || 'FR-9204812'}<br />
                    CIN / Passeport: BE-849102
                  </div>
                  <div>
                    <strong className="text-[#1a1412] block">VÉHICULE LOUÉ:</strong>
                    {car.name}<br />
                    Matricule: 58291-A-1<br />
                    Lieu Prise en charge: {pickupLocation}<br />
                    Période: {pickupDate} au {returnDate} ({days} Jours)
                  </div>
                </div>

                {/* Annexed Verified Documents Section */}
                <div className="text-[11px] pt-2 border-t border-[#EAE3D9]">
                  <strong className="text-[#1a1412] block mb-1">PIÈCES JUSTIFICATIVES ANNEXÉES (ATTACHED COMPLIANCE DOCUMENTS):</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-center gap-2 p-1.5 rounded bg-[#FAF8F5] border border-[#EAE3D9]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Permis Recto: {frontFileName || 'Photo face avant validée'}</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded bg-[#FAF8F5] border border-[#EAE3D9]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Permis Verso: {backFileName || 'Photo face arrière validée'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] pt-2 border-t border-[#EAE3D9]">
                  <strong className="text-[#1a1412] block mb-1">CLAUSES PARTICULIÈRES ET PROTOCOLE SÉQUESTRE AIRBCAR:</strong>
                  1. CAUTION ET FRANCHISE: Le locataire autorise un séquestre de garantie bancaire d'un montant de {depositHold} MAD. La caution est restituée sans déduction dans les 24h suivant l'inspection de retour sans dommage.<br />
                  2. ASSURANCE: Formule {insuranceTier === 'zero_excess' ? 'Tous Risques Zéro Franchise' : 'Tous Risques avec franchise réduite'}. Assistance dépannage 24/7 incluse sur l'ensemble du territoire national marocain.<br />
                  3. CARBURANT &amp; KILOMÉTRAGE: Restitution même niveau (Plein/Plein). Kilométrage illimité.<br />
                  4. PROTECTION DES DONNÉES: Traitement certifié conforme CNDP n° D-W-412/2026.
                </div>
              </div>

              {/* Checkbox Agreements */}
              <div className="space-y-2.5">
                <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#EAE3D9] cursor-pointer shadow-2xs hover:bg-[#FAF8F5] transition-colors">
                  <input
                    type="checkbox"
                    checked={agreedToContract}
                    onChange={(e) => setAgreedToContract(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#c43b0d] focus:ring-[#c43b0d] accent-[#c43b0d]"
                  />
                  <div className="text-xs text-[#6e5d53]">
                    <span className="text-[#1a1412] font-semibold block">Accept General Rental Conditions &amp; Moroccan Law</span>
                    I confirm that I have reviewed the standard rental contract terms, cancellation policy, and vehicle inspection protocols.
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#EAE3D9] cursor-pointer shadow-2xs hover:bg-[#FAF8F5] transition-colors">
                  <input
                    type="checkbox"
                    checked={agreedToEscrow}
                    onChange={(e) => setAgreedToEscrow(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#c43b0d] focus:ring-[#c43b0d] accent-[#c43b0d]"
                  />
                  <div className="text-xs text-[#6e5d53]">
                    <span className="text-[#1a1412] font-semibold block">Security Deposit Escrow Authorization ({depositHold} MAD)</span>
                    I authorize Airbcar Escrow to place a pre-authorized hold of {depositHold} MAD on my card upon check-in, refundable upon safe vehicle return.
                  </div>
                </label>
              </div>

              {/* Digital Signature Pad Box */}
              <div className="p-4 rounded-xl bg-white border border-[#EAE3D9] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1a1412] flex items-center gap-1.5">
                    <FileSignature className="w-3.5 h-3.5 text-[#c43b0d]" />
                    Electronic Signature of Renter
                  </label>
                  <span className="text-[10px] text-[#6e5d53] font-mono">Date: {signedDate}</span>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Type full legal name to sign"
                    className="w-full bg-[#FAF8F5] border border-[#D9CFC4] rounded-xl px-4 py-3 text-lg font-serif italic text-[#1a1412] focus:border-[#c43b0d] focus:bg-white focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs text-emerald-600 font-sans font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> e-Signed
                  </span>
                </div>
                <p className="text-[10px] text-[#6e5d53]">
                  By typing your name, you execute an enforceable electronic signature under Moroccan Law No. 53-05 on digital exchange of legal data.
                </p>
              </div>

            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {currentStep === 4 && (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#1a1412]">
                  Booking Confirmed &amp; Contract Signed!
                </h3>
                <p className="text-xs sm:text-sm text-[#6e5d53] mt-1 max-w-md mx-auto">
                  Your reservation for <strong className="text-[#1a1412]">{car.name}</strong> is locked in with Mayache Cars.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-[#EAE3D9] text-xs space-y-2 text-left shadow-2xs">
                <div className="flex justify-between text-[#6e5d53]">
                  <span>Contract Number:</span>
                  <span className="font-mono font-bold text-[#c43b0d]">{contractNumber}</span>
                </div>
                <div className="flex justify-between text-[#6e5d53]">
                  <span>Handover Date:</span>
                  <span className="text-[#1a1412] font-semibold">{pickupDate} (10:00 AM)</span>
                </div>
                <div className="flex justify-between text-[#6e5d53]">
                  <span>Handover Location:</span>
                  <span className="text-[#1a1412] font-semibold">{pickupLocation}</span>
                </div>
                <div className="flex justify-between text-[#6e5d53]">
                  <span>Total Amount Paid / Escrowed:</span>
                  <span className="text-[#1a1412] font-bold">{totalAmount} MAD</span>
                </div>
                <div className="flex justify-between text-[#6e5d53]">
                  <span>Security Deposit Escrow:</span>
                  <span className="text-emerald-700 font-semibold">{depositHold} MAD (Hold active)</span>
                </div>
                <div className="flex justify-between text-[#6e5d53]">
                  <span>Driver's License Annex:</span>
                  <span className="text-emerald-700 font-semibold">Recto &amp; Verso Validated</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {onOpenPdfModal && (
                  <button
                    type="button"
                    onClick={onOpenPdfModal}
                    className="px-6 py-2.5 rounded-full bg-[#F7F4EE] hover:bg-[#EAE3D9] text-[#1a1412] text-xs font-semibold flex items-center gap-2 border border-[#EAE3D9] cursor-pointer shadow-2xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Signed Contract PDF</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-7 py-2.5 rounded-full bg-[#c43b0d] hover:bg-[#a8320a] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Done &amp; View Trips
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Nav Buttons with Strict Step Gatekeeping */}
        {currentStep < 4 && (
          <div className="p-5 bg-white border-t border-[#EAE3D9] flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="px-5 py-2.5 rounded-full bg-[#F7F4EE] hover:bg-[#EAE3D9] text-[#4a3b32] hover:text-[#1a1412] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-[#EAE3D9]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs text-[#6e5d53] hover:text-[#1a1412] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            {currentStep === 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-7 py-2.5 rounded-full bg-[#c43b0d] hover:bg-[#a8320a] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Documents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                onClick={validateAndProceedToContract}
                disabled={!isLicenseComplete}
                className={`px-7 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                  isLicenseComplete
                    ? 'bg-[#c43b0d] hover:bg-[#a8320a] text-white cursor-pointer'
                    : 'bg-[#EAE3D9] text-[#9c8e82] border border-[#D9CFC4] cursor-not-allowed'
                }`}
              >
                {!isLicenseComplete ? (
                  !hasFrontLicense && !hasBackLicense ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Upload Both License Sides to Continue</span>
                    </>
                  ) : !hasFrontLicense ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Upload Front (Recto) to Continue</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Upload Back (Verso) to Continue</span>
                    </>
                  )
                ) : (
                  <>
                    <span>Confirm Documents &amp; Review Contract</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                disabled={!agreedToContract || !agreedToEscrow || !signatureText.trim() || !isLicenseComplete}
                onClick={handleCompleteBooking}
                className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                  agreedToContract && agreedToEscrow && signatureText.trim() && isLicenseComplete
                    ? 'bg-[#c43b0d] hover:bg-[#a8320a] text-white cursor-pointer'
                    : 'bg-[#EAE3D9] text-[#9c8e82] cursor-not-allowed'
                }`}
              >
                <FileSignature className="w-4 h-4" />
                <span>
                  {!isLicenseComplete 
                    ? "License Incomplete — Return to Step 2 to Sign" 
                    : `Sign Contract & Confirm (${totalAmount} MAD)`}
                </span>
              </button>
            )}
          </div>
        )}

      </div>

      {/* Lightbox / High-Resolution Image Preview Modal */}
      {previewModalUrl && (
        <div 
          className="fixed inset-0 bg-[#1a1412]/80 z-60 flex flex-col items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div 
            className="bg-white border border-[#EAE3D9] rounded-2xl max-w-2xl w-full p-4 overflow-hidden shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D9]">
              <span className="text-xs font-bold text-[#1a1412] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c43b0d]" />
                {previewModalUrl.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="p-1 rounded-full text-[#6e5d53] hover:text-[#1a1412] hover:bg-[#F7F4EE] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#EAE3D9] flex items-center justify-center max-h-[60vh]">
              <img
                src={previewModalUrl.url}
                alt={previewModalUrl.title}
                className="max-h-[60vh] w-auto object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6e5d53] pt-1">
              <span>Moroccan Transport Regulation Dahir n° 1-10-07 Document Check</span>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="px-3 py-1 rounded-lg bg-[#F7F4EE] text-[#1a1412] hover:bg-[#EAE3D9] text-xs font-semibold cursor-pointer border border-[#EAE3D9]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
