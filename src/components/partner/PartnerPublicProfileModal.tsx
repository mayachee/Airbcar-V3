import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Car, 
  Award, 
  Calendar, 
  Fuel, 
  Users, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { PartnerProfile, PartnerVehicle } from '../../types/partner';

interface PartnerPublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerProfile: PartnerProfile;
  vehicles: PartnerVehicle[];
  selectedCurrency?: string;
}

export const PartnerPublicProfileModal: React.FC<PartnerPublicProfileModalProps> = ({
  isOpen,
  onClose,
  partnerProfile,
  vehicles,
  selectedCurrency = 'DH MAD',
}) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'reviews' | 'about'>('fleet');

  if (!isOpen) return null;

  const mockReviews = [
    {
      id: 'rev-1',
      author: 'Thomas Leroy',
      country: 'France',
      date: '28 Aug 2026',
      rating: 5,
      car: '2025 Volkswagen Golf',
      comment: 'Super easy pickup right outside Agadir Al Massira terminal. Car was spotless, brand new, and handover took literally 4 minutes with the digital contract.',
    },
    {
      id: 'rev-2',
      author: 'Fatima-Zahra B.',
      country: 'Morocco',
      date: '15 Aug 2026',
      rating: 5,
      car: '2024 Dacia Duster 4x4',
      comment: 'Very professional agency in Azrou. Clear terms, no surprise fees, and the security deposit was released on the same day after return inspection.',
    },
    {
      id: 'rev-3',
      author: 'Marcus Vance',
      country: 'United Kingdom',
      date: '02 Aug 2026',
      rating: 5,
      car: '2024 Hyundai Tucson',
      comment: 'Yassine from Mayache Cars was responsive on WhatsApp and Telegram when our flight had a 40 min delay. Outstanding service.',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#1a130f] border border-[#2b2018] rounded-3xl max-w-4xl w-full text-[#f5efe8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#261d16] flex items-center justify-between bg-[#16100c] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-[#8d7e73] uppercase tracking-wider">
              Customer Storefront Preview • Live Mode
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8d7e73] hover:text-[#f5efe8] hover:bg-[#241b15] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-7 flex-1">
          
          {/* Agency Storefront Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#201813] border border-[#2c2019] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#f95721]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5">
                {partnerProfile.logoUrl ? (
                  <img 
                    src={partnerProfile.logoUrl} 
                    alt={partnerProfile.agencyName} 
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#f95721]/40 shadow-md shrink-0" 
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f95721] to-[#c73b0d] text-white font-serif-display text-3xl font-bold flex items-center justify-center shadow-md shrink-0">
                    {partnerProfile.agencyName?.charAt(0).toUpperCase() || 'M'}
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#f5efe8]">
                      {partnerProfile.agencyName || 'Mayache Cars'}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Agency
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#a89b90] mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#f95721]" />
                      {partnerProfile.city || 'Azrou / Agadir'}, Morocco
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      4.9 (128 reviews)
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" /> 12 min avg reply
                    </span>
                  </div>
                </div>
              </div>

              {/* Renter trust pill */}
              <div className="bg-[#2a2019] border border-[#382b21] rounded-2xl p-3.5 text-xs space-y-1 sm:max-w-[210px] shrink-0">
                <div className="text-[#8d7e73] text-[10px] uppercase font-bold tracking-wider">
                  Airbcar Guarantee
                </div>
                <div className="text-[#f5efe8] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#f95721]" />
                  <span>Escrow Deposit & 24/7 Handover</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-5 text-xs sm:text-sm text-[#b5a79c] leading-relaxed relative z-10 border-t border-[#2c2019] pt-4">
              {partnerProfile.description || 'Premier car rental agency offering pristine and certified vehicles across Morocco with instant airport delivery, verified digital contracts, and zero hidden fees.'}
            </p>
          </div>

          {/* Navigation Tabs in Customer Storefront */}
          <div className="flex items-center gap-2 border-b border-[#261d16] pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('fleet')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'fleet'
                  ? 'bg-[#f95721] text-white shadow-xs'
                  : 'text-[#8d7e73] hover:text-[#f5efe8] hover:bg-[#201813]'
              }`}
            >
              Fleet & Vehicles ({vehicles.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-[#f95721] text-white shadow-xs'
                  : 'text-[#8d7e73] hover:text-[#f5efe8] hover:bg-[#201813]'
              }`}
            >
              Customer Reviews (128)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-[#f95721] text-white shadow-xs'
                  : 'text-[#8d7e73] hover:text-[#f5efe8] hover:bg-[#201813]'
              }`}
            >
              Agency Info & Policies
            </button>
          </div>

          {/* Tab 1: Fleet */}
          {activeTab === 'fleet' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#8d7e73]">
                <span>Showing vehicles ready for instant booking</span>
                <span>Prices in <strong className="text-[#f5efe8]">{selectedCurrency}</strong></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((car) => (
                  <div 
                    key={car.id} 
                    className="p-4 rounded-2xl bg-[#201813] border border-[#2c2019] hover:border-[#3d2e23] transition-all flex gap-4 items-center group"
                  >
                    <div className="w-28 h-24 rounded-xl overflow-hidden bg-black/40 shrink-0">
                      <img 
                        src={car.image} 
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#f5efe8] truncate">
                          {car.make} {car.model}
                        </h4>
                        <span className="text-[11px] font-mono text-[#8d7e73]">
                          {car.year}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[#8d7e73] mt-1.5">
                        <span>{car.transmission}</span>
                        <span>•</span>
                        <span>{car.fuelType}</span>
                        <span>•</span>
                        <span>{car.seats} seats</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#2a1f18]">
                        <div>
                          <span className="font-bold text-[#f95721] text-sm">
                            {car.dailyRate} {selectedCurrency.replace('DH ', '')}
                          </span>
                          <span className="text-[10px] text-[#8d7e73]"> / day</span>
                        </div>

                        <span className="text-[10px] font-semibold bg-[#2a1f18] text-[#f5efe8] px-3 py-1 rounded-full border border-[#382b21]">
                          Instant Reserve
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#201813] border border-[#2c2019] flex items-center justify-between text-xs">
                <div>
                  <div className="text-2xl font-bold text-[#f5efe8]">4.9 / 5.0</div>
                  <div className="text-[#8d7e73] text-[11px] mt-0.5">Based on 128 verified renter contracts</div>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {mockReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-[#201813] border border-[#2c2019] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#f5efe8]">{rev.author}</span>
                        <span className="text-[#8d7e73] ml-2">({rev.country})</span>
                      </div>
                      <span className="text-[11px] text-[#8d7e73]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((starIndex) => (
                        <Star 
                          key={starIndex} 
                          className={`w-3 h-3 ${
                            starIndex <= Math.round(rev.rating || 5) 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-neutral-700'
                          }`} 
                        />
                      ))}
                      <span className="text-[10px] text-[#8d7e73] ml-2 font-mono">Booked: {rev.car}</span>
                    </div>
                    <p className="text-xs text-[#b5a79c] leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: About & Policies */}
          {activeTab === 'about' && (
            <div className="p-6 rounded-2xl bg-[#201813] border border-[#2c2019] space-y-5 text-xs">
              <div>
                <h4 className="font-bold text-sm text-[#f5efe8] mb-2">Agency Registration</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#a89b90]">
                  <div>Business Name: <strong className="text-[#f5efe8]">{partnerProfile.agencyName}</strong></div>
                  <div>Tax ID / IF: <strong className="text-[#f5efe8]">{partnerProfile.taxId || '4545-MA'}</strong></div>
                  <div>Address: <strong className="text-[#f5efe8]">{partnerProfile.address}</strong></div>
                  <div>Phone: <strong className="text-[#f5efe8]">{partnerProfile.phone}</strong></div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2a1f18]">
                <h4 className="font-bold text-sm text-[#f5efe8] mb-2">Rental Policies & Inclusions</h4>
                <ul className="space-y-2 text-[#b5a79c]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Free airport delivery to Agadir Al Massira (Terminal 1 Arrivals)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>24/7 Roadside Assistance across Morocco included in all rentals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant digital contracts compliant with Moroccan Ministry of Transport</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#261d16] flex items-center justify-between bg-[#16100c] shrink-0 text-xs">
          <span className="text-[#8d7e73]">
            This is how prospective renters see your storefront on the Airbcar platform.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f95721] hover:bg-[#e04a17] text-white font-semibold px-5 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
          >
            Close Storefront View
          </button>
        </div>

      </div>
    </div>
  );
};
