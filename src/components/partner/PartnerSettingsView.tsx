import React, { useState } from 'react';
import { 
  Server, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Plus, 
  Trash2, 
  ShieldCheck,
  Eye,
  ExternalLink,
  Globe,
  Coins,
  Moon,
  Sun,
  Laptop,
  Check,
  Building2,
  Sparkles,
  Sliders,
  PenLine,
  Quote
} from 'lucide-react';
import { SavedReply, PartnerProfile, PartnerVehicle } from '../../types/partner';
import { api, API_BASE_URL } from '../../services/api';
import { PartnerPublicProfileModal } from './PartnerPublicProfileModal';
import { useAccountSettings, LanguageOption, CurrencyOption, ThemeOption } from '../../context/AccountSettingsContext';

interface PartnerSettingsViewProps {
  savedReplies: SavedReply[];
  onAddSavedReply: (reply: SavedReply) => void;
  onDeleteSavedReply: (id: string) => void;
  partnerProfile?: PartnerProfile;
  vehicles?: PartnerVehicle[];
  theme?: 'dark' | 'light' | 'system';
  onThemeChange?: (theme: 'dark' | 'light' | 'system') => void;
  onNavigateTab?: (tab: any) => void;
}

export const PartnerSettingsView: React.FC<PartnerSettingsViewProps> = ({
  savedReplies,
  onAddSavedReply,
  onDeleteSavedReply,
  partnerProfile = {
    id: 'partner-1',
    agencyName: 'Mayache Cars',
    ownerName: 'Yassine Ayache',
    city: 'Azrou / Agadir',
    address: 'Boulevard Mohammed V, Résidence Al Massira',
    phone: '+212696145103',
    email: 'ayacheyassine2000@gmail.com',
    fleetCount: 8,
    rating: 4.9,
    reviewCount: 128,
    replySpeedMinutes: 12,
    replySpeedRank: 'Top 5% in Agadir',
    isVerified: true,
    licenseNumber: 'MA-AG-2024-88',
    taxId: '4545-MA',
    businessType: 'SARL',
    description: 'Premier car rental agency offering pristine and certified vehicles across Morocco with instant airport delivery, verified digital contracts, and zero hidden fees.',
    bankAccount: {
      bankName: 'Attijariwafa Bank',
      rib: '007 780 0001234567890123 45',
      accountHolder: 'Mayache Cars SARL',
    },
  },
  vehicles = [],
  theme = 'dark',
  onThemeChange,
  onNavigateTab,
}) => {
  // Public Profile Preview Modal
  const [isPublicProfileModalOpen, setIsPublicProfileModalOpen] = useState(false);

  // Global Account Settings state
  const { 
    language, 
    setLanguage, 
    currency, 
    setCurrency, 
    theme: currentTheme, 
    setTheme, 
    isLight, 
    t 
  } = useAccountSettings();

  const [savedToast, setSavedToast] = useState(false);

  // Partner Quote & Creed State (Written by Partner)
  const defaultManifesto = 'We believe renting a car in Morocco should be as dignified and unhurried as sharing a pot of mint tea. No hidden franchises, no scratched bumper traps, and no middlemen taking 30% from local people who know these roads by heart.';
  const [partnerQuote, setPartnerQuote] = useState<string>(() => {
    return localStorage.getItem('airbcar_partner_quote_5') || defaultManifesto;
  });
  const [partnerAuthor, setPartnerAuthor] = useState<string>(() => {
    return localStorage.getItem('airbcar_partner_author_5') || partnerProfile.ownerName || 'Younes Mayache';
  });
  const [partnerRole, setPartnerRole] = useState<string>(() => {
    return localStorage.getItem('airbcar_partner_role_5') || `Founder & Fleet Master · ${partnerProfile.city || 'Tetouan'} Mobility Artisan`;
  });
  const [partnerPermit, setPartnerPermit] = useState<string>(() => {
    return localStorage.getItem('airbcar_partner_permit_5') || partnerProfile.licenseNumber || 'Morocco Transport Permit TTU-441';
  });
  const [quoteSavedToast, setQuoteSavedToast] = useState(false);

  const handleSavePartnerQuote = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('airbcar_partner_quote_5', partnerQuote.trim());
    localStorage.setItem('airbcar_partner_author_5', partnerAuthor.trim());
    localStorage.setItem('airbcar_partner_role_5', partnerRole.trim());
    localStorage.setItem('airbcar_partner_permit_5', partnerPermit.trim());

    if (partnerProfile?.id) {
      localStorage.setItem(`airbcar_partner_quote_${partnerProfile.id}`, partnerQuote.trim());
      localStorage.setItem(`airbcar_partner_author_${partnerProfile.id}`, partnerAuthor.trim());
      localStorage.setItem(`airbcar_partner_role_${partnerProfile.id}`, partnerRole.trim());
      localStorage.setItem(`airbcar_partner_permit_${partnerProfile.id}`, partnerPermit.trim());
    }

    setQuoteSavedToast(true);
    setTimeout(() => setQuoteSavedToast(false), 3500);
  };

  // Backend API test state
  const [baseUrl, setBaseUrl] = useState(api.getBaseUrl());
  const [healthStatus, setHealthStatus] = useState<string>('Not tested');
  const [healthLoading, setHealthLoading] = useState(false);

  // New saved reply state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Active section tab: 'account' | 'developer'
  const [settingsSubTab, setSettingsSubTab] = useState<'account' | 'developer'>('account');

  const languages = [
    { id: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { id: 'fr', label: 'Français', native: 'Français (Maroc / FR)', flag: '🇫🇷' },
    { id: 'ar', label: 'العربية', native: 'العربية (الدارجة المغربية)', flag: '🇲🇦' },
    { id: 'es', label: 'Español', native: 'Español', flag: '🇪🇸' },
  ];

  const currencies = [
    { id: 'MAD', label: 'DH MAD', desc: 'Moroccan Dirham (د.م.)', symbol: 'DH' },
    { id: 'EUR', label: 'EUR (€)', desc: 'Euro (Europe)', symbol: '€' },
    { id: 'USD', label: 'USD ($)', desc: 'US Dollar', symbol: '$' },
    { id: 'GBP', label: 'GBP (£)', desc: 'British Pound', symbol: '£' },
  ];

  const themes = [
    { 
      id: 'dark', 
      label: 'Dark Mode', 
      desc: 'Airbcar Signature Warm-Charcoal (#140e0b)', 
      icon: <Moon className="w-4 h-4 text-[#f95721]" /> 
    },
    { 
      id: 'light', 
      label: 'Light Mode', 
      desc: 'Clean Porcelain & High Contrast Ivory', 
      icon: <Sun className="w-4 h-4 text-amber-500" /> 
    },
    { 
      id: 'system', 
      label: 'System Preference', 
      desc: 'Follow your operating system settings', 
      icon: <Laptop className="w-4 h-4 text-blue-400" /> 
    },
  ];

  const handleThemeSelect = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  const handleSavePreferences = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 4000);
  };

  const handleTestBackend = async () => {
    setHealthLoading(true);
    setHealthStatus(`Pinging ${api.getBaseUrl()}/api/health/...`);
    const res = await api.checkHealth();
    setHealthLoading(false);
    if (res.ok) {
      setHealthStatus(`Online (HTTP ${res.status}): ${JSON.stringify(res.data || 'Healthy')}`);
    } else {
      setHealthStatus(`Result: ${res.error || 'Offline / CORS restriction'}`);
    }
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddSavedReply({
      id: `sr-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
    });

    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className={`p-6 lg:p-9 space-y-8 min-h-screen transition-colors duration-200 ${
      isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'
    }`}>
      
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1a130f] border border-[#f95721] text-[#f5efe8] text-xs px-5 py-3.5 rounded-2xl flex items-center gap-3 shadow-2xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#f95721] shrink-0" />
          <div>
            <span className="font-bold block">Settings saved successfully!</span>
            <span className="text-[11px] text-[#a89b90]">Language: {language} • Currency: {currency} • Theme: {currentTheme}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f95721] bg-[#f95721]/15 px-3 py-1 rounded-full border border-[#f95721]/30">
              Agency Controls
            </span>
          </div>
          <h2 className={`font-serif-display text-2xl sm:text-3xl font-bold mt-1 tracking-tight ${
            isLight ? 'text-[#181311]' : 'text-[#f5efe8]'
          }`}>
            Settings & Platform Preferences
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#9c8e82]'}`}>
            Manage your customer-facing appearance, regional currencies, language, and developer endpoints.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#201813] border border-[#2c2019] shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSettingsSubTab('account')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              settingsSubTab === 'account'
                ? 'bg-[#f95721] text-white shadow-xs'
                : 'text-[#8d7e73] hover:text-[#f5efe8]'
            }`}
          >
            Account Settings
          </button>
          <button
            type="button"
            onClick={() => setSettingsSubTab('developer')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              settingsSubTab === 'developer'
                ? 'bg-[#f95721] text-white shadow-xs'
                : 'text-[#8d7e73] hover:text-[#f5efe8]'
            }`}
          >
            Developer & API Map
          </button>
        </div>
      </div>

      {/* 1. VIEW PUBLIC PROFILE SECTION (Prominently displayed) */}
      <div className={`rounded-3xl p-6 sm:p-7 border shadow-sm relative overflow-hidden transition-all ${
        isLight 
          ? 'bg-white border-neutral-200/90 text-[#181311]' 
          : 'bg-[#1a130f] border-[#2b2018] text-[#f5efe8]'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f95721]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f95721]/15 border border-[#f95721]/30 flex items-center justify-center text-[#f95721] shrink-0 shadow-xs">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className={`font-serif-display text-xl sm:text-2xl font-bold tracking-tight ${
                  isLight ? 'text-[#181311]' : 'text-[#f5efe8]'
                }`}>
                  View Public Profile
                </h3>
                <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Customer View
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-1 max-w-xl leading-relaxed ${
                isLight ? 'text-neutral-600' : 'text-[#a89b90]'
              }`}>
                See how your partner profile looks to customers on Airbcar. Verify your public fleet showcase, customer ratings, response time badge, and agency policies.
              </p>

              {/* Quick info snippet */}
              <div className="flex flex-wrap items-center gap-3 text-xs mt-3 pt-3 border-t border-[#261d16]/40">
                <span className={`font-semibold ${isLight ? 'text-neutral-800' : 'text-[#f5efe8]'}`}>
                  {partnerProfile.agencyName}
                </span>
                <span className="text-[#8d7e73]">•</span>
                <span className="text-[#8d7e73]">{partnerProfile.city || 'Azrou & Agadir'}</span>
                <span className="text-[#8d7e73]">•</span>
                <span className="text-amber-400 font-semibold">★ {partnerProfile.rating} (128 reviews)</span>
                <span className="text-[#8d7e73]">•</span>
                <span className="text-emerald-400 font-semibold">{vehicles.length || partnerProfile.fleetCount} vehicles online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <button
              type="button"
              onClick={() => setIsPublicProfileModalOpen(true)}
              className="bg-[#f95721] hover:bg-[#e04a17] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition-all duration-150 shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Preview Public Profile</span>
            </button>
          </div>
        </div>
      </div>

      {settingsSubTab === 'account' ? (
        /* 2. ACCOUNT SETTINGS (Language, Currency, Dark/Light Mode) */
        <div className="space-y-7">
          
          <div>
            <h3 className={`font-serif-display text-xl sm:text-2xl font-bold tracking-tight ${
              isLight ? 'text-[#181311]' : 'text-[#f5efe8]'
            }`}>
              Account Settings
            </h3>
            <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-neutral-600' : 'text-[#9c8e82]'}`}>
              Manage your account settings on the platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* A. LANGUAGE CARD */}
            <div className={`rounded-3xl p-6 border shadow-xs space-y-5 flex flex-col justify-between transition-all ${
              isLight 
                ? 'bg-white border-neutral-200/90' 
                : 'bg-[#1a130f] border-[#2b2018]'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#261d16]/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#f95721]/15 border border-[#f95721]/30 flex items-center justify-center text-[#f95721]">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base ${isLight ? 'text-[#181311]' : 'text-[#f5efe8]'}`}>
                        Language
                      </h4>
                      <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                        Choose your preferred language
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#f95721] bg-[#f95721]/10 px-2.5 py-0.5 rounded-full">
                    {language}
                  </span>
                </div>

                {/* Language selection options */}
                <div className="space-y-2 mt-4">
                  {languages.map((lang) => {
                    const isSelected = language === lang.label;
                    return (
                      <div
                        key={lang.id}
                        onClick={() => setLanguage(lang.label as any)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#f95721]/15 border-[#f95721] text-[#f5efe8]'
                            : isLight
                            ? 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-800'
                            : 'bg-[#201813] border-[#2c2019] hover:bg-[#271e18] text-[#a89b90]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{lang.flag}</span>
                          <div>
                            <span className={`text-xs font-bold block ${isSelected ? (isLight ? 'text-neutral-900' : 'text-[#f5efe8]') : ''}`}>
                              {lang.label}
                            </span>
                            <span className="text-[10px] text-[#8d7e73]">
                              {lang.native}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#f95721] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#261d16]/30 text-[11px] text-[#8d7e73]">
                Used for partner dashboard, booking receipts, and digital contracts.
              </div>
            </div>

            {/* B. CURRENCY CARD */}
            <div className={`rounded-3xl p-6 border shadow-xs space-y-5 flex flex-col justify-between transition-all ${
              isLight 
                ? 'bg-white border-neutral-200/90' 
                : 'bg-[#1a130f] border-[#2b2018]'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#261d16]/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#f95721]/15 border border-[#f95721]/30 flex items-center justify-center text-[#f95721]">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base ${isLight ? 'text-[#181311]' : 'text-[#f5efe8]'}`}>
                        Currency
                      </h4>
                      <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                        Set your preferred currency for prices
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#f95721] bg-[#f95721]/10 px-2.5 py-0.5 rounded-full font-mono">
                    {currency}
                  </span>
                </div>

                {/* Currency selection options */}
                <div className="space-y-2 mt-4">
                  {currencies.map((curr) => {
                    const isSelected = currency === curr.label;
                    return (
                      <div
                        key={curr.id}
                        onClick={() => setCurrency(curr.label as any)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#f95721]/15 border-[#f95721] text-[#f5efe8]'
                            : isLight
                            ? 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-800'
                            : 'bg-[#201813] border-[#2c2019] hover:bg-[#271e18] text-[#a89b90]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-[#291f18] text-[#f95721] font-bold text-xs flex items-center justify-center font-mono border border-[#382b21]">
                            {curr.symbol}
                          </div>
                          <div>
                            <span className={`text-xs font-bold block ${isSelected ? (isLight ? 'text-neutral-900' : 'text-[#f5efe8]') : ''}`}>
                              {curr.label}
                            </span>
                            <span className="text-[10px] text-[#8d7e73]">
                              {curr.desc}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#f95721] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#261d16]/30 text-[11px] text-[#8d7e73]">
                Prices across your fleet and payouts will be calculated in <strong>{currency}</strong>.
              </div>
            </div>

            {/* C. DARK/LIGHT MODE CARD */}
            <div className={`rounded-3xl p-6 border shadow-xs space-y-5 flex flex-col justify-between transition-all ${
              isLight 
                ? 'bg-white border-neutral-200/90' 
                : 'bg-[#1a130f] border-[#2b2018]'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#261d16]/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#f95721]/15 border border-[#f95721]/30 flex items-center justify-center text-[#f95721]">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base ${isLight ? 'text-[#181311]' : 'text-[#f5efe8]'}`}>
                        Dark / Light Mode
                      </h4>
                      <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                        Choose your interface theme
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#f95721] bg-[#f95721]/10 px-2.5 py-0.5 rounded-full capitalize">
                    {currentTheme}
                  </span>
                </div>

                {/* Theme selection options */}
                <div className="space-y-2 mt-4">
                  {themes.map((t) => {
                    const isSelected = currentTheme === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleThemeSelect(t.id as any)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#f95721]/15 border-[#f95721] text-[#f5efe8]'
                            : isLight
                            ? 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-800'
                            : 'bg-[#201813] border-[#2c2019] hover:bg-[#271e18] text-[#a89b90]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-[#291f18] border border-[#382a20]">
                            {t.icon}
                          </div>
                          <div>
                            <span className={`text-xs font-bold block ${isSelected ? (isLight ? 'text-neutral-900' : 'text-[#f5efe8]') : ''}`}>
                              {t.label}
                            </span>
                            <span className="text-[10px] text-[#8d7e73]">
                              {t.desc}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#f95721] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#261d16]/30 text-[11px] text-[#8d7e73]">
                Instant real-time theme preview with smooth contrast switching.
              </div>
            </div>

          </div>

          {/* B. AGENCY FOUNDER PHILOSOPHY & QUOTE CARD */}
          <div className={`rounded-3xl p-6 sm:p-7 border shadow-xs transition-all ${
            isLight ? 'bg-white border-neutral-200/90' : 'bg-[#1a130f] border-[#2b2018]'
          }`}>
            <form onSubmit={handleSavePartnerQuote} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#261d16]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#f95721]/15 border border-[#f95721]/30 flex items-center justify-center text-[#f95721]">
                    <PenLine className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-serif-display text-lg font-bold ${isLight ? 'text-neutral-900' : 'text-[#f5efe8]'}`}>
                        Founder Philosophy &amp; Quote (Written by You)
                      </h4>
                      <span className="text-[10px] uppercase font-bold bg-[#f95721]/15 text-[#f95721] px-2 py-0.5 rounded-md border border-[#f95721]/30">
                        Public Creed
                      </span>
                    </div>
                    <p className="text-xs text-[#8d7e73] mt-0.5">
                      This quote is featured at the top of your public agency page on Airbcar.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#f95721] hover:bg-[#e04a17] text-white text-xs font-bold px-5 py-2 rounded-full transition-all active:scale-95 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Publish Quote</span>
                </button>
              </div>

              {quoteSavedToast && (
                <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your agency quote has been updated and published across your public profile!</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-[#8d7e73] uppercase tracking-wider mb-1">
                  YOUR PERSONAL MANIFESTO / STATEMENT
                </label>
                <textarea
                  rows={3}
                  required
                  value={partnerQuote}
                  onChange={(e) => setPartnerQuote(e.target.value)}
                  placeholder="We believe renting a car in Morocco should be as dignified and unhurried as sharing a pot of mint tea..."
                  className={`w-full rounded-2xl p-3.5 text-xs sm:text-sm font-serif-display leading-relaxed border focus:outline-none focus:ring-1 focus:ring-[#f95721] transition-all ${
                    isLight 
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-900' 
                      : 'bg-[#201813] border-[#2c2019] text-[#f5efe8]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#8d7e73] uppercase tracking-wider mb-1">
                    FOUNDER / SIGNATORY NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerAuthor}
                    onChange={(e) => setPartnerAuthor(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-[#f95721] ${
                      isLight 
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-900' 
                        : 'bg-[#201813] border-[#2c2019] text-[#f5efe8]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8d7e73] uppercase tracking-wider mb-1">
                    ROLE &amp; HOST TITLE
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerRole}
                    onChange={(e) => setPartnerRole(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-[#f95721] ${
                      isLight 
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-900' 
                        : 'bg-[#201813] border-[#2c2019] text-[#f5efe8]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8d7e73] uppercase tracking-wider mb-1">
                    PERMIT OR LICENSE BADGE
                  </label>
                  <input
                    type="text"
                    value={partnerPermit}
                    onChange={(e) => setPartnerPermit(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-[#f95721] font-mono ${
                      isLight 
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-900' 
                        : 'bg-[#201813] border-[#2c2019] text-[#f5efe8]'
                    }`}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Save Preferences Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#8d7e73]">
              Settings are saved automatically to your agency profile session.
            </span>
            <button
              type="button"
              onClick={handleSavePreferences}
              className="bg-[#f95721] hover:bg-[#e04a17] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-150 shadow-xs active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Account Settings</span>
            </button>
          </div>

        </div>
      ) : (
        /* 3. DEVELOPER & INTEGRATIONS TAB */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Backend API Configuration (6 cols) */}
            <div className="lg:col-span-6 bg-[#1a130f] rounded-3xl p-6 border border-[#2b2018] space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#261d16] pb-3">
                <h3 className="font-serif-display text-base font-bold text-[#f5efe8] flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#f95721]" />
                  <span>Django REST API Connection</span>
                </h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Active Server
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#8d7e73] font-semibold mb-1">Backend Base URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={baseUrl}
                      onChange={(e) => {
                        setBaseUrl(e.target.value);
                        api.setBaseUrl(e.target.value);
                      }}
                      className="flex-1 bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-[#f5efe8] font-mono text-[11px] focus:outline-none focus:border-[#f95721]"
                    />
                    <button
                      type="button"
                      onClick={handleTestBackend}
                      disabled={healthLoading}
                      className="px-4 py-2 rounded-xl bg-[#f95721] hover:bg-[#e04a17] text-white font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className={`w-3 h-3 ${healthLoading ? 'animate-spin' : ''}`} />
                      <span>Ping Health</span>
                    </button>
                  </div>
                </div>

                {/* Health ping result */}
                <div className="p-3 rounded-xl bg-[#201813] border border-[#2c2019] text-[11px]">
                  <span className="text-[#8d7e73] block uppercase text-[9px] font-bold">Health check result (GET /api/health/)</span>
                  <p className="font-mono text-[#c9b8ab] mt-1 break-all">{healthStatus}</p>
                </div>

                <div className="pt-2 text-[11px] text-[#8d7e73] space-y-1">
                  <p>• Auth: JWT access & refresh tokens stored in localStorage</p>
                  <p>• Endpoints mapped: Listings, Partners, Bookings, Contracts, Conversations, Car-Shares</p>
                </div>
              </div>
            </div>

            {/* Telegram Alerts (6 cols) */}
            <div className="lg:col-span-6 bg-[#1a130f] rounded-3xl p-6 border border-[#2b2018] space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#261d16] pb-3">
                <h3 className="font-serif-display text-base font-bold text-[#f5efe8] flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#f95721]" />
                  <span>Telegram Agency Alerts</span>
                </h3>
                <span className="text-[10px] text-[#f95721] font-mono">
                  /api/telegram/link/
                </span>
              </div>

              <p className="text-xs text-[#a89b90] leading-relaxed">
                Receive instant push alerts on your phone whenever a renter messages or requests a vehicle to maintain your <strong>12-minute response SLA</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-[#201813] border border-[#2e231c] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    TG
                  </div>
                  <div>
                    <span className="font-bold text-[#f5efe8] block">@AirbcarMayacheBot</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">✓ Linked to Yassine (+212 6 12 34 56 78)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Telegram test alert sent to Yassine!')}
                  className="px-3 py-1.5 rounded-full bg-[#2a2019] hover:bg-[#34271e] text-[#f5efe8] text-[11px] font-semibold border border-[#3c2f25] cursor-pointer"
                >
                  Send Test Ping
                </button>
              </div>
            </div>

          </div>

          {/* Saved Fast Replies */}
          <div className="bg-[#1a130f] rounded-3xl p-6 border border-[#2b2018] space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#261d16] pb-3">
              <div>
                <h3 className="font-serif-display text-base font-bold text-[#f5efe8] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#f95721]" />
                  <span>Saved Fast Replies (Agency Inbox Chips)</span>
                </h3>
                <p className="text-xs text-[#8d7e73] mt-0.5">
                  These chips appear above the message bar in the Messages tab for 1-click answers.
                </p>
              </div>
              <span className="text-xs text-[#f95721] font-mono">/api/agency/saved-replies/</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedReplies.map((reply) => (
                <div key={reply.id} className="p-4 rounded-2xl bg-[#201813] border border-[#2e231c] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#f95721] bg-[#f95721]/15 px-2.5 py-0.5 rounded-md">
                        {reply.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteSavedReply(reply.id)}
                        className="text-[#8d7e73] hover:text-red-400 p-1 cursor-pointer"
                        title="Delete Saved Reply"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-[#c9b8ab] mt-2 line-clamp-3">
                      "{reply.content}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new reply form */}
            <form onSubmit={handleSaveReply} className="pt-4 border-t border-[#261d16] space-y-3">
              <span className="text-xs font-bold text-[#f5efe8] block">Add New Quick Reply Chip</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Chip Title (e.g. Late Return, Airport Pick)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-xs text-[#f5efe8] focus:outline-none focus:border-[#f95721]"
                />
                <input
                  type="text"
                  placeholder="Message template..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="md:col-span-2 bg-[#241b15] border border-[#382b21] rounded-xl px-3 py-2 text-xs text-[#f5efe8] focus:outline-none focus:border-[#f95721]"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#f95721] hover:bg-[#e04a17] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Reply Chip</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Public Profile Storefront Modal */}
      <PartnerPublicProfileModal
        isOpen={isPublicProfileModalOpen}
        onClose={() => setIsPublicProfileModalOpen(false)}
        partnerProfile={partnerProfile}
        vehicles={vehicles}
        selectedCurrency={currency}
      />

    </div>
  );
};
