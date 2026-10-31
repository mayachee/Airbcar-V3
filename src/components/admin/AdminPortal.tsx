import React, { useState, useEffect } from 'react';
import { AdminTab, AdminAgency, AdminClient, AdminVehicle, AdminBooking, AdminDispute, AdminPayoutBatch, PlatformSettings } from '../../types/admin';
import { UserRole } from '../../types/partner';
import { AdminTopNav } from './AdminTopNav';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverviewView } from './AdminOverviewView';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { AdminAgenciesView } from './AdminAgenciesView';
import { AdminClientsView } from './AdminClientsView';
import { AdminFleetView } from './AdminFleetView';
import { AdminBookingsView } from './AdminBookingsView';
import { AdminDisputesView } from './AdminDisputesView';
import { AdminPayoutsView } from './AdminPayoutsView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminAuthGateModal } from './AdminAuthGateModal';
import { useAuth } from '../../context/AuthContext';
import { EXCLUSIVE_ADMIN_EMAIL } from '../../types/auth';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import { 
  initialAdminAgencies, 
  initialAdminClients,
  initialAdminVehicles, 
  initialAdminBookings, 
  initialAdminDisputes, 
  initialAdminPayoutBatches, 
  initialPlatformSettings 
} from '../../data/adminMockData';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { 
  subscribeToContracts, 
  subscribeToCars, 
  subscribeToBookings, 
  subscribeToDisputes 
} from '../../services/firebase';
import { RealDataModal } from '../common/RealDataModal';

