/**
 * Real Moroccan Test Data for Airbcar Platform
 * Full compliance with Moroccan Dahir 2026 regulations
 * Includes authentic license plates, CINs, phone numbers, MAD rates, and legal mediation workflows.
 */

export interface RealTestUser {
  uid: string;
  name: string;
  email: string;
  role: 'renter' | 'partner' | 'admin';
  phone: string;
  cin: string;
  drivingLicenceNumber?: string;
  avatar: string;
  agencyName?: string;
  verified: boolean;
  city: string;
  description: string;
}

export interface RealTestCar {
  id: string;
  title: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  plate: string;
  city: string;
  location: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewsCount: number;
  seats: number;
  doors: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  dailyRate: number;
  pricePerDay: number;
  currency: string;
  depositAmount: number;
  minAge: number;
  mileageLimit: string;
  images: string[];
  imageUrl: string;
  features: string[];
  agencyId: string;
  agencyName: string;
  agencyPhone: string;
  description: string;
  isAvailable: boolean;
  isFeatured?: boolean;
}

export interface RealTestBooking {
  id: string;
  renterId: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  carId: string;
  carTitle: string;
  carCategory: string;
  carImage: string;
  carPlate: string;
  pickupDate: string;
  returnDate: string;
  pickupCity: string;
  pickupLocation: string;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  depositAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  dahirRegistrationId: string;
  agencyName: string;
  agencyId: string;
  contractId: string;
  paymentStatus: 'paid' | 'escrow_held' | 'refunded';
  createdAt: string;
}

export interface RealTestContract {
  id: string;
  bookingId: string;
  contractNumber: string;
  renterId: string;
  renterName: string;
  renterEmail: string;
  cinNumber: string;
  drivingLicenceNumber: string;
  carModel: string;
  carPlate: string;
  agencyName: string;
  status: 'draft' | 'signed' | 'active' | 'closed';
  signedAt: string;
  digitalSignature: string;
  escrowDepositMAD: number;
  inspectionChecklist: {
    fuelLevel: string;
    mileageKm: number;
    exteriorCondition: string;
    spareWheelPresent: boolean;
    registrationCardPresent: boolean;
  };
}

export interface RealTestDispute {
  id: string;
  bookingId: string;
  contractId: string;
  userId: string;
  userName: string;
  userEmail: string;
  agencyName: string;
  reason: string;
  description: string;
  amountMAD: number;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
  createdAt: string;
}

export interface RealTestMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'renter' | 'partner' | 'admin';
  text: string;
  timestamp: string;
}

// -------------------------------------------------------------
// 1. 10 REAL PARTNERS (AGENCIES) & 10 REAL USERS (RENTERS) + 1 ADMIN
// -------------------------------------------------------------

export interface PartnerAgencyInfo {
  id: string;
  agencyName: string;
  ownerName: string;
  email: string;
  phone: string;
  cin: string;
  city: string;
  address: string;
  licenseNumber: string;
  avatar: string;
  description: string;
  coordinates: { lat: number; lng: number };
}

export const REAL_TEST_PARTNERS: PartnerAgencyInfo[] = [
  {
    id: 'partner-1-mayache',
    agencyName: 'Mayache Prestige Cars',
    ownerName: 'Yassine Ayache',
    email: 'partner@mayachecars.ma',
    phone: '+212 696 14 51 03',
    cin: 'V349120',
    city: 'Tetouan',
    address: 'Boulevard Mohamed V, Imm. Al Andalous, Tetouan',
    licenseNumber: 'DAHIR-2026-TTU-0058',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    description: 'Premier luxury & SUV rental agency in northern Morocco. Certified Dahir 2026 partner.',
    coordinates: { lat: 35.5785, lng: -5.3684 },
  },
  {
    id: 'partner-2-atlas',
    agencyName: 'Atlas Drive Casablanca',
    ownerName: 'Hassan El Amrani',
    email: 'contact@atlasdrive-casa.ma',
    phone: '+212 522 29 11 00',
    cin: 'BK39102',
    city: 'Casablanca',
    address: 'Boulevard d\'Anfa & Casablanca Finance City',
    licenseNumber: 'DAHIR-2026-CAS-0142',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    description: 'Corporate and business vehicle fleet at Mohammed V International Airport & CFC.',
    coordinates: { lat: 33.5731, lng: -7.5898 },
  },
  {
    id: 'partner-3-menara',
    agencyName: 'Menara Luxury Motors',
    ownerName: 'Tariq Berrada',
    email: 'info@menaramotors-kech.ma',
    phone: '+212 524 43 20 10',
    cin: 'EE48190',
    city: 'Marrakech',
    address: 'Avenue Mohammed VI, Hivernage, Marrakech',
    licenseNumber: 'DAHIR-2026-RAK-0089',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    description: 'Specializing in premium SUVs, sports cars and desert tourers across Marrakech and Agafay.',
    coordinates: { lat: 31.6295, lng: -7.9811 },
  },
  {
    id: 'partner-4-souss',
    agencyName: 'Souss Atlantic Mobility',
    ownerName: 'Brahim Oubella',
    email: 'contact@souss-mobility.ma',
    phone: '+212 528 84 10 20',
    cin: 'J510293',
    city: 'Agadir',
    address: 'Boulevard du 20 Août, Zone Touristique, Agadir',
    licenseNumber: 'DAHIR-2026-AGA-0211',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    description: 'Beach, coastal & surf adventure vehicles delivered at Al Massira Airport and Taghazout Bay.',
    coordinates: { lat: 30.4278, lng: -9.5981 },
  },
  {
    id: 'partner-5-strait',
    agencyName: 'Strait of Gibraltar Fleet',
    ownerName: 'Zouhair Chraibi',
    email: 'z.chraibi@straitfleet-tanger.ma',
    phone: '+212 539 33 44 55',
    cin: 'K440192',
    city: 'Tangier',
    address: 'Place des Nations & Tanger City Center',
    licenseNumber: 'DAHIR-2026-TNG-0095',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    description: 'Executive sedan & coastal fleet serving Ibn Battouta Airport and Port Tanger Med.',
    coordinates: { lat: 35.7595, lng: -5.8340 },
  },
  {
    id: 'partner-6-capital',
    agencyName: 'Capital Executive Car',
    ownerName: 'Laila Benjelloun',
    email: 'laila@capitalexecutive-rabat.ma',
    phone: '+212 537 77 88 99',
    cin: 'A910283',
    city: 'Rabat',
    address: 'Avenue de la Victoire, Hassan, Rabat',
    licenseNumber: 'DAHIR-2026-RAB-0118',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    description: 'Official diplomatic and business fleet services across Rabat, Salé, and Temara.',
    coordinates: { lat: 34.0209, lng: -6.8416 },
  },
  {
    id: 'partner-7-imperial',
    agencyName: 'Imperial Wheels Fes',
    ownerName: 'Driss Fassi-Fihri',
    email: 'contact@imperialwheels-fes.ma',
    phone: '+212 535 62 14 00',
    cin: 'C782019',
    city: 'Fes',
    address: 'Avenue Hassan II, Ville Nouvelle, Fes',
    licenseNumber: 'DAHIR-2026-FEZ-0074',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    description: 'Modern fleet covering the cultural capital, Fes-Saïss Airport, and Middle Atlas routes.',
    coordinates: { lat: 34.0331, lng: -5.0003 },
  },
  {
    id: 'partner-8-rifexpress',
    agencyName: 'Rif Express Location',
    ownerName: 'Mohamed Bouanani',
    email: 'm.bouanani@rifexpress.ma',
    phone: '+212 536 60 12 34',
    cin: 'S491028',
    city: 'Nador',
    address: 'Avenue Hassan I, Nador Centre',
    licenseNumber: 'DAHIR-2026-NDR-0033',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    description: '4x4 utility and family vehicles serving Nador Al Aroui Airport and Beni Ensar port.',
    coordinates: { lat: 35.1688, lng: -2.9335 },
  },
  {
    id: 'partner-9-oriental',
    agencyName: 'Oriental Prestige Drive',
    ownerName: 'Abdelkader Mansouri',
    email: 'contact@oriental-drive.ma',
    phone: '+212 536 68 99 00',
    cin: 'F310291',
    city: 'Oujda',
    address: 'Boulevard Mohammed V, Oujda',
    licenseNumber: 'DAHIR-2026-OUD-0062',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    description: 'Comfortable road trip sedans and SUVs serving eastern Morocco and Angads Airport.',
    coordinates: { lat: 34.6814, lng: -1.9086 },
  },
  {
    id: 'partner-10-medina',
    agencyName: 'Medina Auto Meknès',
    ownerName: 'Soufiane Belkadi',
    email: 'direction@medina-auto-meknes.ma',
    phone: '+212 535 52 30 00',
    cin: 'M810293',
    city: 'Meknès',
    address: 'Avenue des F.A.R, Hamria, Meknès',
    licenseNumber: 'DAHIR-2026-MEK-0047',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    description: 'Reliable, economical and family vehicles for exploring Volubilis, Moulay Idriss, and Meknès.',
    coordinates: { lat: 33.8938, lng: -5.5516 },
  }
];

