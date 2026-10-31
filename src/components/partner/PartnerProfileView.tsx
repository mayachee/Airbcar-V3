import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Car, 
  Calendar, 
  Share2, 
  MessageSquare, 
  Check, 
  Fuel, 
  Users, 
  Gauge, 
  Sparkles,
  Plane, 
  Award, 
  ChevronRight, 
  X,
  Compass,
  FileCheck2,
  Lock,
  Search,
  PenLine,
  Pencil,
  Quote,
  Eye,
  EyeOff
} from 'lucide-react';
import { ActiveTab, CarListing } from '../../types';
import { getPartnerById } from '../../data/partnersData';
import { getCarsByPartnerId } from '../../data/carsData';

interface PartnerProfileViewProps {
  partnerId?: string;
  partnerProfile?: any;
  onUpdateProfile?: (profile: any) => void;
  onSelectCar?: (car: CarListing) => void;
  onBack?: () => void;
  onNavigateTab?: (tab: ActiveTab) => void;
}

export const PartnerProfileView: React.FC<PartnerProfileViewProps> = ({
  partnerId = '5',
  onSelectCar = (_car: CarListing) => {},
  onBack = () => {},
  onNavigateTab: _onNavigateTab
}) => {
  const partner = useMemo(() => getPartnerById(partnerId), [partnerId]);
  const partnerFleet = useMemo(() => getCarsByPartnerId(partnerId), [partnerId]);
  
  // Interactive UI state
  const [selectedFleetCategory, setSelectedFleetCategory] = useState<string>('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSection, setActiveSection] = useState<'fleet' | 'guarantees' | 'hubs' | 'philosophy' | 'reviews'>('fleet');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick trip estimator dates
  const [pickupDate, setPickupDate] = useState('2026-10-14');
  const [returnDate, setReturnDate] = useState('2026-10-19');

  // Direct Inquiry modal state
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySelectedCar, setInquirySelectedCar] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Review filters
  const [reviewFilter, setReviewFilter] = useState<'all' | 'airport' | '5star'>('all');

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    try {
      const start = new Date(pickupDate).getTime();
      const end = new Date(returnDate).getTime();
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch {
      return 5;
    }
  }, [pickupDate, returnDate]);

  // Partner custom quote state (Written by Partner)
  const initialPartnerManifesto = partner?.manifesto || 'We believe renting a car in Morocco should be as dignified and unhurried as sharing a pot of mint tea. No hidden franchises, no scratched bumper traps, and no middlemen taking 30% from local people who know these roads by heart.';
  const initialPartnerAuthor = partner?.ownerName || (partnerId === '5' ? 'Younes Mayache' : partner?.name || 'Local Partner');
  const initialPartnerRole = `Founder & Fleet Master · ${partner?.city || 'Tetouan'} Mobility Artisan`;
  const initialPartnerPermit = partnerId === '5' ? 'Morocco Transport Permit TTU-441' : `Morocco Transport Permit MA-${partnerId}-2026`;

  const [partnerQuote, setPartnerQuote] = useState<string>(() => {
    return localStorage.getItem(`airbcar_partner_quote_${partnerId}`) || initialPartnerManifesto;
  });
  const [quoteAuthor, setQuoteAuthor] = useState<string>(() => {
    return localStorage.getItem(`airbcar_partner_author_${partnerId}`) || initialPartnerAuthor;
  });
  const [quoteRole, setQuoteRole] = useState<string>(() => {
    return localStorage.getItem(`airbcar_partner_role_${partnerId}`) || initialPartnerRole;
  });
  const [quotePermit, setQuotePermit] = useState<string>(() => {
    return localStorage.getItem(`airbcar_partner_permit_${partnerId}`) || initialPartnerPermit;
  });

  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [editQuoteDraft, setEditQuoteDraft] = useState(partnerQuote);
  const [editAuthorDraft, setEditAuthorDraft] = useState(quoteAuthor);
  const [editRoleDraft, setEditRoleDraft] = useState(quoteRole);
  const [editPermitDraft, setEditPermitDraft] = useState(quotePermit);
  const [quoteToast, setQuoteToast] = useState(false);

  const handleSaveQuote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editQuoteDraft.trim()) return;

    setPartnerQuote(editQuoteDraft.trim());
    setQuoteAuthor(editAuthorDraft.trim());
    setQuoteRole(editRoleDraft.trim());
    setQuotePermit(editPermitDraft.trim());

    localStorage.setItem(`airbcar_partner_quote_${partnerId}`, editQuoteDraft.trim());
    localStorage.setItem(`airbcar_partner_author_${partnerId}`, editAuthorDraft.trim());
    localStorage.setItem(`airbcar_partner_role_${partnerId}`, editRoleDraft.trim());
    localStorage.setItem(`airbcar_partner_permit_${partnerId}`, editPermitDraft.trim());

    setIsEditingQuote(false);
    setQuoteToast(true);
    setTimeout(() => setQuoteToast(false), 3500);
  };

  // Contact infos visibility state (hidden by default to protect on-platform escrow & prevent off-platform bypass)
  const [showContactDetails, setShowContactDetails] = useState<boolean>(() => {
    const saved = localStorage.getItem('airbcar_show_partner_contact_info');
    return saved === 'true'; // defaults to false (hidden)
  });

  const toggleContactDetails = () => {
    setShowContactDetails(prev => {
      const next = !prev;
      localStorage.setItem('airbcar_show_partner_contact_info', String(next));
      return next;
    });
  };

  // Filtered & Sorted Fleet
  const displayedFleet = useMemo(() => {
    let list = [...partnerFleet];

    if (selectedFleetCategory !== 'All') {
      list = list.filter(car => car.category.toLowerCase() === selectedFleetCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(car => 
        car.name.toLowerCase().includes(q) || 
        car.model.toLowerCase().includes(q) || 
        car.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.dailyRate - b.dailyRate);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.dailyRate - a.dailyRate);
    }

    return list;
  }, [partnerFleet, selectedFleetCategory, searchQuery, sortBy]);

  // Filtered Reviews
  const displayedReviews = useMemo(() => {
    if (!partner) return [];
    if (reviewFilter === '5star') {
      return partner.reviews.filter(r => r.rating === 5);
    }
    if (reviewFilter === 'airport') {
      return partner.reviews.filter(r => 
        r.comment.toLowerCase().includes('airport') || 
        r.comment.toLowerCase().includes('ramel') || 
        r.comment.toLowerCase().includes('flight')
      );
    }
    return partner.reviews;
  }, [partner, reviewFilter]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  if (!partner) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1a1412] flex flex-col items-center justify-center p-6">
        <h2 className="font-serif-display text-2xl mb-4">Partner agency not found</h2>
        <button 
          onClick={onBack}
          className="px-6 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white font-medium cursor-pointer shadow-xs transition-colors"
        >
          Return to Search
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1a1412] font-sans selection:bg-[#f95721] selection:text-white pb-28">
      
      {/* ── BREADCRUMB / TOP ACTION BAR ── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#EAE3D9] px-4 sm:px-8 py-3.5 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-2 text-[#6e5d53] hover:text-[#1a1412] transition-colors cursor-pointer group py-1 font-medium"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-[#f95721]" />
              <span>Back to search</span>
            </button>
            <span className="text-[#c2b4a8]">/</span>
            <span className="text-[#8c7a6e]">Verified Agency Atelier</span>
            <span className="text-[#c2b4a8]">/</span>
            <span className="text-[#1a1412] font-medium truncate max-w-[180px] sm:max-w-xs">{partner.name}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4EFEA] hover:bg-[#EAE3D9] text-[#4a3b32] hover:text-[#1a1412] border border-[#E0D7CC] transition-colors text-xs font-medium cursor-pointer shadow-2xs"
              title="Share partner agency profile"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link copied!' : 'Share'}</span>
            </button>
            
            <button
              onClick={() => {
                setInquirySelectedCar(partnerFleet[0]?.name || '');
                setIsInquiryModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FAF8F5] text-[#1a1412] font-medium border border-[#E0D7CC] transition-all text-xs cursor-pointer shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-[#8c7a6e]" />
              <span>Direct Inquiry</span>
            </button>

            {showContactDetails && (
              <a 
                href={`https://wa.me/${partner.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white font-semibold transition-all shadow-xs text-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Concierge</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── CINEMATIC ARCHITECTURAL HERO BANNER ── */}
      <div className="relative border-b border-[#EAE3D9] overflow-hidden bg-[#F4EFEA]">
        {/* Cover Photo Backdrop with warm subtle gradient */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img 
            src={partner.coverImage} 
            alt={partner.name}
            className="w-full h-full object-cover object-center transform scale-105 filter saturate-[0.85] contrast-[0.95]"
          />
          {/* Subtle warm architectural gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/60 to-[#1a1412]/30" />
          
          {/* Grain texture */}
          <div 
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Floating Top Pill Badges */}
          <div className="absolute top-6 left-4 sm:left-8 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-xs font-semibold tracking-wider uppercase text-[#c43b0d] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#f95721]" />
              Official Tetouan Mediterranean Host
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a1412]/80 backdrop-blur-md text-xs font-medium text-white shadow-sm">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              {partner.city} · Northern Rif Corridor
            </span>
          </div>

          <div className="absolute top-6 right-4 sm:right-8 hidden md:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#EAE3D9] text-xs font-mono font-medium text-[#4a3b32] shadow-sm">
              License {partner.licenseNumber}
            </span>
          </div>
        </div>

        {/* ── OVERLAPPING AGENCY IDENTITY CARD ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-24 sm:-mt-28 relative z-20 pb-10">
          <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Monogram & Bio */}
              <div className="lg:col-span-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  {/* Monogram Brand Frame */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-[#EAE3D9] p-1.5 shadow-md flex items-center justify-center overflow-hidden group">
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#f95721] text-white flex items-center justify-center shadow-md ring-4 ring-white" title="Verified Moroccan Partner">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="font-serif-display font-bold text-3xl sm:text-4xl text-[#1a1412] tracking-tight">
                        {partner.name}
                      </h1>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Dahir 2026 Certified
                      </span>
                    </div>

                    <p className="text-[#6e5d53] text-sm mt-1 font-mono">
                      {partner.tradingName} · Registered Transport Operator
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#52433a]">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#f95721]" />
                        <span className="font-medium">{partner.address}</span>
                      </span>
                      <span className="text-[#c2b4a8]">✦</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>Artisan host since {partner.foundedYear}</span>
                      </span>
                      <span className="text-[#c2b4a8]">✦</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span>Open 08:00 – 21:00</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agency Editorial Bio */}
                <p className="text-[#4a3b32] text-base leading-relaxed max-w-3xl font-normal border-t border-[#EAE3D9] pt-4">
                  {partner.bio}
                </p>

                {/* Quick Feature Badges */}
                <div className="flex flex-wrap gap-2 mt-4 pt-2">
                  <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE3D9] text-xs text-[#4a3b32] font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Tetouan Airport (TTU) Free Handover
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE3D9] text-xs text-[#4a3b32] font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    CMI Escrow Pre-Auth (No Cash Hold)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE3D9] text-xs text-[#4a3b32] font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Wafa Assurance All-Risks Fleet
                  </span>
                </div>
              </div>

              {/* Right Column: Key Trust Metric Scorecard (Modern Bento Tile) */}
              <div className="lg:col-span-4 w-full bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4">
                    <div>
                      <span className="text-[11px] text-[#6e5d53] uppercase tracking-wider font-semibold block">
                        Verified Renter Trust Score
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-3xl font-bold text-[#1a1412] font-serif-display">{partner.rating}</span>
                        <div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#6e5d53] mt-0.5 block font-mono">
                            Top 1% Host in Tetouan
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-[#1a1412] font-bold block font-mono">{partner.reviewCount}</span>
                      <span className="text-xs text-emerald-700 font-semibold">{partner.zeroDisputeRate} Dispute-Free</span>
                    </div>
                  </div>

                  {/* 4-Cell Stat Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-4">
                    <div className="bg-white p-3 rounded-xl border border-[#EAE3D9]">
                      <span className="text-[11px] text-[#6e5d53] block font-medium">Avg Response</span>
                      <span className="text-sm font-bold text-[#1a1412] mt-0.5 block">{partner.responseTime}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#EAE3D9]">
                      <span className="text-[11px] text-[#6e5d53] block font-medium">Acceptance</span>
                      <span className="text-sm font-bold text-emerald-700 mt-0.5 block">{partner.responseRate}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#EAE3D9]">
                      <span className="text-[11px] text-[#6e5d53] block font-medium">Completed Trips</span>
                      <span className="text-sm font-bold text-[#1a1412] mt-0.5 block font-mono">{partner.completedTrips}+</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#EAE3D9]">
                      <span className="text-[11px] text-[#6e5d53] block font-medium">Available Fleet</span>
                      <span className="text-sm font-bold text-[#f95721] mt-0.5 block font-mono">{partnerFleet.length} Vehicles</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      const fleetElem = document.getElementById('fleet-section');
                      fleetElem?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#f95721] hover:bg-[#e04816] text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Car className="w-4 h-4" />
                    <span>Browse Fleet &amp; Reserve</span>
                  </button>

                  <div className={showContactDetails ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}>
                    {showContactDetails ? (
                      <a
                        href={`tel:${partner.phone}`}
                        className="py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#EAE3D9] text-[#1a1412] font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#f95721]" />
                        <span>Call Desk</span>
                      </a>
                    ) : (
                      <div className="py-2 px-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] text-[#736357] text-[11px] font-medium flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Contact infos hidden before reservation</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setInquirySelectedCar(partnerFleet[0]?.name || '');
                        setIsInquiryModalOpen(true);
                      }}
                      className="py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#EAE3D9] text-[#1a1412] font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#8c7a6e]" />
                      <span>Send Direct Inquiry</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* ── THE FOUNDER'S PHILOSOPHY & EDITORIAL MANIFESTO (TOP PROFILE HIGHLIGHT) ── */}
            <section id="philosophy-section" className="mt-8 pt-6 border-t border-[#EAE3D9] scroll-mt-36">
              <div className="bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xs transition-all">
                {/* Grain overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.025] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }}
                />

                <div className="max-w-4xl relative z-10">
                  {/* Toast Alert */}
                  {quoteToast && (
                    <div className="mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 animate-fade-in shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">Your partner quote and personal creed were saved &amp; published successfully!</span>
                    </div>
                  )}

                  {!isEditingQuote ? (
                    /* ── DISPLAY MODE (WRITTEN BY PARTNER) ── */
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs uppercase tracking-widest text-[#c43b0d] font-semibold flex items-center gap-2">
                            <span>✦</span> {partner.name || quoteAuthor}'s Philosophy &amp; Creed
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF0E6] text-[#c43b0d] border border-[#F3DFC9] text-[11px] font-medium">
                            <PenLine className="w-3 h-3" />
                            Written by Partner
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-white border border-[#EAE3D9] text-xs text-[#4a3b32] font-mono shadow-2xs">
                            {quotePermit}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              setEditQuoteDraft(partnerQuote);
                              setEditAuthorDraft(quoteAuthor);
                              setEditRoleDraft(quoteRole);
                              setEditPermitDraft(quotePermit);
                              setIsEditingQuote(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#F2ECE4] border border-[#D9CEBF] text-xs font-semibold text-[#1a1412] shadow-2xs transition-all cursor-pointer group hover:border-[#c43b0d]"
                            title="Write or edit this partner quote"
                          >
                            <Pencil className="w-3 h-3 text-[#c43b0d] group-hover:scale-110 transition-transform" />
                            <span>Write / Edit Quote</span>
                          </button>
                        </div>
                      </div>

                      <blockquote className="font-serif-display text-lg sm:text-xl md:text-2xl text-[#1a1412] italic leading-snug">
                        "{partnerQuote}"
                      </blockquote>

                      <div className="mt-6 pt-5 border-t border-[#EAE3D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-white border border-[#EAE3D9] flex items-center justify-center font-serif-display font-bold text-sm text-[#1a1412] shadow-2xs">
                            {quoteAuthor.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'YM'}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-[#1a1412] block">{quoteAuthor}</span>
                            <span className="text-xs text-[#6e5d53]">{quoteRole}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Direct Local Host Guarantee
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ── EDITING / COMPOSING MODE (FOR THE PARTNER TO WRITE IT) ── */
                    <form onSubmit={handleSaveQuote} className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#c43b0d]"></span>
                            <h3 className="font-serif-display text-xl font-bold text-[#1a1412]">
                              Write Your Agency Quote &amp; Philosophy
                            </h3>
                          </div>
                          <p className="text-xs text-[#6e5d53] mt-0.5">
                            Share what makes your agency distinct, your hospitality standard, and your promise to Moroccan road travelers.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingQuote(false)}
                          className="p-1.5 rounded-full hover:bg-neutral-200/60 text-[#6e5d53] hover:text-[#1a1412] transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quick Idea Injections */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-[#8c7a6e] mr-1">Inspirations:</span>
                        {[
                          { label: 'Mint Tea Hospitality', text: 'We believe renting a car in Morocco should be as dignified and unhurried as sharing a pot of mint tea with good company.' },
                          { label: 'Zero Hidden Fees', text: 'No hidden franchise surprises, no scratched bumper traps, and no middlemen taking commissions from hard-working local fleet hosts.' },
                          { label: 'Spotless Motors & Care', text: 'Spotless clean vehicles, pre-authorized non-debited security deposits, and round-the-clock roadside assistance wherever you drive.' },
                          { label: 'Local Northern Roots', text: 'Born and raised in Tetouan, we know every mountain pass in the Rif and welcome travelers like family.' }
                        ].map(chip => (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={() => setEditQuoteDraft(chip.text)}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F2ECE4] border border-[#EAE3D9] text-[11px] font-medium text-[#4a3b32] transition-colors cursor-pointer"
                          >
                            + {chip.label}
                          </button>
                        ))}
                      </div>

                      {/* Main Quote Textarea */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[10px] font-bold text-[#6e5d53] uppercase tracking-wider">
                            YOUR PERSONAL QUOTE / EDITORIAL MANIFESTO
                          </label>
                          <span className="text-[10px] text-[#8c7a6e] font-mono">
                            {editQuoteDraft.length} characters
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          required
                          value={editQuoteDraft}
                          onChange={(e) => setEditQuoteDraft(e.target.value)}
                          placeholder="Write what drives your agency, your standards of vehicle cleanliness, and your hospitality promise to guests..."
                          className="w-full bg-white border border-[#D9CEBF] focus:border-[#c43b0d] rounded-xl p-3.5 text-sm sm:text-base font-serif-display text-[#1a1412] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#c43b0d] transition-all shadow-2xs"
                        />
                      </div>

                      {/* Grid of author credentials */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-[#6e5d53] uppercase tracking-wider mb-1">
                            FOUNDER / AUTHOR NAME
                          </label>
                          <input
                            type="text"
                            required
                            value={editAuthorDraft}
                            onChange={(e) => setEditAuthorDraft(e.target.value)}
                            placeholder="e.g. Younes Mayache"
                            className="w-full bg-white border border-[#D9CEBF] rounded-xl px-3 py-2 text-xs font-medium text-[#1a1412] focus:outline-none focus:ring-1 focus:ring-[#c43b0d]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#6e5d53] uppercase tracking-wider mb-1">
                            ROLE &amp; TITLE
                          </label>
                          <input
                            type="text"
                            required
                            value={editRoleDraft}
                            onChange={(e) => setEditRoleDraft(e.target.value)}
                            placeholder="e.g. Founder & Fleet Master"
                            className="w-full bg-white border border-[#D9CEBF] rounded-xl px-3 py-2 text-xs font-medium text-[#1a1412] focus:outline-none focus:ring-1 focus:ring-[#c43b0d]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#6e5d53] uppercase tracking-wider mb-1">
                            PERMIT OR LICENSE BADGE
                          </label>
                          <input
                            type="text"
                            value={editPermitDraft}
                            onChange={(e) => setEditPermitDraft(e.target.value)}
                            placeholder="e.g. Morocco Transport Permit TTU-441"
                            className="w-full bg-white border border-[#D9CEBF] rounded-xl px-3 py-2 text-xs font-medium text-[#1a1412] focus:outline-none focus:ring-1 focus:ring-[#c43b0d] font-mono"
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setIsEditingQuote(false)}
                          className="px-4 py-2 rounded-xl hover:bg-neutral-200/60 text-xs font-semibold text-[#6e5d53] transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-full bg-[#c43b0d] hover:bg-[#a63009] text-white text-xs font-bold transition-all active:scale-95 shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Publish Partner Quote</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* ── STICKY SUB-NAVIGATION BAR ── */}
      <div className="bg-white border-b border-[#EAE3D9] sticky top-[53px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-6 py-2.5">
            <div className="flex items-center gap-1 sm:gap-2">
              {[
                { id: 'philosophy', label: 'Story & Philosophy' },
                { id: 'fleet', label: 'Fleet & Availability', count: partnerFleet.length },
                { id: 'guarantees', label: 'Dahir Standards & Perks' },
                { id: 'hubs', label: 'Handover Hubs & Airports' },
                { id: 'reviews', label: 'Verified Reviews', count: partner.reviews.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSection(tab.id as typeof activeSection);
                    const el = document.getElementById(`${tab.id}-section`);
                    if (el) {
                      const offset = 120;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = el.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeSection === tab.id
                      ? 'bg-[#1a1412] text-white font-semibold shadow-xs'
                      : 'text-[#6e5d53] hover:text-[#1a1412] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeSection === tab.id ? 'bg-white/20 text-white' : 'bg-[#EAE3D9] text-[#4a3b32]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Micro Live Host Status */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-[#6e5d53] shrink-0 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Desk active · Handover team ready at Sania Ramel</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-16">

        {/* ── SECTION 1: FLEET & INSTANT QUOTE ESTIMATOR ── */}
        <section id="fleet-section" className="scroll-mt-32">
          
          {/* Section Header & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAE3D9]/60 text-xs font-semibold text-[#c43b0d] uppercase tracking-wider mb-2">
                <span>✦</span> Verified Vehicle Registry
              </div>
              <h2 className="font-serif-display font-bold text-2xl sm:text-3xl text-[#1a1412]">
                Mayache Prestige Fleet in Tetouan ({partnerFleet.length})
              </h2>
              <p className="text-sm text-[#6e5d53] mt-1 max-w-2xl">
                Every vehicle is owned and maintained directly by the agency. Delivered spotless with Dahir 2026 digital telemetry and verified CMI deposit guarantee.
              </p>
            </div>

            {/* Quick Trip Date Estimator Widget */}
            <div className="bg-white border border-[#EAE3D9] rounded-2xl p-3 shadow-xs flex flex-wrap items-center gap-3 self-start lg:self-auto">
              <div className="flex items-center gap-2 text-xs text-[#6e5d53] px-2 font-medium">
                <Calendar className="w-4 h-4 text-[#f95721]" />
                <span>Estimate for:</span>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-[#EAE3D9] bg-[#FAF8F5] text-[#1a1412] font-mono focus:outline-[#f95721]"
                  title="Pickup date"
                />
                <span className="text-[#8c7a6e] text-xs font-semibold">to</span>
                <input 
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-[#EAE3D9] bg-[#FAF8F5] text-[#1a1412] font-mono focus:outline-[#f95721]"
                  title="Return date"
                />
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#c43b0d] font-bold text-xs font-mono border border-[#EAE3D9]">
                {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>

          {/* Filter Bar: Categories + Search + Sort */}
          <div className="bg-white border border-[#EAE3D9] rounded-2xl p-4 mb-8 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {['All', 'Sedan', 'SUV', 'Coupe', '4x4'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFleetCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedFleetCategory === cat
                      ? 'bg-[#f95721] text-white font-bold shadow-xs'
                      : 'bg-[#FAF8F5] hover:bg-[#EAE3D9] text-[#4a3b32] border border-[#EAE3D9]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right side: Search & Sort controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="relative flex-1 md:w-48">
                <Search className="w-3.5 h-3.5 text-[#8c7a6e] absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-[#EAE3D9] bg-[#FAF8F5] text-[#1a1412] focus:outline-[#f95721]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c7a6e] hover:text-[#1a1412]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1.5 rounded-full border border-[#EAE3D9] bg-[#FAF8F5] text-[#4a3b32] text-xs font-medium focus:outline-[#f95721] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Vehicles Grid */}
          {displayedFleet.length === 0 ? (
            <div className="bg-white border border-[#EAE3D9] rounded-3xl p-12 text-center">
              <Car className="w-12 h-12 text-[#c2b4a8] mx-auto mb-3" />
              <h3 className="font-serif-display font-semibold text-lg text-[#1a1412]">No vehicles match your criteria</h3>
              <p className="text-xs text-[#6e5d53] mt-1 max-w-sm mx-auto">
                Try selecting a different category or clearing the search filter to view the agency's full fleet.
              </p>
              <button
                onClick={() => {
                  setSelectedFleetCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-full bg-[#f95721] text-white text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedFleet.map((vehicle) => {
                const calculatedTotal = vehicle.dailyRate * rentalDays;
                return (
                  <div 
                    key={vehicle.id}
                    onClick={() => onSelectCar(vehicle)}
                    className="group bg-white hover:border-[#f95721]/50 border border-[#EAE3D9] rounded-3xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Image banner with high-end overlays */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5]">
                        <img 
                          src={vehicle.images[0]} 
                          alt={vehicle.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#EAE3D9] text-xs font-semibold text-[#1a1412] flex items-center gap-1.5 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f95721]"></span>
                            <span>{vehicle.category}</span>
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full bg-[#1a1412]/80 backdrop-blur-md text-[11px] font-semibold text-white shadow-2xs">
                            {vehicle.year} Edition
                          </span>
                        </div>

                        {/* Bottom Tag: Free Airport Meet & Greet */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium text-white flex items-center gap-1">
                            <Plane className="w-3 h-3 text-amber-400" />
                            Free Sania Ramel Delivery
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-[10px] font-medium text-emerald-300 border border-emerald-500/30">
                            Instant Confirmation
                          </span>
                        </div>
                      </div>

                      {/* Vehicle Body Content */}
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-serif-display font-bold text-xl text-[#1a1412] group-hover:text-[#f95721] transition-colors">
                            {vehicle.name}
                          </h3>
                        </div>

                        <p className="text-xs text-[#6e5d53] line-clamp-2 mt-1 leading-relaxed">
                          {vehicle.description}
                        </p>

                        {/* Specs row */}
                        <div className="grid grid-cols-3 gap-2 py-3.5 my-3 border-y border-[#EAE3D9] text-xs text-[#52433a]">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#8c7a6e]" />
                            <span>{vehicle.seats} seats</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Gauge className="w-3.5 h-3.5 text-[#8c7a6e]" />
                            <span className="capitalize">{vehicle.transmission}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Fuel className="w-3.5 h-3.5 text-[#8c7a6e]" />
                            <span className="capitalize">{vehicle.fuel}</span>
                          </div>
                        </div>

                        {/* Key perks / Deposit line */}
                        <div className="flex items-center justify-between text-[11px] text-[#6e5d53] pt-1">
                          <span className="flex items-center gap-1 font-mono">
                            <Lock className="w-3 h-3 text-emerald-600" />
                            CMI Deposit: {vehicle.depositAmount.toLocaleString()} DH
                          </span>
                          <span className="text-emerald-700 font-medium">Unlimited km</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Price & Action */}
                    <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-[#EAE3D9] bg-[#FAF8F5]/60 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-[#1a1412] font-serif-display">
                            {vehicle.dailyRate}
                          </span>
                          <span className="text-xs text-[#f95721] font-bold">DH / day</span>
                        </div>
                        <span className="text-[11px] text-[#6e5d53] block font-mono">
                          Total: ~{calculatedTotal.toLocaleString()} DH ({rentalDays}d)
                        </span>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCar(vehicle);
                        }}
                        className="px-4 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer group-hover:shadow-md"
                      >
                        <span>View &amp; Book</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 2: DAHIR 2026 STANDARDS & PERKS (BENTO VISUAL GRID) ── */}
        <section id="guarantees-section" className="scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE3D9]/60 text-xs font-semibold text-[#c43b0d] uppercase tracking-wider mb-3">
              <span>✦</span> The Mayache Quality Code
            </div>
            <h2 className="font-serif-display font-bold text-3xl sm:text-4xl text-[#1a1412] tracking-tight">
              Dahir 2026 Compliance &amp; Traveler Guarantees
            </h2>
            <p className="text-sm text-[#6e5d53] mt-2 leading-relaxed">
              We operate under sovereign Moroccan Ministry transport mandates, designed to eliminate predatory rental practices, arbitrary scratches disputes, and cash deposits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Biometric E-Contract */}
            <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#f95721] flex items-center justify-center mb-5">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display font-bold text-lg text-[#1a1412] mb-2">
                Biometric Digital Contracts
              </h3>
              <p className="text-xs text-[#52433a] leading-relaxed mb-4">
                No messy triplicate carbon paper. Your contract is generated digitally with timestamped 360° photo telemetry before departure and delivered straight to your email.
              </p>
              <div className="pt-3 border-t border-[#EAE3D9] text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ministry Law Dahir 2026 Compliant
              </div>
            </div>

            {/* Feature 2: CMI Escrow Pre-Auth */}
            <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display font-bold text-lg text-[#1a1412] mb-2">
                CMI Bank Pre-Authorized Hold
              </h3>
              <p className="text-xs text-[#52433a] leading-relaxed mb-4">
                Your security deposit is strictly held as an electronic temporary pre-authorization through Moroccan Interbank (CMI). It is never debited, and releases automatically within 48h.
              </p>
              <div className="pt-3 border-t border-[#EAE3D9] text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero Unsolicited Card Deductions
              </div>
            </div>

            {/* Feature 3: Wafa All-Risks */}
            <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display font-bold text-lg text-[#1a1412] mb-2">
                Wafa Assurance All-Risks Fleet
              </h3>
              <p className="text-xs text-[#52433a] leading-relaxed mb-4">
                Every vehicle in the Mayache fleet carries comprehensive commercial fleet coverage from Wafa Assurance. Upgradeable to Zero-Deductible protection directly on reservation.
              </p>
              <div className="pt-3 border-t border-[#EAE3D9] text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Full Civil &amp; Collision Protection
              </div>
            </div>

            {/* Feature 4: 24/7 Rif Assistance */}
            <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display font-bold text-lg text-[#1a1412] mb-2">
                24/7 Rif Mountain Roadside Concierge
              </h3>
              <p className="text-xs text-[#52433a] leading-relaxed mb-4">
                Flat tire or battery issue on the Chefchaouen road or Akchour gorges? Our dedicated local assistance team responds in under 45 minutes with replacement vehicle guarantee.
              </p>
              <div className="pt-3 border-t border-[#EAE3D9] text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Direct Concierge Hotline Access
              </div>
            </div>

            {/* Feature 5: Free Child Seats & 4G Wi-Fi */}
            <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display font-bold text-lg text-[#1a1412] mb-2">
                Travel Equipment on Request
              </h3>
              <p className="text-xs text-[#52433a] leading-relaxed mb-4">
                Complimentary European-certified child booster seats, high-speed 4G Morocco travel hotspot, and magnetic smartphone cockpit mounts available free on bookings 3+ days.
              </p>
              <div className="pt-3 border-t border-[#EAE3D9] text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Family Ready &amp; Cleaned Between Trips
              </div>
            </div>

            {/* Feature 6: Strict Hygiene & 40-Point Inspection */}
            <div className="bg-white border border-[#EAE3D9] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display font-bold text-lg text-[#1a1412] mb-2">
                40-Point Pre-Handover Inspection
              </h3>
              <p className="text-xs text-[#52433a] leading-relaxed mb-4">
                Tire pressures, brake pads, fluids, air conditioning, and full exterior detailing are performed before every single handover. Guaranteed full tank of fuel.
              </p>
              <div className="pt-3 border-t border-[#EAE3D9] text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Showroom Condition Handover
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION 3: HANDOVER HUBS & AIRPORTS ── */}
        <section id="hubs-section" className="scroll-mt-32">
          <div className="bg-white border border-[#EAE3D9] rounded-3xl p-8 sm:p-10 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAE3D9]/60 text-xs font-semibold text-[#c43b0d] uppercase tracking-wider mb-2">
                  <Plane className="w-3.5 h-3.5" />
                  Northern Morocco Logistics
                </div>
                <h2 className="font-serif-display font-bold text-2xl sm:text-3xl text-[#1a1412]">
                  Handover &amp; Delivery Hubs
                </h2>
                <p className="text-sm text-[#6e5d53] mt-1 max-w-xl">
                  Where would you like to receive your vehicle? Mayache Prestige offers VIP curbside handover at regional airports, ferry terminals, and luxury coastal accommodations.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#6e5d53] bg-[#FAF8F5] px-4 py-2 rounded-full border border-[#EAE3D9]">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">{partner.operatingHours}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Tetouan Sania Ramel Airport (TTU)',
                  badge: 'Free Meet & Greet',
                  desc: 'Host waits outside arrivals with your name plaque. Contract finalized in 3 minutes.',
                  icon: Plane,
                  fee: '0 DH'
                },
                {
                  title: 'Tangier Ibn Battouta Airport (TNG)',
                  badge: 'Express Shuttle Handover',
                  desc: 'Direct curbside handover at Terminal 1. Flight tracking included for delayed arrivals.',
                  icon: Plane,
                  fee: '100 DH'
                },
                {
                  title: 'Port Tanger Med Passenger Terminal',
                  badge: 'Ferry Terminal Meet',
                  desc: 'Perfect for travelers crossing by ferry from Algeciras or Tarifa with luggage.',
                  icon: Compass,
                  fee: '150 DH'
                },
                {
                  title: 'Tetouan, Martil, Cabo Negro & Marina Smir',
                  badge: 'Hotel & Riad Delivery',
                  desc: 'Vehicle delivered directly to your villa, resort lobby, or coastal vacation residence.',
                  icon: MapPin,
                  fee: 'Free on 3+ Days'
                }
              ].map((hub, idx) => (
                <div key={idx} className="bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#EAE3D9] text-[#f95721] flex items-center justify-center">
                        <hub.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#c43b0d] px-2 py-0.5 rounded-full bg-orange-100/60 border border-orange-200">
                        {hub.fee}
                      </span>
                    </div>

                    <h4 className="font-serif-display font-bold text-sm text-[#1a1412]">
                      {hub.title}
                    </h4>
                    <p className="text-xs text-[#6e5d53] mt-2 leading-relaxed">
                      {hub.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EAE3D9] text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{hub.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: VERIFIED TRAVELER REVIEWS ── */}
        <section id="reviews-section" className="scroll-mt-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAE3D9]/60 text-xs font-semibold text-[#c43b0d] uppercase tracking-wider mb-2">
                <span>✦</span> Verified Travel Logs
              </div>
              <h2 className="font-serif-display font-bold text-2xl sm:text-3xl text-[#1a1412]">
                Renter Reviews &amp; Feedback ({partner.reviews.length})
              </h2>
              <p className="text-xs text-[#6e5d53] mt-1">
                Every review represents a verified booking under Dahir 2026 digital contract ID with zero dispute record.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  reviewFilter === 'all'
                    ? 'bg-[#1a1412] text-white font-semibold shadow-xs'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#4a3b32] border border-[#EAE3D9]'
                }`}
              >
                All Reviews
              </button>
              <button
                onClick={() => setReviewFilter('airport')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  reviewFilter === 'airport'
                    ? 'bg-[#1a1412] text-white font-semibold shadow-xs'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#4a3b32] border border-[#EAE3D9]'
                }`}
              >
                Airport Delivery
              </button>
              <button
                onClick={() => setReviewFilter('5star')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  reviewFilter === '5star'
                    ? 'bg-[#1a1412] text-white font-semibold shadow-xs'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#4a3b32] border border-[#EAE3D9]'
                }`}
              >
                5-Star Only
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedReviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white border border-[#EAE3D9] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1a1412] text-sm">{rev.author}</span>
                        {rev.verified && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Trip
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#6e5d53]">{rev.location} · {rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((starIndex) => (
                        <Star 
                          key={starIndex}
                          className={`w-3.5 h-3.5 ${
                            starIndex <= Math.round(rev.rating || 5) 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-neutral-200'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-[#4a3b32] text-sm leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#EAE3D9] text-xs text-[#f95721] font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#8c7a6e]" />
                    <span>Rented: {rev.carRented}</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-mono font-medium">CMI Released 48h</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 6: DIRECT CONTACT ATELIER DESK ── */}
        <div className="bg-white border border-[#EAE3D9] rounded-3xl p-8 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs uppercase tracking-widest text-[#c43b0d] font-semibold block mb-2">
                Direct Agency Concierge Desk
              </span>
              <h3 className="font-serif-display font-bold text-2xl sm:text-3xl text-[#1a1412]">
                Have a question for Mayache Prestige Cars?
              </h3>
              <p className="text-sm text-[#4a3b32] mt-2 max-w-2xl leading-relaxed">
                Send an inquiry directly through our verified messaging desk, or visit the agency premises at Boulevard Mohamed V in Tetouan. Direct phone numbers and messaging coordinates are protected to guarantee your Dahir 2026 legal contract rights and CMI escrow security.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                {showContactDetails ? (
                  <>
                    <a 
                      href={`tel:${partner.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#EAE3D9] text-[#1a1412] font-medium transition-colors text-xs shadow-2xs"
                    >
                      <Phone className="w-4 h-4 text-[#f95721]" />
                      <span>{partner.phone}</span>
                    </a>

                    <a 
                      href={`https://wa.me/${partner.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white font-semibold transition-all shadow-xs text-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF8F5] border border-[#EAE3D9] text-[#5c4d43] text-xs font-medium shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Contact infos hidden · Released upon confirmed reservation</span>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setInquirySelectedCar(partnerFleet[0]?.name || '');
                    setIsInquiryModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white font-semibold transition-all shadow-xs text-xs cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Direct Inquiry</span>
                </button>

                <button
                  type="button"
                  onClick={toggleContactDetails}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-dashed border-[#D9CEBF] hover:border-[#f95721] text-[#736357] hover:text-[#1a1412] text-xs font-medium transition-all cursor-pointer"
                  title={showContactDetails ? "Hide contact infos" : "Show contact infos"}
                >
                  {showContactDetails ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-[#f95721]" />
                      <span>Hide contact infos</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#8c7a6e]" />
                      <span>Show contact infos</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EAE3D9] rounded-2xl p-6 text-xs text-[#52433a] space-y-3">
              <div className="font-semibold text-[#1a1412] text-sm pb-2 border-b border-[#EAE3D9] flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Certified Agency Guarantee</span>
              </div>
              <p className="flex items-start gap-2">
                <span className="text-[#f95721] font-bold">•</span>
                <span>Zero hidden card deductions; CMI deposit pre-authorized.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#f95721] font-bold">•</span>
                <span>Flight delay guarantee: Driver waits at TTU with no extra charge.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#f95721] font-bold">•</span>
                <span>Clean, sanitized, and air-conditioned vehicle at handover.</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── DIRECT INQUIRY MODAL ── */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE3D9] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setIsInquiryModalOpen(false);
                setInquirySubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FAF8F5] text-[#8c7a6e] hover:text-[#1a1412] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!inquirySubmitted ? (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#c43b0d] uppercase tracking-wider mb-1">
                  <span>✦</span> Mayache Concierge Desk
                </div>
                <h3 className="font-serif-display font-bold text-2xl text-[#1a1412]">
                  Send Inquiry to {partner.name}
                </h3>
                <p className="text-xs text-[#6e5d53] mt-1 mb-6">
                  Inquire about custom dates, delivery to your riad, or specific vehicle requests. The agency typically responds in under 15 minutes.
                </p>

                <form onSubmit={handleSendInquiry} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1a1412] block mb-1">Your Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Sofia Mansouri"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-[#1a1412] focus:outline-[#f95721]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1a1412] block mb-1">Phone / WhatsApp Number</label>
                    <input 
                      type="tel"
                      required
                      placeholder="+212 6..."
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-[#1a1412] focus:outline-[#f95721]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1a1412] block mb-1">Vehicle of Interest</label>
                    <select
                      value={inquirySelectedCar}
                      onChange={(e) => setInquirySelectedCar(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-[#1a1412] focus:outline-[#f95721] cursor-pointer"
                    >
                      {partnerFleet.map(c => (
                        <option key={c.id} value={c.name}>{c.name} — {c.dailyRate} DH/day</option>
                      ))}
                      <option value="General Fleet Advice">General Fleet Advice / Recommendations</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1a1412] block mb-1">Message or Travel Dates</label>
                    <textarea 
                      rows={3}
                      placeholder="Tell us your arrival time, airport delivery needs, or any special requests..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-[#1a1412] focus:outline-[#f95721]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Message to Agency</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="font-serif-display font-bold text-2xl text-[#1a1412] mb-2">
                  Inquiry Dispatched!
                </h3>
                <p className="text-xs text-[#6e5d53] max-w-sm mx-auto mb-6 leading-relaxed">
                  Thank you, {inquiryName}. Mayache Prestige Cars concierge desk has received your request regarding the <strong className="text-[#1a1412]">{inquirySelectedCar}</strong>. They will respond via WhatsApp / Phone shortly.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/${partner.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salam, I just sent an inquiry for ${inquirySelectedCar}. My name is ${inquiryName}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#f95721] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open WhatsApp Directly</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsInquiryModalOpen(false);
                      setInquirySubmitted(false);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#EAE3D9] text-[#1a1412] text-xs font-medium border border-[#EAE3D9] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