interface AdminPortalProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentRole,
  onSwitchRole,
}) => {
  const { isLight } = useAccountSettings();

  // State
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [agencies, setAgencies] = useState<AdminAgency[]>(initialAdminAgencies);
  const [clients, setClients] = useState<AdminClient[]>(initialAdminClients);
  const [vehicles, setVehicles] = useState<AdminVehicle[]>(initialAdminVehicles);
  const [bookings, setBookings] = useState<AdminBooking[]>(initialAdminBookings);
  const [disputes, setDisputes] = useState<AdminDispute[]>(initialAdminDisputes);
  const [batches, setBatches] = useState<AdminPayoutBatch[]>(initialAdminPayoutBatches);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(initialPlatformSettings);
  const [contracts, setContracts] = useState<any[]>([]);
  const [isRealDataModalOpen, setIsRealDataModalOpen] = useState(false);

  // Subscribe to live Firestore collections
  useEffect(() => {
    const unsubContracts = subscribeToContracts(undefined, (items) => {
      if (Array.isArray(items) && items.length > 0) {
        setContracts(items);
      }
    });

    const unsubCars = subscribeToCars((remoteCars) => {
      if (remoteCars && remoteCars.length > 0) {
        setVehicles(prev => {
          return prev.map(v => {
            const match = remoteCars.find(rc => rc.id === v.id || `veh-${rc.id}` === v.id);
            if (match) {
              return {
                ...v,
                dailyRate: match.dailyRate,
                depositAmount: match.depositAmount,
                city: match.city,
                rating: match.rating,
              };
            }
            return v;
          });
        });
      }
    });

    const unsubBookings = subscribeToBookings(undefined, (remoteBookings) => {
      if (remoteBookings && remoteBookings.length > 0) {
        setBookings(prev => {
          return prev.map(b => {
            const match = remoteBookings.find(rb => rb.id === b.id || rb.dahirRegistrationId === b.bookingNumber);
            if (match) {
              return {
                ...b,
                status: match.status === 'confirmed' ? 'confirmed' : match.status === 'completed' ? 'completed' : b.status,
                totalAmountMAD: match.totalPrice || b.totalAmountMAD,
              };
            }
            return b;
          });
        });
      }
    });

    const unsubDisputes = subscribeToDisputes((remoteDisputes) => {
      if (remoteDisputes && remoteDisputes.length > 0) {
        setDisputes(prev => {
          return prev.map(d => {
            const match = remoteDisputes.find(rd => rd.id === d.id);
            if (match) {
              return {
                ...d,
                status: match.status,
                notes: match.resolutionNotes || d.notes,
              };
            }
            return d;
          });
        });
      }
    });

    return () => {
      unsubContracts();
      unsubCars();
      unsubBookings();
      unsubDisputes();
    };
  }, []);

  // Search & Navigation cross-links
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgencyForKYC, setSelectedAgencyForKYC] = useState<AdminAgency | null>(null);
  const [selectedAgencyFleetFilter, setSelectedAgencyFleetFilter] = useState<string | undefined>(undefined);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | undefined>(undefined);

  // Client Handlers
  const handleUpdateClientTrustScore = (clientId: string, newScore: AdminClient['trustScore']) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, trustScore: newScore } : c));
  };

  // Agency Handlers
  const handleVerifyAgency = (agencyId: string) => {
    setAgencies(prev => prev.map(a => a.id === agencyId ? {
      ...a,
      status: 'verified',
      kycDocuments: a.kycDocuments.map(d => ({ ...d, status: 'verified' as const }))
    } : a));
  };

  const handleSuspendAgency = (agencyId: string, reason: string) => {
    setAgencies(prev => prev.map(a => a.id === agencyId ? { ...a, status: 'suspended' } : a));
  };

  const handleUpdateCommission = (agencyId: string, newRate: number) => {
    setAgencies(prev => prev.map(a => a.id === agencyId ? { ...a, commissionRatePct: newRate } : a));
  };

  const handleViewAgencyFleet = (agencyId: string) => {
    setSelectedAgencyFleetFilter(agencyId);
    setCurrentTab('fleet');
  };

  // Fleet Handlers
  const handleToggleFeatureVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, isFeatured: !v.isFeatured } : v));
  };

  const handleToggleFlagVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const nextStatus = v.status === 'flagged' ? 'available' : 'flagged';
        const nextCompliance = v.complianceStatus === 'flagged' ? 'compliant' : 'flagged';
        return { ...v, status: nextStatus, complianceStatus: nextCompliance };
      }
      return v;
    }));
  };

  // Bookings Handlers
  const handleReleaseEscrow = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, escrowStatus: 'released_to_renter' } : b));
  };

  const handleFreezeEscrow = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, escrowStatus: 'disputed_freeze', status: 'disputed' } : b));
  };

  // Dispute Handlers
  const handleResolveDispute = (
    disputeId: string, 
    verdict: 'refund_renter' | 'release_to_agency' | 'split_50_50', 
    notes: string
  ) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        return {
          ...d,
          status: 'resolved',
          verdict,
          resolutionNotes: notes,
          resolvedAt: new Date().toISOString().split('T')[0],
          resolvedBy: 'HQ Superadmin'
        };
      }
      return d;
    }));

    // Also update corresponding booking escrow status
    const dispute = disputes.find(d => d.id === disputeId);
    if (dispute) {
      setBookings(prev => prev.map(b => {
        if (b.bookingNumber === dispute.bookingNumber) {
          return {
            ...b,
            status: 'completed',
            escrowStatus: verdict === 'refund_renter' ? 'released_to_renter' : 'partially_deducted'
          };
        }
        return b;
      }));
    }
  };

  // Payout Handlers
  const handleExecuteBatch = (batchId: string) => {
    setBatches(prev => prev.map(batch => {
      if (batch.id === batchId) {
        return {
          ...batch,
          status: 'settled',
          executedAt: new Date().toISOString().split('T')[0],
          items: batch.items.map(item => ({ ...item, status: 'settled' }))
        };
      }
      return batch;
    }));
  };

  const pendingAgenciesCount = agencies.filter(a => a.status === 'pending' || a.status === 'under_review').length;
  const openDisputesCount = disputes.filter(d => d.status === 'open' || d.status === 'under_investigation').length;
  const flaggedVehiclesCount = vehicles.filter(v => v.status === 'flagged' || v.complianceStatus === 'flagged').length;

  const { user } = useAuth();
  const isAuthorizedAdmin = user?.role === 'admin' && user?.email?.toLowerCase().trim() === EXCLUSIVE_ADMIN_EMAIL.toLowerCase().trim();
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(!isAuthorizedAdmin);

  // If active user is NOT authorized admin, show restricted shield lock screen
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0e0907] text-[#f5efe8]">
        <AdminAuthGateModal
          isOpen={isAuthGateOpen}
          onClose={() => setIsAuthGateOpen(false)}
          onSuccess={() => onSwitchRole('admin')}
        />
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#1a120e] border border-rose-500/30 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Access Restricted
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Morocco HQ Admin Access Required
            </h1>
            <p className="text-xs text-[#a8988a] leading-relaxed">
              Administrative oversight is exclusively reserved for <strong className="text-white font-mono">{EXCLUSIVE_ADMIN_EMAIL}</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setIsAuthGateOpen(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Verify Admin Password</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole('renter')}
              className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-[#c9b8ab] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Traveler Portal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isLight ? 'bg-neutral-50 text-neutral-900' : 'bg-[#120c09] text-[#f5efe8]'
    }`}>
      
      {/* Top Navbar */}
      <AdminTopNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentRole={currentRole}
        onSwitchRole={onSwitchRole}
        pendingAgenciesCount={pendingAgenciesCount}
        openDisputesCount={openDisputesCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenRealDataModal={() => setIsRealDataModalOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          pendingAgenciesCount={pendingAgenciesCount}
          openDisputesCount={openDisputesCount}
          flaggedVehiclesCount={flaggedVehiclesCount}
        />

        {/* Dynamic Center Tab Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0">
          {currentTab === 'overview' && (
            <AdminOverviewView
              agencies={agencies}
              vehicles={vehicles}
              bookings={bookings}
              disputes={disputes}
              contracts={contracts}
              onNavigateTab={setCurrentTab}
              onSelectAgencyForKYC={(agency) => {
                setSelectedAgencyForKYC(agency);
                setCurrentTab('agencies');
              }}
              onSelectDispute={(dispute) => {
                setSelectedDisputeId(dispute.id);
                setCurrentTab('disputes');
              }}
            />
          )}

          {currentTab === 'analytics' && (
            <AdminAnalyticsDashboard
              bookings={bookings}
              contracts={contracts}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'agencies' && (
            <AdminAgenciesView
              agencies={agencies}
              onVerifyAgency={handleVerifyAgency}
              onSuspendAgency={handleSuspendAgency}
              onUpdateCommission={handleUpdateCommission}
              onViewAgencyFleet={handleViewAgencyFleet}
              selectedAgencyForKYC={selectedAgencyForKYC}
              onCloseKYCModal={() => setSelectedAgencyForKYC(null)}
              onOpenKYCModal={(agency) => setSelectedAgencyForKYC(agency)}
            />
          )}

          {currentTab === 'clients' && (
            <AdminClientsView
              clients={clients}
              onUpdateTrustScore={handleUpdateClientTrustScore}
              onViewBooking={(bookingId) => {
                setCurrentTab('bookings');
              }}
            />
          )}

          {currentTab === 'fleet' && (
            <AdminFleetView
              vehicles={vehicles}
              selectedAgencyFilter={selectedAgencyFleetFilter}
              onClearAgencyFilter={() => setSelectedAgencyFleetFilter(undefined)}
              onToggleFeatureVehicle={handleToggleFeatureVehicle}
              onToggleFlagVehicle={handleToggleFlagVehicle}
            />
          )}

          {currentTab === 'bookings' && (
            <AdminBookingsView
              bookings={bookings}
              onReleaseEscrow={handleReleaseEscrow}
              onFreezeEscrow={handleFreezeEscrow}
              onSelectAgency={(agencyId) => {
                setCurrentTab('agencies');
              }}
              onSelectClient={(clientId) => {
                setCurrentTab('clients');
              }}
            />
          )}

          {currentTab === 'disputes' && (
            <AdminDisputesView
              disputes={disputes}
              onResolveDispute={handleResolveDispute}
              selectedDisputeId={selectedDisputeId}
            />
          )}

          {currentTab === 'payouts' && (
            <AdminPayoutsView
              batches={batches}
              onExecuteBatch={handleExecuteBatch}
            />
          )}

          {currentTab === 'settings' && (
            <AdminSettingsView
              settings={platformSettings}
              onUpdateSettings={setPlatformSettings}
            />
          )}
        </main>

      </div>

      {/* Real Moroccan Test Data Hub Modal */}
      <RealDataModal
        isOpen={isRealDataModalOpen}
        onClose={() => setIsRealDataModalOpen(false)}
        onSwitchRole={onSwitchRole}
      />
    </div>
  );
};