// 10 RENTER PROFILES + 10 PARTNER PROFILES + 1 HQ ADMIN
export const REAL_TEST_USERS: RealTestUser[] = [
  // 1. Exclusive Admin
  {
    uid: 'usr-admin-exclusive',
    name: 'Yassine Ayache (HQ Superadmin)',
    email: 'ayacheyassine2000@gmail.com',
    role: 'admin',
    phone: '+212 661 28 49 50',
    cin: 'HQ-99001',
    drivingLicenceNumber: 'MA-1002931',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Rabat HQ',
    description: 'Sole verified administrator for Morocco Drive & Airbcar Dahir 2026 platform governance',
  },

  // 10 Verified Renters
  {
    uid: 'usr-renter-1',
    name: 'Camille Dubois',
    email: 'camille.d@mail.com',
    role: 'renter',
    phone: '+212 6 12 34 56 78',
    cin: 'L-849201',
    drivingLicenceNumber: 'FR-9204812',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Tetouan',
    description: 'Verified international traveler with French biometric licence and active contract in Tetouan',
  },
  {
    uid: 'usr-renter-2',
    name: 'Mehdi Bennani',
    email: 'mehdi.bennani@gmail.com',
    role: 'renter',
    phone: '+212 661 44 88 12',
    cin: 'BK64019',
    drivingLicenceNumber: 'MA-1920481',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Casablanca',
    description: 'Casablanca tech founder, frequent executive car renter at Mohammed V Airport',
  },
  {
    uid: 'usr-renter-3',
    name: 'Sarah Alami',
    email: 'sarah.alami@gmail.com',
    role: 'renter',
    phone: '+212 662 99 11 33',
    cin: 'BE89214',
    drivingLicenceNumber: 'MA-8841029',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Rabat',
    description: 'Corporate consultant booking executive vehicles across Rabat and Marrakech',
  },
  {
    uid: 'usr-renter-4',
    name: 'Karim Tazi',
    email: 'karim.tazi@gmail.com',
    role: 'renter',
    phone: '+212 663 55 22 77',
    cin: 'EE78120',
    drivingLicenceNumber: 'MA-5541092',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Agadir',
    description: 'Verified driver touring the Souss-Massa region, Taghazout, and Atlantic coastal routes',
  },
  {
    uid: 'usr-renter-5',
    name: 'Omar El Fassi',
    email: 'omar.elfassi@gmail.com',
    role: 'renter',
    phone: '+212 664 12 34 56',
    cin: 'K512930',
    drivingLicenceNumber: 'MA-6201948',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Tangier',
    description: 'Northern Morocco traveler renting performance vehicles for Tangier and Chefchaouen',
  },
  {
    uid: 'usr-renter-6',
    name: 'Fatim-Zahra Benjelloun',
    email: 'f.benjelloun@gmail.com',
    role: 'renter',
    phone: '+212 665 77 88 99',
    cin: 'A749102',
    drivingLicenceNumber: 'MA-3109284',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Rabat',
    description: 'Senior finance manager traveling between Rabat ministries and Casablanca headquarters',
  },
  {
    uid: 'usr-renter-7',
    name: 'Amine Chraibi',
    email: 'amine.chraibi@gmail.com',
    role: 'renter',
    phone: '+212 666 33 22 11',
    cin: 'EE90214',
    drivingLicenceNumber: 'MA-4491023',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Marrakech',
    description: 'Creative producer hiring luxury SUVs for desert expeditions in Agafay and Ouarzazate',
  },
  {
    uid: 'usr-renter-8',
    name: 'Sofia Andersson',
    email: 'sofia.andersson@gmail.com',
    role: 'renter',
    phone: '+46 70 123 45 67',
    cin: 'PASS-SE-9284102',
    drivingLicenceNumber: 'SE-9102834',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Agadir / Taghazout',
    description: 'Swedish surfer traveling the Atlantic coastline from Taghazout to Imsouane and Essaouira',
  },
  {
    uid: 'usr-renter-9',
    name: 'Lucas Martin',
    email: 'lucas.martin@gmail.com',
    role: 'renter',
    phone: '+33 6 45 67 89 01',
    cin: 'PASS-FR-7810293',
    drivingLicenceNumber: 'FR-4410293',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Fes',
    description: 'Documentary photographer traveling through imperial medinas, Meknès, and cedar forests',
  },
  {
    uid: 'usr-renter-10',
    name: 'Zineb Boukhriss',
    email: 'zineb.boukhriss@gmail.com',
    role: 'renter',
    phone: '+212 667 99 00 22',
    cin: 'BK88120',
    drivingLicenceNumber: 'MA-7740192',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    verified: true,
    city: 'Casablanca',
    description: 'Business attorney with verified Dahir 2026 profile for quick airport handovers',
  },

  // 10 Partner Agency Accounts
  ...REAL_TEST_PARTNERS.map(p => ({
    uid: p.id,
    name: `${p.ownerName} (${p.agencyName})`,
    email: p.email,
    role: 'partner' as const,
    phone: p.phone,
    cin: p.cin,
    drivingLicenceNumber: `MA-${p.cin}01`,
    avatar: p.avatar,
    agencyName: p.agencyName,
    verified: true,
    city: p.city,
    description: p.description,
  }))
];

// -------------------------------------------------------------
// 2. 50 VEHICLES (10 PARTNERS x 5 VEHICLES EACH)
// -------------------------------------------------------------

interface RawVehicleSpec {
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  plate: string;
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  dailyRate: number;
  depositAmount: number;
  image: string;
  features: string[];
}

