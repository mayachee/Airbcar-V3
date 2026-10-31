import React, { useState, useRef } from 'react';
import { 
  CreditCard, Check, ArrowRight, Clock, Star, Shield, Car, 
  FileText, CheckCircle2, AlertTriangle, AlertCircle, Upload, 
  XCircle, RefreshCw, Camera, Trash2, User, Mail, Phone, MapPin, Sparkles
} from 'lucide-react';
import { SavedCar, PastTrip, UserProfile, ActiveTab } from '../types';

interface OverviewViewProps {
  userProfile: UserProfile;
  savedCars: SavedCar[];
  pastTrips: PastTrip[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenSecondDriverModal: () => void;
  onSaveProfile: (profile: UserProfile) => void;
  onSelectCarToBook: (car: SavedCar) => void;
  onOpenPdfModal: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  userProfile,
  savedCars,
  pastTrips,
  onNavigateTab,
  onOpenSecondDriverModal,
  onSaveProfile,
  onSelectCarToBook,
  onOpenPdfModal,
}) => {
  const [profileForm, setProfileForm] = useState({
    fullName: userProfile.fullName || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '',
    avatarUrl: userProfile.avatarUrl || '',
    city: userProfile.city || 'Tetouan',
    cinNumber: userProfile.cinNumber || 'L-849201',
    drivingLicenceNumber: userProfile.drivingLicenceNumber || 'FR-9204812',
    licenceExpiry: userProfile.licenceExpiry || '11 Nov 2026',
  });
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [uploadMockActive, setUploadMockActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileForm(prev => ({ ...prev, avatarUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...userProfile,
      fullName: profileForm.fullName,
      email: profileForm.email,
      phone: profileForm.phone,
      avatarUrl: profileForm.avatarUrl,
      city: profileForm.city,
      cinNumber: profileForm.cinNumber,
      drivingLicenceNumber: profileForm.drivingLicenceNumber,
      licenceExpiry: profileForm.licenceExpiry,
    });
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const isLicenseUploaded = userProfile.hasLicenseUploaded !== false && Boolean(userProfile.drivingLicenceNumber || userProfile.licenseFrontUrl);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-8 pb-16">
      
      {/* 3 Overview Top Cards: Payment, Documents, Verification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: PAYMENT METHOD */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
              PAYMENT METHOD
            </div>
            
            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-8 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-[10px] tracking-wider text-neutral-700">
                VISA
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-900">
                  Visa ending 4218
                </div>
                <div className="text-xs text-neutral-400">
                  Expires 09/28 · default
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-neutral-100 flex items-end justify-between">
            <div>
              <div className="text-[11px] text-neutral-500">Next charge 3 Sep</div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-900">
                2,450 MAD
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('payments')}
              className="text-xs font-semibold text-[#f95721] hover:underline cursor-pointer"
            >
              All invoices
            </button>
          </div>
        </div>

        {/* Card 2: DOCUMENTS */}
        <div className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
          !isLicenseUploaded 
            ? 'border-amber-300 shadow-sm bg-gradient-to-b from-amber-50/30 to-white' 
            : 'border-neutral-200/80 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                DOCUMENTS
              </div>
              {!isLicenseUploaded ? (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  Missing License
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-neutral-900 mt-2">
              {!isLicenseUploaded ? "Driver's license required" : "Licence expires soon"}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              {!isLicenseUploaded 
                ? "Upload both front & back photos of your driver's license to unlock car rentals and instant booking."
                : `Runs out ${userProfile.licenceExpiry || '11 Nov 2026'}. Renew it before your December booking.`}
            </p>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    !isLicenseUploaded ? 'bg-amber-500 w-[15%]' : 'bg-[#f95721] w-[65%]'
                  }`} 
                />
              </div>
              <div className="text-[11px] font-medium text-neutral-500 mt-1.5 flex items-center justify-between">
                <span>{!isLicenseUploaded ? '0 of 2 sides uploaded' : `${userProfile.daysLeft || 76} days left`}</span>
                {!isLicenseUploaded && (
                  <span className="text-amber-700 font-semibold text-[10px]">Action required</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('documents')}
              className={`text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                !isLicenseUploaded 
                  ? 'bg-[#f95721] hover:bg-[#e04816] text-white ring-2 ring-[#f95721]/20' 
                  : 'bg-[#181311] hover:bg-neutral-800 text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{!isLicenseUploaded ? 'Upload Driver License' : 'Upload front & back'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('documents')}
              className="border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-medium px-4 py-2 rounded-full transition-all cursor-pointer"
            >
              View documents
            </button>
          </div>
        </div>

        {/* Card 3: VERIFICATION */}
        <div className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
          !isLicenseUploaded 
            ? 'bg-[#FFFBF7] border-amber-300 shadow-sm ring-1 ring-amber-200/50' 
            : 'bg-[#FAF8F5] border-neutral-200/80 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                VERIFICATION
              </div>
              {!isLicenseUploaded ? (
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  Action Required
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Fully Verified
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-neutral-900 mt-2">
              {!isLicenseUploaded ? "Verification Incomplete" : "You are fully verified"}
            </h3>

            {!isLicenseUploaded && (
              <div className="text-[11px] text-amber-900 bg-amber-500/10 border border-amber-300/60 rounded-xl p-2.5 mt-2 leading-relaxed">
                <strong>License Missing:</strong> Moroccan Dahir transport regulations require verified front &amp; back license before vehicle handover and contract signing.
              </div>
            )}

            <div className="mt-3.5 space-y-2 text-xs text-neutral-700">
              {/* Driving License item */}
              <div className="flex items-center justify-between py-1 border-b border-neutral-200/40">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    !isLicenseUploaded ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                  }`} />
                  <span className="font-medium">Driving Licence:</span>
                </div>
                {!isLicenseUploaded ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1 text-[11px]">
                    <XCircle className="w-3 h-3 text-rose-500" /> Not uploaded
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold font-mono text-[11px]">
                    {userProfile.drivingLicenceNumber || 'FR-9204812'}
                  </span>
                )}
              </div>

              {/* National ID / CIN */}
              <div className="flex items-center justify-between py-1 border-b border-neutral-200/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>National ID / CIN:</span>
                </div>
                <span className="text-emerald-700 font-medium">Checked 14 Mar 2026</span>
              </div>

              {/* Contact info */}
              <div className="flex items-center justify-between py-1 border-b border-neutral-200/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Phone &amp; Email:</span>
                </div>
                <span className="text-emerald-700 font-medium">Confirmed</span>
              </div>

              {/* Second driver status */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${userProfile.hasSecondDriver ? 'bg-emerald-500' : 'bg-neutral-300'} shrink-0`} />
                  <span>Second Driver:</span>
                </div>
                <span className={userProfile.hasSecondDriver ? 'text-emerald-700 font-medium' : 'text-neutral-400'}>
                  {userProfile.hasSecondDriver ? userProfile.secondDriverName : 'Not added yet'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-neutral-200/60 flex flex-wrap items-center justify-between gap-2">
            {!isLicenseUploaded ? (
              <button
                onClick={() => onNavigateTab('documents')}
                className="bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Driving License</span>
              </button>
            ) : (
              <button
                onClick={onOpenSecondDriverModal}
                className="text-xs font-semibold text-[#f95721] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{userProfile.hasSecondDriver ? 'Edit second driver' : 'Add a second driver'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {/* Test simulator button */}
            <button
              type="button"
              onClick={() => {
                const toggled = !isLicenseUploaded;
                onSaveProfile({
                  ...userProfile,
                  hasLicenseUploaded: toggled,
                  licenseStatus: toggled ? 'verified' : 'missing',
                  isVerified: toggled,
                  drivingLicenceNumber: toggled ? 'FR-9204812' : '',
                  licenseFrontUrl: toggled ? 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1000&q=85' : null,
                  licenseBackUrl: toggled ? 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1000&q=85' : null,
                });
              }}
              className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
              title="Click to toggle between Renter With License and Renter Without License to preview both flows"
            >
              <RefreshCw className="w-3 h-3 text-[#f95721]" />
              <span>{isLicenseUploaded ? 'Simulate: No License' : 'Simulate: Has License'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Section: Still on your list (Saved Cars) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900">
            Still on your list
          </h2>
          <button
            onClick={() => onNavigateTab('saved-cars')}
            className="text-xs font-semibold text-[#f95721] hover:underline"
          >
            See all saved cars
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm flex flex-col hover:shadow-md transition-shadow group"
            >
              {/* Image with badge */}
              <div className="relative h-48 bg-neutral-100 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {car.badge && (
                  <div className="absolute top-3 left-3 bg-[#f95721] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {car.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    {car.name}
                  </h3>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {car.location} · {car.transmission} · {car.seats} seats
                  </div>
                  <div className="text-xs text-neutral-400 mt-2 font-medium">
                    {car.name}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {car.location} · {car.transmission} · {car.seats} seats
                  </div>
                </div>

                {/* Price & Action */}
                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-neutral-900">
                      {car.dailyRate.toLocaleString()} MAD
                    </span>
                    <span className="text-xs text-neutral-400">/ day</span>
                  </div>
                  <button
                    onClick={() => onSelectCarToBook(car)}
                    className="bg-[#181311] hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2 rounded-full transition-all active:scale-95"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Roads you have already driven (Trip History) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900">
            Roads you have already driven
          </h2>
          <button
            onClick={() => onNavigateTab('my-trips')}
            className="text-xs font-semibold text-[#f95721] hover:underline"
          >
            All trips
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden divide-y divide-neutral-100">
          {pastTrips.map((trip) => (
            <div
              key={trip.id}
              className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-center gap-4">
                <div className="w-16 sm:w-20 h-12 sm:h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                  <img
                    src={trip.image}
                    alt={trip.carName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">
                    {trip.carName} · {trip.city}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {trip.dates} · {trip.agency}
                  </div>
                </div>
              </div>

              {/* Middle: Total Price */}
              <div className="md:w-36">
                <div className="text-sm font-bold text-neutral-900">
                  {trip.totalPrice.toLocaleString()} {trip.currency}
                </div>
              </div>

              {/* Status Badge */}
              <div className="md:w-36">
                {trip.status === 'Completed' ? (
                  <span className="inline-block bg-[#F5F2EB] text-neutral-700 text-xs font-medium px-3 py-1 rounded-full border border-neutral-200/50">
                    Completed
                  </span>
                ) : (
                  <span className="inline-block border border-[#f95721] text-[#f95721] text-xs font-medium px-3 py-1 rounded-full">
                    Review pending
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                <button
                  onClick={onOpenPdfModal}
                  className="text-[#f95721] hover:underline"
                >
                  Invoice
                </button>
                {trip.status === 'Review pending' ? (
                  <button
                    onClick={() => onNavigateTab('messages')}
                    className="text-[#f95721] hover:underline"
                  >
                    Write review
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigateTab('saved-cars')}
                    className="text-[#f95721] hover:underline"
                  >
                    Rebook
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Section: Messages preview & Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* Left Column: Messages preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif-display text-2xl font-bold text-neutral-900">
              Messages
            </h2>
            <button
              onClick={() => onNavigateTab('messages')}
              className="text-xs font-semibold text-[#f95721] hover:underline"
            >
              Open inbox
            </button>
          </div>

          <div className="space-y-3">
            {/* Message 1 */}
            <div 
              onClick={() => onNavigateTab('messages')}
              className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-sm flex items-start gap-3.5 cursor-pointer hover:border-neutral-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[#f95721] text-white flex items-center justify-center text-xs font-bold shrink-0">
                M
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm font-bold text-neutral-900">
                    Mayache Cars
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-400">2h ago</span>
                    <span className="w-2 h-2 rounded-full bg-[#f95721]" />
                  </div>
                </div>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-1">
                  “Your Golf will be at Terminal 1 on arrivals, plate 4218-A-6.”
                </p>
              </div>
            </div>

            {/* Message 2 */}
            <div 
              onClick={() => onNavigateTab('messages')}
              className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-sm flex items-start gap-3.5 cursor-pointer hover:border-neutral-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm font-bold text-neutral-900">
                    Airbcar support
                  </div>
                  <span className="text-[11px] text-neutral-400">4 May</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-1">
                  “Your Camaro deposit was released on 6 May.”
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile & Logo Editor */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h2 className="font-serif-display text-2xl font-bold text-neutral-900">
                  Renter Profile &amp; ID
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update your personal credentials, contact details, and account logo
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#181311] hover:bg-neutral-800 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-sm cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save changes</span>
              </button>
            </div>

            {saveSuccessToast && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 animate-fade-in shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Profile information and logo updated successfully!</span>
              </div>
            )}

            {/* Hidden File Input for Logo/Photo */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleAvatarFileChange} 
              className="hidden" 
            />

            {/* Logo / Avatar Upload Section */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-neutral-200/70 space-y-3">
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                PROFILE LOGO &amp; AVATAR
              </label>

              <div className="flex flex-wrap items-center gap-4">
                {/* Avatar Preview */}
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-amber-600 text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-md">
                    {profileForm.avatarUrl ? (
                      <img 
                        src={profileForm.avatarUrl} 
                        alt="Profile avatar" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span>{profileForm.fullName ? profileForm.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CD'}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-[#f95721] hover:bg-[#e04816] text-white rounded-xl shadow-xs transition-transform active:scale-90 cursor-pointer"
                    title="Change Logo / Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Upload & Remove buttons */}
                <div className="flex-1 min-w-[200px] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#f95721]" />
                      <span>Upload Logo / Photo</span>
                    </button>

                    {profileForm.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setProfileForm(prev => ({ ...prev, avatarUrl: '' }))}
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove custom logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Supports JPG, PNG or WebP. Displayed in vehicle contracts, agency chats &amp; header.
                  </p>
                </div>
              </div>

              {/* Quick Preset Badges */}
              <div className="pt-2 border-t border-neutral-200/50 flex items-center gap-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Quick Badges:</span>
                <div className="flex items-center gap-1.5">
                  {[
                    { label: 'Traveler', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
                    { label: 'Executive', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
                    { label: 'Atlas Driver', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setProfileForm(prev => ({ ...prev, avatarUrl: preset.url }))}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-[10px] font-medium text-neutral-700 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <img src={preset.url} alt={preset.label} className="w-3.5 h-3.5 rounded-full object-cover" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  FULL LEGAL NAME
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    placeholder="e.g. Camille Dubois"
                    className="w-full bg-[#FAF8F5] border border-neutral-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#f95721] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="e.g. camille.d@mail.com"
                    className="w-full bg-[#FAF8F5] border border-neutral-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#f95721] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  PHONE NUMBER
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+212 6 12 34 56 78"
                    className="w-full bg-[#FAF8F5] border border-neutral-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#f95721] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* City / Base Region */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  CITY / REGION
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <select
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-neutral-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#f95721] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Tetouan">Tetouan</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Agadir">Agadir</option>
                    <option value="Fes">Fes</option>
                  </select>
                </div>
              </div>

              {/* National ID / CIN */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  NATIONAL ID / CIN
                </label>
                <input
                  type="text"
                  value={profileForm.cinNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, cinNumber: e.target.value })}
                  placeholder="e.g. L-849201"
                  className="w-full bg-[#FAF8F5] border border-neutral-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#f95721] focus:bg-white transition-all"
                />
              </div>

              {/* Driving License Number */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  DRIVING LICENCE NUMBER
                </label>
                <input
                  type="text"
                  value={profileForm.drivingLicenceNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, drivingLicenceNumber: e.target.value })}
                  placeholder="e.g. FR-9204812"
                  className="w-full bg-[#FAF8F5] border border-neutral-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#f95721] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                Encrypted &amp; verified under Moroccan CNDP privacy guidelines.
              </span>
              <button
                type="submit"
                className="bg-[#181311] hover:bg-black text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all active:scale-95 shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Save Profile Changes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
