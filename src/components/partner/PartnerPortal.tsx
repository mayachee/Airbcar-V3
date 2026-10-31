import React, { useState } from 'react';
import { PartnerSidebar } from './PartnerSidebar';
import { PartnerTopNav } from './PartnerTopNav';
import { PartnerMessagesView } from './PartnerMessagesView';
import { PartnerDashboardView } from './PartnerDashboardView';
import { PartnerVehiclesView } from './PartnerVehiclesView';
import { PartnerBookingsView } from './PartnerBookingsView';
import { PartnerCarSharingView } from './PartnerCarSharingView';
import { PartnerEarningsView } from './PartnerEarningsView';
import { PartnerAnalyticsView } from './PartnerAnalyticsView';
import { PartnerCalendarView } from './PartnerCalendarView';
import { PartnerReviewsView } from './PartnerReviewsView';
import { PartnerPoliciesView } from './PartnerPoliciesView';
import { PartnerProfileView } from './PartnerProfileView';
import { PartnerSettingsView } from './PartnerSettingsView';
import { PartnerManualBookingModal } from './PartnerManualBookingModal';

import { 
  PartnerTab, 
  UserRole, 
  PartnerBooking, 
  PartnerVehicle, 
  PartnerConversation, 
  SavedReply, 
  B2BCarShare 
} from '../../types/partner';

import {
  initialPartnerProfile,
  initialPartnerVehicles,
  initialPartnerBookings,
  initialPartnerConversations,
  initialSavedReplies,
  initialB2BCarShares,
  initialPartnerEarnings,
  initialPartnerReviews,
} from '../../data/partnerMockData';
import { api } from '../../services/api';
import { useAccountSettings } from '../../context/AccountSettingsContext';
import { 
  savePartnerVehicleToFirestore, 
  deleteCarFromFirestore, 
  createFirestoreBooking, 
  createFirestoreContract,
  subscribeToCars,
  subscribeToBookings
} from '../../services/firebase';

import { ActiveTab } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { REAL_TEST_PARTNERS } from '../../data/realTestData';
import { PartnerAuthGateModal } from './PartnerAuthGateModal';
import { RealDataModal } from '../common/RealDataModal';
import { Lock, ArrowLeft, Building2 } from 'lucide-react';