const PARTNER_FLEET_SPECS: Record<string, RawVehicleSpec[]> = {
  'partner-1-mayache': [
    {
      name: 'Mercedes-Benz C-Class AMG Line 2024',
      brand: 'Mercedes-Benz',
      model: 'C-Class AMG Line',
      year: 2024,
      category: 'Sedan',
      plate: '18392-D-1',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 950,
      depositAmount: 7000,
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
      features: ['AMG Line Exterior', 'Burmester 3D Sound', 'MBUX Augmented Navigation', 'Panoramic Roof', 'Heated Leather'],
    },
    {
      name: 'Range Rover Velar R-Dynamic 2024',
      brand: 'Land Rover',
      model: 'Velar R-Dynamic D300',
      year: 2024,
      category: 'SUV',
      plate: '54120-B-72',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 1600,
      depositAmount: 12000,
      image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1000&q=80',
      features: ['Terrain Response 2', 'Air Suspension', 'Meridian Sound', 'Matrix LED Headlights', '360 Camera'],
    },
    {
      name: 'Honda Civic Type R 2024',
      brand: 'Honda',
      model: 'Civic Type R (FL5)',
      year: 2024,
      category: 'Sedan',
      plate: '24589-A-40',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 900,
      depositAmount: 5000,
      image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=1000&q=80',
      features: ['Brembo Brakes', 'Apple CarPlay & Android Auto', 'Digital Cockpit', 'Dual-Zone Climate', 'Sport Exhaust'],
    },
    {
      name: 'Volkswagen Golf 8 R-Line 2025',
      brand: 'Volkswagen',
      model: 'Golf 8 R-Line 2.0 TDI',
      year: 2025,
      category: 'City',
      plate: '4218-A-40',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 600,
      depositAmount: 3000,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      features: ['R-Line Interior', 'Digital Cockpit Pro', 'IQ.LIGHT Matrix LED', 'Keyless Access', 'Parking Sensors'],
    },
    {
      name: 'BMW 420i Gran Coupé 2024',
      brand: 'BMW',
      model: '420i M Sport Gran Coupé',
      year: 2024,
      category: 'Sedan',
      plate: '77321-A-40',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 850,
      depositAmount: 5000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
      features: ['M Sport Package', 'Harman Kardon Audio', 'BMW Curved Display', 'Ambient Lighting', 'Wireless Charging'],
    }
  ],
  'partner-2-atlas': [
    {
      name: 'Audi A6 40 TDI S-Line 2024',
      brand: 'Audi',
      model: 'A6 40 TDI S-Line',
      year: 2024,
      category: 'Sedan',
      plate: '61092-B-1',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 750,
      depositAmount: 4000,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
      features: ['Virtual Cockpit', 'Bang & Olufsen 3D', 'Matrix LED', 'Leather Seats', 'Quattro Drive'],
    },
    {
      name: 'Peugeot 208 GT PureTech 2024',
      brand: 'Peugeot',
      model: '208 GT 130 EAT8',
      year: 2024,
      category: 'City',
      plate: '45129-A-1',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 420,
      depositAmount: 2500,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      features: ['3D i-Cockpit', 'Full LED Lighting', 'Rear Camera', 'Apple CarPlay', 'Eco PureTech'],
    },
    {
      name: 'Cupra Formentor VZ 2024',
      brand: 'Cupra',
      model: 'Formentor VZ 2.0 TSI',
      year: 2024,
      category: 'SUV',
      plate: '93810-B-1',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 780,
      depositAmount: 4500,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      features: ['Brembo Brakes', 'BeatsAudio', 'Bucket Seats', 'Drive Profile Select', 'Digital Cockpit'],
    },
    {
      name: 'Mercedes-Benz E-Class 220d 2024',
      brand: 'Mercedes-Benz',
      model: 'E 220 d Avantgarde',
      year: 2024,
      category: 'Sedan',
      plate: '10923-D-1',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 1300,
      depositAmount: 8000,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
      features: ['MBUX Superscreen', 'Air Body Control', 'Burmester Audio', 'Driving Assistance Plus', 'Nappa Leather'],
    },
    {
      name: 'Renault Clio 5 Intens 2024',
      brand: 'Renault',
      model: 'Clio 5 TCe 90',
      year: 2024,
      category: 'City',
      plate: '71923-A-1',
      transmission: 'manual',
      fuelType: 'gasoline',
      dailyRate: 350,
      depositAmount: 2000,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      features: ['Easy Link 7"', 'Eco Mode', 'Speed Limiter', 'Park Assist', 'Air Conditioning'],
    }
  ],
  'partner-3-menara': [
    {
      name: 'Porsche Macan GTS 2024',
      brand: 'Porsche',
      model: 'Macan GTS V6 440ch',
      year: 2024,
      category: 'SUV',
      plate: '33910-D-26',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 2200,
      depositAmount: 18000,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      features: ['Sport Chrono Package', 'Air Suspension PASM', 'BOSE Surround Sound', 'Sports Exhaust', 'Panoramic Sunroof'],
    },
    {
      name: 'Range Rover Sport Dynamic 2024',
      brand: 'Land Rover',
      model: 'Sport Dynamic SE D300',
      year: 2024,
      category: 'SUV',
      plate: '88201-B-26',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 2400,
      depositAmount: 20000,
      image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1000&q=80',
      features: ['Dynamic Air Suspension', 'Meridian Sound System', 'Pixel LED Headlights', 'Heated & Ventilated Seats', 'Terrain Response'],
    },
    {
      name: 'BMW X5 xDrive30d 2024',
      brand: 'BMW',
      model: 'X5 xDrive30d M Sport',
      year: 2024,
      category: 'SUV',
      plate: '51290-A-26',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 1800,
      depositAmount: 14000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80',
      features: ['xDrive All-Wheel', 'Harman Kardon Audio', 'Sky Lounge Panoramic Roof', 'Live Cockpit Professional', 'Comfort Access'],
    },
    {
      name: 'Mercedes-Benz GLA 200 AMG 2024',
      brand: 'Mercedes-Benz',
      model: 'GLA 200 AMG Line',
      year: 2024,
      category: 'SUV',
      plate: '40912-A-26',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 850,
      depositAmount: 5000,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
      features: ['AMG Body Styling', 'MBUX Widescreen Cockpit', 'LED High Performance Lights', 'Active Park Assist', 'Ambient Lighting'],
    },
    {
      name: 'Fiat 500 Hybrid Dolcevita 2024',
      brand: 'Fiat',
      model: '500 Hybrid Dolcevita',
      year: 2024,
      category: 'City',
      plate: '19820-A-26',
      transmission: 'manual',
      fuelType: 'hybrid',
      dailyRate: 380,
      depositAmount: 2000,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
      features: ['Glass Roof', 'Uconnect 7" Touchscreen', 'Eco Hybrid System', 'Chrome Package', 'Cruise Control'],
    }
  ],
  'partner-4-souss': [
    {
      name: 'Mercedes-AMG GT Coupe 2023',
      brand: 'Mercedes-Benz',
      model: 'AMG GT Coupe Bi-Turbo',
      year: 2023,
      category: 'Coupe',
      plate: '1154-A-33',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 1880,
      depositAmount: 15000,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
      features: ['AMG V8 Biturbo', 'Switchable Performance Exhaust', 'Burmester Audio', 'Ceramic Brakes', 'Sport Seats'],
    },
    {
      name: 'Jeep Wrangler Sahara Unlimited 2024',
      brand: 'Jeep',
      model: 'Wrangler Sahara 4x4 (JL)',
      year: 2024,
      category: '4x4',
      plate: '38102-A-33',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 950,
      depositAmount: 5000,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
      features: ['Command-Trac 4x4', 'Removable Freedom Hardtop', 'Alpine 9-Speaker Audio', 'Heavy Duty Suspension', 'Surf Rack'],
    },
    {
      name: 'Toyota Land Cruiser Prado 2024',
      brand: 'Toyota',
      model: 'Prado VX 2.8 D-4D',
      year: 2024,
      category: '4x4',
      plate: '29103-B-33',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 1400,
      depositAmount: 9000,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
      features: ['Multi-Terrain Select', 'Kinetic Suspension', 'JBL Premium Audio', 'Crawl Control', '7 Passenger Seating'],
    },
    {
      name: 'Dacia Duster 4x4 Prestige 2024',
      brand: 'Dacia',
      model: 'Duster Prestige 4x4 dCi',
      year: 2024,
      category: '4x4',
      plate: '88219-A-33',
      transmission: 'manual',
      fuelType: 'diesel',
      dailyRate: 450,
      depositAmount: 3000,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
      features: ['Mechanical 4x4 Lock', 'High Ground Clearance', 'Hill Descent Control', 'Roof Bars', 'Economical dCi'],
    },
    {
      name: 'Hyundai Tucson N-Line 2024',
      brand: 'Hyundai',
      model: 'Tucson N-Line 1.6 CRDi',
      year: 2024,
      category: 'SUV',
      plate: '62940-A-33',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 650,
      depositAmount: 3500,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      features: ['N-Line Sport Styling', 'KRELL Sound System', 'Panoramic Glass Roof', 'Dual 10.25" Screens', 'Blind Spot Monitor'],
    }
  ],
  'partner-5-strait': [
    {
      name: 'BMW M4 Competition 2024',
      brand: 'BMW',
      model: 'M4 Competition Coupé',
      year: 2024,
      category: 'Coupe',
      plate: '11029-A-40',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 1250,
      depositAmount: 10000,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80',
      features: ['M xDrive System', 'Carbon Fiber Roof', 'Harman Kardon Audio', 'M Differential', 'Head-Up Display'],
    },
    {
      name: 'Audi Q5 40 TDI S-Line 2024',
      brand: 'Audi',
      model: 'Q5 40 TDI S-Line Quattro',
      year: 2024,
      category: 'SUV',
      plate: '78201-B-40',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 1100,
      depositAmount: 7000,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
      features: ['Quattro All-Wheel Drive', 'Audi Virtual Cockpit', 'Matrix LED Lights', 'Panoramic Sunroof', 'Power Tailgate'],
    },
    {
      name: 'Volkswagen Touareg R-Line 2024',
      brand: 'Volkswagen',
      model: 'Touareg R-Line 3.0 V6 TDI',
      year: 2024,
      category: 'SUV',
      plate: '49102-D-40',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 1500,
      depositAmount: 10000,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      features: ['Innovision Cockpit', 'Air Suspension with Rear Steer', 'Dynaudio Consequence', 'IQ.LIGHT Matrix', 'Night Vision'],
    },
    {
      name: 'SEAT Leon FR 2024',
      brand: 'SEAT',
      model: 'Leon FR 2.0 TDI DSG',
      year: 2024,
      category: 'City',
      plate: '32901-A-40',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 500,
      depositAmount: 2500,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      features: ['FR Sport Trim', 'Digital Cockpit', 'Ambient Wrap-Around Light', 'Full Link Wireless', 'Dynamic Chassis'],
    },
    {
      name: 'Dacia Sandero Stepway 2024',
      brand: 'Dacia',
      model: 'Sandero Stepway TCe 90',
      year: 2024,
      category: 'City',
      plate: '19203-A-40',
      transmission: 'manual',
      fuelType: 'gasoline',
      dailyRate: 320,
      depositAmount: 2000,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
      features: ['Modular Roof Bars', 'High Ground Clearance', 'Media Display 8"', 'Eco LED Headlamps', 'Reverse Sensor'],
    }
  ],
  'partner-6-capital': [
    {
      name: 'Audi A8 L Quattro 2024',
      brand: 'Audi',
      model: 'A8 L 50 TDI Quattro',
      year: 2024,
      category: 'Sedan',
      plate: '50192-D-7',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 2600,
      depositAmount: 20000,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
      features: ['Executive Long Wheelbase', 'Bang & Olufsen Advanced 3D', 'Rear Executive Relaxation Seat', 'Predictive Active Suspension', 'Laser Lights'],
    },
    {
      name: 'Mercedes-Benz GLC 300 2024',
      brand: 'Mercedes-Benz',
      model: 'GLC 300 4MATIC AMG Line',
      year: 2024,
      category: 'SUV',
      plate: '88102-A-7',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 1200,
      depositAmount: 8000,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
      features: ['4MATIC All-Wheel', 'MBUX Augmented Video', 'Panoramic Sunroof', 'Burmester 3D Sound', 'Rear Axle Steering'],
    },
    {
      name: 'Volvo XC60 Recharge T8 2024',
      brand: 'Volvo',
      model: 'XC60 T8 AWD Ultimate',
      year: 2024,
      category: 'SUV',
      plate: '34109-B-7',
      transmission: 'automatic',
      fuelType: 'hybrid',
      dailyRate: 1150,
      depositAmount: 7500,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      features: ['Plug-in Hybrid AWD', 'Bowers & Wilkins Audio', 'Pilot Assist Adaptive', 'Nappa Ventilated Seats', 'Google Built-in'],
    },
    {
      name: 'Peugeot 3008 GT Hybrid 2024',
      brand: 'Peugeot',
      model: '3008 GT Hybrid 136 e-DCS6',
      year: 2024,
      category: 'SUV',
      plate: '67201-A-7',
      transmission: 'automatic',
      fuelType: 'hybrid',
      dailyRate: 700,
      depositAmount: 4000,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      features: ['Panoramic i-Cockpit 21"', 'Focal Premium HiFi', 'LED Pixel Tech Lights', 'Alcantara Interior', 'Handsfree Tailgate'],
    },
    {
      name: 'Citroën C3 Aircross 2024',
      brand: 'Citroën',
      model: 'C3 Aircross Shine BlueHDi',
      year: 2024,
      category: 'City',
      plate: '21903-A-7',
      transmission: 'manual',
      fuelType: 'diesel',
      dailyRate: 380,
      depositAmount: 2000,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
      features: ['Advanced Comfort Seats', 'Grip Control System', 'Head-Up Display', 'Sliding Rear Bench', 'Park Assist'],
    }
  ],
  'partner-7-imperial': [
    {
      name: 'Ford Mustang GT 5.0 V8 2023',
      brand: 'Ford',
      model: 'Mustang GT Fastback 5.0L',
      year: 2023,
      category: 'Coupe',
      plate: '20948-A-15',
      transmission: 'manual',
      fuelType: 'gasoline',
      dailyRate: 1120,
      depositAmount: 8000,
      image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1000&q=80',
      features: ['Coyote 5.0L V8 450 HP', 'Active Valve Exhaust', 'Brembo Calipers', 'B&O Sound System', 'Track Apps'],
    },
    {
      name: 'Volkswagen Tiguan R-Line 2024',
      brand: 'Volkswagen',
      model: 'Tiguan R-Line 2.0 TDI 4Motion',
      year: 2024,
      category: 'SUV',
      plate: '55102-B-15',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 800,
      depositAmount: 5000,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      features: ['4Motion Active Control', 'Harman Kardon Audio', 'IQ.LIGHT Matrix', 'Digital Cockpit Pro', 'Travel Assist'],
    },
    {
      name: 'Skoda Superb Laurin & Klement 2024',
      brand: 'Skoda',
      model: 'Superb L&K 2.0 TDI DSG',
      year: 2024,
      category: 'Sedan',
      plate: '89102-A-15',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 750,
      depositAmount: 4500,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
      features: ['Canton 14-Speaker Sound', 'Ventilated Massage Seats', 'DCC Adaptive Chassis', 'Virtual Pedal', 'Matrix LED'],
    },
    {
      name: 'Renault Austral Techno 2024',
      brand: 'Renault',
      model: 'Austral E-Tech Full Hybrid',
      year: 2024,
      category: 'SUV',
      plate: '33109-A-15',
      transmission: 'automatic',
      fuelType: 'hybrid',
      dailyRate: 620,
      depositAmount: 3500,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      features: ['OpenR Link Google built-in', 'Harman Kardon Audio', '4Control 4-Wheel Steer', 'LED Matrix Vision', 'Multi-Sense'],
    },
    {
      name: 'Kia Sportage GT-Line 2024',
      brand: 'Kia',
      model: 'Sportage GT-Line 1.6 CRDi',
      year: 2024,
      category: 'SUV',
      plate: '71902-A-15',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 590,
      depositAmount: 3000,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      features: ['Dual 12.3" Panoramic Displays', 'Harman Kardon Audio', 'Smart Cruise Control', 'Smart Power Tailgate', 'Heated Seats'],
    }
  ],
  'partner-8-rifexpress': [
    {
      name: 'Toyota Hilux GR Sport 4x4 2024',
      brand: 'Toyota',
      model: 'Hilux GR Sport Double Cab',
      year: 2024,
      category: '4x4',
      plate: '90182-A-50',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 850,
      depositAmount: 5000,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
      features: ['GR Sport Monotube Shocks', 'Heavy Duty Bedliner', 'JBL Premium Audio', '360 Panoramic Camera', 'Rear Diff Lock'],
    },
    {
      name: 'Dacia Duster 4x4 Extreme 2024',
      brand: 'Dacia',
      model: 'Duster Extreme 4x4 dCi',
      year: 2024,
      category: '4x4',
      plate: '41209-A-50',
      transmission: 'manual',
      fuelType: 'diesel',
      dailyRate: 450,
      depositAmount: 3000,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
      features: ['Copper Brown Extreme Trim', 'High Ground Clearance', 'Multi-view Camera', 'Washable MicroCloud Seats', 'All-Terrain Lock'],
    },
    {
      name: 'Hyundai Santa Fe Calligraphy 2024',
      brand: 'Hyundai',
      model: 'Santa Fe Calligraphy AWD',
      year: 2024,
      category: 'SUV',
      plate: '78102-B-50',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 1100,
      depositAmount: 7000,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      features: ['HTRAC All-Wheel Drive', 'Bose 12-Speaker Sound', 'Dual Wireless Chargers', 'Relaxation Comfort Seats', '7 Passenger Seating'],
    },
    {
      name: 'Renault Express Van Pro 2024',
      brand: 'Renault',
      model: 'Express Van Confort Blue dCi',
      year: 2024,
      category: 'Utility',
      plate: '23910-A-50',
      transmission: 'manual',
      fuelType: 'diesel',
      dailyRate: 400,
      depositAmount: 2500,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
      features: ['3.3 m³ Cargo Volume', 'Easy Link System', 'Wide Sliding Side Door', 'Reinforced Payload', 'Rear View Assist'],
    },
    {
      name: 'Peugeot 2008 Allure 2024',
      brand: 'Peugeot',
      model: '2008 Allure PureTech 130',
      year: 2024,
      category: 'SUV',
      plate: '51902-A-50',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 480,
      depositAmount: 2500,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      features: ['Peugeot i-Cockpit 10"', 'Full LED 3-Claw Lights', 'VisioPark 1 Camera', 'Eco Mode', 'Mirror Screen'],
    }
  ],
  'partner-9-oriental': [
    {
      name: 'Mercedes-Benz CLA Coupé AMG 2024',
      brand: 'Mercedes-Benz',
      model: 'CLA 200 d AMG Line',
      year: 2024,
      category: 'Coupe',
      plate: '66102-A-48',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 900,
      depositAmount: 6000,
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
      features: ['Frameless Doors', 'AMG Aerodynamics', 'MBUX Dual 10.25" Displays', 'Burmester Surround', 'Panoramic Roof'],
    },
    {
      name: 'BMW 218i Gran Coupé 2024',
      brand: 'BMW',
      model: '218i M Sport Gran Coupé',
      year: 2024,
      category: 'Sedan',
      plate: '39102-A-48',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 750,
      depositAmount: 4500,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
      features: ['M Sport Package', 'Illuminated Boston Trim', 'BMW Live Cockpit', 'Parking Assistant', 'Sport Seats'],
    },
    {
      name: 'Nissan X-Trail e-Power 2024',
      brand: 'Nissan',
      model: 'X-Trail e-Power e-4ORCE',
      year: 2024,
      category: 'SUV',
      plate: '81209-B-48',
      transmission: 'automatic',
      fuelType: 'hybrid',
      dailyRate: 880,
      depositAmount: 5000,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      features: ['e-4ORCE All-Wheel Drive', 'Bose 10-Speaker Audio', 'ProPILOT Assist', 'Triple Zone Climate', 'Panoramic Roof'],
    },
    {
      name: 'Opel Mokka GS Line 2024',
      brand: 'Opel',
      model: 'Mokka GS Line 1.2 Turbo',
      year: 2024,
      category: 'SUV',
      plate: '44910-A-48',
      transmission: 'automatic',
      fuelType: 'gasoline',
      dailyRate: 450,
      depositAmount: 2500,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
      features: ['Opel Pure Panel Cockpit', 'Black Contrast Roof', 'Matrix IntelliLux LED', 'Sport Alloy Wheels', 'Apple CarPlay'],
    },
    {
      name: 'Hyundai i20 N-Line 2024',
      brand: 'Hyundai',
      model: 'i20 N-Line 1.0 T-GDi',
      year: 2024,
      category: 'City',
      plate: '20918-A-48',
      transmission: 'manual',
      fuelType: 'gasoline',
      dailyRate: 360,
      depositAmount: 2000,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      features: ['N-Line Sport Exhaust', 'Dedicated Sport Seats', 'Bose Sound System', 'Digital Cluster 10.25"', 'Lane Follow Assist'],
    }
  ],
  'partner-10-medina': [
    {
      name: 'Audi A4 35 TDI S-Line 2024',
      brand: 'Audi',
      model: 'A4 35 TDI S-Line S tronic',
      year: 2024,
      category: 'Sedan',
      plate: '72109-A-60',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 680,
      depositAmount: 4000,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
      features: ['Audi Virtual Cockpit', 'MMI Navigation Plus', 'S-Line Sport Suspension', 'LED Headlights', 'Rear Camera'],
    },
    {
      name: 'Peugeot 508 GT Fastback 2024',
      brand: 'Peugeot',
      model: '508 GT BlueHDi 130 EAT8',
      year: 2024,
      category: 'Sedan',
      plate: '51203-A-60',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 820,
      depositAmount: 5000,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      features: ['Frameless Doors Fastback', 'Matrix LED Headlights', 'Focal 10-Speaker Audio', 'Night Vision Camera', 'Agr Seats'],
    },
    {
      name: 'Jeep Compass Trailhawk 2024',
      brand: 'Jeep',
      model: 'Compass Trailhawk 4x4',
      year: 2024,
      category: '4x4',
      plate: '39102-B-60',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 700,
      depositAmount: 4000,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
      features: ['Selec-Terrain with Rock Mode', 'Off-Road Skid Plates', 'Alpine Audio', '360 Camera', 'Trail Rated Badge'],
    },
    {
      name: 'Volkswagen T-Roc R-Line 2024',
      brand: 'Volkswagen',
      model: 'T-Roc R-Line 2.0 TDI DSG',
      year: 2024,
      category: 'SUV',
      plate: '84102-A-60',
      transmission: 'automatic',
      fuelType: 'diesel',
      dailyRate: 600,
      depositAmount: 3000,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      features: ['R-Line Aerodynamics', 'Digital Cockpit Pro', 'IQ.LIGHT Matrix', 'Keyless Access', 'Sports Steering Wheel'],
    },
    {
      name: 'Dacia Logan TCe Intens 2024',
      brand: 'Dacia',
      model: 'Logan Intens TCe 90',
      year: 2024,
      category: 'Sedan',
      plate: '18290-A-60',
      transmission: 'manual',
      fuelType: 'gasoline',
      dailyRate: 300,
      depositAmount: 1800,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
      features: ['Large 528L Trunk', 'Media Nav 8" Screen', 'Automatic Climate Control', 'LED Y-Shape Lights', 'High Ground Clearance'],
    }
  ]
};

