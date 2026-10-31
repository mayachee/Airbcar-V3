import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Car, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Fuel, 
  Settings2, 
  Users, 
  Sparkles, 
  Heart, 
  MessageSquare, 
  Clock, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Filter,
  Database
} from 'lucide-react';
import { SavedCar, ActiveTab } from '../../types';

interface RentViewProps {
  savedCars: SavedCar[];
  onSelectCarToBook: (car: SavedCar) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

interface DestinationItem {
  number: string;
  tag: string;
  name: string;
  description: string;
  image: string;
  recommendedType: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    number: '01 / Imperial',
    tag: 'Imperial',
    name: 'Marrakech',
    description: "Sun-bleached souks and snowcapped Atlas peaks within an hour's drive.",
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80',
    recommendedType: 'SUV & 4×4'
  },
  {
    number: '02 / Coastal',
    tag: 'Coastal',
    name: 'Essaouira',
    description: "Atlantic winds, white-and-blue ramparts, and fish straight off the wooden boats.",
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    recommendedType: 'Compact & Crossover'
  },
  {
    number: '03 / Sahara',
    tag: 'Sahara',
    name: 'Merzouga',
    description: "4×4 country. Rolling Erg Chebbi dunes that swallow the horizon by sundown.",
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    recommendedType: 'Dune-ready 4×4'
  },
  {
    number: '04 / Capital',
    tag: 'Capital',
    name: 'Casablanca',
    description: "Art-deco boulevards, the Atlantic Hassan II skyline, and a Friday-night soul.",
    image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80',
    recommendedType: 'Executive Sedan'
  },
  {
    number: '05 / Blue',
    tag: 'Blue City',
    name: 'Chefchaouen',
    description: "Indigo alleys folded into the Rif mountain ridges. Mountain roads worth every hairpin.",
    image: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&w=800&q=80',
    recommendedType: 'Compact & SUV'
  },
  {
    number: '06 / Spiritual',
    tag: 'Spiritual',
    name: 'Fes',
    description: "The world's oldest living medina. Worth a dependable ride and an unhurried week.",
    image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=800&q=80',
    recommendedType: 'Sedan & Electric'
  }
];

const CITIES_WITH_AGENCIES = [
  { name: 'Tetouan', count: '18 agencies' },
  { name: 'Casablanca', count: '86 agencies' },
  { name: 'Marrakech', count: '71 agencies' },
  { name: 'Tangier', count: '28 agencies' },
  { name: 'Rabat', count: '42 agencies' },
  { name: 'Agadir', count: '38 agencies' },
  { name: 'Fes', count: '34 agencies' },
  { name: 'Chefchaouen', count: '12 agencies' },
  { name: 'Merzouga', count: '9 agencies' }
];

const VEHICLE_CATEGORIES = [
  'All',
  'SUV & 4×4',
  'Sedan',
  'Luxury',
  'Electric',
  'Compact',
  'Van & 7-seat'
];

