export type AdminTab = 
  | 'overview'
  | 'analytics'
  | 'agencies'
  | 'clients'
  | 'bookings'
  | 'fleet'
  | 'disputes'
  | 'payouts'
  | 'settings';

export interface AdminKYCDoc {
  id: string;
  name: string;
  type: 'rc' | 'patente' | 'tourism_license' | 'insurance' | 'cin_passport' | 'ice' | 'bank_rib';
  status: 'verified' | 'pending' | 'rejected';
  fileUrl: string;
  uploadedAt: string;
  notes?: string;
}

export interface AdminAgency {
  id: string;
  agencyName: string;
  legalName: string; // e.g. "MAYACHE CARS SARL AU"
  tradeName: string;
  ownerName: string;
  ownerCin: string;
  ice: string; // 15-digit Identifiant Commun de l'Entreprise
  cnssNumber: string;
  city: string;
  address: string;
  headquartersAddress: string;
  phone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  managerName: string;
  managerPhone: string;
  fleetCount: number;
  activeRentals: number;
  rating: number;
  reviewCount: number;
  status: 'verified' | 'pending' | 'under_review' | 'suspended';
  commissionRatePct: number; // e.g. 15
  joinedDate: string;
  commercialRegisterRc: string; // e.g. "RC 4545/Meknès"
  courtTribunal: string;
  patenteNumber: string; // e.g. "PAT-482019"
  taxIdIf: string; // e.g. "IF 45450012"
  tourismMinistryLicense: string; // e.g. "AUT-MIN-2022/4545"
  airportDeliveryPoints: string[];
  operatingHours: string;
  bankAccount: {
    bankName: string;
    branchCity: string;
    rib: string;
    swiftBic: string;
    accountHolder: string;
  };
  kycDocuments: AdminKYCDoc[];
  totalVolumeMAD: number;
  totalPaidOutMAD: number;
  pendingPayoutMAD: number;
  cancellationRatePct: number;
  disputeRatePct: number;
  avgResponseTimeMinutes: number;
  reviewsBreakdown: {
    cleanliness: number;
    communication: number;
    carCondition: number;
    punctuality: number;
  };
  fleetBreakdown: {
    economy: number;
    suv: number;
    sedan: number;
    luxury: number;
  };
  notes: string;
}

export interface AdminClient {
  id: string;
  fullName: string;
  avatar: string;
  email: string;
  phone: string;
  whatsapp: string;
  nationality: string;
  flag: string;
  country: string;
  dateOfBirth: string;
  age: number;
  address: string;
  cinOrPassport: {
    type: 'cin' | 'passport';
    number: string;
    expiryDate: string;
    verified: boolean;
  };
  drivingLicense: {
    number: string;
    issuingCountry: string;
    issueDate: string;
    expiryDate: string;
    categories: string[];
    yearsExperience: number;
    verified: boolean;
  };
  trustScore: 'vip' | 'verified_good' | 'under_review' | 'flagged';
  totalBookings: number;
  totalSpentMAD: number;
  depositHistory: {
    totalHeldMAD: number;
    refundedFullMAD: number;
    withheldMAD: number;
  };
  disputeCount: number;
  rating: number;
  preferredCity: string;
  preferredCategory: string;
  joinedDate: string;
  activeBookingId?: string;
  notes: string;
}

export interface AdminVehicle {
  id: string;
  agencyId: string;
  agencyName: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  city: string;
  dailyRate: number;
  depositAmount: number;
  status: 'available' | 'on_trip' | 'maintenance' | 'flagged';
  isB2bEligible: boolean;
  isFeatured: boolean;
  image: string;
  images?: string[];
  rating: number;
  tripsCount: number;
  insuranceExpiry: string;
  technicalInspectionDate: string;
  complianceStatus: 'compliant' | 'inspection_due' | 'flagged';
}

export interface BookingFlowStep {
  step: number; // 1 to 8
  name: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending' | 'disputed';
  actor: 'client' | 'agency' | 'platform_escrow' | 'driver';
  details?: Record<string, any>;
}

export interface BookingAttachedDocument {
  id: string;
  type: 'contract_pdf' | 'cin_passport' | 'driving_license' | 'insurance_policy' | 'inspection_handover';
  title: string;
  subtitle: string;
  documentNumber?: string;
  fileUrl?: string;
  previewImage?: string;
  status: 'verified' | 'signed' | 'valid';
  sizeKb: number;
  uploadedAt: string;
}