// Flatten to precisely 50 Real Vehicles (10 Partners x 5 Vehicles)
export const REAL_TEST_CARS: RealTestCar[] = REAL_TEST_PARTNERS.flatMap((partner, pIdx) => {
  const specs = PARTNER_FLEET_SPECS[partner.id] || [];
  return specs.map((spec, vIdx) => {
    const carId = `${pIdx + 1}-${vIdx + 1}`;
    return {
      id: carId,
      title: spec.name,
      name: spec.name,
      brand: spec.brand,
      model: spec.model,
      year: spec.year,
      category: spec.category,
      plate: spec.plate,
      city: partner.city,
      location: partner.address,
      coordinates: partner.coordinates,
      rating: 4.85 + ((pIdx + vIdx) % 15) * 0.01,
      reviewsCount: 15 + ((pIdx * 7 + vIdx * 3) % 40),
      seats: spec.category === 'Coupe' ? 2 : spec.category === '4x4' && spec.model.includes('7') ? 7 : 5,
      doors: spec.category === 'Coupe' ? 2 : 4,
      transmission: spec.transmission,
      fuelType: spec.fuelType,
      dailyRate: spec.dailyRate,
      pricePerDay: spec.dailyRate,
      currency: 'DH',
      depositAmount: spec.depositAmount,
      minAge: spec.dailyRate > 1500 ? 26 : spec.dailyRate > 800 ? 23 : 21,
      mileageLimit: 'Unlimited km included',
      images: [spec.image],
      imageUrl: spec.image,
      features: spec.features,
      agencyId: partner.id,
      agencyName: partner.agencyName,
      agencyPhone: partner.phone,
      description: `${spec.name} (${spec.plate}) maintained in pristine showroom condition by ${partner.agencyName} in ${partner.city}. Certified Dahir 2026 fleet vehicle.`,
      isAvailable: true,
      isFeatured: vIdx === 0,
    };
  });
});

