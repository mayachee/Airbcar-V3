export type PartnerTab = 
  | 'dashboard'
  | 'vehicles'
  | 'bookings'
  | 'car-sharing'
  | 'messages'
  | 'earnings'
  | 'analytics'
  | 'calendar'
  | 'reviews'
  | 'policies'
  | 'profile'
  | 'settings';

export type UserRole = 'renter' | 'partner' | 'admin';

export interface PartnerProfile {
  id: string;
  agencyName: string;
  ownerName: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  fleetCount: number;
  rating: number;
  reviewCount: number;
  replySpeedMinutes: number;
  replySpeedRank: string;
  isVerified: boolean;
  licenseNumber: string;
  taxId?: string;
  businessType?: string;
  description?: string;
  stateRegion?: string;
  logoUrl?: string;
  verificationStatus?: 'Pending' | 'Verified' | 'Under Review';
  bankAccount: {
    bankName: string;
    rib: string;
    accountHolder: string;
  };
}

export interface PartnerVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  dailyRate: number;
  depositAmount: number;
  city: string;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Diesel' | 'Petrol' | 'Hybrid';
  seats: number;
  status: 'available' | 'on_trip' | 'maintenance' | 'blackout';
  isB2bEligible: boolean;
  image: string;
  images?: string[];
  rating: number;
  tripsCount: number;
  blackoutDates?: { id: string; start: string; end: string; reason: string }[];
}

export interface PartnerBooking {
  id: string;
  bookingNumber: string; // e.g. AC-2418
  renter: {
    id: string;
    fullName: string;
    avatarInitials: string;
    country: string;
    tripsCount: number;
    phone: string;
    email: string;
    licenseStatus: 'Verified' | 'Pending';
    licenseVerifiedDate: string;
    languages: string;
  };
  vehicle: {
    id: string;
    name: string;
    year: number;
    plate: string;
    image: string;
  };
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  deliveryLocation: string;
  totalMAD: number;
  depositMAD: number;
  status: 'pending' | 'confirmed' | 'on_trip' | 'completed' | 'cancelled' | 'disputed';
  contractSent: boolean;
  contractSigned: boolean;
  contractPdfUrl?: string;
  deliveryConfirmed: boolean;
  createdAt: string;
}

export interface PartnerChatMessage {
  id: string;
  sender: 'partner' | 'renter' | 'system';
  senderName: string;
  time: string;
  timestamp: string;
  text: string;
  isRead: boolean;
  attachment?: {
    type: 'pdf' | 'image';
    fileName: string;
    fileSize?: string;
    url?: string;
  };
}

export interface PartnerConversation {
  id: string;
  renterId: string;
  renterName: string;
  renterCountry: string;
  renterTripsCount: number;
  renterLicenseVerified: boolean;
  avatarInitials: string;
  avatarColor?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  category: 'needs_you' | 'upcoming' | 'on_trip' | 'closed';
  tag?: string; // e.g. "AC-2418 • Golf"
  pickupTag?: string; // e.g. "Picks up 3 Sep"
  bookingId?: string;
  messages: PartnerChatMessage[];
}

export interface SavedReply {
  id: string;
  title: string;
  content: string;
  shortcut?: string;
}

export interface B2BCarShare {
  id: string;
  requestNumber: string;
  targetAgencyName: string;
  targetAgencyCity: string;
  vehicleName: string;
  vehiclePlate: string;
  dailyRateMAD: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'active' | 'returned' | 'cancelled';
  inspections: {
    id: string;
    type: 'pickup' | 'return';
    odometerKm: number;
    fuelLevel: string; // e.g. "8/8 Full"
    photosCount: number;
    notes: string;
    date: string;
    inspectorName: string;
  }[];
}

export interface PartnerEarnings {
  currentMonthRevenueMAD: number;
  netPayoutMAD: number;
  airbcarFeeMAD: number;
  heldDepositsMAD: number;
  nextPayoutDate: string;
  payoutStatus: 'Pending payout' | 'Processing' | 'Paid';
  recentPayouts: {
    id: string;
    period: string;
    amountMAD: number;
    date: string;
    status: 'Paid' | 'Processing';
    transferRef: string;
  }[];
}

export interface PartnerReview {
  id: string;
  renterName: string;
  renterAvatar: string;
  rating: number;
  vehicleName: string;
  date: string;
  comment: string;
  partnerResponse?: {
    text: string;
    date: string;
  };
}
