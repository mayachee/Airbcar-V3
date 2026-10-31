export type ActiveTab = 
  | 'rent'
  | 'search'
  | 'car-detail'
  | 'partner-profile'
  | 'partner'
  | 'mission'
  | 'help'
  | 'overview' 
  | 'my-trips' 
  | 'contracts' 
  | 'saved-cars' 
  | 'documents' 
  | 'payments' 
  | 'messages' 
  | 'settings';

export interface PartnerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  carRented: string;
  comment: string;
  verified: boolean;
}

export interface PartnerProfileData {
  id: string;
  name: string;
  tradingName: string;
  licenseNumber: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  rating: number;
  reviewCount: number;
  completedTrips: number;
  responseRate: string;
  responseTime: string;
  zeroDisputeRate: string;
  foundedYear: number;
  coverImage: string;
  logo: string;
  bio: string;
  manifesto: string;
  operatingHours: string;
  airportDelivery: string[];
  features: string[];
  reviews: PartnerReview[];
}

export interface CarListing {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: 'Sedan' | 'SUV' | 'Convertible' | 'City' | '4x4' | 'Coupe' | 'Family';
  location: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewsCount: number;
  seats: number;
  doors: number;
  transmission: 'automatic' | 'manual';
  fuel: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  airConditioning: boolean;
  dailyRate: number;
  currency: string;
  images: string[];
  agency: {
    id?: string;
    name: string;
    city: string;
    verified: boolean;
    rating: number;
    completedTrips: number;
    phone: string;
    address: string;
  };
  features: string[];
  depositAmount: number;
  minAge: number;
  mileageLimit: string;
  description: string;
}

export interface SearchFilters {
  location: string;
  pickupDate: string;
  returnDate: string;
  pickupTime?: string;
  returnTime?: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: 'all' | 'automatic' | 'manual';
  fuel?: 'all' | 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'popular';
}

export interface SavedCar {
  id: string;
  name: string;
  location: string;
  transmission: string;
  seats: number;
  dailyRate: number;
  image: string;
  badge?: string;
}

export interface PastTrip {
  id: string;
  carName: string;
  city: string;
  dates: string;
  agency: string;
  totalPrice: number;
  currency: string;
  image: string;
  status: 'Completed' | 'Review pending' | 'Upcoming';
  invoiceUrl?: string;
  contractId: string;
}

export interface ContractRecord {
  id: string;
  vehicle: string;
  agency: string;
  city: string;
  dates: string;
  total: number;
  currency: string;
  depositStatus: 'Refunded' | 'Held' | 'Awaiting signature';
  documentName: string;
  hasPdf: boolean;
}

export interface MessageItem {
  id: string;
  sender: 'agency' | 'user';
  senderName: string;
  time: string;
  timestamp: string;
  text: string;
  isRead?: boolean;
  attachments?: {
    type: 'pdf' | 'map' | 'image';
    title: string;
    details?: string;
    url?: string;
  }[];
}

export interface Conversation {
  id: string;
  agencyName: string;
  city: string;
  avatarLetter: string;
  avatarColor: string;
  lastMessage: string;
  lastMessageTime: string;
  isUnread?: boolean;
  type: 'agency' | 'support';
  bookingTag?: string;
  responseSpeed: string;
  vehicleDetails: {
    name: string;
    agency: string;
    city: string;
    transmission: string;
    dates: string;
    pickup: string;
    returnDate: string;
    totalDays: number;
    totalAmount: string;
    image: string;
    contractId: string;
  };
  messages: MessageItem[];
  sharedFiles: {
    type: 'pdf' | 'pin';
    title: string;
    date: string;
  }[];
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  city?: string;
  cinNumber?: string;
  licenceExpiry: string;
  daysLeft: number;
  isVerified: boolean;
  hasLicenseUploaded?: boolean;
  licenseStatus?: 'verified' | 'pending' | 'missing';
  drivingLicenceNumber?: string;
  licenseFrontUrl?: string | null;
  licenseBackUrl?: string | null;
  hasSecondDriver: boolean;
  secondDriverName?: string;
  secondDriverLicence?: string;
}
