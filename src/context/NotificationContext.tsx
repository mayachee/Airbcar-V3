import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type NotificationType = 
  | 'booking' 
  | 'review' 
  | 'contract' 
  | 'payment' 
  | 'message' 
  | 'system';

export type NotificationCategory = 'all' | 'unread' | 'bookings' | 'reviews' | 'payments';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  targetRole?: 'renter' | 'partner' | 'admin' | 'all';
  actionLabel?: string;
  actionTab?: string;
  meta?: {
    carName?: string;
    bookingId?: string;
    amount?: number;
    rating?: number;
    authorName?: string;
  };
}

interface NotificationToast {
  id: string;
  notification: AppNotification;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  unreadCountForRole: (role: 'renter' | 'partner' | 'admin') => number;
  filteredNotifications: (category: NotificationCategory, role?: 'renter' | 'partner' | 'admin') => AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: (role?: 'renter' | 'partner' | 'admin') => void;
  deleteNotification: (id: string) => void;
  clearAll: (role?: 'renter' | 'partner' | 'admin') => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  simulateNotification: (preset: 'new_review' | 'booking_confirmed' | 'deposit_released' | 'contract_ready') => void;
  activeToast: NotificationToast | null;
  dismissToast: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'airbcar_notifications_v1';
const SOUND_KEY = 'airbcar_notification_sound';

const initialMockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'review',
    title: 'New 5-Star Review Received',
    message: 'Fatima-Zahra B. left a 5.0 rating for the 2024 Dacia Duster 4x4: "Very professional agency in Azrou... deposit released promptly."',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18m ago
    read: false,
    targetRole: 'partner',
    actionLabel: 'Post Official Reply',
    actionTab: 'reviews',
    meta: {
      carName: '2024 Dacia Duster 4x4',
      rating: 5,
      authorName: 'Fatima-Zahra B.'
    }
  },
  {
    id: 'notif-2',
    type: 'booking',
    title: 'Confirmed Booking #AC-8841',
    message: 'Hamza El Mansouri reserved the 2025 Volkswagen Golf 8 for 4 days. Sania Ramel Airport pickup confirmed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), // 55m ago
    read: false,
    targetRole: 'partner',
    actionLabel: 'View Handover Voucher',
    actionTab: 'calendar',
    meta: {
      bookingId: 'AC-8841',
      carName: '2025 Volkswagen Golf 8',
      amount: 2400
    }
  },
  {
    id: 'notif-3',
    type: 'review',
    title: 'Rate Your Recent Trip',
    message: 'Your rental with Mayache Prestige Cars has concluded. Leave a verified review on vehicle condition & handover.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2h ago
    read: false,
    targetRole: 'renter',
    actionLabel: 'Write Review',
    actionTab: 'overview',
    meta: {
      carName: '2025 Volkswagen Golf 8'
    }
  },
  {
    id: 'notif-4',
    type: 'payment',
    title: 'Security Deposit Released',
    message: 'CMI Escrow successfully released your 5,000 DH security deposit hold following spotless return inspection.',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4h ago
    read: true,
    targetRole: 'renter',
    actionLabel: 'View Release Receipt',
    actionTab: 'contracts',
    meta: {
      amount: 5000
    }
  },
  {
    id: 'notif-5',
    type: 'contract',
    title: 'Dahir 2026 Digital Contract Signed',
    message: 'Both agency and driver authenticated signature on digital lease AC-2418 under Moroccan law 09-08.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14h ago
    read: true,
    targetRole: 'all',
    actionLabel: 'Download Signed PDF',
    actionTab: 'contracts'
  },
  {
    id: 'notif-6',
    type: 'payment',
    title: 'Fleet Payout Processed',
    message: 'Weekly payout of 14,800 DH sent to your CIH Bank account (Ref: WTR-99401).',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // Yesterday
    read: true,
    targetRole: 'partner',
    actionLabel: 'View Settlement',
    actionTab: 'earnings',
    meta: {
      amount: 14800
    }
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window === 'undefined') return initialMockNotifications;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return initialMockNotifications;
  });

  const [activeToast, setActiveToast] = useState<NotificationToast | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(SOUND_KEY) !== 'false';
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem(SOUND_KEY, String(enabled));
  };

  const playNotificationSound = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // audio context may be locked until user interaction
    }
  }, [soundEnabled]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const unreadCountForRole = useCallback((role: 'renter' | 'partner' | 'admin') => {
    return notifications.filter(n => !n.read && (n.targetRole === role || n.targetRole === 'all' || !n.targetRole)).length;
  }, [notifications]);

  const filteredNotifications = useCallback((category: NotificationCategory, role?: 'renter' | 'partner' | 'admin') => {
    let list = notifications;
    if (role) {
      list = list.filter(n => n.targetRole === role || n.targetRole === 'all' || !n.targetRole);
    }
    if (category === 'unread') {
      return list.filter(n => !n.read);
    }
    if (category === 'bookings') {
      return list.filter(n => n.type === 'booking');
    }
    if (category === 'reviews') {
      return list.filter(n => n.type === 'review');
    }
    if (category === 'payments') {
      return list.filter(n => n.type === 'payment');
    }
    return list;
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback((role?: 'renter' | 'partner' | 'admin') => {
    setNotifications(prev => prev.map(n => {
      if (!role || n.targetRole === role || n.targetRole === 'all' || !n.targetRole) {
        return { ...n, read: true };
      }
      return n;
    }));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (activeToast?.id === id) {
      setActiveToast(null);
    }
  }, [activeToast]);

  const clearAll = useCallback((role?: 'renter' | 'partner' | 'admin') => {
    if (!role) {
      setNotifications([]);
    } else {
      setNotifications(prev => prev.filter(n => n.targetRole !== role && n.targetRole !== 'all'));
    }
    setActiveToast(null);
  }, []);

  const addNotification = useCallback((item: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast({ id: newNotif.id, notification: newNotif });
    playNotificationSound();

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setActiveToast(current => current?.id === newNotif.id ? null : current);
    }, 6000);
  }, [playNotificationSound]);

  const simulateNotification = useCallback((preset: 'new_review' | 'booking_confirmed' | 'deposit_released' | 'contract_ready') => {
    switch (preset) {
      case 'new_review':
        addNotification({
          type: 'review',
          title: 'New Customer Review Posted',
          message: 'Thomas Leroy just gave 5 stars: "Pristine car condition at Sania Ramel, effortless handover in 3 minutes!"',
          targetRole: 'partner',
          actionLabel: 'Write Official Reply',
          actionTab: 'reviews',
          meta: {
            carName: '2025 Volkswagen Golf 8',
            rating: 5,
            authorName: 'Thomas Leroy'
          }
        });
        break;
      case 'booking_confirmed':
        addNotification({
          type: 'booking',
          title: 'Instant Booking Confirmed',
          message: 'Booking #AC-9402: Dacia Duster 4x4 reserved for 5 days starting tomorrow in Tetouan.',
          targetRole: 'all',
          actionLabel: 'View Trip Details',
          actionTab: 'overview',
          meta: {
            bookingId: 'AC-9402',
            carName: '2024 Dacia Duster 4x4',
            amount: 3250
          }
        });
        break;
      case 'deposit_released':
        addNotification({
          type: 'payment',
          title: 'Escrow Deposit Released',
          message: 'Security deposit of 4,000 DH was released back to customer card with zero deductions.',
          targetRole: 'renter',
          actionLabel: 'View Receipt',
          actionTab: 'contracts',
          meta: {
            amount: 4000
          }
        });
        break;
      case 'contract_ready':
        addNotification({
          type: 'contract',
          title: 'Dahir 2026 Contract Ready to Sign',
          message: 'Your bilateral rental contract AC-3190 has been prepared by Mayache Prestige Cars. Tap to sign.',
          targetRole: 'renter',
          actionLabel: 'Review & Sign Contract',
          actionTab: 'contracts'
        });
        break;
    }
  }, [addNotification]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        unreadCountForRole,
        filteredNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification,
        simulateNotification,
        activeToast,
        dismissToast,
        soundEnabled,
        setSoundEnabled
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