// -------------------------------------------------------------
// 3. REAL BOOKINGS & RESERVATIONS
// -------------------------------------------------------------
export const REAL_TEST_BOOKINGS: RealTestBooking[] = [
  {
    id: 'BK-TET-2026-0914',
    renterId: 'usr-camille',
    renterName: 'Camille Dubois',
    renterEmail: 'camille.d@mail.com',
    renterPhone: '+212 6 12 34 56 78',
    carId: '5',
    carTitle: 'Range Rover Velar R-Dynamic 2024',
    carCategory: 'SUV',
    carImage: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80',
    carPlate: '54120-B-72',
    pickupDate: '2026-09-07',
    returnDate: '2026-09-11',
    pickupCity: 'Tetouan',
    pickupLocation: 'Aéroport Tetouan Sania R\'mel (TTU)',
    totalDays: 4,
    pricePerDay: 1600,
    totalPrice: 6400,
    depositAmount: 12000,
    status: 'confirmed',
    dahirRegistrationId: 'DAHIR-2026-TET-00492',
    agencyName: 'Mayache Prestige Cars',
    agencyId: '5',
    contractId: 'CTR-DAHIR-2026-00492',
    paymentStatus: 'escrow_held',
    createdAt: '2026-09-02T14:22:00Z',
  },
  {
    id: 'BK-AGA-2026-0810',
    renterId: 'usr-karim',
    renterName: 'Karim Tazi',
    renterEmail: 'karim.tazi@gmail.com',
    renterPhone: '+212 663 55 22 77',
    carId: '7',
    carTitle: 'Audi A6 40 TDI S-Line 2024',
    carCategory: 'Sedan',
    carImage: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    carPlate: '9102-B-33',
    pickupDate: '2026-08-10',
    returnDate: '2026-08-15',
    pickupCity: 'Agadir',
    pickupLocation: 'Aéroport Agadir Al Massira (AGA) Terminal 1',
    totalDays: 5,
    pricePerDay: 720,
    totalPrice: 3600,
    depositAmount: 3500,
    status: 'active',
    dahirRegistrationId: 'DAHIR-2026-AGA-00219',
    agencyName: 'Mayache Prestige Cars',
    agencyId: '5',
    contractId: 'CTR-DAHIR-2026-00219',
    paymentStatus: 'escrow_held',
    createdAt: '2026-08-04T10:15:00Z',
  },
  {
    id: 'BK-CAS-2026-0722',
    renterId: 'usr-mehdi',
    renterName: 'Mehdi Bennani',
    renterEmail: 'mehdi.bennani@gmail.com',
    renterPhone: '+212 661 44 88 12',
    carId: '4',
    carTitle: 'Mercedes-Benz C-Class AMG Line 2024',
    carCategory: 'Sedan',
    carImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    carPlate: '18392-D-1',
    pickupDate: '2026-07-22',
    returnDate: '2026-07-29',
    pickupCity: 'Casablanca',
    pickupLocation: 'Aéroport Casablanca Mohammed V (CMN)',
    totalDays: 7,
    pricePerDay: 950,
    totalPrice: 6650,
    depositAmount: 7000,
    status: 'completed',
    dahirRegistrationId: 'DAHIR-2026-CAS-00812',
    agencyName: 'Mayache Prestige Cars',
    agencyId: '5',
    contractId: 'CTR-DAHIR-2026-00812',
    paymentStatus: 'refunded',
    createdAt: '2026-07-16T18:40:00Z',
  },
  {
    id: 'BK-RAK-2026-0928',
    renterId: 'usr-sarah',
    renterName: 'Sarah Alami',
    renterEmail: 'sarah.alami@gmail.com',
    renterPhone: '+212 662 99 11 33',
    carId: '9',
    carTitle: 'BMW 420i Gran Coupé 2024',
    carCategory: 'Sedan',
    carImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    carPlate: '77321-A-26',
    pickupDate: '2026-09-28',
    returnDate: '2026-10-01',
    pickupCity: 'Marrakech',
    pickupLocation: 'Aéroport Marrakech Menara (RAK)',
    totalDays: 3,
    pricePerDay: 850,
    totalPrice: 2550,
    depositAmount: 5000,
    status: 'confirmed',
    dahirRegistrationId: 'DAHIR-2026-RAK-00341',
    agencyName: 'Menara Motors Marrakech',
    agencyId: '9',
    contractId: 'CTR-DAHIR-2026-00341',
    paymentStatus: 'escrow_held',
    createdAt: '2026-09-21T09:30:00Z',
  },
  {
    id: 'BK-TNG-2026-0930',
    renterId: 'usr-omar',
    renterName: 'Omar El Fassi',
    renterEmail: 'omar.elfassi@gmail.com',
    renterPhone: '+212 664 12 34 56',
    carId: '1',
    carTitle: 'Honda Civic Type R 2024',
    carCategory: 'Sedan',
    carImage: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80',
    carPlate: '24589-A-40',
    pickupDate: '2026-09-30',
    returnDate: '2026-10-02',
    pickupCity: 'Tangier',
    pickupLocation: 'Aéroport Tanger Ibn Battouta (TNG)',
    totalDays: 2,
    pricePerDay: 900,
    totalPrice: 1800,
    depositAmount: 5000,
    status: 'confirmed',
    dahirRegistrationId: 'DAHIR-2026-TNG-00109',
    agencyName: 'Mayache Prestige Cars',
    agencyId: '5',
    contractId: 'CTR-DAHIR-2026-00109',
    paymentStatus: 'escrow_held',
    createdAt: '2026-09-24T16:00:00Z',
  },
  {
    id: 'BK-TAG-2026-1002',
    renterId: 'usr-sofia',
    renterName: 'Sofia Andersson',
    renterEmail: 'sofia.andersson@gmail.com',
    renterPhone: '+46 70 123 45 67',
    carId: '15',
    carTitle: 'Jeep Wrangler Sahara Unlimited 2024',
    carCategory: '4x4',
    carImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    carPlate: '38102-A-33',
    pickupDate: '2026-10-04',
    returnDate: '2026-10-10',
    pickupCity: 'Agadir',
    pickupLocation: 'Taghazout Bay Resort',
    totalDays: 6,
    pricePerDay: 950,
    totalPrice: 5700,
    depositAmount: 5000,
    status: 'pending',
    dahirRegistrationId: 'DAHIR-2026-AGA-00304',
    agencyName: 'Mayache Prestige Cars',
    agencyId: '5',
    contractId: 'CTR-DAHIR-2026-00304',
    paymentStatus: 'escrow_held',
    createdAt: '2026-10-01T12:00:00Z',
  }
];

