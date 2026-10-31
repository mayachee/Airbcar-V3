import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Star, 
  Car, 
  ShieldCheck, 
  CreditCard, 
  MessageSquare, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  useNotifications, 
  NotificationCategory, 
  NotificationType,
  AppNotification 
} from '../../context/NotificationContext';

interface NotificationBellProps {
  currentRole?: 'renter' | 'partner' | 'admin';
  isLight?: boolean;
  onNavigateTab?: (tab: any) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  currentRole = 'renter',
  isLight = false,
  onNavigateTab
}) => {
  const {
    unreadCountForRole,
    filteredNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    simulateNotification,
    soundEnabled,
    setSoundEnabled
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('all');
  const [showSimulateDrawer, setShowSimulateDrawer] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = unreadCountForRole(currentRole);
  const notifications = filteredNotifications(selectedCategory, currentRole);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const past = new Date(timestamp).getTime();
    const diffMin = Math.floor((now - past) / (1000 * 60));

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'review':
        return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
      case 'booking':
        return <Car className="w-4 h-4 text-[#f95721]" />;
      case 'contract':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-400" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#f95721]" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.actionTab && onNavigateTab) {
      onNavigateTab(notif.actionTab);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        className={`relative p-2 rounded-full border transition-all cursor-pointer shadow-xs active:scale-95 ${
          isLight
            ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800'
            : 'bg-[#201813] hover:bg-[#2c2018] border-[#2e231c] text-neutral-200 hover:text-white'
        } ${isOpen ? 'ring-2 ring-[#f95721]' : ''}`}
      >
        <Bell className="w-4 h-4" />

        {/* Unread Pill Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#f95721] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#181311] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border shadow-2xl z-50 overflow-hidden backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-150 ${
            isLight
              ? 'bg-white/95 border-neutral-200 text-neutral-900 shadow-neutral-900/10'
              : 'bg-[#18120e]/95 border-[#2f2219] text-[#f5efe8] shadow-black/60'
          }`}
        >
          {/* Header */}
          <div className={`p-4 pb-3 border-b flex items-center justify-between ${
            isLight ? 'border-neutral-200 bg-neutral-50/50' : 'border-[#261d16] bg-[#201813]/60'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-serif-display font-bold text-base tracking-tight">
                Notifications
              </span>
              {unreadCount > 0 ? (
                <span className="text-[11px] font-bold bg-[#f95721] text-white px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              ) : (
                <span className="text-[11px] text-[#8d7e73] font-medium">
                  Up to date
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute alert sounds' : 'Enable alert sounds'}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  soundEnabled 
                    ? 'text-[#f95721] hover:bg-[#f95721]/10' 
                    : 'text-[#8d7e73] hover:text-white'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead(currentRole)}
                  title="Mark all as read"
                  className="p-1.5 text-xs text-[#8d7e73] hover:text-[#f95721] hover:bg-[#f95721]/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Read all</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Categories */}
          <div className={`px-3 py-2 border-b flex items-center gap-1 overflow-x-auto text-[11px] scrollbar-none ${
            isLight ? 'border-neutral-200 bg-neutral-50' : 'border-[#261d16] bg-[#140e0b]'
          }`}>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#f95721] text-white'
                  : isLight ? 'text-neutral-600 hover:bg-neutral-200' : 'text-[#8d7e73] hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('unread')}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                selectedCategory === 'unread'
                  ? 'bg-[#f95721] text-white'
                  : isLight ? 'text-neutral-600 hover:bg-neutral-200' : 'text-[#8d7e73] hover:text-white'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="text-[9px] bg-white/20 text-current px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('bookings')}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'bookings'
                  ? 'bg-[#f95721] text-white'
                  : isLight ? 'text-neutral-600 hover:bg-neutral-200' : 'text-[#8d7e73] hover:text-white'
              }`}
            >
              Bookings
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('reviews')}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'reviews'
                  ? 'bg-[#f95721] text-white'
                  : isLight ? 'text-neutral-600 hover:bg-neutral-200' : 'text-[#8d7e73] hover:text-white'
              }`}
            >
              Reviews
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('payments')}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'payments'
                  ? 'bg-[#f95721] text-white'
                  : isLight ? 'text-neutral-600 hover:bg-neutral-200' : 'text-[#8d7e73] hover:text-white'
              }`}
            >
              Escrow &amp; Pay
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-neutral-200 dark:divide-[#241b15]">
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-white/5 mx-auto flex items-center justify-center text-[#8d7e73] mb-2">
                  <Bell className="w-5 h-5 opacity-40" />
                </div>
                <p className="text-xs font-semibold text-[#8d7e73]">
                  No notifications in this category
                </p>
                <p className="text-[11px] text-[#6d6056] mt-0.5">
                  You are completely caught up!
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 sm:p-4 flex items-start gap-3 transition-colors cursor-pointer group relative ${
                    !notif.read
                      ? isLight ? 'bg-orange-50/50 hover:bg-orange-100/40' : 'bg-[#231a14]/60 hover:bg-[#2b2018]'
                      : isLight ? 'hover:bg-neutral-50' : 'hover:bg-[#1f1612]'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-[#261d17] border-[#36271e]'
                  }`}>
                    {getIcon(notif.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className={`text-xs font-bold truncate ${
                        !notif.read ? 'text-[#f95721]' : isLight ? 'text-neutral-900' : 'text-[#f5efe8]'
                      }`}>
                        {notif.title}
                      </h5>
                      <span className="text-[10px] text-[#8d7e73] shrink-0">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>

                    <p className={`text-[11px] mt-0.5 leading-relaxed line-clamp-2 ${
                      isLight ? 'text-neutral-600' : 'text-[#a69688]'
                    }`}>
                      {notif.message}
                    </p>

                    {/* Metadata tags & action */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {notif.meta?.carName && (
                        <span className="text-[9px] font-semibold bg-white/10 px-1.5 py-0.5 rounded text-[#8d7e73]">
                          🚗 {notif.meta.carName}
                        </span>
                      )}
                      {notif.meta?.amount && (
                        <span className="text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                          {notif.meta.amount} DH
                        </span>
                      )}
                      {notif.meta?.rating && (
                        <span className="text-[9px] font-semibold bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">
                          ★ {notif.meta.rating}.0
                        </span>
                      )}

                      {notif.actionLabel && (
                        <span className="text-[10px] font-bold text-[#f95721] flex items-center gap-0.5 ml-auto group-hover:underline">
                          <span>{notif.actionLabel}</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unread indicator / Delete on hover */}
                  <div className="flex flex-col items-center gap-2 shrink-0 pt-0.5">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#f95721] shadow-xs" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#8d7e73] hover:text-rose-500 transition-opacity rounded cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls & Quick Simulation Sandbox */}
          <div className={`p-3 border-t text-xs space-y-2 ${
            isLight ? 'border-neutral-200 bg-neutral-50' : 'border-[#261d16] bg-[#140e0b]'
          }`}>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowSimulateDrawer(!showSimulateDrawer)}
                className="text-[11px] font-bold text-[#f95721] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>{showSimulateDrawer ? 'Hide Simulation' : 'Test Live Alerts'}</span>
              </button>

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => clearAll(currentRole)}
                  className="text-[10px] text-[#8d7e73] hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Simulation drawer for testing */}
            {showSimulateDrawer && (
              <div className="pt-2 border-t border-white/10 space-y-1.5 animate-in fade-in duration-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8d7e73]">
                  Simulate Realtime Event:
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => simulateNotification('new_review')}
                    className="p-1.5 rounded-lg bg-[#f95721]/15 hover:bg-[#f95721]/25 text-[#f95721] text-[10px] font-bold text-left transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>⭐</span>
                    <span>New Review</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => simulateNotification('booking_confirmed')}
                    className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[10px] font-bold text-left transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>🚗</span>
                    <span>New Booking</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => simulateNotification('deposit_released')}
                    className="p-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-[10px] font-bold text-left transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>💳</span>
                    <span>Deposit Release</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => simulateNotification('contract_ready')}
                    className="p-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 text-[10px] font-bold text-left transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>📄</span>
                    <span>Digital Lease</span>
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
