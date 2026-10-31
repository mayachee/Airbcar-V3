import React, { useState } from 'react';
import { 
  Plus, 
  RefreshCw, 
  Menu, 
  Radio,
  Sun,
  Moon,
  Globe,
  Coins,
  ChevronDown,
  Database
} from 'lucide-react';
import { PartnerTab, UserRole } from '../../types/partner';
import { useAccountSettings, LanguageOption, CurrencyOption } from '../../context/AccountSettingsContext';
import { NotificationBell } from '../notifications/NotificationBell';
import { UserAuthButton } from '../auth/UserAuthButton';

interface PartnerTopNavProps {
  activeTab: PartnerTab;
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onOpenManualBooking: () => void;
  onToggleMobileSidebar: () => void;
  apiStatus: 'connected' | 'offline' | 'checking';
  onCheckApiHealth: () => void;
  ownerName?: string;
  unansweredCount?: number;
  onSelectTab?: (tab: PartnerTab) => void;
  onOpenRealDataModal?: () => void;
}

export const PartnerTopNav: React.FC<PartnerTopNavProps> = ({
  activeTab,
  currentRole,
  onSwitchRole,
  onOpenManualBooking,
  onToggleMobileSidebar,
  apiStatus,
  onCheckApiHealth,
  ownerName = 'yassine',
  unansweredCount = 3,
  onSelectTab,
  onOpenRealDataModal,
}) => {
  const { theme, setTheme, isLight, language, setLanguage, currency, setCurrency, t } = useAccountSettings();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const languagesList: { label: LanguageOption; flag: string; short: string }[] = [
    { label: 'English', flag: '🇬🇧', short: 'EN' },
    { label: 'Français', flag: '🇫🇷', short: 'FR' },
    { label: 'العربية', flag: '🇲🇦', short: 'AR' },
    { label: 'Español', flag: '🇪🇸', short: 'ES' },
  ];

  const currenciesList: { label: CurrencyOption; symbol: string }[] = [
    { label: 'DH MAD', symbol: 'DH' },
    { label: 'EUR (€)', symbol: '€' },
    { label: 'USD ($)', symbol: '$' },
    { label: 'GBP (£)', symbol: '£' },
  ];

  const getTabTitles = () => {
    switch (activeTab) {
      case 'messages':
        return {
          title: t('messages', 'Messages'),
          subtitle: `${unansweredCount} renters are waiting on you, ${ownerName}`,
        };
      case 'dashboard':
        return {
          title: t('dashboard', 'Partner Dashboard'),
          subtitle: 'Daily operations, incoming reservations & fleet overview',
        };
      case 'vehicles':
        return {
          title: t('vehicles', 'Fleet & Vehicles'),
          subtitle: 'Manage availability, blackout dates, rates and B2B car-sharing',
        };
      case 'bookings':
        return {
          title: t('bookings', 'Reservations & Contracts'),
          subtitle: 'Active rentals, contract dispatching and customer arrivals',
        };
      case 'car-sharing':
        return {
          title: t('carSharing', 'B2B Car Sharing'),
          subtitle: 'Inter-agency fleet loaning, digital inspections & requests',
        };
      case 'earnings':
        return {
          title: t('earnings', 'Earnings & Payouts'),
          subtitle: 'Payout cycles, deposit escrows and bank transfer history',
        };
      case 'analytics':
        return {
          title: t('analytics', 'Agency Analytics'),
          subtitle: 'Fleet occupancy, conversion rates and Agadir market benchmarks',
        };
      case 'calendar':
        return {
          title: t('calendar', 'Fleet Calendar'),
          subtitle: 'Vehicle schedule, airport delivery dates and maintenance slots',
        };
      case 'reviews':
        return {
          title: t('reviews', 'Customer Reviews'),
          subtitle: 'Feedback from verified renters and public agency replies',
        };
      case 'policies':
        return {
          title: t('policies', 'Rental Policies'),
          subtitle: 'Deposit rules, fuel conditions, insurance tiers and mileage limits',
        };
      case 'profile':
        return {
          title: t('profile', 'Agency Profile'),
          subtitle: 'Business credentials, Moroccan ministry registration & contact',
        };
      case 'settings':
        return {
          title: t('settings', 'Settings & API Config'),
          subtitle: 'Account settings, customer public profile preview & backend connection',
        };
      default:
        return { title: 'Partner Portal', subtitle: 'Airbcar Partner Workspace' };
    }
  };

  const { title, subtitle } = getTabTitles();

  const currentLangObj = languagesList.find(l => l.label === language) || languagesList[0];

  return (
    <header className={`px-6 lg:px-9 pt-7 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b transition-colors duration-200 ${
      isLight ? 'bg-white border-neutral-200 text-[#181311]' : 'bg-[#140e0b] border-[#241c16] text-[#f5efe8]'
    }`}>
      {/* Title & subtitle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          title="Toggle Navigation Sidebar"
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            isLight ? 'bg-neutral-100 text-neutral-700 hover:text-black' : 'bg-[#201813] text-[#b3a497] hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className={`font-serif-display text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-[#181311]' : 'text-[#f5efe8]'
          }`}>
            {title}
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 font-normal ${
            isLight ? 'text-neutral-500' : 'text-[#9c8e82]'
          }`}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Action controls & Portal Switcher */}
      <div className="flex flex-wrap items-center gap-2.5">
        
        {/* Quick Language Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsLangDropdownOpen(!isLangDropdownOpen);
              setIsCurrencyDropdownOpen(false);
            }}
            title="Change Dashboard Language"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
              isLight 
                ? 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200' 
                : 'bg-[#201813] border-[#2e231c] text-[#c9b8ab] hover:text-white'
            }`}
          >
            <span>{currentLangObj.flag}</span>
            <span>{currentLangObj.short}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isLangDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-44 rounded-2xl border shadow-xl z-50 p-1.5 space-y-1 ${
              isLight ? 'bg-white border-neutral-200 text-neutral-800' : 'bg-[#1e1612] border-[#382b21] text-[#f5efe8]'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 text-[#8d7e73]">
                {t('language', 'Language')}
              </div>
              {languagesList.map((lang) => (
                <button
                  key={lang.label}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.label);
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    language === lang.label 
                      ? 'bg-[#f95721] text-white' 
                      : isLight ? 'hover:bg-neutral-100' : 'hover:bg-[#2c2018]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  {language === lang.label && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Currency Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
              setIsLangDropdownOpen(false);
            }}
            title="Change Dashboard Currency"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
              isLight 
                ? 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200' 
                : 'bg-[#201813] border-[#2e231c] text-[#c9b8ab] hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-[#f95721]" />
            <span>{currency.replace('DH ', '')}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isCurrencyDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-44 rounded-2xl border shadow-xl z-50 p-1.5 space-y-1 ${
              isLight ? 'bg-white border-neutral-200 text-neutral-800' : 'bg-[#1e1612] border-[#382b21] text-[#f5efe8]'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 text-[#8d7e73]">
                {t('currency', 'Currency')}
              </div>
              {currenciesList.map((curr) => (
                <button
                  key={curr.label}
                  type="button"
                  onClick={() => {
                    setCurrency(curr.label);
                    setIsCurrencyDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currency === curr.label 
                      ? 'bg-[#f95721] text-white' 
                      : isLight ? 'hover:bg-neutral-100' : 'hover:bg-[#2c2018]'
                  }`}
                >
                  <span>{curr.label}</span>
                  {currency === curr.label && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Dark/Light Mode Toggle */}
        <button
          type="button"
          onClick={() => setTheme(isLight ? 'dark' : 'light')}
          title={`Switch to ${isLight ? 'Dark Mode' : 'Light Mode'}`}
          className={`p-2 rounded-full border transition-all cursor-pointer shadow-xs active:scale-95 ${
            isLight 
              ? 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200' 
              : 'bg-[#201813] border-[#2e231c] text-amber-400 hover:text-amber-300'
          }`}
        >
          {isLight ? (
            <Moon className="w-4 h-4 text-neutral-800" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Agency Partner Notification Bell */}
        <NotificationBell
          currentRole="partner"
          isLight={isLight}
          onNavigateTab={onSelectTab}
        />

        {/* Backend API Health indicator */}
        <button
          type="button"
          onClick={onCheckApiHealth}
          title="Click to ping https://airbcar-backend.onrender.com/api/health/"
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
            isLight
              ? 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
              : 'bg-[#201813] border-[#2e231c] text-[#b3a497] hover:text-white'
          }`}
        >
          <Radio className={`w-3 h-3 ${apiStatus === 'connected' ? 'text-emerald-500 animate-pulse' : apiStatus === 'checking' ? 'text-amber-400 animate-spin' : 'text-orange-400'}`} />
          <span>{apiStatus === 'connected' ? 'Live' : apiStatus === 'checking' ? 'Pinging...' : 'Demo'}</span>
          <RefreshCw className="w-2.5 h-2.5 ml-0.5 opacity-60 hover:opacity-100" />
        </button>

        {/* Real Test Data Hub Modal Trigger */}
        {onOpenRealDataModal && (
          <button
            type="button"
            onClick={onOpenRealDataModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Inspect or Populate Real Moroccan Test Data"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Real Data Hub</span>
          </button>
        )}

        {/* Portal Role Switcher */}
        <div className={`flex items-center p-1 rounded-full border shadow-xs ${
          isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#201813] border-[#2e231c]'
        }`}>
          <button
            type="button"
            onClick={() => onSwitchRole('admin')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              currentRole === 'admin'
                ? 'bg-rose-600 text-white shadow-xs'
                : isLight ? 'text-neutral-600 hover:text-black' : 'text-[#9c8e82] hover:text-white'
            }`}
          >
            🛡️ Admin
          </button>
          <button
            type="button"
            onClick={() => onSwitchRole('partner')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              currentRole === 'partner'
                ? 'bg-[#f95721] text-white shadow-xs'
                : isLight ? 'text-neutral-600 hover:text-black' : 'text-[#9c8e82] hover:text-white'
            }`}
          >
            🏢 Partner
          </button>
          <button
            type="button"
            onClick={() => onSwitchRole('renter')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              currentRole === 'renter'
                ? 'bg-[#f95721] text-white shadow-xs'
                : isLight ? 'text-neutral-600 hover:text-black' : 'text-[#9c8e82] hover:text-white'
            }`}
          >
            👤 Renter
          </button>
        </div>

        {/* Create manual booking button */}
        <button
          type="button"
          onClick={onOpenManualBooking}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#f95721] hover:bg-[#e04a17] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>{t('manualBooking', 'Manual Booking')}</span>
        </button>

        {/* OAuth User Auth Button */}
        <UserAuthButton
          currentRole={currentRole}
          onSwitchRole={onSwitchRole}
          onNavigateTab={onSelectTab as any}
        />
      </div>
    </header>
  );
};
