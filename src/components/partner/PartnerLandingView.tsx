import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Coins, 
  TrendingUp, 
  Car, 
  FileText, 
  Zap, 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight,
  Sparkles,
  PhoneCall,
  Lock,
  ChevronDown,
  ChevronUp,
  Sliders,
  DollarSign,
  LayoutGrid,
  Calendar,
  CreditCard,
  Globe,
  Star,
  Activity
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { UserRole } from '../../types/partner';

interface PartnerLandingViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSwitchRole?: (role: UserRole) => void;
}

export const PartnerLandingView: React.FC<PartnerLandingViewProps> = ({
  onNavigateTab,
  onSwitchRole
}) => {
  // Interactive Calculator State
  const [fleetSize, setFleetSize] = useState<number>(14);
  const [avgDailyRate, setAvgDailyRate] = useState<number>(450);
  const [extraDays, setExtraDays] = useState<number>(4);
  const [selectedHub, setSelectedHub] = useState<string>('Casablanca');

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [agencyName, setAgencyName] = useState('');
  const [agencyCity, setAgencyCity] = useState('Casablanca');
  const [agencyPhone, setAgencyPhone] = useState('');
  const [agencyFleetCount, setAgencyFleetCount] = useState('12');
  const [agencyIce, setAgencyIce] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculations
  const grossMonthlyExtra = useMemo(() => {
    return fleetSize * avgDailyRate * extraDays;
  }, [fleetSize, avgDailyRate, extraDays]);

  const netAnnualExtra = useMemo(() => {
    // 88% net to agency after 12% airbcar platform fee
    return Math.round(grossMonthlyExtra * 12 * 0.88);
  }, [grossMonthlyExtra]);

  // Interactive Mockup Dashboard State
  const [mockupActiveTab, setMockupActiveTab] = useState<'overview' | 'bookings' | 'fleet' | 'verifications' | 'payouts' | 'b2b' | 'drivers' | 'reviews'>('overview');
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  const last14DaysRevenue = [
    { day: '22', date: '22 Sep', mad: 4800, height: '42%' },
    { day: '23', date: '23 Sep', mad: 6200, height: '56%' },
    { day: '24', date: '24 Sep', mad: 5400, height: '50%' },
    { day: '25', date: '25 Sep', mad: 6800, height: '62%' },
    { day: '26', date: '26 Sep', mad: 3100, height: '30%', isDip: true },
    { day: '27', date: '27 Sep', mad: 7200, height: '66%' },
    { day: '28', date: '28 Sep', mad: 8100, height: '74%' },
    { day: '29', date: '29 Sep', mad: 6500, height: '60%' },
    { day: '30', date: '30 Sep', mad: 7600, height: '70%' },
    { day: '01', date: '01 Oct', mad: 9200, height: '84%' },
    { day: '02', date: '02 Oct', mad: 6900, height: '64%' },
    { day: '03', date: '03 Oct', mad: 8400, height: '78%' },
    { day: '04', date: '04 Oct', mad: 9800, height: '90%' },
    { day: '05', date: '05 Oct', mad: 8900, height: '82%' },
  ];

  const mockLiveBookings = [
    { name: 'Youssef M.', details: 'Land Cruiser · 4 days', initials: 'YM', avatarColor: 'bg-[#626955]', status: 'CONFIRMED' },
    { name: 'Sara E.', details: 'Dacia Logan · 2 days', initials: 'SE', avatarColor: 'bg-[#a8884c]', status: 'ID REVIEW' },
    { name: 'Karim B.', details: 'Peugeot 208 · 7 days', initials: 'KB', avatarColor: 'bg-[#a83928]', status: 'CONFIRMED' },
    { name: 'Fatima Z.', details: 'Hyundai Tucson · 3 days', initials: 'FZ', avatarColor: 'bg-[#737a6b]', status: 'CONFIRMED' },
  ];

  const networkCities = [
    { name: 'Casablanca', agencies: 86, surplus: '+18% demand' },
    { name: 'Marrakech', agencies: 71, surplus: '+34% peak' },
    { name: 'Rabat', agencies: 42, surplus: '+12% steady' },
    { name: 'Agadir', agencies: 38, surplus: '+22% weekend' },
    { name: 'Fes', agencies: 34, surplus: '+16% cultural' },
    { name: 'Tangier', agencies: 28, surplus: '+29% port' },
    { name: 'Chefchaouen', agencies: 12, surplus: '+40% seasonal' },
    { name: 'Merzouga', agencies: 9, surplus: '+45% 4x4 peak' }
  ];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsApplyModalOpen(false);
      // If desired, switch into partner portal
      if (onSwitchRole) {
        onSwitchRole('partner');
      }
    }, 1800);
  };

  return (
    <div className="w-full pb-20">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden bg-[#181311] text-white pt-16 pb-20 px-4 sm:px-8 border-b border-white/10">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#f95721]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#f95721]/20 text-[#f95721] border border-[#f95721]/30">
              <Building2 className="w-3.5 h-3.5" />
              Airbcar Partner Network
            </span>
            <span className="text-xs text-neutral-400">
              Morocco's independent rental agency federation
            </span>
          </div>

          <div className="max-w-4xl space-y-4">
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Run an agency.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f95721] to-amber-300">
                Not a charity for middlemen.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-3xl font-normal">
              List your fleet on airbcar, fill the empty days that kill your margin, and share vehicles between agencies when demand spikes. No setup fees. No lock-in. Just the road, paying you back.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="px-8 py-4 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white font-semibold text-sm transition-all shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Become a partner →</span>
            </button>

            <button
              onClick={() => {
                const calc = document.getElementById('earnings-calculator');
                calc?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/15 cursor-pointer"
            >
              Calculate my earnings
            </button>

            {onSwitchRole && (
              <button
                onClick={() => onSwitchRole('partner')}
                className="px-6 py-4 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-sm transition-all border border-amber-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Launch Agency Workspace</span>
              </button>
            )}
          </div>

          {/* Partner Stats Pill */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-neutral-300">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <div className="text-lg font-bold text-white">320+</div>
              <div className="text-neutral-400">Agencies onboarded</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <div className="text-lg font-bold text-[#f95721]">0 MAD</div>
              <div className="text-neutral-400">Listing or monthly fee</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <div className="text-lg font-bold text-emerald-400">Wafa</div>
              <div className="text-neutral-400">Official Insurance</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <div className="text-lg font-bold text-amber-300">Tuesday</div>
              <div className="text-neutral-400">Weekly bank payouts</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. B2B DEMAND OVERFLOW & NETWORK MAP ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#f95721]">
              Shared Fleet Liquidity
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              You're not competing with them. You're plugged into them.
            </h2>
            <p className="text-sm text-neutral-600 mt-1.5 max-w-2xl">
              320 agencies in 14 Moroccan cities, sharing demand and inventory. When your fleet is empty, other agencies' overflow fills your lot — and vice versa.
            </p>
          </div>

          <div className="shrink-0">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ● Live B2B Network Active
            </span>
          </div>
        </div>

        {/* Network Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {networkCities.map((hub) => (
            <div
              key={hub.name}
              onClick={() => setSelectedHub(hub.name)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedHub === hub.name
                  ? 'bg-[#181311] text-white border-[#f95721] shadow-md scale-102'
                  : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif-display font-bold text-base">{hub.name}</span>
                <span className="text-[11px] font-medium text-[#f95721]">{hub.surplus}</span>
              </div>
              <p className={`text-xs mt-1 ${selectedHub === hub.name ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {hub.agencies} certified agencies
              </p>
            </div>
          ))}
        </div>

        {/* Hub spotlight details */}
        <div className="mt-6 bg-[#f7f4ee] rounded-3xl p-6 sm:p-8 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#f95721]" />
              <span className="font-bold text-neutral-900 text-base">{selectedHub} Fleet Cluster</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl">
              Agencies in {selectedHub} share real-time booking requests when flights land or when international bookings exceed single-agency capacity. Escrow settlement occurs within 24 hours.
            </p>
          </div>
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="shrink-0 px-6 py-3 rounded-xl bg-[#181311] hover:bg-[#f95721] text-white text-xs font-semibold transition-colors"
          >
            Connect my {selectedHub} agency
          </button>
        </div>
      </section>

      {/* ── 3. FIVE STEPS ONBOARDING ── */}
      <section className="bg-[#f3efe8] py-16 px-4 sm:px-8 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f95721]">
              Zero Bureaucracy
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-neutral-900">
              Five steps. Zero red tape.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Most agencies are live, verified, and accepting bookings before the day's atay is cold. Bring your papers. We'll bring the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">01</span>
                  <span className="text-[11px] font-semibold text-neutral-400">~4 min</span>
                </div>
                <h3 className="font-serif-display font-bold text-base text-neutral-900">Apply in 4 mins</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Tell us who you are, where you're based, and how big your fleet is. We screen applications inside one business day.
                </p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Free application</span>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">02</span>
                  <span className="text-[11px] font-semibold text-neutral-400">~1 day</span>
                </div>
                <h3 className="font-serif-display font-bold text-base text-neutral-900">RC, ICE &amp; Licences</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Upload your registre de commerce, ICE, and sample carte grise. We verify against the official ministry registry.
                </p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">CNDP Protected</span>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center">03</span>
                  <span className="text-[11px] font-semibold text-neutral-400">15 min</span>
                </div>
                <h3 className="font-serif-display font-bold text-base text-neutral-900">Bulk-list fleet</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Drop in a spreadsheet or enter your VINs. Our system auto-fetches specs, photos, and suggested pricing benchmarks.
                </p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Instant import</span>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">04</span>
                  <span className="text-[11px] font-semibold text-neutral-400">Optional</span>
                </div>
                <h3 className="font-serif-display font-bold text-base text-neutral-900">Wafa Insurance</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Top up your existing policy with airbcar's Wafa Assurance agreement. Trip-based, automatic, zero paperwork.
                </p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Full Moroccan coverage</span>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#f95721]/20 text-[#f95721] font-bold text-xs flex items-center justify-center">05</span>
                  <span className="text-[11px] font-semibold text-[#f95721]">You're live</span>
                </div>
                <h3 className="font-serif-display font-bold text-base text-neutral-900">First booking, same week</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Listings go live the moment checks clear. Bookings hit your dashboard, payouts hit your bank account every Tuesday.
                </p>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Direct Bank Transfer</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. INTERACTIVE EARNINGS CALCULATOR ── */}
      <section id="earnings-calculator" className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="bg-[#181311] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Sliders */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f95721]">
                  Yield Optimization
                </span>
                <h2 className="font-serif-display text-3xl sm:text-4xl font-bold">
                  What an empty Tuesday costs you
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Pull the sliders. Most Moroccan agencies discover that their existing fleet, with airbcar's reach, lifts annual revenue by between 22% and 47% — without buying a single new car.
                </p>
              </div>

              {/* Slider 1: Fleet size */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-300">Your Fleet Size</span>
                  <span className="text-[#f95721] text-sm">{fleetSize} vehicles</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="50" 
                  value={fleetSize}
                  onChange={(e) => setFleetSize(Number(e.target.value))}
                  className="w-full accent-[#f95721] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>3 cars</span>
                  <span>25 cars</span>
                  <span>50 cars</span>
                </div>
              </div>

              {/* Slider 2: Average daily rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-300">Average Daily Rate (MAD)</span>
                  <span className="text-[#f95721] text-sm">{avgDailyRate} MAD / day</span>
                </div>
                <input 
                  type="range" 
                  min="250" 
                  max="1200" 
                  step="50"
                  value={avgDailyRate}
                  onChange={(e) => setAvgDailyRate(Number(e.target.value))}
                  className="w-full accent-[#f95721] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>250 MAD (Economy)</span>
                  <span>650 MAD (SUV)</span>
                  <span>1200 MAD (Luxury)</span>
                </div>
              </div>

              {/* Slider 3: Extra rented days per month */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-300">Extra Days Rented per Month (per car)</span>
                  <span className="text-[#f95721] text-sm">+{extraDays} days / month</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="8" 
                  value={extraDays}
                  onChange={(e) => setExtraDays(Number(e.target.value))}
                  className="w-full accent-[#f95721] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>+1 day</span>
                  <span>+4 days (Average)</span>
                  <span>+8 days (Peak)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1">● Live Moroccan MAD pricing</span>
                <span className="flex items-center gap-1">● Net of 12% platform fee</span>
                <span className="flex items-center gap-1">● Direct CMI settlement</span>
              </div>
            </div>

            {/* Right: Results Card */}
            <div className="lg:col-span-5 bg-[#241c19] rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Estimated Net Revenue Lift
              </span>

              <div className="space-y-1">
                <div className="text-xs text-neutral-400">Monthly extra income:</div>
                <div className="font-serif-display text-3xl sm:text-4xl font-extrabold text-white">
                  +{grossMonthlyExtra.toLocaleString()} <span className="text-sm font-normal text-neutral-400">MAD</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-1">
                <div className="text-xs text-neutral-400">Annual net profit added:</div>
                <div className="font-serif-display text-4xl sm:text-5xl font-extrabold text-[#f95721]">
                  +{netAnnualExtra.toLocaleString()} <span className="text-base font-normal text-white">MAD</span>
                </div>
                <p className="text-[11px] text-neutral-400 pt-1">
                  Based on {fleetSize} cars at {avgDailyRate} MAD for +{extraDays} extra days each month.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-[#f95721] hover:bg-[#e04816] text-white font-semibold text-sm transition-all shadow-lg active:scale-95 cursor-pointer text-center"
                >
                  Apply with my {fleetSize} cars →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. BUILT FOR THE WAY AGENCIES ACTUALLY WORK (BROWSER MOCKUP & ABILITIES) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        
        {/* Section Header: Headline matching screenshot */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-neutral-900 leading-[1.08]">
              Built for the way<br />
              agencies <span className="italic font-serif text-[#b83a24]">actually</span> work.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
              Everything you need on one screen — bookings, dispatch, payouts, fleet health. No tabs. No spreadsheets. No cousin in IT.
            </p>
          </div>
        </div>

        {/* Browser Mockup Window Container */}
        <div className="bg-[#ede7df] border border-[#dfd7cc] rounded-3xl p-3 sm:p-6 shadow-xl space-y-4">
          
          {/* Top Browser Bar with Window Dots & Centered URL */}
          <div className="flex items-center justify-between px-2 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f46b5d] inline-block shadow-2xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#f4be38] inline-block shadow-2xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#5cc858] inline-block shadow-2xs"></span>
            </div>

            {/* Address bar */}
            <div className="flex-1 max-w-sm mx-auto">
              <div className="bg-white/85 border border-neutral-200/80 rounded-full px-4 py-1 text-xs text-neutral-600 flex items-center justify-center gap-1.5 font-mono shadow-2xs">
                <Lock className="w-3 h-3 text-neutral-400" />
                <span>partner.airbcar.com/dashboard</span>
              </div>
            </div>

            <div className="w-12 hidden sm:block"></div>
          </div>

          {/* Browser Viewport */}
          <div className="bg-white border border-[#e5ded4] rounded-2xl overflow-hidden shadow-2xs grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
            
            {/* Left Sidebar */}
            <div className="lg:col-span-3 border-r border-neutral-100 p-5 flex flex-col justify-between bg-white">
              <div className="space-y-6">
                
                {/* Brand Logo & Agency Pill */}
                <div className="flex items-center gap-2.5 pb-2">
                  <span className="font-serif-display font-extrabold text-2xl text-neutral-900 tracking-tight">
                    airbcar
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#fbeee8] text-[#b83a24]">
                    AGENCY
                  </span>
                </div>

                {/* Main Navigation Items */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setMockupActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      mockupActiveTab === 'overview'
                        ? 'bg-[#181311] text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Overview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMockupActiveTab('bookings')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      mockupActiveTab === 'bookings'
                        ? 'bg-[#181311] text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" />
                      <span>Bookings</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#b83a24] text-white text-[10px] font-bold">
                      12
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMockupActiveTab('fleet')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      mockupActiveTab === 'fleet'
                        ? 'bg-[#181311] text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Fleet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMockupActiveTab('verifications')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      mockupActiveTab === 'verifications'
                        ? 'bg-[#181311] text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verifications</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMockupActiveTab('payouts')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      mockupActiveTab === 'payouts'
                        ? 'bg-[#181311] text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Payouts</span>
                  </button>
                </div>

                {/* Network Section */}
                <div className="pt-2">
                  <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Network
                  </div>
                  <div className="space-y-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setMockupActiveTab('b2b')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        mockupActiveTab === 'b2b'
                          ? 'bg-[#181311] text-white shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>B2B sharing</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMockupActiveTab('drivers')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        mockupActiveTab === 'drivers'
                          ? 'bg-[#181311] text-white shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Drivers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMockupActiveTab('reviews')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        mockupActiveTab === 'reviews'
                          ? 'bg-[#181311] text-white shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      <span>Reviews</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Switch Link */}
              {onSwitchRole && (
                <div className="pt-6 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => onSwitchRole('partner')}
                    className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#b83a24] text-[11px] font-bold transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Open Live Agency App</span>
                    <span>→</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Main Dashboard View */}
            <div className="lg:col-span-9 p-6 sm:p-8 space-y-6 bg-white">
              
              {/* Header: Salam, Hamid. + Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-display text-3xl font-bold text-neutral-900 tracking-tight">
                    Salam, <span className="italic font-serif text-[#b83a24]">Hamid</span>.
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    Your week is up <strong className="text-neutral-900 font-bold">+22%</strong>. Three cars are due back today — one early.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button 
                    type="button"
                    onClick={() => setIsApplyModalOpen(true)}
                    className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    Add car
                  </button>
                  <button 
                    type="button"
                    onClick={() => onSwitchRole ? onSwitchRole('partner') : setIsApplyModalOpen(true)}
                    className="px-4 py-2 rounded-full bg-[#181311] hover:bg-[#b83a24] text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    + New booking
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                
                {/* 1. Revenue MTD */}
                <div className="p-4 rounded-2xl bg-[#fcfbfa] border border-neutral-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    <span>Revenue · MTD</span>
                    <Clock className="w-3 h-3 text-neutral-400" />
                  </div>
                  <div>
                    <div className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                      87,840
                    </div>
                    <div className="font-serif italic text-lg text-[#b83a24] leading-tight">
                      MAD
                    </div>
                  </div>
                  <div className="text-[11px] font-medium text-emerald-700">
                    ↑ +18.4%
                  </div>
                </div>

                {/* 2. Trips MTD */}
                <div className="p-4 rounded-2xl bg-[#fcfbfa] border border-neutral-200/80 space-y-2">
                  <div className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Trips · MTD
                  </div>
                  <div>
                    <div className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                      142
                    </div>
                    <div className="h-6"></div>
                  </div>
                  <div className="text-[11px] font-medium text-neutral-700">
                    ↑ +24
                  </div>
                </div>

                {/* 3. Utilisation */}
                <div className="p-4 rounded-2xl bg-[#fcfbfa] border border-neutral-200/80 space-y-2">
                  <div className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Utilisation
                  </div>
                  <div>
                    <div className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                      76<span className="font-serif italic text-[#b83a24] text-xl ml-0.5">%</span>
                    </div>
                    <div className="h-6"></div>
                  </div>
                  <div className="text-[11px] font-medium text-neutral-700">
                    ↑ from 52%
                  </div>
                </div>

                {/* 4. Avg Rating */}
                <div className="p-4 rounded-2xl bg-[#fcfbfa] border border-neutral-200/80 space-y-2">
                  <div className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Avg Rating
                  </div>
                  <div>
                    <div className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight flex items-center">
                      4.92<span className="text-[#b83a24] text-xl ml-1">★</span>
                    </div>
                    <div className="h-6"></div>
                  </div>
                  <div className="text-[11px] font-medium text-[#b83a24]">
                    - 0.02
                  </div>
                </div>

              </div>

              {/* Bottom Row: 14 Days Revenue Bar Chart + Live Bookings */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 14 Days Bar Chart */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-[#fcfbfa] border border-neutral-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-neutral-900">
                      Revenue · last 14 days
                    </span>
                    <button 
                      type="button"
                      onClick={() => onSwitchRole && onSwitchRole('partner')}
                      className="text-xs font-semibold text-[#b83a24] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View report</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Bars Container */}
                  <div className="pt-4 pb-2">
                    <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2">
                      {last14DaysRevenue.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative cursor-pointer"
                          onMouseEnter={() => setHoveredDayIndex(idx)}
                          onMouseLeave={() => setHoveredDayIndex(null)}
                        >
                          {/* Tooltip */}
                          {hoveredDayIndex === idx && (
                            <div className="absolute -top-10 bg-[#181311] text-white text-[10px] px-2 py-1 rounded-md font-mono whitespace-nowrap shadow-md z-10">
                              {item.date}: {item.mad.toLocaleString()} MAD
                            </div>
                          )}

                          {/* Bar element */}
                          <div 
                            style={{ height: item.height }}
                            className={`w-full rounded-t-xs transition-all duration-300 ${
                              item.isDip 
                                ? 'bg-[#e8decb] group-hover:bg-[#dfd3bc]' 
                                : 'bg-[#8b261b] group-hover:bg-[#a62f22]'
                            }`}
                          ></div>
                        </div>
                      ))}
                    </div>

                    {/* X-axis Day labels */}
                    <div className="flex justify-between gap-1.5 sm:gap-2 pt-2 border-t border-neutral-200/60 mt-1">
                      {last14DaysRevenue.map((item, idx) => (
                        <div key={idx} className="flex-1 text-center text-[10px] text-neutral-500 font-mono">
                          {item.day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Bookings list */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-[#fcfbfa] border border-neutral-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-neutral-900">
                      Live bookings
                    </span>
                    <button 
                      type="button"
                      onClick={() => onSwitchRole && onSwitchRole('partner')}
                      className="text-xs font-semibold text-[#b83a24] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>All</span>
                      <span>→</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {mockLiveBookings.map((b, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-100/70 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${b.avatarColor}`}>
                            {b.initials}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900">
                              {b.name}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {b.details}
                            </div>
                          </div>
                        </div>

                        <div>
                          {b.status === 'CONFIRMED' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#edf7ee] text-[#2d7334] border border-[#d2edd5]">
                              CONFIRMED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#fdf5e7] text-[#9c6a1e] border border-[#f7e6c4]">
                              ID REVIEW
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-neutral-400 text-center">
                    Instant sync with Casablanca & Marrakech airport dispatch
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* ── 3 OPERATIONAL HIGHLIGHT PILLARS (OUR PLATFORM'S CORE ABILITIES) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-neutral-900">Dahir 2026 Bilingual Contracts</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Legally binding Arabic/French digital rental agreements generated automatically with transport ministry compliance clauses, pre-trip condition diagrams, and tamper-proof timestamps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-neutral-900">Pre-authorized CMI Guarantee</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Security deposits held securely on Moroccan or international credit cards without manual POS terminal friction. Claims for damages or fines resolve in 2 clicks with photo evidence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-neutral-900">Inter-Agency B2B Fleet Sharing</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              When you are out of cars during peak seasons (GITEX, holidays, summer), source idle cars from verified partner agencies in your city with automated split revenue. Never turn away a booking.
            </p>
          </div>
        </div>

        {/* Live Portal Launch Bar */}
        {onSwitchRole && (
          <div className="mt-8 p-6 rounded-2xl bg-[#181311] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f95721]" />
                <span>Ready to experience the real agency workspace?</span>
              </div>
              <p className="text-xs text-neutral-400">
                Log in to inspect live fleet telematics, dynamic MAD pricing, Dahir contract signatures, and direct CMI payouts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSwitchRole('partner')}
              className="px-6 py-3 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <span>Launch Live Partner Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* ── ONBOARDING MODAL ── */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e1714] text-white border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              ✕
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-white">Application Received!</h3>
                <p className="text-xs text-neutral-300 max-w-xs mx-auto">
                  Marhaban! Our Moroccan agency onboarding team will contact you within 24 hours. Launching your workspace...
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f95721]">
                    Quick Registration
                  </span>
                  <h3 className="font-serif-display text-2xl font-bold text-white mt-0.5">
                    Partner with Airbcar
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Zero listing fees. Direct payouts. Insured by Wafa Assurance.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-1">Agency Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Atlas Prestige Cars SARL"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#2b201b] border border-white/15 text-white text-xs focus:border-[#f95721] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">City</label>
                      <select 
                        value={agencyCity}
                        onChange={(e) => setAgencyCity(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#2b201b] border border-white/15 text-white text-xs focus:border-[#f95721] focus:outline-none cursor-pointer"
                      >
                        {networkCities.map(c => (
                          <option key={c.name} value={c.name} className="bg-[#1e1714] text-white">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">Fleet Count</label>
                      <input 
                        type="number" 
                        min="1"
                        required
                        value={agencyFleetCount}
                        onChange={(e) => setAgencyFleetCount(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#2b201b] border border-white/15 text-white text-xs focus:border-[#f95721] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-1">WhatsApp / Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+212 6 XX XX XX XX"
                      value={agencyPhone}
                      onChange={(e) => setAgencyPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#2b201b] border border-white/15 text-white text-xs focus:border-[#f95721] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-1">ICE or Registre de Commerce (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 002345892000034"
                      value={agencyIce}
                      onChange={(e) => setAgencyIce(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#2b201b] border border-white/15 text-white text-xs focus:border-[#f95721] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#f95721] hover:bg-[#e04816] text-white font-semibold text-xs transition-colors shadow-lg active:scale-98 cursor-pointer"
                  >
                    Submit Agency Application
                  </button>
                  <p className="text-[10px] text-center text-neutral-400 mt-2">
                    By applying, you accept Airbcar partner terms &amp; Moroccan transport regulations.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