export interface AdminBooking {
  id: string;
  bookingNumber: string; // e.g. "AC-2418"
  agencyId: string;
  agencyName: string;
  clientId: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  renterCountry: string;
  renterFlag: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePlate: string;
  vehicleImage: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
  flightNumber?: string;
  city: string;
  totalAmountMAD: number;
  escrowDepositMAD: number;
  platformCommissionMAD: number;
  agencyNetMAD: number;
  status: 'confirmed' | 'on_trip' | 'completed' | 'disputed' | 'cancelled';
  escrowStatus: 'held' | 'released_to_renter' | 'partially_deducted' | 'disputed_freeze';
  createdAt: string;

  // Comprehensive booking flow telemetry & details
  deviceInfo: {
    channel: 'web' | 'mobile_app' | 'partner_b2b';
    ipAddress: string;
    userAgent: string;
    geoCity: string;
  };
  paymentDetails: {
    method: 'cmi_morocco' | 'visa_mastercard' | 'apple_pay' | 'cash_arrival';
    gatewayTransactionId: string;
    authCode: string;
    cardLast4: string;
    cardBrand: string;
    escrowAccountNumber: string;
    paidAt: string;
  };
  digitalContract: {
    contractNumber: string;
    signedAt: string;
    signMethod: 'sms_otp' | 'digital_canvas';
    sha256Hash: string;
    hasSecondDriver: boolean;
    secondDriverName?: string;
    secondDriverLicense?: string;
  };
  checkInInspection: {
    completedAt: string;
    agentName: string;
    initialMileageKm: number;
    initialFuelLevel: string;
    photos: { url: string; angle: string }[];
    notes: string;
  };
  checkOutInspection?: {
    completedAt?: string;
    agentName?: string;
    returnMileageKm?: number;
    returnFuelLevel?: string;
    photos?: { url: string; angle: string }[];
    conditionVerdict?: 'clean_perfect' | 'minor_scuff' | 'damage_claim';
    notes?: string;
  };
  escrowResolution: {
    depositAmountMAD: number;
    refundedAmountMAD: number;
    deductedAmountMAD: number;
    deductionReason?: string;
    releasedAt?: string;
    transactionRef?: string;
  };
  flowTimeline: BookingFlowStep[];
  documents?: BookingAttachedDocument[];
}

export interface AdminDispute {
  id: string;
  disputeNumber: string;
  bookingNumber: string;
  agencyId: string;
  agencyName: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  vehicleName: string;
  vehiclePlate: string;
  amountInDisputeMAD: number;
  dateOpened: string;
  status: 'open' | 'under_investigation' | 'resolved' | 'escalated';
  issueType: 'deposit_deduction' | 'damage_claim' | 'cancellation_fee' | 'pickup_delay' | 'fuel_mileage';
  renterClaim: string;
  agencyClaim: string;
  evidencePhotos: {
    url: string;
    caption: string;
    uploadedBy: 'renter' | 'agency';
  }[];
  verdict?: 'refund_renter' | 'release_to_agency' | 'split_50_50' | 'arbitration';
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AdminPayoutItem {
  agencyId: string;
  agencyName: string;
  rib: string;
  bankName: string;
  grossVolumeMAD: number;
  commissionMAD: number;
  netPayoutMAD: number;
  tripsCount: number;
  status: 'pending' | 'approved' | 'settled';
}

export interface AdminPayoutBatch {
  id: string;
  batchNumber: string;
  period: string;
  totalAmountMAD: number;
  totalCommissionMAD: number;
  agenciesCount: number;
  status: 'draft' | 'approved' | 'processing' | 'settled';
  createdAt: string;
  executedAt?: string;
  items: AdminPayoutItem[];
}

export interface PlatformSettings {
  platformCommissionPct: number;
  minimumDepositMAD: number;
  minimumRenterAge: number;
  disputeResolutionWindowHours: number;
  instantPayoutThresholdMAD: number;
  maintenanceMode: boolean;
  activeCities: {
    city: string;
    region: string;
    enabled: boolean;
    agenciesCount: number;
    vehiclesCount: number;
  }[];
}