// -------------------------------------------------------------
// 4. REAL DAHIR 2026 DIGITAL CONTRACTS
// -------------------------------------------------------------
export const REAL_TEST_CONTRACTS: RealTestContract[] = [
  {
    id: 'CTR-DAHIR-2026-00492',
    bookingId: 'BK-TET-2026-0914',
    contractNumber: 'DAHIR-2026-TET-00492',
    renterId: 'usr-camille',
    renterName: 'Camille Dubois',
    renterEmail: 'camille.d@mail.com',
    cinNumber: 'L-849201',
    drivingLicenceNumber: 'FR-9204812',
    carModel: 'Range Rover Velar R-Dynamic 2024',
    carPlate: '54120-B-72',
    agencyName: 'Mayache Prestige Cars',
    status: 'signed',
    signedAt: '2026-09-02T15:00:00Z',
    digitalSignature: 'Camille Dubois (Verified Biometric e-Sign)',
    escrowDepositMAD: 12000,
    inspectionChecklist: {
      fuelLevel: '8/8 Full Tank',
      mileageKm: 28410,
      exteriorCondition: 'Pristine - zero scratches or paint dents',
      spareWheelPresent: true,
      registrationCardPresent: true,
    }
  },
  {
    id: 'CTR-DAHIR-2026-00219',
    bookingId: 'BK-AGA-2026-0810',
    contractNumber: 'DAHIR-2026-AGA-00219',
    renterId: 'usr-karim',
    renterName: 'Karim Tazi',
    renterEmail: 'karim.tazi@gmail.com',
    cinNumber: 'EE78120',
    drivingLicenceNumber: 'MA-5541092',
    carModel: 'Audi A6 40 TDI S-Line 2024',
    carPlate: '9102-B-33',
    agencyName: 'Mayache Prestige Cars',
    status: 'active',
    signedAt: '2026-08-10T14:30:00Z',
    digitalSignature: 'Karim Tazi (SMS OTP 482-910)',
    escrowDepositMAD: 3500,
    inspectionChecklist: {
      fuelLevel: '8/8 Full Tank',
      mileageKm: 34120,
      exteriorCondition: 'Minor stone chip on lower front bumper (noted & approved)',
      spareWheelPresent: true,
      registrationCardPresent: true,
    }
  },
  {
    id: 'CTR-DAHIR-2026-00812',
    bookingId: 'BK-CAS-2026-0722',
    contractNumber: 'DAHIR-2026-CAS-00812',
    renterId: 'usr-mehdi',
    renterName: 'Mehdi Bennani',
    renterEmail: 'mehdi.bennani@gmail.com',
    cinNumber: 'BK64019',
    drivingLicenceNumber: 'MA-1920481',
    carModel: 'Mercedes-Benz C-Class AMG Line 2024',
    carPlate: '18392-D-1',
    agencyName: 'Mayache Prestige Cars',
    status: 'closed',
    signedAt: '2026-07-22T09:00:00Z',
    digitalSignature: 'Mehdi Bennani (Verified e-ID)',
    escrowDepositMAD: 7000,
    inspectionChecklist: {
      fuelLevel: '8/8 Full Tank',
      mileageKm: 19840,
      exteriorCondition: 'Returned spotless, deposit refunded within 2 hours',
      spareWheelPresent: true,
      registrationCardPresent: true,
    }
  },
  {
    id: 'CTR-DAHIR-2026-00341',
    bookingId: 'BK-RAK-2026-0928',
    contractNumber: 'DAHIR-2026-RAK-00341',
    renterId: 'usr-sarah',
    renterName: 'Sarah Alami',
    renterEmail: 'sarah.alami@gmail.com',
    cinNumber: 'BE89214',
    drivingLicenceNumber: 'MA-8841029',
    carModel: 'BMW 420i Gran Coupé 2024',
    carPlate: '77321-A-26',
    agencyName: 'Menara Motors Marrakech',
    status: 'signed',
    signedAt: '2026-09-28T16:20:00Z',
    digitalSignature: 'Sarah Alami (Digital Signature)',
    escrowDepositMAD: 5000,
    inspectionChecklist: {
      fuelLevel: '8/8 Full Tank',
      mileageKm: 15420,
      exteriorCondition: 'Pre-existing right alloy rim scuff documented',
      spareWheelPresent: true,
      registrationCardPresent: true,
    }
  },
  {
    id: 'CTR-DAHIR-2026-00109',
    bookingId: 'BK-TNG-2026-0930',
    contractNumber: 'DAHIR-2026-TNG-00109',
    renterId: 'usr-omar',
    renterName: 'Omar El Fassi',
    renterEmail: 'omar.elfassi@gmail.com',
    cinNumber: 'K512930',
    drivingLicenceNumber: 'MA-6201948',
    carModel: 'Honda Civic Type R 2024',
    carPlate: '24589-A-40',
    agencyName: 'Mayache Prestige Cars',
    status: 'signed',
    signedAt: '2026-09-30T11:45:00Z',
    digitalSignature: 'Omar El Fassi (Verified Dahir Portal)',
    escrowDepositMAD: 5000,
    inspectionChecklist: {
      fuelLevel: '8/8 Full Tank',
      mileageKm: 8910,
      exteriorCondition: 'Pristine - Brembo brakes inspection passed',
      spareWheelPresent: true,
      registrationCardPresent: true,
    }
  }
];

