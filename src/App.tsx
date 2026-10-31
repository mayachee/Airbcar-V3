/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, SavedCar, PastTrip, UserProfile, CarListing } from './types';
import { UserRole } from './types/partner';
import { PartnerPortal } from './components/partner/PartnerPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { 
  initialUserProfile, 
  savedCarsData, 
  pastTripsData, 
  closedContractsData, 
  initialConversations 
} from './data/mockData';
import { allCarsData, getCarById } from './data/carsData';
import { Header } from './components/Header';
import { NextTripCard } from './components/NextTripCard';
import { NavigationTabs } from './components/NavigationTabs';
import { OverviewView } from './components/OverviewView';
import { MessagesView } from './components/MessagesView';
import { ContractsView } from './components/ContractsView';
import { OtherTabsView } from './components/OtherTabsView';
import { MissionView } from './components/mission/MissionView';
import { HelpCenterView } from './components/help/HelpCenterView';
import { RentView } from './components/rent/RentView';
import { PartnerLandingView } from './components/partner/PartnerLandingView';
import { SearchView } from './components/search/SearchView';
import { VehicleProfileView } from './components/car/VehicleProfileView';
import { PartnerProfileView } from './components/partner/PartnerProfileView';
import { Footer } from './components/Footer';
import { SignContractModal } from './components/SignContractModal';
import { ContractPdfModal } from './components/ContractPdfModal';
import { SecondDriverModal } from './components/SecondDriverModal';
import { DisputeModal } from './components/DisputeModal';
import { TripDetailsModal } from './components/TripDetailsModal';
import { BookingFlowModal } from './components/BookingFlowModal';

import { AccountSettingsProvider } from './context/AccountSettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationToastBanner } from './components/notifications/NotificationToastBanner';
import { AuthProviderComponent, useAuth } from './context/AuthContext';
import { OAuthModal } from './components/auth/OAuthModal';
import { OAuthCallback } from './components/auth/OAuthCallback';
import { 
  createFirestoreBooking, 
  createFirestoreContract,
  subscribeToBookings,
  subscribeToContracts,
  subscribeToCars,
  seedInitialCarsIfEmpty,
  createFirestoreDispute,
  syncUserToFirestore
} from './services/firebase';

export default function App() {
  // Catch popup OAuth callback in React if reached
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/callback')) {
    return <OAuthCallback />;
  }

  return (
    <AuthProviderComponent>
      <AccountSettingsProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AccountSettingsProvider>
    </AuthProviderComponent>
  );
}

