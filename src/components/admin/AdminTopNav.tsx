import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  Layers, 
  DollarSign, 
  Radio, 
  RefreshCw,
  Sliders,
  Building2,
  Car,
  AlertTriangle,
  Database
} from 'lucide-react';
import { AdminTab } from '../../types/admin';
import { UserRole } from '../../types/partner';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { NotificationBell } from '../notifications/NotificationBell';
import { UserAuthButton } from '../auth/UserAuthButton';

interface AdminTopNavProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  pendingAgenciesCount: number;
  openDisputesCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenRealDataModal?: () => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
  onSwitchRole,
  pendingAgenciesCount,
  openDisputesCount,
  searchQuery,
  onSearchChange,
  onOpenRealDataModal,
}) => {
  const { isLight, formatPrice } = useAccountSettings();

  return (
    <header className={`sticky top-0 z-40 border-b px-4 sm:px-6 py-3 transition-colors ${
      isLight ? 'bg-white/95 border-neutral-200 text-neutral-900' : 'bg-[#150f0c]/95 border-[#281d16] text-[#f5efe8]'
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Brand / Admin Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f95721] to-[#d83f0f] flex items-center justify-center text-white shadow-md shadow-[#f95721]/20">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-display font-bold text-base sm:text-lg tracking-tight">
                  Morocco Drive
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-500 border border-rose-500/30">
                  HQ Admin
                </span>
              </div>
              <p className={`text-[10px] hidden sm:block ${isLight ? 'text-neutral-500' : 'text-[#8d7e73]'}`}>
                Platform Governance & Escrow Supervision • Kingdom of Morocco
              </p>
            </div>
          </div>
        </div>

        {/* Center Search bar across platform */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className={`relative w-full rounded-full border flex items-center transition-colors ${
            isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-[#201813] border-[#36271e] text-[#f5efe8]'
          }`}>
            <Search className="w-4 h-4 text-[#8d7e73] ml-3.5" />
            <input
              type="text"
              placeholder="Search agencies, vehicle plates, booking # or disputes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent px-3 py-1.5 text-xs focus:outline-none placeholder:text-neutral-500"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')} 
                className="mr-3 text-xs text-[#8d7e73] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Role switch, quick status, and user */}
        <div className="flex items-center gap-3">
          
          {/* Quick Platform Status */}
          <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
            isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300'
          }`}>
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Escrow & Telemetry: Live</span>
          </div>

          {/* Quick Alert Counters */}
          {(pendingAgenciesCount > 0 || openDisputesCount > 0) && (
            <div className="flex items-center gap-1.5">
              {pendingAgenciesCount > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectTab('agencies')}
                  className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1 cursor-pointer hover:bg-amber-500/25 transition-colors"
                  title={`${pendingAgenciesCount} agencies awaiting KYC verification`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>{pendingAgenciesCount} KYC</span>
                </button>
              )}
              {openDisputesCount > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectTab('disputes')}
                  className="px-2 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center gap-1 cursor-pointer hover:bg-rose-500/25 transition-colors"
                  title={`${openDisputesCount} open customer disputes`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{openDisputesCount} Disputes</span>
                </button>
              )}
            </div>
          )}

          {/* HQ Admin Notification Bell */}
          <NotificationBell
            currentRole="admin"
            isLight={isLight}
            onNavigateTab={onSelectTab}
          />

          {/* Real Test Data Hub Modal Trigger */}
          {onOpenRealDataModal && (
            <button
              type="button"
              onClick={onOpenRealDataModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Inspect or Populate Real Moroccan Test Data"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Real Data Hub</span>
            </button>
          )}

          {/* 3-Way Role Switcher: Partner / Renter / Admin */}
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

          {/* Admin OAuth User Auth Button */}
          <div className="pl-2 border-l border-[#382a20]">
            <UserAuthButton
              currentRole={currentRole}
              onSwitchRole={onSwitchRole}
              onNavigateTab={onSelectTab as any}
            />
          </div>

        </div>
      </div>
    </header>
  );
};