// -------------------------------------------------------------
// 5. REAL DAHIR 2026 DISPUTE & MEDIATION TICKETS
// -------------------------------------------------------------
export const REAL_TEST_DISPUTES: RealTestDispute[] = [
  {
    id: 'DISP-2026-001',
    bookingId: 'BK-CAS-2026-0722',
    contractId: 'CTR-DAHIR-2026-00812',
    userId: 'usr-mehdi',
    userName: 'Mehdi Bennani',
    userEmail: 'mehdi.bennani@gmail.com',
    agencyName: 'Mayache Prestige Cars',
    reason: 'CMI Escrow Security Deposit Release Confirmation',
    description: 'Vehicle returned on July 29 at Mohammed V Airport. Verified clean inspection report. Requested electronic confirmation of escrow pre-authorization release.',
    amountMAD: 7000,
    status: 'resolved',
    resolutionNotes: 'Escrow pre-authorization released via CMI Moroccan Interbank gateway within 2 hours. Both parties signed restitution protocol.',
    createdAt: '2026-07-29T14:30:00Z',
  },
  {
    id: 'DISP-2026-002',
    bookingId: 'BK-RAK-2026-0928',
    contractId: 'CTR-DAHIR-2026-00341',
    userId: 'usr-sarah',
    userName: 'Sarah Alami',
    userEmail: 'sarah.alami@gmail.com',
    agencyName: 'Menara Motors Marrakech',
    reason: 'Pre-existing Right Alloy Rim Cosmetic Mark',
    description: 'During vehicle return, agency noted light scratch on right rear rim. Customer provided handover photos taken at Menara Airport showing the scratch was pre-existing.',
    amountMAD: 350,
    status: 'under_review',
    resolutionNotes: 'Morocco Drive mediation team reviewing geo-tagged handover photos under Dahir Article 14 rules.',
    createdAt: '2026-10-01T17:10:00Z',
  },
  {
    id: 'DISP-2026-003',
    bookingId: 'BK-TNG-2026-0930',
    contractId: 'CTR-DAHIR-2026-00109',
    userId: 'usr-omar',
    userName: 'Omar El Fassi',
    userEmail: 'omar.elfassi@gmail.com',
    agencyName: 'Mayache Prestige Cars',
    reason: 'Royal Air Maroc Flight AT791 Delay Handover Surcharge Waiver',
    description: 'Customer flight from Paris Orly to Tangier delayed by 3 hours. Requested waiver of late night airport handover fee.',
    amountMAD: 150,
    status: 'resolved',
    resolutionNotes: 'Agency Mayache Prestige agreed to waive late fee upon submission of Royal Air Maroc boarding pass with delayed flight status.',
    createdAt: '2026-10-01T01:20:00Z',
  }
];

