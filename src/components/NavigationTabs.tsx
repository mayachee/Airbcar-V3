import React from 'react';
import { ActiveTab } from '../types';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadMessagesCount?: number;
  awaitingSignatureCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
  unreadMessagesCount = 2,
  awaitingSignatureCount = 1,
}) => {
  const tabs: { id: ActiveTab; label: string; badge?: number | string; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'my-trips', label: 'My trips' },
    { 
      id: 'contracts', 
      label: 'Contracts', 
      badge: awaitingSignatureCount > 0 ? awaitingSignatureCount : undefined,
      badgeColor: 'bg-[#f95721] text-white'
    },
    { id: 'saved-cars', label: 'Saved cars' },
    { id: 'documents', label: 'Documents' },
    { id: 'payments', label: 'Payments' },
    { 
      id: 'messages', 
      label: 'Messages', 
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeColor: 'bg-[#f95721] text-white'
    },
    { id: 'settings', label: 'Settings' },
    { id: 'mission', label: 'Mission' },
    { id: 'help', label: 'Help & FAQ' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-4">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition-all relative font-medium flex items-center gap-2 ${
                isActive
                  ? 'bg-[#181311] text-white shadow-sm'
                  : 'bg-transparent text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/40 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && !isActive && (
                <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${tab.badgeColor}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