export const RentView: React.FC<RentViewProps> = ({
  savedCars,
  onSelectCarToBook,
  onNavigateTab
}) => {
  const [selectedCity, setSelectedCity] = useState('All Morocco');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pickupDate, setPickupDate] = useState('2026-09-12');
  const [returnDate, setReturnDate] = useState('2026-09-18');
  const [searchQuery, setSearchQuery] = useState('');

  // Enriched vehicle listings prioritizing Firestore real-time savedCars
  const allFleetVehicles: SavedCar[] = useMemo(() => {
    const additionalVehicles: SavedCar[] = [
      {
        id: 'fleet-1',
        name: 'Toyota Land Cruiser Prado TX',
        location: 'Marrakech Menara (RAK)',
        transmission: 'Automatic',
        seats: 7,
        dailyRate: 1100,
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
        badge: 'Atlas & Desert Ready'
      },
      {
        id: 'fleet-2',
        name: 'Mercedes-Benz C-Class 220d',
        location: 'Casablanca Mohammed V (CMN)',
        transmission: 'Automatic',
        seats: 5,
        dailyRate: 950,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
        badge: 'Executive VIP'
      },
      {
        id: 'fleet-3',
        name: 'Dacia Duster 4x4 Prestige',
        location: 'Agadir Al-Massira (AGA)',
        transmission: 'Manual',
        seats: 5,
        dailyRate: 480,
        image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80',
        badge: 'Top Value'
      },
      {
        id: 'fleet-4',
        name: 'Tesla Model Y Dual Motor',
        location: 'Tangier Ibn Battouta (TNG)',
        transmission: 'Automatic',
        seats: 5,
        dailyRate: 880,
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
        badge: '100% Electric'
      },
      {
        id: 'fleet-5',
        name: 'Volkswagen Touareg V6 TDI',
        location: 'Rabat-Salé Airport (RBA)',
        transmission: 'Automatic',
        seats: 5,
        dailyRate: 1350,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
        badge: 'Premium Comfort'
      },
      {
        id: 'fleet-6',
        name: 'Renault Clio 5 Turbo',
        location: 'Fes Saïss (FEZ)',
        transmission: 'Manual',
        seats: 5,
        dailyRate: 320,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        badge: 'City Explorer'
      }
    ];

    // Combine Firestore cars with base verified fleet without duplicate IDs
    const existingIds = new Set(savedCars.map(c => c.id));
    const uniqueAdditional = additionalVehicles.filter(c => !existingIds.has(c.id));
    return [...savedCars, ...uniqueAdditional];
  }, [savedCars]);

  // Filtered fleet
  const filteredFleet = useMemo(() => {
    return allFleetVehicles.filter(car => {
      const matchCity = selectedCity === 'All Morocco' || car.location.toLowerCase().includes(selectedCity.toLowerCase());
      const matchSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || car.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchCat = true;
      if (selectedCategory === 'SUV & 4×4') {
        matchCat = car.name.includes('Prado') || car.name.includes('Duster') || car.name.includes('Touareg') || car.name.includes('Defender');
      } else if (selectedCategory === 'Sedan') {
        matchCat = car.name.includes('Mercedes') || car.name.includes('BMW') || car.name.includes('Audi') || car.name.includes('Clio');
      } else if (selectedCategory === 'Electric') {
        matchCat = car.name.includes('Tesla') || car.name.includes('Electric');
      } else if (selectedCategory === 'Luxury') {
        matchCat = car.dailyRate >= 900;
      } else if (selectedCategory === 'Compact') {
        matchCat = car.dailyRate < 500;
      }

      return matchCity && matchSearch && matchCat;
    });
  }, [allFleetVehicles, selectedCity, selectedCategory, searchQuery]);

  return (
    <div className="w-full pb-20">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden bg-[#181311] text-white pt-16 pb-20 px-4 sm:px-8 border-b border-white/10">
        {/* Subtle background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#f95721]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          {/* Tag & City pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f95721]/20 text-[#f95721] border border-[#f95721]/30">
              <Sparkles className="w-3.5 h-3.5" />
              Airbcar Morocco
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Database className="w-3 h-3" />
              Firestore Real-Time Fleet ({allFleetVehicles.length} cars)
            </span>
            <span className="text-xs text-neutral-400">
              Rent from trusted local agencies with zero middlemen markups
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-3xl space-y-4">
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              The road to Morocco,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f95721] to-amber-300">
                uncaged.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl font-normal">
              Rent from trusted local agencies, share the road with a community of explorers, and discover the country at your own pace — no detours through middlemen.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="bg-[#241c19] border border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              
              {/* Destination / City */}
              <div className="bg-[#181311] border border-white/10 rounded-2xl p-3 flex flex-col justify-center">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#f95721]" /> Pick-up City
                </span>
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="mt-1 bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
                >
                  {CITIES_WITH_AGENCIES.map(city => (
                    <option key={city.name} value={city.name} className="bg-[#241c19] text-white">
                      {city.name} ({city.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pick-up Date */}
              <div className="bg-[#181311] border border-white/10 rounded-2xl p-3 flex flex-col justify-center">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Pick-up Date
                </span>
                <input 
                  type="date" 
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="mt-1 bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
                />
              </div>

              {/* Return Date */}
              <div className="bg-[#181311] border border-white/10 rounded-2xl p-3 flex flex-col justify-center">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Return Date
                </span>
                <input 
                  type="date" 
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="mt-1 bg-transparent text-white font-medium text-sm focus:outline-none cursor-pointer"
                />
              </div>

              {/* Find cars action */}
              <div className="flex items-center">
                <button 
                  onClick={() => onNavigateTab('search')}
                  className="w-full h-full min-h-[52px] bg-[#f95721] hover:bg-[#e04816] text-white font-semibold text-sm rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Cars &amp; Map</span>
                </button>
              </div>
            </div>

            {/* Popular quick tags */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
              <span className="text-neutral-500 font-medium">Quick hubs:</span>
              {['Tetouan', 'Casablanca', 'Marrakech', 'Tangier', 'Merzouga'].map((hub) => (
                <button
                  key={hub}
                  onClick={() => {
                    setSelectedCity(hub);
                    if (hub === 'Tetouan') {
                      onNavigateTab('search');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    selectedCity === hub 
                      ? 'bg-[#f95721] text-white font-bold' 
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                  }`}
                >
                  {hub}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-neutral-300 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">320+</span>
              <span className="text-neutral-400">Local agencies</span>
            </div>
            <span className="text-[#f95721]">✦</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">100%</span>
              <span className="text-neutral-400">Verified drivers</span>
            </div>
            <span className="text-[#f95721]">✦</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">Wafa</span>
              <span className="text-neutral-400">Insured trips</span>
            </div>
            <span className="text-[#f95721]">✦</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">14</span>
              <span className="text-neutral-400">Moroccan cities</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. DESTINATIONS SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#f95721]">
              Moroccan Roadtrips
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              From Imperial to Saharan
            </h2>
            <p className="text-sm text-neutral-500 mt-1.5 max-w-xl">
              Hand-picked destinations across Morocco — each with vehicles tuned to the terrain, the season, and the company you keep.
            </p>
          </div>
        </div>

        {/* 6 Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest) => (
            <div 
              key={dest.name}
              className="group bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/50 text-white backdrop-blur-md">
                  {dest.number}
                </span>

                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f95721] text-white shadow-xs">
                  {dest.recommendedType}
                </span>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-serif-display text-2xl font-bold">{dest.name}</h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {dest.description}
                </p>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <button 
                    onClick={() => {
                      setSelectedCity(dest.name);
                      const fleetSection = document.getElementById('available-fleet');
                      fleetSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-[#f95721] hover:text-[#d44516] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Browse {dest.name} cars</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-neutral-400">Direct agency handover</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. VEHICLE CATEGORIES & AVAILABLE FLEET ── */}
      <section id="available-fleet" className="bg-[#f2eee7] py-16 px-4 sm:px-8 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#f95721]">
                Curated Moroccan Fleet
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
                Every road, the right machine
              </h2>
              <p className="text-sm text-neutral-600 mt-1.5 max-w-xl">
                From nimble medina compacts to desert-spec 4×4s. Browse by what the trip actually demands, backed by real Moroccan rental contracts.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {VEHICLE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#181311] text-white shadow-sm'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFleet.map((car) => (
              <div 
                key={car.id}
                className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-neutral-100">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {car.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#f95721] text-white shadow-xs">
                        {car.badge}
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md">
                      {car.dailyRate} MAD <span className="text-[10px] font-normal text-neutral-300">/ day</span>
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif-display font-bold text-lg text-neutral-900">
                          {car.name}
                        </h3>
                        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          {car.location}
                        </p>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-100 text-xs text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Settings2 className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>CNDP Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => onSelectCarToBook(car)}
                    className="w-full py-3 px-4 rounded-2xl bg-[#181311] hover:bg-[#f95721] text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                  >
                    <span>Book with Document Check</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-neutral-400 mt-2">
                    Instant contract review &amp; digital signature included
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredFleet.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8">
              <Car className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="font-serif-display text-xl font-bold text-neutral-800">No vehicles match this filter</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Try selecting "All Morocco" or changing the category filter to see available fleet cars across all partner agencies.
              </p>
              <button
                onClick={() => {
                  setSelectedCity('All Morocco');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-5 py-2 bg-[#f95721] text-white text-xs font-semibold rounded-full hover:bg-[#e04816] transition-colors"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. THREE STEPS, ONE STANDARD ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#f95721]">
            How Airbcar Works
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-neutral-900">
            Three steps, one standard
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            No middlemen, no hidden fees, no surprises at the counter. Search the route, inspect the contract, drive — and tell the community where you've been.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center font-serif-display font-bold text-lg text-amber-700">
                01
              </div>
              <h3 className="font-serif-display text-xl font-bold text-neutral-900">
                Search by destination
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Tell us where the road is going — city, region, or airport — and we'll surface the right cars from verified local agencies near you.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-medium text-neutral-500">
              <CheckCircle2 className="w-4 h-4 text-[#f95721]" />
              <span>14 Moroccan hubs available</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-serif-display font-bold text-lg text-emerald-700">
                02
              </div>
              <h3 className="font-serif-display text-xl font-bold text-neutral-900">
                Verified in 60 seconds
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Scan your driver's licence (front &amp; back), review the Dahir ministry contract, and lock in the deposit. CMI, Moroccan cards, and transfers all work.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-medium text-neutral-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bilingual contract &amp; escrow</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center font-serif-display font-bold text-lg text-purple-700">
                03
              </div>
              <h3 className="font-serif-display text-xl font-bold text-neutral-900">
                Drive — and share the trip
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Pick up the keys at the agency or airport curb, hit the Moroccan highway, and post the journey when you're back. Trips earn kudos, agencies earn reviews.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-medium text-neutral-500">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Community travel reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. REAL TRIPS COMMUNITY FEED ── */}
      <section className="bg-[#181311] text-white py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#f95721]">
                Community Road Journal
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mt-1">
                Real trips, verified receipts
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-xl">
                A live feed of verified journeys from Airbcar drivers across Morocco. The receipts are in the road.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Story 1 */}
            <div className="bg-[#241c19] rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                    ✓ Verified trip
                  </span>
                  <span className="text-neutral-400">2 days ago</span>
                </div>
                <h4 className="font-serif-display font-bold text-base text-white">
                  Casablanca → Merzouga Desert Loop
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  “The dunes at sunrise are worth the 9-hour drive. The Toyota Prado didn’t blink. Booked direct, picked up in Casa, dropped in Errachidia — seamless contract handover.”
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-rose-400 font-medium">
                  <Heart className="w-3.5 h-3.5 fill-current" /> 248 kudos
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> 32 comments
                </span>
                <span className="text-neutral-500">Yassine A.</span>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-[#241c19] rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                    ✓ Verified trip
                  </span>
                  <span className="text-neutral-400">4 days ago</span>
                </div>
                <h4 className="font-serif-display font-bold text-base text-white">
                  Tangier → Chefchaouen Rif Traverse
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  “Wind along the Atlantic highway up to the blue alleys. Agency delivered the car right to Tangier Ville railway station in 10 minutes flat.”
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-rose-400 font-medium">
                  <Heart className="w-3.5 h-3.5 fill-current" /> 192 kudos
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> 24 comments
                </span>
                <span className="text-neutral-500">Kenza M.</span>
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-[#241c19] rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                    ✓ Verified trip
                  </span>
                  <span className="text-neutral-400">1 week ago</span>
                </div>
                <h4 className="font-serif-display font-bold text-base text-white">
                  Marrakech → Tizi n'Tichka Atlas Pass
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  “Climbing through the High Atlas pass without hiccups. The pre-authorized deposit was released back to my card right when the return check was completed.”
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-rose-400 font-medium">
                  <Heart className="w-3.5 h-3.5 fill-current" /> 124 kudos
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> 18 comments
                </span>
                <span className="text-neutral-500">Mehdi B.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. RUN AN AGENCY? PARTNER CALLOUT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16">
        <div className="bg-gradient-to-br from-[#1c1613] to-[#2b1f1a] rounded-3xl p-8 sm:p-12 text-white border border-white/10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f95721] text-white inline-block">
              For Moroccan Agencies
            </span>
            <h3 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight">
              Run an agency? Stop paying middlemen 25%.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              List your fleet on Airbcar, fill empty days with direct bookings, and share vehicles between agencies when peak demand strikes. No setup fees, no lock-in, insured by Wafa Assurance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => onNavigateTab('partner')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white font-semibold text-sm transition-all shadow-md active:scale-95 text-center cursor-pointer"
            >
              Become a partner →
            </button>
            <button
              onClick={() => onNavigateTab('partner')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/15 text-center cursor-pointer"
            >
              Calculate earnings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