function AppContent() {
  const [currentRole, setCurrentRole] = useState<UserRole>('renter');
  const { user } = useAuth();

  // Check URL query parameters and pathname
  const initialParams = useMemo(() => {
    if (typeof window === 'undefined') {
      return { 
        location: 'Tetouan', 
        pickup: '2026-09-07', 
        returnD: '2026-09-11', 
        carId: '4', 
        partnerId: '5',
        tab: 'rent' as ActiveTab 
      };
    }
    const sp = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    
    let targetTab: ActiveTab = 'rent';
    let carId = sp.get('carId') || '4';
    let partnerId = sp.get('partnerId') || '5';
    
    const partnerMatch = path.match(/\/partner\/(\w+)/);
    const carMatch = path.match(/\/car\/(\w+)/);

    if (partnerMatch) {
      targetTab = 'partner-profile';
      partnerId = partnerMatch[1];
    } else if (carMatch) {
      targetTab = 'car-detail';
      carId = carMatch[1];
    } else if (path.includes('/search') || sp.has('location')) {
      targetTab = 'search';
    }

    return {
      location: sp.get('location') || 'Tetouan',
      pickup: sp.get('pickupDate') || '2026-09-07',
      returnD: sp.get('returnDate') || '2026-09-11',
      carId,
      partnerId,
      tab: targetTab
    };
  }, []);

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialParams.tab);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(initialParams.partnerId || '5');
  const [searchLocation, setSearchLocation] = useState<string>(initialParams.location);
  const [searchPickupDate, setSearchPickupDate] = useState<string>(initialParams.pickup);
  const [searchReturnDate, setSearchReturnDate] = useState<string>(initialParams.returnD);
  const [selectedCarForProfile, setSelectedCarForProfile] = useState<CarListing>(
    getCarById(initialParams.carId) || getCarById('4') || allCarsData[0]
  );

  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);

  // Sync OAuth user identity with booking and contract profile
  useEffect(() => {
    if (user) {
      setUserProfile((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        avatarUrl: user.avatar || prev.avatarUrl,
        phone: user.phone || prev.phone,
        cinNumber: user.cin || prev.cinNumber,
        drivingLicenceNumber: user.drivingLicenceNumber || prev.drivingLicenceNumber,
        isVerified: user.verified ?? prev.isVerified,
      }));
      if (user.role) {
        setCurrentRole(user.role);
      }
    } else {
      setUserProfile(initialUserProfile);
    }
  }, [user]);

  const [dbCars, setDbCars] = useState<CarListing[]>(allCarsData);
  const [savedCars, setSavedCars] = useState<SavedCar[]>(savedCarsData);
  const [pastTrips, setPastTrips] = useState<PastTrip[]>(pastTripsData);
  const [closedContracts, setClosedContracts] = useState(closedContractsData);
  const [conversations, setConversations] = useState(initialConversations);
  const [openDisputes, setOpenDisputes] = useState<string[]>([]);

  // Live Firestore database synchronization
  useEffect(() => {
    // Seed initial fleet into Firestore if empty
    seedInitialCarsIfEmpty();

    // Subscribe to live fleet/cars from Firestore
    const unsubCars = subscribeToCars((remoteCars) => {
      if (remoteCars && remoteCars.length > 0) {
        setDbCars(remoteCars);
        const mappedSaved: SavedCar[] = remoteCars.map((c) => ({
          id: c.id,
          name: c.name,
          location: c.location,
          transmission: c.transmission ? c.transmission.charAt(0).toUpperCase() + c.transmission.slice(1) : 'Automatic',
          seats: c.seats,
          dailyRate: c.dailyRate,
          image: c.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
          badge: c.category
        }));
        setSavedCars(mappedSaved);
      }
    });

    // Subscribe to live bookings from Firestore
    const unsubBookings = subscribeToBookings(user?.id, (remoteBookings) => {
      if (remoteBookings && remoteBookings.length > 0) {
        const mappedTrips: PastTrip[] = remoteBookings.map((b) => ({
          id: b.id,
          carName: b.carTitle || 'Vehicle',
          city: b.pickupCity || 'Morocco',
          dates: `${b.pickupDate} - ${b.returnDate}`,
          agency: 'Airbcar Partner Agency',
          totalPrice: b.totalPrice || 0,
          currency: 'MAD',
          image: b.carImage || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
          status: b.status === 'confirmed' ? 'Upcoming' : 'Completed',
          contractId: b.dahirRegistrationId || `AC-${b.id.slice(-4)}`,
        }));
        setPastTrips((prev) => {
          const ids = new Set(mappedTrips.map((m) => m.id));
          const existingNotOverwritten = prev.filter((p) => !ids.has(p.id));
          return [...mappedTrips, ...existingNotOverwritten];
        });
      }
    });

    // Subscribe to live contracts from Firestore
    const unsubContracts = subscribeToContracts(user?.id, (remoteContracts) => {
      if (remoteContracts && remoteContracts.length > 0) {
        const mappedContracts = remoteContracts.map((c) => ({
          id: c.contractNumber || c.id,
          vehicle: c.carModel || 'Rental Vehicle',
          agency: 'Airbcar Verified Agency',
          city: 'Morocco',
          dates: 'Active Contract',
          total: 2180,
          currency: 'MAD',
          depositStatus: 'Held in Escrow' as const,
          disputeRaised: false,
          downloadPdf: '#',
          isSigned: c.status === 'signed' || c.status === 'active',
          isB2b: false,
        }));
        setClosedContracts((prev) => {
          const ids = new Set(mappedContracts.map((m) => m.id));
          const existing = prev.filter((p) => !ids.has(p.id));
          return [...mappedContracts, ...existing];
        });
      }
    });

    return () => {
      unsubCars();
      unsubBookings();
      unsubContracts();
    };
  }, [user?.id]);

  // Modals state
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSecondDriverModalOpen, setIsSecondDriverModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isTripDetailsModalOpen, setIsTripDetailsModalOpen] = useState(false);
  const [selectedCarForBooking, setSelectedCarForBooking] = useState<SavedCar | null>(null);
  const [isBookingFlowModalOpen, setIsBookingFlowModalOpen] = useState(false);

  // Quick helper to switch tab and scroll smoothly to top
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPartner = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setActiveTab('partner-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignComplete = () => {
    setIsSigned(true);
    if (user) {
      createFirestoreContract({
        id: `CTR-2026-${Date.now().toString().slice(-6)}`,
        bookingId: 'BK-TET-2026-0914',
        renterId: user.id,
        renterName: user.name,
        renterEmail: user.email,
        carModel: 'Range Rover Velar R-Dynamic',
        contractNumber: `CTR-2026-${Date.now().toString().slice(-6)}`,
        digitalSignature: user.name,
        cinNumber: user.cin || 'L482910',
        drivingLicenceNumber: user.drivingLicenceNumber || 'MA-2849102',
        status: 'signed',
        signedAt: new Date().toISOString(),
      });
    }
  };

  const handleSaveDriver = (driverName: string, licenceNum: string) => {
    setUserProfile((prev) => ({
      ...prev,
      hasSecondDriver: true,
      secondDriverName: driverName,
      secondDriverLicence: licenceNum,
    }));
    if (user) {
      syncUserToFirestore({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        drivingLicenceNumber: licenceNum,
        phone: user.phone,
        cin: user.cin,
      });
    }
  };

  const handleOpenDispute = (disputeTitle: string) => {
    setOpenDisputes((prev) => [...prev, disputeTitle]);
    createFirestoreDispute({
      id: `disp-${Date.now()}`,
      contractId: 'CTR-2026-0914',
      userId: user?.id || 'usr-renter',
      userName: user?.name || userProfile.fullName,
      reason: disputeTitle,
      description: 'Dispute submitted under Dahir 2026 mediation framework.',
      status: 'open',
    });
  };

  const handleSelectCarToBook = (car: SavedCar) => {
    setSelectedCarForBooking(car);
    setIsBookingFlowModalOpen(true);
  };

  const handleBookingFlowSuccess = (bookingData: {
    car: SavedCar;
    dates: string;
    totalAmount: number;
    contractNumber: string;
  }) => {
    const newTrip: PastTrip = {
      id: `trip-${Date.now()}`,
      carName: bookingData.car.name,
      city: bookingData.car.location,
      dates: bookingData.dates,
      agency: 'Mayache Cars',
      totalPrice: bookingData.totalAmount,
      currency: 'MAD',
      image: bookingData.car.image,
      status: 'Upcoming',
      contractId: bookingData.contractNumber,
    };
    setPastTrips((prev) => [newTrip, ...prev]);

    // Persist real-time to Google Cloud Firestore
    const newBookingId = `bk-${Date.now()}`;
    createFirestoreBooking({
      id: newBookingId,
      renterId: user?.id || 'usr-renter',
      renterName: user?.name || userProfile.fullName,
      renterEmail: user?.email,
      carId: bookingData.car.id,
      carTitle: bookingData.car.name,
      carCategory: 'Premium Vehicle',
      carImage: bookingData.car.image,
      pickupDate: bookingData.dates.split(' to ')[0] || new Date().toISOString().slice(0, 10),
      returnDate: bookingData.dates.split(' to ')[1] || new Date().toISOString().slice(0, 10),
      pickupCity: bookingData.car.location,
      totalDays: 3,
      pricePerDay: bookingData.car.dailyRate || 850,
      totalPrice: bookingData.totalAmount,
      depositAmount: 5000,
      status: 'confirmed',
      dahirRegistrationId: bookingData.contractNumber,
    });

    createFirestoreContract({
      id: bookingData.contractNumber,
      bookingId: newBookingId,
      renterId: user?.id || 'usr-renter',
      renterName: user?.name || userProfile.fullName,
      renterEmail: user?.email,
      carModel: bookingData.car.name,
      contractNumber: bookingData.contractNumber,
      digitalSignature: user?.name || userProfile.fullName,
      cinNumber: user?.cin || userProfile.cin || 'L-482910',
      drivingLicenceNumber: user?.drivingLicenceNumber || userProfile.drivingLicenceNumber || 'FR-9204812',
      status: 'signed',
      signedAt: new Date().toISOString(),
    });
  };

  const unreadMessagesCount = conversations.filter((c) => c.isUnread).length;

  return (
    <>
      {currentRole === 'admin' ? (
        <AdminPortal
          currentRole={currentRole}
          onSwitchRole={setCurrentRole}
        />
      ) : currentRole === 'partner' ? (
        <PartnerPortal
          currentRole={currentRole}
          onSwitchRole={setCurrentRole}
          onOpenContractPdf={(id) => setIsPdfModalOpen(true)}
          onNavigateToTab={handleTabChange}
        />
      ) : (
        <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#1a1412] font-sans selection:bg-[#f95721] selection:text-white">
          {/* 1. Global Airbcar Header (Rent, Partner, Mission, Help & FAQ) */}
          <Header
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            userName={userProfile.fullName}
            userAvatar={userProfile.avatarUrl}
            onSwitchRole={setCurrentRole}
          />

          {/* 2. Main Views */}
          <main className="flex-1 w-full">
            {/* Page 1: Rent Landing Page */}
            {activeTab === 'rent' && (
              <RentView
                savedCars={savedCars}
                onSelectCarToBook={handleSelectCarToBook}
                onNavigateTab={handleTabChange}
              />
            )}

            {/* Page: Search Cars with Map View */}
            {activeTab === 'search' && (
              <SearchView
                cars={dbCars}
                initialLocation={searchLocation}
                initialPickupDate={searchPickupDate}
                initialReturnDate={searchReturnDate}
                onSelectCarDetails={(car) => {
                  setSelectedCarForProfile(car);
                  handleTabChange('car-detail');
                }}
                onNavigateTab={handleTabChange}
                onSelectPartner={handleSelectPartner}
              />
            )}

            {/* Page: Vehicle Profile Details */}
            {activeTab === 'car-detail' && selectedCarForProfile && (
              <VehicleProfileView
                car={selectedCarForProfile}
                pickupDate={searchPickupDate}
                returnDate={searchReturnDate}
                location={searchLocation}
                onBackToSearch={() => handleTabChange('search')}
                onSelectAnotherCar={(car) => {
                  setSelectedCarForProfile(car);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectPartner={handleSelectPartner}
                onNavigateTab={handleTabChange}
                onBookNow={(car, totalDays, totalAmount) => {
                  const asSavedCar: SavedCar = {
                    id: car.id,
                    name: car.name,
                    location: car.location,
                    transmission: car.transmission,
                    seats: car.seats,
                    dailyRate: car.dailyRate,
                    image: car.images[0],
                    badge: car.category
                  };
                  setSelectedCarForBooking(asSavedCar);
                  setIsBookingFlowModalOpen(true);
                }}
              />
            )}

            {/* Page: Partner Profile (e.g. Mayache Prestige Cars - Partner #5) */}
            {activeTab === 'partner-profile' && (
              <PartnerProfileView
                partnerId={selectedPartnerId}
                onSelectCar={(car) => {
                  setSelectedCarForProfile(car);
                  setActiveTab('car-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBack={() => handleTabChange('search')}
                onNavigateTab={handleTabChange}
              />
            )}

            {/* Page 2: Partner Network Landing Page */}
            {activeTab === 'partner' && (
              <PartnerLandingView
                onNavigateTab={handleTabChange}
                onSwitchRole={setCurrentRole}
              />
            )}

            {/* Page 3: Mission Page */}
            {activeTab === 'mission' && (
              <div className="bg-[#140e0b] text-[#f5efe8]">
                <MissionView
                  onNavigateTab={handleTabChange}
                  onSwitchRole={setCurrentRole}
                />
              </div>
            )}

            {/* Page 4: Help & FAQ Center */}
            {activeTab === 'help' && (
              <HelpCenterView
                onNavigateTab={handleTabChange}
                onSwitchRole={setCurrentRole}
              />
            )}

            {/* Renter Portal & Account Pages */}
            {activeTab !== 'rent' && 
             activeTab !== 'search' && 
             activeTab !== 'car-detail' && 
             activeTab !== 'partner' && 
             activeTab !== 'partner-profile' && 
             activeTab !== 'mission' && 
             activeTab !== 'help' && (
              <div className="w-full">
                {/* Next Trip Card on Overview and Messages */}
                {(activeTab === 'overview' || activeTab === 'messages') && (
                  <NextTripCard
                    onMessageAgency={() => handleTabChange('messages')}
                    onViewTripDetails={() => setIsTripDetailsModalOpen(true)}
                    isSigned={isSigned}
                  />
                )}

                {/* Navigation Pills Group */}
                <NavigationTabs
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                  unreadMessagesCount={unreadMessagesCount}
                  awaitingSignatureCount={isSigned ? 0 : 1}
                />

                <div className="pt-2">
                  {activeTab === 'overview' && (
                    <OverviewView
                      userProfile={userProfile}
                      savedCars={savedCars}
                      pastTrips={pastTrips}
                      onNavigateTab={handleTabChange}
                      onOpenSecondDriverModal={() => setIsSecondDriverModalOpen(true)}
                      onSaveProfile={(updated) => setUserProfile(updated)}
                      onSelectCarToBook={handleSelectCarToBook}
                      onOpenPdfModal={() => setIsPdfModalOpen(true)}
                    />
                  )}

                  {activeTab === 'messages' && (
                    <MessagesView
                      conversations={conversations}
                      onOpenPdfModal={() => setIsPdfModalOpen(true)}
                      onOpenTripDetails={() => setIsTripDetailsModalOpen(true)}
                      onNavigateTab={handleTabChange}
                      onOpenDispute={() => setIsDisputeModalOpen(true)}
                    />
                  )}

                  {activeTab === 'contracts' && (
                    <ContractsView
                      isSigned={isSigned}
                      onOpenSignModal={() => setIsSignModalOpen(true)}
                      onOpenPdfModal={() => setIsPdfModalOpen(true)}
                      onOpenSecondDriverModal={() => setIsSecondDriverModalOpen(true)}
                      onNavigateTab={handleTabChange}
                      onOpenDispute={() => setIsDisputeModalOpen(true)}
                      closedContracts={closedContracts}
                    />
                  )}

                  {activeTab !== 'overview' && activeTab !== 'messages' && activeTab !== 'contracts' && (
                    <OtherTabsView
                      activeTab={activeTab}
                      savedCars={savedCars}
                      pastTrips={pastTrips}
                      userProfile={userProfile}
                      onNavigateTab={handleTabChange}
                      onSelectCarToBook={handleSelectCarToBook}
                      onOpenPdfModal={() => setIsPdfModalOpen(true)}
                      onSaveProfile={(updated) => setUserProfile(updated)}
                    />
                  )}
                </div>
              </div>
            )}
          </main>

          {/* 3. Global Airbcar Footer */}
          <Footer 
            onBrowseCars={() => handleTabChange('rent')} 
            onNavigateTab={handleTabChange}
            onSwitchRole={setCurrentRole}
          />
        </div>
      )}

      {/* Modals & Dialogs (shared across roles) */}
      <SignContractModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSignComplete={handleSignComplete}
      />

      <ContractPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        isSigned={isSigned}
      />

      <SecondDriverModal
        isOpen={isSecondDriverModalOpen}
        onClose={() => setIsSecondDriverModalOpen(false)}
        userProfile={userProfile}
        onSaveDriver={handleSaveDriver}
      />

      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onSubmitDispute={handleOpenDispute}
      />

      <TripDetailsModal
        isOpen={isTripDetailsModalOpen}
        onClose={() => setIsTripDetailsModalOpen(false)}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onMessageAgency={() => handleTabChange('messages')}
        isSigned={isSigned}
      />

      <BookingFlowModal
        isOpen={isBookingFlowModalOpen}
        onClose={() => setIsBookingFlowModalOpen(false)}
        car={selectedCarForBooking}
        userProfile={userProfile}
        onBookingSuccess={handleBookingFlowSuccess}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onUpdateProfile={setUserProfile}
      />

      {/* Global Realtime Notification Toast */}
      <NotificationToastBanner onNavigateTab={handleTabChange} />

      {/* OAuth Login & Setup Modal */}
      <OAuthModal onSwitchRole={setCurrentRole} />
    </>
  );
}
