import React from 'react';
import { 
  BarChart3, 
  TrendingUp,
  Building2, 
  Car, 
  Users,
  FileText, 
  AlertTriangle, 
  DollarSign, 
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AdminTab } from '../../types/admin';
import { useAccountSettings } from '../../context/AccountSettingsContext';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingAgenciesCount: number;
  openDisputesCount: number;
  flaggedVehiclesCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingAgenciesCount,
  openDisputesCount,
  flaggedVehiclesCount,
}) => {
  const { isLight } = useAccountSettings();

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Analytics & Visuals',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'agencies',
      label: 'Agencies & KYC',
      icon: <Building2 className="w-4 h-4" />,
      badge: pendingAgenciesCount,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'clients',
      label: 'Clients & Renters',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'fleet',
      label: 'Master Fleet Inventory',
      icon: <Car className="w-4 h-4" />,
      badge: flaggedVehiclesCount > 0 ? flaggedVehiclesCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'bookings',
      label: 'Bookings & Escrow',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'disputes',
      label: 'Dispute Desk',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: openDisputesCount,
      badgeColor: 'bg-rose-600 text-white animate-pulse'
    },
    {
      id: 'payouts',
      label: 'Bank Payout Batches',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Platform & Cities',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <aside className={`w-64 shrink-0 border-r flex flex-col justify-between p-4 transition-colors hidden md:flex min-h-[calc(100vh-65px)] ${
      isLight ? 'bg-neutral-50/80 border-neutral-200' : 'bg-[#150f0c] border-[#261c16]'
    }`}>
      <div className="space-y-6">
        
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8d7e73]">
            Platform Headquarters
          </div>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 font-bold'
                    : isLight
                    ? 'text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900'
                    : 'text-[#9c8e82] hover:bg-[#201712] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-[#8d7e73]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-[#f95721] text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Moroccan Escrow Compliance Card */}
        <div className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
          isLight ? 'bg-white border-neutral-200 text-neutral-700' : 'bg-[#1e1611] border-[#30231a] text-[#c5b8ad]'
        }`}>
          <div className="flex items-center gap-2 text-rose-500 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Escrow Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            All customer security deposits are isolated in dedicated escrow accounts compliant with Bank Al-Maghrib standards.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#8d7e73]">
            <span>BANK AL-MAGHRIB</span>
            <span className="text-emerald-500 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className={`pt-4 border-t text-[11px] ${isLight ? 'border-neutral-200 text-neutral-500' : 'border-[#261c16] text-[#706358]'}`}>
        <div className="flex items-center justify-between">
          <span>Morocco Drive HQ</span>
          <span className="font-mono">v2.4.0</span>
        </div>
        <div className="mt-1 text-[10px]">
          Kingdom of Morocco Platform
        </div>
      </div>
    </aside>
  );
};
