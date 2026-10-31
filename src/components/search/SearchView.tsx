import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Heart, 
  SlidersHorizontal, 
  X, 
  ArrowRight,
  Users,
  Fuel,
  Sparkles,
  ShieldCheck,
  Check,
  Columns2,
  Map,
  List,
  Database,
  RefreshCw
} from 'lucide-react';
import { CarListing, SearchFilters } from '../../types';
import { allCarsData } from '../../data/carsData';
import { SearchMapView } from './SearchMapView';
import { subscribeToCars } from '../../services/firebase';

interface SearchViewProps {
  initialLocation?: string;
  initialPickupDate?: string;
  initialReturnDate?: string;
  cars?: CarListing[];
  onSelectCarDetails: (car: CarListing) => void;
  onNavigateTab: (tab: any) => void;
  onSelectPartner?: (partnerId: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  initialLocation = 'All Morocco',
  initialPickupDate = '2026-09-07',
  initialReturnDate = '2026-09-11',
  cars: externalCars,
  onSelectCarDetails,
  onNavigateTab,
  onSelectPartner
}) => {
  // Live Firestore database subscription fallback
  const [internalCars, setInternalCars] = useState<CarListing[]>(allCarsData);
  const [isDbLive, setIsDbLive] = useState(true);

  useEffect(() => {
    if (!externalCars) {
      const unsub = subscribeToCars((dbData) => {
        if (dbData && dbData.length > 0) {
          setInternalCars(dbData);
          setIsDbLive(true);
        }
      });
      return () => unsub();
    }
  }, [externalCars]);

  // Active car pool
  const activeCars = useMemo(() => {
    if (externalCars && externalCars.length > 0) return externalCars;
    if (internalCars && internalCars.length > 0) return internalCars;
    return allCarsData;
  }, [externalCars, internalCars]);

  // Search parameters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [location, setLocation] = useState<string>(initialLocation);
  const [pickupDate, setPickupDate] = useState<string>(initialPickupDate);
  const [returnDate, setReturnDate] = useState<string>(initialReturnDate);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'popular'>('price_asc');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Hover & selection for map sync
  const [hoveredCarId, setHoveredCarId] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [viewLayout, setViewLayout] = useState<'split' | 'map' | 'list'>('split');

  // Filter drawer modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTransmission, setSelectedTransmission] = useState<'all' | 'automatic' | 'manual'>('all');
  const [selectedFuel, setSelectedFuel] = useState<'all' | 'gasoline' | 'diesel'>('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(3000);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    try {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 4;
    } catch {
      return 4;
    }
  }, [pickupDate, returnDate]);

  // Categories list matching screenshot
  const categories = ['All', 'Sedan', 'SUV', 'Convertible', 'City', '4x4', 'Coupe', 'Family'];

  // Available locations
  const locations = [
    'All Morocco',
    'Tetouan',
    'Casablanca',
    'Marrakech',
    'Agadir',
    'Tangier',
    'Rabat',
    'Fes',
    'Nador',
    'Oujda',
    'Meknes',
    'Chefchaouen',
    'Merzouga'
  ];

  // Filter and sort vehicles
  const filteredCars = useMemo(() => {
    return activeCars
      .filter((car) => {
        // Text keyword search (brand, model, name, features, agency)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches = 
            (car.name && car.name.toLowerCase().includes(q)) ||
            (car.brand && car.brand.toLowerCase().includes(q)) ||
            (car.model && car.model.toLowerCase().includes(q)) ||
            (car.category && car.category.toLowerCase().includes(q)) ||
            (car.city && car.city.toLowerCase().includes(q)) ||
            (car.agency?.name && car.agency.name.toLowerCase().includes(q)) ||
            (car.features && car.features.some(f => f.toLowerCase().includes(q)));
          if (!matches) return false;
        }

        // City match
        if (location && location !== 'All Morocco' && car.city.toLowerCase() !== location.toLowerCase()) {
          return false;
        }
        // Category match
        if (selectedCategory !== 'All' && car.category !== selectedCategory) {
          return false;
        }
        // Transmission match
        if (selectedTransmission !== 'all' && car.transmission !== selectedTransmission) {
          return false;
        }
        // Fuel match
        if (selectedFuel !== 'all' && car.fuel !== selectedFuel) {
          return false;
        }
        // Price match
        if (car.dailyRate > maxPriceFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.dailyRate - b.dailyRate;
        if (sortBy === 'price_desc') return b.dailyRate - a.dailyRate;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewsCount - a.reviewsCount;
      });
  }, [activeCars, searchQuery, location, selectedCategory, selectedTransmission, selectedFuel, maxPriceFilter, sortBy]);

  // Active filter count
  const activeFiltersCount = (selectedTransmission !== 'all' ? 1 : 0) + 
                            (selectedFuel !== 'all' ? 1 : 0) + 
                            (maxPriceFilter < 3000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1a1412] font-sans selection:bg-[#f95721] selection:text-white">
      
      {/* ── MISSION-STYLE EDITORIAL HERO BANNER ── */}
      <div className="relative border-b border-[#EAE3D9] bg-gradient-to-b from-white via-[#FAF7F2] to-[#FAF8F5] px-4 sm:px-8 pt-8 pb-9">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f95721]/10 border border-[#f95721]/20 text-xs font-semibold tracking-wider uppercase text-[#f95721] mb-3">
            <span>✦ Northern Morocco Fleet &amp; Hubs</span>
            <span className="text-neutral-400">·</span>
            <span>Tetouan &amp; Mediterranean Coast</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif-display font-medium text-3xl sm:text-4xl text-[#1a1412] tracking-tight">
                The road is the destination. <span className="italic font-serif text-[#f95721]">The car is the promise.</span>
              </h1>
              <p className="text-[#6B5E55] text-sm mt-2 max-w-2xl">
                Rent directly from verified Moroccan partner agencies. Every trip is legally sealed with Dahir 2026 digital telemetry and CMI pre-authorized security deposits.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectPartner ? onSelectPartner('5') : onNavigateTab('partner-profile')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F2ECE4] border border-[#E0D7CC] text-[#2C2420] hover:text-black text-xs font-semibold transition-all cursor-pointer shadow-xs group"
              >
                <ShieldCheck className="w-4 h-4 text-[#f95721]" />
                <span>Featured Partner: Mayache (#5)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8C7E74] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MARQUEE STRIP (MISSION PAGE COMPONENT) ── */}
      <div className="bg-[#F2ECE4] py-2.5 border-b border-[#E4DCD2] overflow-hidden text-xs uppercase tracking-widest text-[#6B5E55] font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-6 overflow-x-auto scrollbar-none">
          <span className="flex items-center gap-1.5 shrink-0"><span className="text-[#f95721]">✦</span> Verified Local Partner Agencies</span>
          <span className="flex items-center gap-1.5 shrink-0"><span className="text-[#f95721]">✦</span> Automatic CMI Deposit Release in 48h</span>
          <span className="flex items-center gap-1.5 shrink-0"><span className="text-[#f95721]">✦</span> Free Cancellation up to 24h</span>
          <span className="flex items-center gap-1.5 shrink-0"><span className="text-[#f95721]">✦</span> Tetouan Airport (TTU) &amp; Tangier (TNG) Delivery</span>
        </div>
      </div>

      {/* ── 1. TOP SEARCH BAR STRIP (MISSION EDITORIAL THEME) ── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#EAE3D9] px-4 sm:px-8 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo, Keyword Search & City Picker */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
            <div className="flex items-center gap-2 pr-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#f95721] flex items-center justify-center text-white font-bold text-xs">
                🚗
              </div>
              <span className="font-serif-display font-extrabold text-xl text-[#1a1412] tracking-tight">
                Airbcar
              </span>
            </div>

            {/* Keyword Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-semibold text-[#1a1412] focus-within:border-[#f95721] transition-all">
                <Search className="w-3.5 h-3.5 text-[#f95721] shrink-0" />
                <input
                  type="text"
                  placeholder="Search model, brand (e.g. Clio, Range)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-[#1a1412] placeholder-[#8C7E74] border-none outline-none w-full text-xs font-normal"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="text-[#8C7E74] hover:text-[#1a1412] text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* City Dropdown Input */}
            <div className="relative w-40 sm:w-44">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-semibold text-[#1a1412]">
                <MapPin className="w-3.5 h-3.5 text-[#f95721] shrink-0" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-[#1a1412] border-none outline-none w-full appearance-none cursor-pointer pr-4 text-xs font-semibold"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc} className="bg-white text-[#1a1412]">
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#8C7E74] absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Date Pickers & CTA */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Pickup Date */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#1a1412]">
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="bg-transparent text-[#1a1412] border-none outline-none text-xs font-mono cursor-pointer"
              />
              <CalendarIcon className="w-3.5 h-3.5 text-[#8C7E74]" />
            </div>

            {/* Return Date */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#1a1412]">
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="bg-transparent text-[#1a1412] border-none outline-none text-xs font-mono cursor-pointer"
              />
              <CalendarIcon className="w-3.5 h-3.5 text-[#8C7E74]" />
            </div>

            {/* Search Button */}
            <button
              type="button"
              className="px-5 py-2 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Cars</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── 2. FILTER & CATEGORY TOOLBAR ── */}
      <div className="bg-white border-b border-[#EAE3D9] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Category Pills matching screenshot */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1a1412] text-white shadow-xs font-bold'
                    : 'bg-[#FAF8F5] text-[#5A4E46] hover:bg-[#EDE6DC] border border-[#E0D7CC]'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Advanced Filters Button */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#EDE6DC] border border-[#E0D7CC] text-xs font-semibold text-[#1a1412] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#f95721]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#f95721] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-[#8C7E74]" />
            </button>
          </div>

          {/* Right Status: Result Count, View Switcher & Sort Dropdown */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            <div className="text-xs text-[#6B5E55]">
              <strong className="text-[#1a1412] font-bold">{filteredCars.length}</strong> vehicles available · {location}
            </div>

            {/* View Layout Switcher (Split / Full Map / List Only) */}
            <div className="flex items-center p-0.5 rounded-full bg-[#FAF8F5] border border-[#E0D7CC]">
              <button
                type="button"
                onClick={() => setViewLayout('split')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  viewLayout === 'split' ? 'bg-[#1a1412] text-white shadow-xs' : 'text-[#6B5E55] hover:text-[#1a1412]'
                }`}
                title="Split View (List + Map)"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split</span>
              </button>

              <button
                type="button"
                onClick={() => setViewLayout('map')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  viewLayout === 'map' ? 'bg-[#1a1412] text-white shadow-xs' : 'text-[#6B5E55] hover:text-[#1a1412]'
                }`}
                title="Full Screen Map View"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Full Map</span>
              </button>

              <button
                type="button"
                onClick={() => setViewLayout('list')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  viewLayout === 'list' ? 'bg-[#1a1412] text-white shadow-xs' : 'text-[#6B5E55] hover:text-[#1a1412]'
                }`}
                title="List View Only"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E0D7CC] text-xs font-semibold text-[#1a1412] cursor-pointer pr-7 appearance-none outline-none"
              >
                <option value="price_asc" className="bg-white">Price: Low to High</option>
                <option value="price_desc" className="bg-white">Price: High to Low</option>
                <option value="rating" className="bg-white">Rating: High to Low</option>
                <option value="popular" className="bg-white">Most Popular</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#8C7E74] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Applied Filter Tags */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-3 pt-2 border-t border-[#EAE3D9] text-xs">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F2ECE4] border border-[#E0D7CC] text-[#3D332D]">
            <MapPin className="w-3 h-3 text-[#f95721]" />
            <span>{location}</span>
            <button 
              type="button" 
              onClick={() => setLocation('')}
              className="text-[#8C7E74] hover:text-[#1a1412] ml-1 cursor-pointer font-bold"
            >
              ×
            </button>
          </div>

          {selectedCategory !== 'All' && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F2ECE4] border border-[#E0D7CC] text-[#3D332D]">
              <span>Category: {selectedCategory}</span>
              <button 
                type="button" 
                onClick={() => setSelectedCategory('All')}
                className="text-[#8C7E74] hover:text-[#1a1412] ml-1 cursor-pointer font-bold"
              >
                ×
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setLocation('Tetouan');
              setSelectedCategory('All');
              setSelectedTransmission('all');
              setSelectedFuel('all');
              setMaxPriceFilter(3000);
            }}
            className="text-[#f95721] hover:underline text-xs font-semibold ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* ── 3. MAIN CONTENT: SPLIT VIEW, FULL MAP, OR LIST VIEW ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Mobile View Switcher (< lg screens) */}
        <div className="lg:hidden flex items-center justify-center p-1 rounded-2xl bg-white border border-[#E0D7CC] shadow-xs mb-4">
          <button
            type="button"
            onClick={() => setViewLayout('list')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              viewLayout === 'list' || viewLayout === 'split' ? 'bg-[#1a1412] text-white shadow-xs' : 'text-[#6B5E55] hover:text-[#1a1412]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Vehicles List ({filteredCars.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewLayout('map')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              viewLayout === 'map' ? 'bg-[#f95721] text-white shadow-xs' : 'text-[#6B5E55] hover:text-[#1a1412]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Interactive Map ({filteredCars.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Car Cards List */}
          <div className={`${
            viewLayout === 'map' 
              ? 'hidden' 
              : viewLayout === 'list' 
                ? 'col-span-1 lg:col-span-12 space-y-4' 
                : 'col-span-1 lg:col-span-7 space-y-4'
          }`}>
            {/* Live Search & Firestore Sync Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1 px-1">
              <div className="text-xs text-[#6B5E55]">
                Showing <strong className="text-[#1a1412] font-bold">{filteredCars.length}</strong> available vehicles
                {location && location !== 'All Morocco' ? ` in ${location}` : ' across Morocco'}
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Connected to Cloud Firestore ({activeCars.length} live fleet)</span>
              </div>
            </div>

            {filteredCars.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#EAE3D9] space-y-3 shadow-xs">
                <div className="text-3xl">🚗</div>
                <h3 className="font-serif-display text-xl font-bold text-[#1a1412]">No cars found matching filters</h3>
                <p className="text-xs text-[#6B5E55]">
                  Try clearing your filters or selecting another city like Casablanca or Marrakech.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTransmission('all');
                    setSelectedFuel('all');
                    setMaxPriceFilter(3000);
                  }}
                  className="px-4 py-2 rounded-full bg-[#f95721] text-white text-xs font-bold cursor-pointer shadow-sm hover:bg-[#e04816] transition-all"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredCars.map((car) => {
                const totalPrice = car.dailyRate * rentalDays;
                const isFav = favorites.includes(car.id);
                const isHovered = hoveredCarId === car.id;
                const isSelected = selectedCarId === car.id;

                return (
                  <div
                    key={car.id}
                    onMouseEnter={() => setHoveredCarId(car.id)}
                    onMouseLeave={() => setHoveredCarId(null)}
                    onClick={() => {
                      setSelectedCarId(car.id);
                      onSelectCarDetails(car);
                    }}
                    className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer shadow-xs hover:shadow-md ${
                      isHovered || isSelected
                        ? 'border-[#f95721] ring-2 ring-[#f95721]/20 bg-[#FFFDFB]'
                        : 'border-[#EAE3D9] hover:border-[#D6CCC0]'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4">
                      
                      {/* Vehicle Image with Favorite Heart */}
                      <div className="sm:col-span-5 relative rounded-xl overflow-hidden bg-[#F7F4EE] aspect-16/10 sm:aspect-auto sm:h-44">
                        <img
                          src={car.images[0]}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(car.id, e)}
                          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white transition-all cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-[#f95721] text-[#f95721]' : 'text-white'}`} />
                        </button>
                      </div>

                      {/* Vehicle Details */}
                      <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                        
                        <div>
                          {/* Title and Rating */}
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif-display font-bold text-lg text-[#1a1412] group-hover:text-[#f95721] transition-colors leading-tight">
                              {car.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 shrink-0">
                              <span>★</span>
                              <span>{car.rating.toFixed(1)}</span>
                              <span className="text-[#8C7E74] font-normal">({car.reviewsCount})</span>
                            </div>
                          </div>

                          {/* Location & Agency Badge */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-1 text-xs text-[#6B5E55]">
                              <MapPin className="w-3 h-3 text-[#f95721]" />
                              <span>{car.location}</span>
                            </div>

                            <span className="text-[#C4B9AC]">·</span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectPartner) {
                                  onSelectPartner(car.agency.id || '5');
                                } else {
                                  onNavigateTab('partner-profile');
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#E0D7CC] hover:border-[#f95721]/60 text-[11px] text-[#3D332D] hover:text-[#1a1412] transition-all cursor-pointer group/agency"
                              title="View partner agency profile"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#f95721]"></span>
                              <span className="group-hover/agency:text-[#f95721] transition-colors">{car.agency.name}</span>
                              <ArrowRight className="w-2.5 h-2.5 text-[#8C7E74] group-hover/agency:translate-x-0.5 transition-transform" />
                            </button>
                          </div>

                          {/* Specifications Icons */}
                          <div className="flex items-center gap-3 text-xs text-[#6B5E55] mt-2.5">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-[#8C7E74]" />
                              <span>{car.seats}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[#8C7E74] font-mono text-[11px]">⚙</span>
                              <span className="capitalize">{car.transmission}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Fuel className="w-3.5 h-3.5 text-[#8C7E74]" />
                              <span className="capitalize">{car.fuel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price Breakdown and CTA */}
                        <div className="pt-3 border-t border-[#EAE3D9] flex items-end justify-between">
                          <div>
                            <div className="font-serif-display font-extrabold text-xl text-[#1a1412] tracking-tight">
                              {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {car.currency}
                            </div>
                            <div className="text-[11px] text-[#8C7E74]">
                              {rentalDays} days · {car.dailyRate.toFixed(2)} {car.currency}/day
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-[#f95721] group-hover:translate-x-1 transition-transform">
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Interactive Leaflet Map */}
          <div className={`${
            viewLayout === 'list' 
              ? 'hidden' 
              : viewLayout === 'map' 
                ? 'col-span-1 lg:col-span-12' 
                : 'col-span-1 lg:col-span-5 sticky top-24'
          }`}>
            <SearchMapView
              cars={filteredCars}
              selectedCarId={selectedCarId}
              hoveredCarId={hoveredCarId}
              onSelectCar={(car) => {
                setSelectedCarId(car.id);
                onSelectCarDetails(car);
              }}
              city={location || 'All Morocco'}
              viewLayout={viewLayout}
            />
          </div>

        </div>

        {/* Mobile Floating Action Button to toggle between List & Map */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            type="button"
            onClick={() => setViewLayout(viewLayout === 'map' ? 'list' : 'map')}
            className="px-5 py-2.5 rounded-full bg-[#1a1412] hover:bg-[#f95721] text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/20 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            {viewLayout === 'map' ? (
              <>
                <List className="w-4 h-4 text-[#f95721]" />
                <span>Show Vehicles List ({filteredCars.length})</span>
              </>
            ) : (
              <>
                <Map className="w-4 h-4 text-[#f95721]" />
                <span>Show Fleet Map ({filteredCars.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 4. FILTER MODAL DRAWER ── */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#E0D7CC] rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl text-[#1a1412]">
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#f95721]" />
                <h3 className="font-serif-display font-bold text-lg text-[#1a1412]">Filter Vehicles</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#FAF8F5] text-[#8C7E74] hover:text-[#1a1412] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55]">
                Transmission
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['all', 'automatic', 'manual'] as const).map((trans) => (
                  <button
                    key={trans}
                    type="button"
                    onClick={() => setSelectedTransmission(trans)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                      selectedTransmission === trans
                        ? 'bg-[#f95721] text-white border-[#f95721]'
                        : 'bg-[#FAF8F5] text-[#4A3E37] border-[#E0D7CC] hover:bg-[#EDE6DC]'
                    }`}
                  >
                    {trans}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55]">
                Fuel Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['all', 'gasoline', 'diesel'] as const).map((fuel) => (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => setSelectedFuel(fuel)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                      selectedFuel === fuel
                        ? 'bg-[#f95721] text-white border-[#f95721]'
                        : 'bg-[#FAF8F5] text-[#4A3E37] border-[#E0D7CC] hover:bg-[#EDE6DC]'
                    }`}
                  >
                    {fuel}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Daily Rate Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold uppercase tracking-wider text-[#6B5E55]">
                  Maximum Daily Rate
                </label>
                <span className="font-mono font-bold text-[#f95721]">
                  {maxPriceFilter} DH / day
                </span>
              </div>
              <input
                type="range"
                min={300}
                max={3000}
                step={50}
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-[#f95721] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8C7E74] font-mono">
                <span>300 DH</span>
                <span>1,500 DH</span>
                <span>3,000 DH</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#EAE3D9]">
              <button
                type="button"
                onClick={() => {
                  setSelectedTransmission('all');
                  setSelectedFuel('all');
                  setMaxPriceFilter(3000);
                }}
                className="text-xs text-[#8C7E74] hover:text-[#1a1412] underline cursor-pointer"
              >
                Reset filters
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Apply Filters ({filteredCars.length} results)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
