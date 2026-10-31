import React, { useState, useMemo } from 'react';
import { ActiveTab } from '../../types';
import { UserRole } from '../../types/partner';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Car, 
  CreditCard, 
  PhoneCall, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  Clock,
  Send,
  X,
  FileText,
  Key,
  Compass,
  UserCheck,
  Building2,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';

interface HelpCenterViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSwitchRole?: (role: UserRole) => void;
}

interface FaqItem {
  id: string;
  category: 'getting-started' | 'account-profile' | 'booking-trips' | 'payments-refunds' | 'partner-program' | 'safety-insurance';
  question: string;
  answer: string;
  tags: string[];
}

export const HelpCenterView: React.FC<HelpCenterViewProps> = ({
  onNavigateTab,
  onSwitchRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': false,
  });
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'yes' | 'no'>>({});
  
  // Support Ticket Modal State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketTopic, setTicketTopic] = useState('Booking modification');
  const [ticketBookingRef, setTicketBookingRef] = useState('AC-2026-8812');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const categories = [
    { 
      id: 'getting-started', 
      label: 'Getting Started', 
      desc: 'Learn how to find cars, check verification rules, and book.', 
      icon: Compass, 
      count: 4 
    },
    { 
      id: 'booking-trips', 
      label: 'Booking & Trips', 
      desc: 'Modifying dates, key handover, mileage, and return procedures.', 
      icon: Car, 
      count: 5 
    },
    { 
      id: 'safety-insurance', 
      label: 'Safety & Insurance', 
      desc: 'Wafa Assurance, roadside emergency, and accident coverage.', 
      icon: ShieldCheck, 
      count: 4 
    },
    { 
      id: 'payments-refunds', 
      label: 'Payments & Deposits', 
      desc: 'MAD pricing, deposit release timelines, and refund terms.', 
      icon: CreditCard, 
      count: 4 
    },
    { 
      id: 'account-profile', 
      label: 'Account & Documents', 
      desc: 'Moroccan C.I.N., driving license front/back, and biometric check.', 
      icon: UserCheck, 
      count: 3 
    },
    { 
      id: 'partner-program', 
      label: 'Host & Partner Fleet', 
      desc: 'Listing vehicles, inter-agency B2B overflow, and weekly payouts.', 
      icon: Building2, 
      count: 4 
    },
  ];

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'getting-started',
      question: 'How do I book a car?',
      answer: 'To book a car, search for your destination and dates on our homepage. Browse the available listings, select the car that suits your needs, and click "Book Now". Follow the prompts to complete your payment and confirm your booking. Your contract is issued automatically in Moroccan Dirhams (MAD) with zero hidden currency fees.',
      tags: ['book', 'reservation', 'search', 'start', 'how to']
    },
    {
      id: 'faq-2',
      category: 'account-profile',
      question: 'What items and documents do I need to rent a car?',
      answer: "You will need: 1) A valid driver's license (Permis de Conduire) held for at least 1 or 2 years depending on category; 2) Proof of identity (Moroccan C.I.N. for residents or international passport for travelers); 3) A credit or debit card in the primary renter's name for booking and security deposit authorization. Airbcar allows you to securely upload and inspect front & back images of your license directly in the app prior to arrival.",
      tags: ['license', 'cin', 'passport', 'documents', 'permis', 'requirements']
    },
    {
      id: 'faq-3',
      category: 'booking-trips',
      question: 'Can I cancel my booking, and what is the refund policy?',
      answer: 'Yes, you can cancel your booking directly from the "My Trips" or "Contracts" screen. Cancellations made at least 48 hours prior to your scheduled pickup receive a 100% full refund back to your original payment method in MAD. Cancellations within 48 hours are subject to the partner agency\'s 1-day standard fee.',
      tags: ['cancel', 'cancellation', 'refund', 'policy', 'money back']
    },
    {
      id: 'faq-4',
      category: 'safety-insurance',
      question: 'How does insurance work on AirbCar?',
      answer: 'AirbCar provides basic Wafa Assurance trip-based coverage for all trips, including third-party liability (Responsabilité Civile), fire, and theft. During booking or digital check-in, you can select an upgraded protection tier for reduced or zero-deductible peace of mind. In case of an incident or breakdown, our 24/7 roadside assistance is active across all 14 Moroccan cities.',
      tags: ['insurance', 'wafa', 'assurance', 'coverage', 'deductible', 'franchise']
    },
    {
      id: 'faq-5',
      category: 'booking-trips',
      question: 'Is there a mileage limit on my rental?',
      answer: 'The vast majority of partner listings on AirbCar include Unlimited Mileage across Morocco. Specific luxury sedans, sports coupes, or long-term month-to-month rentals may have a designated daily allowance (typically 250 km – 350 km/day). Any mileage caps are highlighted transparently on the vehicle page before you confirm.',
      tags: ['mileage', 'kilometers', 'distance', 'unlimited', 'limit']
    },
    {
      id: 'faq-6',
      category: 'booking-trips',
      question: 'What is the Fuel Policy at pickup and return?',
      answer: 'All rentals follow the Full-to-Full (Plein-à-Plein) or Same-to-Same standard. The exact fuel gauge level is recorded on your digital contract and handover photo inspection. When returning, ensure the fuel matches the original level. If returned lower, the agency simply charges the direct station pump cost without penalty surcharges.',
      tags: ['fuel', 'gasoline', 'diesel', 'full to full', 'plein']
    },
    {
      id: 'faq-7',
      category: 'payments-refunds',
      question: 'How does the Security Deposit (Caution) work and when is it unblocked?',
      answer: 'A security deposit is pre-authorized on your card to cover incidental tolls or damages. It is held securely in escrow and is NOT an outright charge. Following the return check-out inspection, the release is triggered automatically within 24 to 48 business hours by the Moroccan banking network.',
      tags: ['deposit', 'caution', 'hold', 'bank', 'release', 'refund']
    },
    {
      id: 'faq-8',
      category: 'safety-insurance',
      question: 'What should I do in case of an accident or mechanical breakdown?',
      answer: 'First, ensure everyone\'s safety and activate your hazard lights. For an accident, complete the standard Moroccan Constat Amiable with the third party (or call Police 19 / Gendarmerie 177 if required). Immediately call Airbcar 24/7 Emergency Dispatch at +212 5 22 49 10 20. We will dispatch a recovery vehicle (Dépannage) and arrange a substitute replacement car.',
      tags: ['accident', 'breakdown', 'emergency', 'constat', 'roadside', 'depannage']
    },
    {
      id: 'faq-9',
      category: 'account-profile',
      question: 'Can I add an additional or second driver to my contract?',
      answer: 'Yes! An additional driver can be registered during checkout or added to your contract at handover. The second driver must present their valid driver\'s license and identity document for digital verification to ensure full Wafa Assurance validity.',
      tags: ['second driver', 'additional driver', 'conducteur', 'license']
    },
    {
      id: 'faq-10',
      category: 'partner-program',
      question: 'How do Moroccan rental agencies join as an AirbCar Partner?',
      answer: 'Moroccan registered car rental agencies (SARL with official ministry license) can apply via the Partner portal. Once verified by our Casablanca team, you gain access to our digital fleet manager, automated contract signing, B2B inter-agency car sharing, and weekly direct MAD payouts every Tuesday.',
      tags: ['partner', 'host', 'agency', 'fleet', 'b2b', 'register']
    },
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFeedback = (id: string, isHelpful: 'yes' | 'no') => {
    setFeedbackGiven(prev => ({
      ...prev,
      [id]: isHelpful
    }));
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const fakeId = `ABC-TICKET-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicketId(fakeId);
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfaf7] text-[#1a1412] pb-24">
      {/* ── TOP HERO & SEARCH ── */}
      <div className="bg-[#181311] text-white pt-12 pb-20 px-4 sm:px-8 border-b border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#f95721]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Breadcrumb & Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs text-amber-300 font-medium tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AirbCar Support &amp; Knowledge Base</span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How can we help you today?
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Search our comprehensive Moroccan rental guides, verify rental requirements, or reach our 24/7 Casablanca dispatch team.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative pt-2">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white text-neutral-900 border border-white/20">
              <Search className="w-5 h-5 text-neutral-400 ml-4.5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., insurance, cancellation, driver license, caution, fuel)..."
                className="w-full px-4 py-4 text-sm sm:text-base bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mr-3 p-1.5 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setIsTicketModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 mr-2 px-4 py-2.5 rounded-xl bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact</span>
              </button>
            </div>
            
            {/* Quick search tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs text-neutral-400">
              <span className="font-medium text-neutral-300">Popular:</span>
              {['Permis de conduire', 'Wafa Insurance', 'Security Deposit', 'Unlimited Mileage', 'Cancellation'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 text-[11px] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 relative z-20 space-y-12">
        {/* ── 6 QUICK CATEGORY CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(isSelected ? 'all' : cat.id);
                  if (searchQuery) setSearchQuery('');
                }}
                className={`text-left p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between group shadow-sm ${
                  isSelected
                    ? 'bg-white border-[#f95721] ring-2 ring-[#f95721]/20 shadow-md'
                    : 'bg-white hover:bg-neutral-50 border-neutral-200/80 hover:border-neutral-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-[#f95721] text-white' 
                        : 'bg-orange-50 text-[#f95721] group-hover:bg-[#f95721] group-hover:text-white'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {cat.count} articles
                    </span>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-base mb-1 group-hover:text-[#f95721] transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-semibold text-[#f95721] gap-1">
                  <span>{isSelected ? 'Showing articles' : 'View articles'}</span>
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── FILTER CHIPS BAR ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#181311] text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              All Topics ({faqs.length})
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-[#181311] text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-500 font-medium">
            Showing <strong className="text-neutral-900">{filteredFaqs.length}</strong> help articles
          </div>
        </div>

        {/* ── 24/7 EMERGENCY & DIRECT ASSISTANCE BANNER ── */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#1e1511] to-[#2d1e18] text-white border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>24/7 Roadside Assistance &amp; Emergency Dispatch</span>
            </div>
            <h3 className="font-serif-display text-2xl font-bold">
              Experiencing a roadside issue or need immediate assistance?
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Our Moroccan roadside operations team is on call around the clock across 14 cities — covering rapid tow recovery (dépannage), flat tire assistance, and replacement vehicle logistics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <a
              href="tel:+212522491020"
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-[#f95721]" />
              <span>+212 5 22 49 10 20</span>
            </a>
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="px-5 py-3.5 rounded-xl bg-[#f95721] hover:bg-[#e04816] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Support Ticket</span>
            </button>
          </div>
        </div>

        {/* ── FAQ ACCORDION LIST ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif-display text-2xl font-bold text-neutral-900">
              Frequently Asked Questions
            </h2>
            <button 
              onClick={() => {
                const allOpen = Object.values(openFaqIds).every(Boolean);
                const nextState: Record<string, boolean> = {};
                faqs.forEach(f => { nextState[f.id] = !allOpen; });
                setOpenFaqIds(nextState);
              }}
              className="text-xs text-[#f95721] font-semibold hover:underline"
            >
              {Object.values(openFaqIds).every(Boolean) ? 'Collapse all' : 'Expand all'}
            </button>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 space-y-3">
              <HelpCircle className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="font-bold text-neutral-800 text-base">No matching articles found</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                We couldn't find any help articles matching "{searchQuery}". Try a different keyword or contact our support team directly.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold mt-2"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openFaqIds[faq.id];
              const feedback = feedbackGiven[faq.id];
              return (
                <div 
                  key={faq.id}
                  className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-neutral-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#f95721] flex-shrink-0"></span>
                      <span className="font-bold text-neutral-900 text-sm sm:text-base">
                        {faq.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="hidden sm:inline-block text-[11px] font-medium text-neutral-500 capitalize px-2.5 py-0.5 rounded-full bg-neutral-100">
                        {faq.category.replace('-', ' ')}
                      </span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${isOpen ? 'bg-orange-100 text-[#f95721] rotate-180' : 'bg-neutral-100 text-neutral-500'}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-neutral-100 text-neutral-700 text-sm leading-relaxed space-y-4">
                      <p>{faq.answer}</p>
                      
                      {/* Helpful Feedback Row */}
                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                        <span>Was this article helpful?</span>
                        {feedback ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Thank you for your feedback!
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleFeedback(faq.id, 'yes')}
                              className="px-2.5 py-1 rounded-md border border-neutral-200 hover:bg-neutral-50 flex items-center gap-1 font-medium transition-colors"
                            >
                              <ThumbsUp className="w-3 h-3 text-emerald-600" />
                              <span>Yes</span>
                            </button>
                            <button
                              onClick={() => handleFeedback(faq.id, 'no')}
                              className="px-2.5 py-1 rounded-md border border-neutral-200 hover:bg-neutral-50 flex items-center gap-1 font-medium transition-colors"
                            >
                              <ThumbsDown className="w-3 h-3 text-neutral-500" />
                              <span>No</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── LOCAL HUBS & CONTACT METHODS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f95721] flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-neutral-900 text-base">Phone Support</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Direct line to our customer service desk in Casablanca. Available Monday through Sunday.
            </p>
            <div className="pt-2 text-xs font-mono font-bold text-[#f95721]">
              +212 5 22 49 10 20
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-neutral-900 text-base">WhatsApp Concierge</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Instant bilingual chat in Darija, French, and English for quick booking questions.
            </p>
            <div className="pt-2 text-xs font-mono font-bold text-emerald-700">
              +212 6 61 98 24 10 (3 min reply)
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-neutral-900 text-base">Casablanca HQ</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Hay Mohammadi &amp; Casablanca Marina operations center. Open 8:00 AM – 8:00 PM.
            </p>
            <div className="pt-2 text-xs font-semibold text-neutral-800">
              salam@airbcar.com · support@airbcar.ma
            </div>
          </div>
        </div>

        {/* ── BOTTOM CALL TO ACTION ── */}
        <div className="p-8 rounded-3xl bg-[#181311] text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10">
          <div>
            <h3 className="font-serif-display text-2xl font-bold text-white mb-1">
              Still have questions about your rental?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300">
              Our support team answers 94% of inquiries within 15 minutes.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigateTab('mission')}
              className="px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
            >
              Read Our Mission
            </button>
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-bold transition-colors shadow-md"
            >
              Open Ticket
            </button>
          </div>
        </div>
      </div>

      {/* ── SUPPORT TICKET MODAL ── */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 border border-neutral-200 max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => {
                setIsTicketModalOpen(false);
                setSubmittedTicketId(null);
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedTicketId ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-neutral-900">
                  Support Ticket Submitted
                </h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Your ticket has been routed to our Casablanca operations queue. An advisor will respond via in-app messages or email within 15 minutes.
                </p>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-xs text-neutral-800">
                  Ticket Reference: <strong>{submittedTicketId}</strong>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsTicketModalOpen(false);
                      setSubmittedTicketId(null);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#181311] text-white text-xs font-bold hover:bg-neutral-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#f95721] uppercase tracking-wider">
                    Airbcar Concierge Desk
                  </span>
                  <h3 className="font-serif-display text-2xl font-bold text-neutral-900">
                    Contact Support
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Tell us what you need help with and our team in Casablanca will assist you promptly.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Topic</label>
                  <select
                    value={ticketTopic}
                    onChange={(e) => setTicketTopic(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#f95721]"
                  >
                    <option value="Booking modification">Booking modification or dates change</option>
                    <option value="Security deposit inquiry">Security deposit inquiry &amp; release</option>
                    <option value="Document verification">Document verification (Permis / CIN)</option>
                    <option value="Roadside issue">Roadside or mechanical assistance</option>
                    <option value="Partner agency onboarding">Partner agency onboarding inquiry</option>
                    <option value="Other">Other question</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Booking Reference (Optional)</label>
                  <input
                    type="text"
                    value={ticketBookingRef}
                    onChange={(e) => setTicketBookingRef(e.target.value)}
                    placeholder="e.g. AC-2026-8812"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#f95721]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Describe your inquiry</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Please provide details about your question, vehicle, or reservation..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#f95721] resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#f95721] hover:bg-[#e04816] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Ticket</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
