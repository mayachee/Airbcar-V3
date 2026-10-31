import React from 'react';
import { 
  X, 
  Bell, 
  Star, 
  Car, 
  ShieldCheck, 
  CreditCard, 
  MessageSquare, 
  ExternalLink 
} from 'lucide-react';
import { useNotifications, NotificationType } from '../../context/NotificationContext';

interface NotificationToastBannerProps {
  onNavigateTab?: (tab: any) => void;
}

export const NotificationToastBanner: React.FC<NotificationToastBannerProps> = ({ onNavigateTab }) => {
  const { activeToast, dismissToast, markAsRead } = useNotifications();

  if (!activeToast) return null;

  const notif = activeToast.notification;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'review':
        return <Star className="w-5 h-5 text-amber-400 fill-amber-400" />;
      case 'booking':
        return <Car className="w-5 h-5 text-[#f95721]" />;
      case 'contract':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-blue-400" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-[#f95721]" />;
    }
  };

  const handleAction = () => {
    markAsRead(notif.id);
    dismissToast();
    if (notif.actionTab && onNavigateTab) {
      onNavigateTab(notif.actionTab);
    }
  };

  return (
    <div className="fixed top-5 right-4 sm:right-6 z-[100] max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-[#1f1713] text-[#f5efe8] border border-[#f95721]/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md relative overflow-hidden flex items-start gap-3">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f95721] via-amber-400 to-[#f95721] animate-pulse" />

        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
          {getIcon(notif.type)}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-white truncate">
              {notif.title}
            </span>
            <span className="text-[10px] text-[#8d7e73] shrink-0 font-medium">
              Just now
            </span>
          </div>

          <p className="text-xs text-[#c4b5a8] mt-1 line-clamp-2 leading-relaxed">
            {notif.message}
          </p>

          <div className="flex items-center gap-2 mt-2.5">
            {notif.actionLabel && (
              <button
                type="button"
                onClick={handleAction}
                className="text-xs font-bold text-[#f95721] hover:text-[#ff7444] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{notif.actionLabel}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            <button
              type="button"
              onClick={dismissToast}
              className="text-[11px] text-[#8d7e73] hover:text-white transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissToast}
          className="p-1 text-[#8d7e73] hover:text-white rounded-lg transition-colors cursor-pointer"
          title="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
