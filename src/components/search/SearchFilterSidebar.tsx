import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  X, 
  ChevronLeft, 
  Car, 
  Sparkles,
  Fuel,
  Users,
  DollarSign
} from 'lucide-react';

export interface SearchFilterSidebarProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedTransmission: 'all' | 'automatic' | 'manual';
  onSelectTransmission: (trans: 'all' | 'automatic' | 'manual') => void;
  transmissionCounts: Record<string, number>;
  minPrice: number;
  maxPrice: number;
  priceBounds: { min: number; max: number };
  onChangePriceRange: (min: number, max: number) => void;
  selectedFuel: 'all' | 'gasoline' | 'diesel';
  onSelectFuel: (fuel: 'all' | 'gasoline' | 'diesel') => void;
  selectedSeats: 'any' | '4' | '5' | '7';
  onSelectSeats: (seats: 'any' | '4' | '5' | '7') => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  totalResults: number;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
  onCollapseSidebar?: () => void;
}

export const SearchFilterSidebar: React.FC<SearchFilterSidebarProps> = ({
  categories,
  categoryCounts,
  selectedCategory,
  onSelectCategory,
  selectedTransmission,
  onSelectTransmission,
  transmissionCounts,
  minPrice,
  maxPrice,
  priceBounds,
  onChangePriceRange,
  selectedFuel,
  onSelectFuel,
  selectedSeats,
  onSelectSeats,
  onResetFilters,
  activeFiltersCount,
  totalResults,
  isMobileDrawer = false,
  onCloseMobileDrawer,
  onCollapseSidebar
}) => {
  // Category icon helper
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'suv':
      case '4x4':
        return '🚙';
      case 'convertible':
      case 'coupe':
        return '🏎️';
      case 'sedan':
        return '🚗';
      case 'city':
        return '🚘';
      case 'family':
        return '🚐';
      default:
        return '✨';
    }
  };

  // Price presets
  const pricePresets = [
    { label: 'All Prices', min: priceBounds.min, max: priceBounds.max },
    { label: 'Under 500 DH', min: priceBounds.min, max: 500 },
    { label: '500 - 1,000 DH', min: 500, max: 1000 },
    { label: '1,000 - 2,000 DH', min: 1000, max: 2000 },
    { label: '2,000+ DH (Luxury)', min: 2000, max: priceBounds.max },
  ];

  const isPresetActive = (presetMin: number, presetMax: number) => {
    return minPrice === presetMin && maxPrice === presetMax;
  };

  return (
    <aside 
      className={`bg-white rounded-3xl border border-[#EAE3D9] shadow-sm flex flex-col text-[#1a1412] ${
        isMobileDrawer ? 'h-full max-h-[90vh]' : 'sticky top-20 max-h-[calc(100vh-100px)] overflow-hidden'
      }`}
    >
      {/* ── HEADER ── */}
      <div className="px-5 py-4 border-b border-[#EAE3D9] flex items-center justify-between bg-gradient-to-b from-[#FAF8F5] to-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#f95721]/10 flex items-center justify-center text-[#f95721]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-display font-bold text-base text-[#1a1412]">
                Fleet Filters
              </h3>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#f95721] text-white text-[11px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#6B5E55]">
              {totalResults} matching vehicles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-[#f95721] hover:text-[#d44516] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-[#FAF8F5] transition-all cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {isMobileDrawer && onCloseMobileDrawer && (
            <button
              type="button"
              onClick={onCloseMobileDrawer}
              className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#8C7E74] hover:text-[#1a1412] cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {!isMobileDrawer && onCollapseSidebar && (
            <button
              type="button"
              onClick={onCollapseSidebar}
              className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#8C7E74] hover:text-[#1a1412] cursor-pointer transition-colors"
              title="Hide filter sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── SCROLLABLE FILTER CONTENT ── */}
      <div className="overflow-y-auto p-5 space-y-6 flex-1 scrollbar-none divide-y divide-[#EAE3D9]">

        {/* ── 1. CATEGORY FILTER ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#f95721]" />
              <span>Vehicle Category</span>
            </label>
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => onSelectCategory('All')}
                className="text-[11px] text-[#8C7E74] hover:text-[#1a1412] underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const count = categoryCounts[category] || 0;
              const icon = getCategoryIcon(category);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onSelectCategory(category)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border text-left ${
                    isSelected
                      ? 'bg-[#1a1412] text-white border-[#1a1412] shadow-xs font-bold'
                      : count === 0
                        ? 'bg-[#FAF8F5]/60 text-[#A89C92] border-transparent opacity-60'
                        : 'bg-[#FAF8F5] hover:bg-[#F2ECE4] text-[#3D332D] border-[#E0D7CC]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs shrink-0">{icon}</span>
                    <span className="truncate">{category}</span>
                  </div>
                  <span 
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold shrink-0 ml-1 ${
                      isSelected 
                        ? 'bg-[#f95721] text-white' 
                        : 'bg-white text-[#6B5E55] border border-[#E0D7CC]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. TRANSMISSION TYPE ── */}
        <div className="pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] flex items-center gap-1.5">
              <span className="text-[#f95721] font-mono text-xs">⚙</span>
              <span>Transmission</span>
            </label>
            {selectedTransmission !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectTransmission('all')}
                className="text-[11px] text-[#8C7E74] hover:text-[#1a1412] underline cursor-pointer"
              >
                All
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CC]">
            {(
              [
                { id: 'all', label: 'All', icon: '✦', count: transmissionCounts.all },
                { id: 'automatic', label: 'Automatic', icon: '⚙', count: transmissionCounts.automatic },
                { id: 'manual', label: 'Manual', icon: '🕹', count: transmissionCounts.manual },
              ] as const
            ).map((item) => {
              const isSelected = selectedTransmission === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTransmission(item.id)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'bg-[#1a1412] text-white shadow-xs font-bold'
                      : 'text-[#5A4E46] hover:text-[#1a1412] hover:bg-white/60'
                  }`}
                >
                  <span className="text-[11px]">{item.icon}</span>
                  <span className="text-[11px] capitalize">{item.label}</span>
                  <span className={`text-[9px] font-mono ${isSelected ? 'text-[#f95721]' : 'text-[#8C7E74]'}`}>
                    ({item.count || 0})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. PRICE RANGE (DAILY RATE) ── */}
        <div className="pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#f95721]" />
              <span>Daily Rate (DH/day)</span>
            </label>
            {(minPrice > priceBounds.min || maxPrice < priceBounds.max) && (
              <button
                type="button"
                onClick={() => onChangePriceRange(priceBounds.min, priceBounds.max)}
                className="text-[11px] text-[#8C7E74] hover:text-[#1a1412] underline cursor-pointer"
              >
                Reset Price
              </button>
            )}
          </div>

          {/* Current Selection Pill */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CC] flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8C7E74] block">Min Rate</span>
              <span className="font-extrabold text-sm text-[#1a1412]">{minPrice} DH</span>
            </div>
            <div className="text-[#8C7E74] font-bold">→</div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#8C7E74] block">Max Rate</span>
              <span className="font-extrabold text-sm text-[#f95721]">{maxPrice} DH</span>
            </div>
          </div>

          {/* Slider for Max Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-[#6B5E55] font-medium">
              <span>Max Budget:</span>
              <span className="font-extrabold font-mono text-[#f95721]">{maxPrice} DH / day</span>
            </div>
            <input
              type="range"
              min={priceBounds.min || 200}
              max={priceBounds.max || 3500}
              step={50}
              value={maxPrice}
              onChange={(e) => onChangePriceRange(minPrice, Number(e.target.value))}
              className="w-full accent-[#f95721] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C7E74] font-mono">
              <span>{priceBounds.min} DH</span>
              <span>1,500 DH</span>
              <span>{priceBounds.max} DH</span>
            </div>
          </div>

          {/* Quick Price Preset Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pricePresets.map((preset) => {
              const active = isPresetActive(preset.min, preset.max);
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChangePriceRange(preset.min, preset.max)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
                    active
                      ? 'bg-[#f95721] text-white border-[#f95721] shadow-2xs font-bold'
                      : 'bg-white hover:bg-[#F2ECE4] text-[#5A4E46] border-[#E0D7CC]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 4. FUEL TYPE ── */}
        <div className="pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-[#f95721]" />
              <span>Fuel Type</span>
            </label>
            {selectedFuel !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectFuel('all')}
                className="text-[11px] text-[#8C7E74] hover:text-[#1a1412] underline cursor-pointer"
              >
                All
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(['all', 'gasoline', 'diesel'] as const).map((fuel) => {
              const isSelected = selectedFuel === fuel;
              return (
                <button
                  key={fuel}
                  type="button"
                  onClick={() => onSelectFuel(fuel)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-[#1a1412] text-white border-[#1a1412] shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#4A3E37] border-[#E0D7CC] hover:bg-[#EDE6DC]'
                  }`}
                >
                  {fuel === 'all' ? 'All Fuels' : fuel}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 5. SEATS CAPACITY ── */}
        <div className="pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B5E55] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#f95721]" />
              <span>Minimum Seats</span>
            </label>
            {selectedSeats !== 'any' && (
              <button
                type="button"
                onClick={() => onSelectSeats('any')}
                className="text-[11px] text-[#8C7E74] hover:text-[#1a1412] underline cursor-pointer"
              >
                Any
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {(
              [
                { id: 'any', label: 'Any' },
                { id: '4', label: '4+' },
                { id: '5', label: '5+' },
                { id: '7', label: '7+' },
              ] as const
            ).map((seat) => {
              const isSelected = selectedSeats === seat.id;
              return (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => onSelectSeats(seat.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-[#1a1412] text-white border-[#1a1412] shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#4A3E37] border-[#E0D7CC] hover:bg-[#EDE6DC]'
                  }`}
                >
                  {seat.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── FOOTER: APPLY / STATUS BAR ── */}
      <div className="p-4 border-t border-[#EAE3D9] bg-[#FAF8F5] shrink-0">
        {isMobileDrawer ? (
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="w-full py-3 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Show {totalResults} Matching Vehicles</span>
          </button>
        ) : (
          <div className="flex items-center justify-between text-xs text-[#6B5E55]">
            <span className="font-medium">
              Live Fleet Filtered
            </span>
            <span className="font-extrabold text-[#1a1412] font-mono">
              {totalResults} cars
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