interface PartnerPortalProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onOpenContractPdf: (contractId?: string) => void;
  onNavigateToTab?: (tab: ActiveTab) => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
  currentRole,
  onSwitchRole,
  onOpenContractPdf,
  onNavigateToTab,
}) => {
  const { user, isPartner } = useAuth();
  const { theme, setTheme, isLight, isRTL } = useAccountSettings();
  const [activeTab, setActiveTab] = useState<PartnerTab>('messages'); // Default to messages to match the user's screenshot!
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(!isPartner);

  // Core state
  const [partnerProfile, setPartnerProfile] = useState(initialPartnerProfile);
  const [vehicles, setVehicles] = useState<PartnerVehicle[]>(initialPartnerVehicles);
  const [bookings, setBookings] = useState<PartnerBooking[]>(initialPartnerBookings);
  const [conversations, setConversations] = useState<PartnerConversation[]>(initialPartnerConversations);
  const [savedReplies, setSavedReplies] = useState<SavedReply[]>(initialSavedReplies);
  const [carShares, setCarShares] = useState<B2BCarShare[]>(initialB2BCarShares);
  const [earnings] = useState(initialPartnerEarnings);
  const [reviews] = useState(initialPartnerReviews);
  const [isRealDataModalOpen, setIsRealDataModalOpen] = useState(false);

  // Live Firestore database synchronization for partner
  React.useEffect(() => {
    // Sync partner profile if current user matches one of the 10 partners
    if (user) {
      const matchedPartner = REAL_TEST_PARTNERS.find(p => 
        p.id === user.uid || p.email.toLowerCase() === user.email?.toLowerCase() || (user.agencyName && p.agencyName.toLowerCase().includes(user.agencyName.toLowerCase()))
      );
      if (matchedPartner) {
        setPartnerProfile(prev => ({
          ...prev,
          id: matchedPartner.id,
          agencyName: matchedPartner.agencyName,
          ownerName: matchedPartner.ownerName,
          city: matchedPartner.city,
          address: matchedPartner.address,
          phone: matchedPartner.phone,
          email: matchedPartner.email,
          description: matchedPartner.description,
          licenseNumber: matchedPartner.licenseNumber,
          isVerified: true,
          verificationStatus: 'Approved',
          fleetCount: 5,
        }));
      }
    }

    const unsubCars = subscribeToCars((remoteCars) => {
      if (remoteCars && remoteCars.length > 0) {
        const currentPartnerAgency = REAL_TEST_PARTNERS.find(p => 
          p.id === user?.uid || p.email.toLowerCase() === user?.email?.toLowerCase() || (user?.agencyName && p.agencyName.toLowerCase().includes(user.agencyName.toLowerCase()))
        ) || REAL_TEST_PARTNERS[0];

        const agencyCars = remoteCars.filter(rc => (rc as any).agencyId === currentPartnerAgency.id || rc.agency?.id === currentPartnerAgency.id);
        if (agencyCars.length > 0) {
          const mappedVehicles: PartnerVehicle[] = agencyCars.map(rc => {
            const rawFuel = ((rc as any).fuelType || rc.fuel || 'gasoline').toLowerCase();
            const fuelVal: 'Diesel' | 'Petrol' | 'Hybrid' = rawFuel === 'diesel' ? 'Diesel' : rawFuel === 'hybrid' ? 'Hybrid' : 'Petrol';
            return {
              id: rc.id,
              make: rc.brand || rc.name.split(' ')[0],
              model: rc.model || rc.name,
              year: rc.year || 2024,
              plate: (rc as any).plate || '12345-A-1',
              dailyRate: rc.dailyRate || 500,
              depositAmount: rc.depositAmount || 3000,
              city: rc.city || currentPartnerAgency.city,
              transmission: rc.transmission === 'manual' ? 'Manual' : 'Automatic',
              fuelType: fuelVal,
              seats: rc.seats || 5,
              status: 'available',
              isB2bEligible: true,
              image: (rc as any).imageUrl || rc.images?.[0] || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
              rating: rc.rating || 4.9,
              tripsCount: rc.reviewsCount || 12,
              blackoutDates: [],
            };
          });
          setVehicles(mappedVehicles);
        } else {
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
                totalMAD: match.totalPrice || b.totalMAD,
              };
            }
            return b;
          });
        });
      }
    });

    return () => {
      unsubCars();
      unsubBookings();
    };
  }, [user]);

  // Backend API Status
  const [apiStatus, setApiStatus] = useState<'connected' | 'offline' | 'checking'>('connected');

  const checkApiHealth = async () => {
    setApiStatus('checking');
    const res = await api.checkHealth();
    if (res.ok) {
      setApiStatus('connected');
    } else {
      setApiStatus('offline');
    }
  };

  const handleToggleB2b = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, isB2bEligible: !v.isB2bEligible } : v));
  };

  const handleAddBlackout = (vehicleId: string, blackout: { start: string; end: string; reason: string }) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          status: 'blackout',
          blackoutDates: [...(v.blackoutDates || []), { id: `bo-${Date.now()}`, ...blackout }],
        };
      }
      return v;
    }));
  };

  const handleAddVehicle = (newVehicle: PartnerVehicle | PartnerVehicle[]) => {
    if (Array.isArray(newVehicle)) {
      setVehicles(prev => [...newVehicle, ...prev]);
      newVehicle.forEach(v => savePartnerVehicleToFirestore({
        ...v,
        agencyId: partnerProfile.id,
        agencyName: partnerProfile.agencyName,
      } as any));
    } else {
      setVehicles(prev => [newVehicle, ...prev]);
      savePartnerVehicleToFirestore({
        ...newVehicle,
        agencyId: partnerProfile.id,
        agencyName: partnerProfile.agencyName,
      } as any);
    }
  };

  const handleUpdateVehicle = (updatedVehicle: PartnerVehicle) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
    savePartnerVehicleToFirestore({
      ...updatedVehicle,
      agencyId: partnerProfile.id,
      agencyName: partnerProfile.agencyName,
    } as any);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    deleteCarFromFirestore(vehicleId);
  };

  const handleSendContract = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, contractSent: true } : b));
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      createFirestoreContract({
        id: `CTR-${bookingId.toUpperCase()}`,
        bookingId,
        renterId: targetBooking.renter?.id || 'usr-client',
        renterName: targetBooking.renter?.fullName || 'Client',
        renterEmail: targetBooking.renter?.email,
        carModel: targetBooking.vehicle?.name || 'Vehicle',
        contractNumber: `CTR-${bookingId.toUpperCase()}`,
        status: 'draft',
      });
    }
  };

  const handleConfirmDelivery = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, deliveryConfirmed: true } : b));
  };

  const handleAddManualBooking = (newBooking: PartnerBooking) => {
    setBookings(prev => [newBooking, ...prev]);
    setActiveTab('bookings');
    createFirestoreBooking({
      id: newBooking.id,
      renterId: newBooking.renter?.id || 'usr-manual-client',
      renterName: newBooking.renter?.fullName || 'Walk-in Client',
      renterEmail: newBooking.renter?.email,
      carId: newBooking.vehicle?.id || 'veh-1',
      carTitle: newBooking.vehicle?.name || 'Vehicle',
      carCategory: 'Fleet Vehicle',
      carImage: newBooking.vehicle?.image,
      pickupDate: newBooking.pickupDate,
      returnDate: newBooking.returnDate,
      pickupCity: newBooking.pickupLocation || 'Morocco',
      totalDays: 3,
      pricePerDay: Math.round((newBooking.totalMAD || 2100) / 3),
      totalPrice: newBooking.totalMAD || 2100,
      depositAmount: newBooking.depositMAD || 5000,
      status: 'confirmed',
      dahirRegistrationId: newBooking.bookingNumber || `MAN-${Date.now().toString().slice(-6)}`,
    });
  };

  const handleAddSavedReply = (reply: SavedReply) => {
    setSavedReplies(prev => [...prev, reply]);
  };

  const handleDeleteSavedReply = (id: string) => {
    setSavedReplies(prev => prev.filter(r => r.id !== id));
  };

  const unreadConversationsCount = conversations.filter(c => c.unreadCount > 0).length;

  const handleToggleSidebar = () => {
    // Toggle desktop sidebar or mobile sidebar depending on screen width
    setDesktopSidebarOpen(prev => !prev);
    setMobileSidebarOpen(prev => !prev);
  };

  // If user does not have the partner role, lock the dashboard behind authentication
  if (!isPartner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0e0a08] text-[#f5efe8]">
        <PartnerAuthGateModal
          isOpen={isAuthGateOpen}
          onClose={() => setIsAuthGateOpen(false)}
          onSuccess={() => onSwitchRole('partner')}
        />
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#18120e] border border-amber-500/30 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Partner Authentication Required
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Partner Dashboard is Restricted
            </h1>
            <p className="text-xs text-[#a8988a] leading-relaxed">
              This portal is reserved for registered car rental agencies and fleet operators in Morocco. Please authenticate with your agency account to manage your fleet, contracts, and bookings.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setIsAuthGateOpen(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-neutral-950" />
              <span>Sign In with Partner Account</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole('renter')}
              className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-[#c9b8ab] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Traveler Trips</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${isLight ? 'bg-[#f8f6f3] text-[#181311]' : 'bg-[#140e0b] text-[#f5efe8]'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Desktop Sidebar */}
      {desktopSidebarOpen && (
        <div className="hidden md:block shrink-0">
          <PartnerSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            unreadCount={unreadConversationsCount}
            fleetCount={vehicles.length}
            replySpeedMinutes={partnerProfile.replySpeedMinutes}
            replySpeedRank={partnerProfile.replySpeedRank}
            agencyName={partnerProfile.agencyName}
            onNavigateToTab={onNavigateToTab}
            onSwitchRole={onSwitchRole}
          />
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <div className="relative w-64 max-w-[80vw] bg-[#16110e] h-full z-10">
            <PartnerSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              unreadCount={unreadConversationsCount}
              fleetCount={vehicles.length}
              replySpeedMinutes={partnerProfile.replySpeedMinutes}
              replySpeedRank={partnerProfile.replySpeedRank}
              agencyName={partnerProfile.agencyName}
              onNavigateToTab={onNavigateToTab}
              onSwitchRole={onSwitchRole}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PartnerTopNav
          activeTab={activeTab}
          currentRole={currentRole}
          onSwitchRole={onSwitchRole}
          onOpenManualBooking={() => setIsManualBookingOpen(true)}
          onToggleMobileSidebar={handleToggleSidebar}
          apiStatus={apiStatus}
          onCheckApiHealth={checkApiHealth}
          ownerName={partnerProfile.ownerName}
          unansweredCount={unreadConversationsCount}
          onSelectTab={setActiveTab}
          onOpenRealDataModal={() => setIsRealDataModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'messages' && (
            <PartnerMessagesView
              conversations={conversations}
              activeBooking={bookings[0]}
              savedReplies={savedReplies}
              onOpenContractPdf={onOpenContractPdf}
              onConfirmDelivery={handleConfirmDelivery}
              onEscalateDispute={() => alert('Dispute escalation opened. Airbcar HQ will review message history.')}
            />
          )}

          {activeTab === 'dashboard' && (
            <PartnerDashboardView
              partnerProfile={partnerProfile}
              bookings={bookings}
              vehicles={vehicles}
              onNavigateTab={setActiveTab}
              onSendContract={handleSendContract}
              onOpenManualBooking={() => setIsManualBookingOpen(true)}
              onOpenContractPdf={onOpenContractPdf}
            />
          )}

          {activeTab === 'vehicles' && (
            <PartnerVehiclesView
              vehicles={vehicles}
              onToggleB2b={handleToggleB2b}
              onAddBlackout={handleAddBlackout}
              onAddVehicle={handleAddVehicle}
              onUpdateVehicle={handleUpdateVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              partnerProfile={partnerProfile}
            />
          )}

          {activeTab === 'bookings' && (
            <PartnerBookingsView
              bookings={bookings}
              onSendContract={handleSendContract}
              onOpenContractPdf={onOpenContractPdf}
              onOpenManualBooking={() => setIsManualBookingOpen(true)}
              onOpenChatWithRenter={() => setActiveTab('messages')}
            />
          )}

          {activeTab === 'car-sharing' && (
            <PartnerCarSharingView
              carShares={carShares}
            />
          )}

          {activeTab === 'earnings' && (
            <PartnerEarningsView
              earnings={earnings}
              partnerProfile={partnerProfile}
            />
          )}

          {activeTab === 'analytics' && (
            <PartnerAnalyticsView
              partnerProfile={partnerProfile}
            />
          )}

          {activeTab === 'calendar' && (
            <PartnerCalendarView
              vehicles={vehicles}
              bookings={bookings}
            />
          )}

          {activeTab === 'reviews' && (
            <PartnerReviewsView
              reviews={reviews}
              partnerProfile={partnerProfile}
            />
          )}

          {activeTab === 'policies' && (
            <PartnerPoliciesView />
          )}

          {activeTab === 'profile' && (
            <PartnerProfileView
              partnerProfile={partnerProfile}
              onUpdateProfile={setPartnerProfile}
            />
          )}

          {activeTab === 'settings' && (
            <PartnerSettingsView
              savedReplies={savedReplies}
              onAddSavedReply={handleAddSavedReply}
              onDeleteSavedReply={handleDeleteSavedReply}
              partnerProfile={partnerProfile}
              vehicles={vehicles}
              theme={theme}
              onThemeChange={setTheme}
              onNavigateTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Manual Booking Modal */}
      <PartnerManualBookingModal
        isOpen={isManualBookingOpen}
        onClose={() => setIsManualBookingOpen(false)}
        vehicles={vehicles}
        onCreateBooking={handleAddManualBooking}
        onOpenContractPdf={onOpenContractPdf}
      />

      {/* Real Moroccan Test Data Hub Modal */}
      <RealDataModal
        isOpen={isRealDataModalOpen}
        onClose={() => setIsRealDataModalOpen(false)}
        onSwitchRole={onSwitchRole}
      />
    </div>
  );
};