// -------------------------------------------------------------
// 6. REAL CUSTOMER & PARTNER MESSAGES
// -------------------------------------------------------------
export const REAL_TEST_MESSAGES: RealTestMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-camille-mayache',
    senderId: 'usr-camille',
    senderName: 'Camille Dubois',
    senderRole: 'renter',
    text: 'Salam! We just landed at Tetouan Sania R\'mel airport on Royal Air Maroc AT791. We have our Dahir 2026 contract ready on the app. Where will your representative meet us?',
    timestamp: '2026-09-07T10:15:00Z',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-camille-mayache',
    senderId: 'usr-agency-mayache',
    senderName: 'Yassine Ayache (Mayache Prestige)',
    senderRole: 'partner',
    text: 'Marhaban bikoum Camille! Welcome to Tetouan. Our driver Amine is waiting directly outside the arrivals terminal holding a sign with your name. The Range Rover Velar is washed, inspected, and ready with full tank.',
    timestamp: '2026-09-07T10:18:00Z',
  },
  {
    id: 'msg-3',
    conversationId: 'conv-camille-mayache',
    senderId: 'usr-camille',
    senderName: 'Camille Dubois',
    senderRole: 'renter',
    text: 'Perfect, we see Amine now! The car looks stunning. Thank you so much for the swift service.',
    timestamp: '2026-09-07T10:22:00Z',
  },
  {
    id: 'msg-4',
    conversationId: 'conv-karim-souss',
    senderId: 'usr-karim',
    senderName: 'Karim Tazi',
    senderRole: 'renter',
    text: 'Bonjour, could we please extend our Audi A6 rental by 2 additional days in Taghazout?',
    timestamp: '2026-08-14T09:00:00Z',
  },
  {
    id: 'msg-5',
    conversationId: 'conv-karim-souss',
    senderId: 'usr-agency-mayache',
    senderName: 'Mayache Fleet Desk',
    senderRole: 'partner',
    text: 'Salam Karim! We checked our fleet schedule: the Audi A6 is available until August 17th. We updated the contract addendum at the same daily rate of 720 MAD/day. You can sign the addendum directly in your app.',
    timestamp: '2026-08-14T09:12:00Z',
  },
  {
    id: 'msg-6',
    conversationId: 'conv-sarah-menara',
    senderId: 'usr-sarah',
    senderName: 'Sarah Alami',
    senderRole: 'renter',
    text: 'Hello, could we add an Isofix child safety seat for our 2-year old for the BMW 420i in Marrakech?',
    timestamp: '2026-09-27T14:00:00Z',
  },
  {
    id: 'msg-7',
    conversationId: 'conv-sarah-menara',
    senderId: 'usr-agency-mayache',
    senderName: 'Mayache Customer Concierge',
    senderRole: 'partner',
    text: 'Bonsoir Sarah! Yes, absolutely. We have European safety certified Cybex Isofix toddler seats sanitized and ready. It has been added to your reservation at zero extra charge.',
    timestamp: '2026-09-27T14:15:00Z',
  }
];

// -------------------------------------------------------------
// 7. PLATFORM SETTINGS
// -------------------------------------------------------------
export const REAL_TEST_SETTINGS = {
  platformName: 'Airbcar - Morocco Drive',
  dahirRegulationVersion: 'Dahir n° 1-26-04 (2026 Framework)',
  escrowReleaseHours: 48,
  standardCommissionPct: 15,
  jurisdictionCourt: 'Tribunal de Commerce de Meknès / Casablanca',
  cmiGatewayStatus: 'active',
  insurancePartner: 'Wafa Assurance All-Risks Fleet',
  maxDisputeResolutionHours: 72,
  exclusiveAdminEmail: 'ayacheyassine2000@gmail.com',
};
