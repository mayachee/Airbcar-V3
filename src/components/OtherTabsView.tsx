import React, { useState } from 'react';
import { 
  SavedCar, PastTrip, UserProfile, ActiveTab 
} from '../types';
import { 
  Car, Calendar, CreditCard, Shield, FileText, CheckCircle2, 
  Upload, AlertTriangle, Download, Plus, Trash2, ArrowRight 
} from 'lucide-react';
import { DriverLicenseSection } from './DriverLicenseSection';
import { SettingsView } from './SettingsView';

interface OtherTabsViewProps {
  activeTab: ActiveTab;
  savedCars: SavedCar[];
  pastTrips: PastTrip[];
  userProfile: UserProfile;
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectCarToBook: (car: SavedCar) => void;
  onOpenPdfModal: () => void;
  onSaveProfile?: (profile: UserProfile) => void;
}

export const OtherTabsView: React.FC<OtherTabsViewProps> = ({
  activeTab,
  savedCars,
  pastTrips,
  userProfile,
  onNavigateTab,
  onSelectCarToBook,
  onOpenPdfModal,
  onSaveProfile,
}) => {
  if (activeTab === 'my-trips') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 space-y-8">
        <div>
          <h2 className="font-serif-display text-3xl font-bold text-neutral-900">
            My Trips
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Track your active, upcoming, and past rental journeys across Morocco.
          </p>
        </div>

        {/* Upcoming Trip Section */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#f95721] mb-3">
            UPCOMING RESERVATION
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-64 h-40 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
                alt="2025 Volkswagen Golf"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-neutral-900">2025 Volkswagen Golf</h3>
              <div className="text-xs text-neutral-500 mt-0.5">Mayache Cars · Agadir Terminal 1 Arrivals</div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs">
                <div><span className="text-neutral-400">Pick-up:</span> <strong className="text-neutral-800">Thu 3 Sep, 10:00</strong></div>
                <div><span className="text-neutral-400">Return:</span> <strong className="text-neutral-800">Tue 8 Sep, 10:00</strong></div>
                <div><span className="text-neutral-400">Total:</span> <strong className="text-neutral-900">2,450 MAD</strong></div>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => onNavigateTab('contracts')}
                className="bg-[#181311] hover:bg-neutral-800 text-white text-xs font-semibold px-6 py-2.5 rounded-full text-center"
              >
                View contract
              </button>
              <button
                onClick={() => onNavigateTab('messages')}
                className="border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold px-6 py-2.5 rounded-full text-center"
              >
                Chat with agency
              </button>
            </div>
          </div>
        </div>

        {/* Past History */}
        <div>
          <h3 className="font-serif-display text-xl font-bold text-neutral-900 mb-4">
            Completed Journeys
          </h3>
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm divide-y divide-neutral-100 overflow-hidden">
            {pastTrips.map((trip) => (
              <div key={trip.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={trip.image} alt={trip.carName} className="w-16 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <div className="font-bold text-neutral-900 text-sm">{trip.carName} · {trip.city}</div>
                    <div className="text-xs text-neutral-500">{trip.dates} · {trip.agency}</div>
                  </div>
                </div>
                <div className="font-bold text-neutral-900">{trip.totalPrice} {trip.currency}</div>
                <div className="flex items-center gap-3">
                  <button onClick={onOpenPdfModal} className="text-xs font-semibold text-[#f95721] hover:underline">
                    Receipt & Invoice
                  </button>
                  <button onClick={() => onNavigateTab('saved-cars')} className="bg-[#181311] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    Rebook
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'saved-cars') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 space-y-8">
        <div>
          <h2 className="font-serif-display text-3xl font-bold text-neutral-900">
            Saved Vehicles
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Hand-picked rentals with verified local Moroccan agencies, ready for instant reservation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCars.map((car) => (
            <div key={car.id} className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-sm flex flex-col group">
              <div className="relative h-52 bg-neutral-100 overflow-hidden">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                {car.badge && (
                  <span className="absolute top-3 left-3 bg-[#f95721] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {car.badge}
                  </span>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900 text-lg">{car.name}</h3>
                  <div className="text-xs text-neutral-500 mt-1">{car.location} · {car.transmission} · {car.seats} seats</div>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-neutral-900">{car.dailyRate.toLocaleString()} MAD</span>
                    <span className="text-xs text-neutral-400"> / day</span>
                  </div>
                  <button
                    onClick={() => onSelectCarToBook(car)}
                    className="bg-[#181311] hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all"
                  >
                    Book now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'documents') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 space-y-8">
        <div>
          <h2 className="font-serif-display text-3xl font-bold text-neutral-900">
            Documents & Verification
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Valid documentation is verified by Airbcar once and recognized by all Moroccan agencies.
          </p>
        </div>

        {/* Driver's License Documents (Front & Back) - Upload & Previews */}
        <DriverLicenseSection 
          userProfile={userProfile} 
          onUpdateProfile={onSaveProfile} 
          onNavigateTab={onNavigateTab} 
        />

        {/* Additional Identity & Compliance Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(() => {
            const hasLicense = userProfile.hasLicenseUploaded !== false && Boolean(userProfile.drivingLicenceNumber || userProfile.licenseFrontUrl);
            return (
              <div className={`rounded-3xl p-6 border shadow-sm space-y-4 text-[#f5efe8] ${
                !hasLicense ? 'bg-[#201511] border-amber-500/40' : 'bg-[#1a130f] border-[#2b2018]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#f5efe8]">Registered Licence Details</div>
                  {hasLicense ? (
                    <span className="text-xs font-bold text-[#f95721] bg-[#f95721]/15 px-2.5 py-1 rounded-full border border-[#f95721]/30">
                      Expires in 76 days
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/15 px-2.5 py-1 rounded-full border border-rose-500/30">
                      Not Uploaded
                    </span>
                  )}
                </div>

                {hasLicense ? (
                  <>
                    <p className="text-xs text-[#8d7e73]">
                      Licence ID: {userProfile.drivingLicenceNumber || 'FR-9204812'} · Issued by France · Category B (Light vehicles)
                    </p>
                    <div className="w-full h-2 bg-[#261d16] rounded-full overflow-hidden">
                      <div className="h-full bg-[#f95721] rounded-full w-[65%]" />
                    </div>
                    <div className="text-[11px] text-[#8d7e73] flex items-center justify-between">
                      <span>Valid through: {userProfile.licenceExpiry || '11 Nov 2026'}</span>
                      <span className="font-medium text-[#f5efe8]">{userProfile.daysLeft || 76} days left</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-[#a89b90]">
                      No driver's license currently on file for {userProfile.fullName}. Upload front and back sides above.
                    </p>
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Legal Requirement:</strong> Moroccan Dahir n° 1-10-07 prohibits car rental companies from releasing vehicles without a verified license.
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          <div className="bg-[#1a130f] rounded-3xl p-6 border border-[#2b2018] shadow-sm space-y-4 text-[#f5efe8]">
            <div className="flex items-center justify-between">
              <div className="font-bold text-[#f5efe8]">Passport / National ID</div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Verified
              </span>
            </div>
            <p className="text-xs text-[#8d7e73]">
              Identity document checked on 14 Mar 2026. Biometric verification active.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full compliance with Moroccan Ministry of Transport</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'payments') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 space-y-8">
        <div>
          <h2 className="font-serif-display text-3xl font-bold text-neutral-900">
            Payment & Security Escrow
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage your cards, security deposit pre-authorizations, and digital VAT invoices.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-4 max-w-xl">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">PRIMARY CARD</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded-lg bg-neutral-900 text-white font-bold text-[10px] flex items-center justify-center">
                VISA
              </div>
              <div>
                <div className="font-bold text-sm text-neutral-900">Visa ending in 4218</div>
                <div className="text-xs text-neutral-400">Expires 09/28 · Default for rentals & deposits</div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600">Active</span>
          </div>
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Security deposit escrow protocol:</span>
            <span className="font-bold text-neutral-800">2,000 MAD pre-authorized hold</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'settings') {
    return <SettingsView userProfile={userProfile} />;
  }

  return null;
};
