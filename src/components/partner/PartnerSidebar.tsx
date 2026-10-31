import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  CalendarCheck, 
  Share2, 
  MessageSquare, 
  Wallet, 
  BarChart3, 
  CalendarDays, 
  Star, 
  FileText, 
  User, 
  Settings,
  Sparkles,
  Compass,
  HelpCircle
} from 'lucide-react';
import { PartnerTab, UserRole } from '../../types/partner';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface PartnerSidebarProps {
  activeTab: PartnerTab;
  onSelectTab: (tab: PartnerTab) => void;
  unreadCount?: number;
  fleetCount?: number;
  replySpeedMinutes?: number;
  replySpeedRank?: string;
  agencyName?: string;
  onNavigateToTab?: (tab: 'mission' | 'help') => void;
  onSwitchRole?: (role: UserRole) => void;
}

export const PartnerSidebar: React.FC<PartnerSidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 3,
  fleetCount = 8,
  replySpeedMinutes = 12,
  replySpeedRank = 'Top 5% of Agadir agencies',
  agencyName = 'Mayache Cars',
  onNavigateToTab,
  onSwitchRole,
}) => {
  const { isLight, t } = useAccountSettings();

  const menuItems: { id: PartnerTab; labelKey: string; fallback: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', labelKey: 'dashboard', fallback: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'vehicles', labelKey: 'vehicles', fallback: 'Fleet & Vehicles', icon: <Car className="w-4 h-4" />, badge: fleetCount },
    { id: 'bookings', labelKey: 'bookings', fallback: 'Bookings', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'car-sharing', labelKey: 'carSharing', fallback: 'Car Sharing', icon: <Share2 className="w-4 h-4" /> },
    { id: 'messages', labelKey: 'messages', fallback: 'Messages', icon: <MessageSquare className="w-4 h-4" />, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'earnings', labelKey: 'earnings', fallback: 'Earnings', icon: <Wallet className="w-4 h-4" /> },
    { id: 'analytics', labelKey: 'analytics', fallback: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'calendar', labelKey: 'calendar', fallback: 'Calendar', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'reviews', labelKey: 'reviews', fallback: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'policies', labelKey: 'policies', fallback: 'Rental Policies', icon: <FileText className="w-4 h-4" /> },
    { id: 'profile', labelKey: 'profile', fallback: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings', labelKey: 'settings', fallback: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className={`w-64 shrink-0 flex flex-col justify-between border-r min-h-screen select-none transition-colors duration-200 ${
      isLight 
        ? 'bg-white text-neutral-800 border-neutral-200' 
        : 'bg-[#16110e] text-[#c9b8ab] border-[#261e18]'
    }`}>
      <div>
        {/* Logo & Agency Identity Header */}
        <div className={`p-6 pb-5 flex items-center gap-3 border-b ${isLight ? 'border-neutral-100' : 'border-[#201813]'}`}>
          <div className="w-9 h-9 rounded-full bg-[#f95721] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
            {agencyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-serif-display text-lg font-bold tracking-tight ${
                isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
              }`}>
                airbcar
              </span>
            </div>
            <p className={`text-[11px] leading-tight font-medium ${
              isLight ? 'text-neutral-500' : 'text-[#9c8e82]'
            }`}>
              {t('partnerPortal', 'Partner Workspace')} • {agencyName}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="px-3 space-y-1 mt-3">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const translatedLabel = t(item.labelKey, item.fallback);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive 
                    ? 'bg-[#f95721] text-white shadow-sm' 
                    : isLight
                    ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    : 'text-[#9c8e82] hover:text-[#f5efe8] hover:bg-[#201813]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : isLight ? 'text-neutral-500' : 'text-[#7d6f64]'}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium tracking-tight">
                    {translatedLabel}
                  </span>
                </div>

                {item.badge !== undefined && (
                  <span 
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : isLight
                        ? 'bg-neutral-200 text-neutral-800'
                        : 'bg-[#2a2019] text-[#b3a497]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Card: Reply Speed Metric */}
      <div className={`p-4 m-3 mt-4 rounded-2xl border transition-colors ${
        isLight 
          ? 'bg-neutral-50 border-neutral-200' 
          : 'bg-[#201813] border-[#2e231c]'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold tracking-wider uppercase ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
            {t('replySpeed', 'REPLY SPEED')}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#f95721]" />
        </div>
        <div className="text-2xl font-extrabold text-[#f95721] mt-1 tracking-tight">
          {replySpeedMinutes} min
        </div>
        <p className={`text-[11px] mt-0.5 leading-tight font-medium ${isLight ? 'text-neutral-600' : 'text-[#9c8e82]'}`}>
          {replySpeedRank}
        </p>

        {/* Quick links to Mission and Help */}
        {onNavigateToTab && onSwitchRole && (
          <div className="mt-3 pt-3 border-t border-neutral-200/50 dark:border-white/5 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => {
                onSwitchRole('renter');
                onNavigateToTab('mission');
              }}
              className="text-[#f95721] hover:underline font-semibold flex items-center gap-1"
            >
              <Compass className="w-3 h-3" />
              <span>Mission</span>
            </button>
            <span className="text-neutral-400">·</span>
            <button
              type="button"
              onClick={() => {
                onSwitchRole('renter');
                onNavigateToTab('help');
              }}
              className="text-[#f95721] hover:underline font-semibold flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Help Center</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
