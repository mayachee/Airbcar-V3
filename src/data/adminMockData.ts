import { 
  AdminAgency, 
  AdminClient,
  AdminVehicle, 
  AdminBooking, 
  AdminDispute, 
  AdminPayoutBatch, 
  PlatformSettings 
} from '../types/admin';

export const initialAdminAgencies: AdminAgency[] = [
  {
    id: 'agency-mayache',
    agencyName: 'Mayache Cars',
    legalName: 'MAYACHE CARS SARL D\'ASSOCIÉ UNIQUE',
    tradeName: 'Mayache Premium Mobility',
    ownerName: 'Yassine Ayache',
    ownerCin: 'V349120',
    ice: '002849102000045',
    cnssNumber: '8912401',
    city: 'Azrou & Agadir',
    address: 'Boulevard Mohammed V, Résidence Al Massira, Azrou',
    headquartersAddress: 'Boulevard Mohammed V, Résidence Al Massira, 53100 Azrou (Succursale Agadir: Cité Al Houda)',
    phone: '+212 696-145103',
    secondaryPhone: '+212 535-562211',
    whatsappNumber: '+212 696-145103',
    email: 'ayacheyassine2000@gmail.com',
    managerName: 'Amine Ayache',
    managerPhone: '+212 661-884422',
    fleetCount: 8,
    activeRentals: 4,
    rating: 4.94,
    reviewCount: 114,
    status: 'verified',
    commissionRatePct: 15,
    joinedDate: '2024-03-12',
    commercialRegisterRc: 'RC 4545/Meknès',
    courtTribunal: 'Tribunal de Commerce de Meknès',
    patenteNumber: 'PAT-482019-AZR',
    taxIdIf: 'IF 45450012',
    tourismMinistryLicense: 'AUT-MIN-2022/4545',
    airportDeliveryPoints: [
      'Aéroport Agadir Al Massira (AGA) Terminal 1',
      'Aéroport Fès-Saïss (FEZ)',
      'Gare ONCF Meknès Ville'
    ],
    operatingHours: '08:00 - 23:00 (7j/7 - 24h Assistance)',
    bankAccount: {
      bankName: 'Attijariwafa Bank',
      branchCity: 'Agence Azrou Hassan II',
      rib: '007 010 0001234567890123 44',
      swiftBic: 'BCMAMAMC',
      accountHolder: 'MAYACHE CARS SARL',
    },
    cancellationRatePct: 1.2,
    disputeRatePct: 0.0,
    avgResponseTimeMinutes: 8,
    reviewsBreakdown: {
      cleanliness: 4.98,
      communication: 4.96,
      carCondition: 4.92,
      punctuality: 4.95
    },
    fleetBreakdown: {
      economy: 3,
      sedan: 2,
      suv: 2,
      luxury: 1
    },
    notes: 'Premium partner with exemplary escrow compliance and fast customer delivery in Agadir & Middle Atlas.',
    totalVolumeMAD: 184500,
    totalPaidOutMAD: 148200,
    pendingPayoutMAD: 36300,
    kycDocuments: [
      {
        id: 'doc-rc-1',
        name: 'Registre de Commerce (RC Formulaire 7)',
        type: 'rc',
        status: 'verified',
        fileUrl: '#',
        uploadedAt: '2024-03-12',
        notes: 'Délivré par le Greffe du Tribunal de Commerce de Meknès'
      },
      {
        id: 'doc-pat-1',
        name: 'Attestation de Patente Professionnelle (Direction Générale des Impôts)',
        type: 'patente',
        status: 'verified',
        fileUrl: '#',
        uploadedAt: '2024-03-12',
      },
      {
        id: 'doc-tour-1',
        name: 'Agrément Ministère du Tourisme et du Transport Routier',
        type: 'tourism_license',
        status: 'verified',
        fileUrl: '#',
        uploadedAt: '2024-03-14',
      },
      {
        id: 'doc-ins-1',
        name: 'Police d\'Assurance Flotte Tous Risques (RMA Watanya)',
        type: 'insurance',
        status: 'verified',
        fileUrl: '#',
        uploadedAt: '2025-01-10',
        notes: 'Police n° 8849201-B - Couverture Responsabilité Civile et Dommages Tous Risques'
      }
    ]
  },
  {
    id: 'agency-atlas-marrakech',
    agencyName: 'Atlas Wheels Marrakech',
    legalName: 'ATLAS WHEELS SERVICES SARL',
    tradeName: 'Atlas Wheels Luxury Car Rental',
    ownerName: 'Mehdi Benjelloun',
    ownerCin: 'EE491024',
    ice: '001928374000088',
    cnssNumber: '4410293',
    city: 'Marrakech',
    address: '142 Avenue Mohammed VI, Guéliz, Marrakech',
    headquartersAddress: '142 Avenue Mohammed VI, Guéliz, Marrakech (Comptoir RAK Menara Terminal 1)',
    phone: '+212 524-439920',
    secondaryPhone: '+212 661-332211',
    whatsappNumber: '+212 661-332211',
    email: 'contact@atlaswheels-marrakech.ma',
    managerName: 'Tariq Alami',
    managerPhone: '+212 661-998877',
    fleetCount: 24,
    activeRentals: 19,
    rating: 4.92,
    reviewCount: 382,
    status: 'verified',
    commissionRatePct: 13, // High-volume partner discount
    joinedDate: '2023-08-15',
    commercialRegisterRc: 'RC 88210/Marrakech',
    courtTribunal: 'Tribunal de Commerce de Marrakech',
    patenteNumber: 'PAT-771920-RAK',
    taxIdIf: 'IF 29104822',
    tourismMinistryLicense: 'AUT-MIN-2021/119',
    airportDeliveryPoints: [
      'Aéroport Marrakech Menara (RAK) VIP Hall',
      'Gare Marrakech Guéliz',
      'Palmeraie Resorts Delivery'
    ],
    operatingHours: '24h/24 - 7j/7',
    bankAccount: {
      bankName: 'Banque Populaire (BCP)',
      branchCity: 'Agence Guéliz Majorelle Marrakech',
      rib: '101 220 2121100984728192 18',
      swiftBic: 'BPOUMAMC',
      accountHolder: 'ATLAS WHEELS SERVICES SARL',
    },
    cancellationRatePct: 2.1,
    disputeRatePct: 0.8,
    avgResponseTimeMinutes: 5,
    reviewsBreakdown: {
      cleanliness: 4.94,
      communication: 4.90,
      carCondition: 4.95,
      punctuality: 4.92
    },
    fleetBreakdown: {
      economy: 8,
      suv: 10,
      sedan: 4,
      luxury: 2
    },
    notes: 'Largest Marrakech fleet partner. Provides high-end airport meet-and-greet and concierge deliveries.',
    totalVolumeMAD: 894000,
    totalPaidOutMAD: 755200,
    pendingPayoutMAD: 138800,
    kycDocuments: [
      { id: 'doc-am-1', name: 'RC Formulaire 7 Marrakech', type: 'rc', status: 'verified', fileUrl: '#', uploadedAt: '2023-08-15' },
      { id: 'doc-am-2', name: 'Patente 2026', type: 'patente', status: 'verified', fileUrl: '#', uploadedAt: '2026-01-05' },
      { id: 'doc-am-3', name: 'Assurance Flotte Sanad', type: 'insurance', status: 'verified', fileUrl: '#', uploadedAt: '2026-01-10' }
    ]
  },
  {
    id: 'agency-casa-prestige',
    agencyName: 'Casa Prestige Auto',
    legalName: 'CASA PRESTIGE MOBILITY SARL',
    tradeName: 'Casa Prestige Executive Drive',
    ownerName: 'Salma Tazi',
    ownerCin: 'BK104928',
    ice: '003182910000012',
    cnssNumber: '7829102',
    city: 'Casablanca',
    address: '78 Rue Taha Hussein, Quartier Maârif, Casablanca',
    headquartersAddress: '78 Rue Taha Hussein, Quartier Maârif, 20100 Casablanca',
    phone: '+212 522-998811',
    secondaryPhone: '+212 661-445566',
    whatsappNumber: '+212 661-445566',
    email: 'direction@casaprestigeauto.ma',
    managerName: 'Kenza Benmoussa',
    managerPhone: '+212 662-110099',
    fleetCount: 18,
    activeRentals: 14,
    rating: 4.88,
    reviewCount: 219,
    status: 'verified',
    commissionRatePct: 15,
    joinedDate: '2024-01-20',
    commercialRegisterRc: 'RC 149201/Casablanca',
    courtTribunal: 'Tribunal de Commerce de Casablanca',
    patenteNumber: 'PAT-903124-CAS',
    taxIdIf: 'IF 51920184',
    tourismMinistryLicense: 'AUT-MIN-2023/302',
    airportDeliveryPoints: [
      'Aéroport Mohammed V (CMN) Terminal 1 & 2',
      'Gare Casa-Port TGV',
      'Gare Casa-Voyageurs'
    ],
    operatingHours: '07:30 - 23:30',
    bankAccount: {
      bankName: 'BMCE Bank of Africa',
      branchCity: 'Agence Boulevard d\'Anfa Casablanca',
      rib: '011 780 0004928172910482 91',
      swiftBic: 'BMCEAMC',
      accountHolder: 'CASA PRESTIGE MOBILITY SARL',
    },
    cancellationRatePct: 1.8,
    disputeRatePct: 0.5,
    avgResponseTimeMinutes: 12,
    reviewsBreakdown: {
      cleanliness: 4.90,
      communication: 4.86,
      carCondition: 4.92,
      punctuality: 4.88
    },
    fleetBreakdown: {
      economy: 4,
      suv: 6,
      sedan: 5,
      luxury: 3
    },
    notes: 'Premium corporate and executive car rental in the economic capital with German sedans and luxury SUVs.',
    totalVolumeMAD: 495000,
    totalPaidOutMAD: 412000,
    pendingPayoutMAD: 83000,
    kycDocuments: [
      { id: 'doc-cp-1', name: 'RC Casablanca', type: 'rc', status: 'verified', fileUrl: '#', uploadedAt: '2024-01-20' },
      { id: 'doc-cp-2', name: 'Patente Maârif', type: 'patente', status: 'verified', fileUrl: '#', uploadedAt: '2024-01-20' },
      { id: 'doc-cp-3', name: 'Agrément Transport Touristique', type: 'tourism_license', status: 'verified', fileUrl: '#', uploadedAt: '2024-01-22' }
    ]
  },
  {
    id: 'agency-med-tangier',
    agencyName: 'Med Express Location',
    legalName: 'MED EXPRESS LOCATION SARL',
    tradeName: 'Med Express Car Rental',
    ownerName: 'Omar El Mansouri',
    ownerCin: 'K291039',
    ice: '002910482000071',
    cnssNumber: '5519284',
    city: 'Tangier',
    address: 'Place des Nations, Tour Al Boughaz, Tanger',
    headquartersAddress: 'Place des Nations, Tour Al Boughaz, 90000 Tanger',
    phone: '+212 539-332211',
    secondaryPhone: '+212 661-778899',
    whatsappNumber: '+212 661-778899',
    email: 'info@medexpress-tanger.com',
    managerName: 'Rachid Fassi',
    managerPhone: '+212 663-882211',
    fleetCount: 14,
    activeRentals: 8,
    rating: 4.79,
    reviewCount: 142,
    status: 'under_review',
    commissionRatePct: 15,
    joinedDate: '2024-06-10',
    commercialRegisterRc: 'RC 49102/Tanger',
    courtTribunal: 'Tribunal de Commerce de Tanger',
    patenteNumber: 'PAT-338291-TNG',
    taxIdIf: 'IF 41829031',
    tourismMinistryLicense: 'AUT-MIN-2024/091',
    airportDeliveryPoints: [
      'Aéroport Tanger Ibn Battouta (TNG)',
      'Port Tanger Ville Ferry',
      'Port Tanger Med Ferry Terminal'
    ],
    operatingHours: '08:00 - 24:00',
    bankAccount: {
      bankName: 'CIH Bank',
      branchCity: 'Agence Tanger Boulevard Pasteur',
      rib: '230 640 0019283746192837 55',
      swiftBic: 'CIHMMAMC',
      accountHolder: 'MED EXPRESS LOCATION',
    },
    cancellationRatePct: 3.5,
    disputeRatePct: 1.4,
    avgResponseTimeMinutes: 18,
    reviewsBreakdown: {
      cleanliness: 4.78,
      communication: 4.75,
      carCondition: 4.82,
      punctuality: 4.80
    },
    fleetBreakdown: {
      economy: 6,
      suv: 5,
      sedan: 3,
      luxury: 0
    },
    notes: 'Fleet insurance renewal pending verification for 2 vehicles. Under routine review.',
    totalVolumeMAD: 248000,
    totalPaidOutMAD: 210000,
    pendingPayoutMAD: 38000,
    kycDocuments: [
      { id: 'doc-me-1', name: 'RC Tanger', type: 'rc', status: 'verified', fileUrl: '#', uploadedAt: '2024-06-10' },
      { id: 'doc-me-2', name: 'Attestation Fiscale IF/Patente', type: 'patente', status: 'verified', fileUrl: '#', uploadedAt: '2024-06-10' },
      { id: 'doc-me-3', name: 'Renouvellement Assurance Flotte', type: 'insurance', status: 'pending', fileUrl: '#', uploadedAt: '2026-08-28', notes: 'Inspection requested for 2 new vehicles' }
    ]
  },
  {
    id: 'agency-sahara-ouarzazate',
    agencyName: 'Sahara Desert Overland',
    legalName: 'SAHARA OVERLAND ADVENTURES SARL',
    tradeName: 'Sahara 4x4 Expedition Morocco',
    ownerName: 'Brahim Ait Ali',
    ownerCin: 'OD19283',
    ice: '001829103000092',
    cnssNumber: '3391024',
    city: 'Ouarzazate',
    address: 'Avenue Al Mouahidine, Ouarzazate',
    headquartersAddress: 'Avenue Al Mouahidine, 45000 Ouarzazate',
    phone: '+212 524-884433',
    secondaryPhone: '+212 661-229900',
    whatsappNumber: '+212 661-229900',
    email: 'contact@sahara-overland.ma',
    managerName: 'Hassan Ait Ali',
    managerPhone: '+212 664-331199',
    fleetCount: 9,
    activeRentals: 6,
    rating: 4.96,
    reviewCount: 88,
    status: 'verified',
    commissionRatePct: 14,
    joinedDate: '2024-04-18',
    commercialRegisterRc: 'RC 7219/Ouarzazate',
    courtTribunal: 'Tribunal de Première Instance d\'Ouarzazate',
    patenteNumber: 'PAT-182903-OZT',
    taxIdIf: 'IF 19203847',
    tourismMinistryLicense: 'AUT-MIN-2023/182',
    airportDeliveryPoints: [
      'Aéroport Ouarzazate (OZZ)',
      'Hôtels & Riads Ouarzazate & Ksar Aït Benhaddou'
    ],
    operatingHours: '07:00 - 22:00',
    bankAccount: {
      bankName: 'Crédit Agricole du Maroc (CAM)',
      branchCity: 'Agence Principale Ouarzazate',
      rib: '225 790 0009182736451928 32',
      swiftBic: 'AGRAMAMC',
      accountHolder: 'SAHARA OVERLAND ADVENTURES',
    },
    cancellationRatePct: 0.8,
    disputeRatePct: 0.0,
    avgResponseTimeMinutes: 10,
    reviewsBreakdown: {
      cleanliness: 4.95,
      communication: 4.98,
      carCondition: 4.96,
      punctuality: 4.97
    },
    fleetBreakdown: {
      economy: 1,
      suv: 6,
      sedan: 0,
      luxury: 2
    },
    notes: 'Specialist in 4x4 rugged vehicles (Duster, Prado, Defender) for desert circuits (Merzouga, Zagora).',
    totalVolumeMAD: 162000,
    totalPaidOutMAD: 139000,
    pendingPayoutMAD: 23000,
    kycDocuments: [
      { id: 'doc-so-1', name: 'RC Ouarzazate', type: 'rc', status: 'verified', fileUrl: '#', uploadedAt: '2024-04-18' },
      { id: 'doc-so-2', name: 'Patente 4x4 Tourisme', type: 'patente', status: 'verified', fileUrl: '#', uploadedAt: '2024-04-18' }
    ]
  }
];

export const initialAdminClients: AdminClient[] = [
  {
    id: 'client-karim-bennani',
    fullName: 'Karim Bennani',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    email: 'karim.bennani@gmail.com',
    phone: '+212 661-234567',
    whatsapp: '+212 661-234567',
    nationality: 'Moroccan',
    flag: '🇲🇦',
    country: 'Morocco',
    dateOfBirth: '1989-05-14',
    age: 37,
    address: '15 Boulevard d\'Anfa, Résidence Les Fleurs, Casablanca',
    cinOrPassport: {
      type: 'cin',
      number: 'BE849102',
      expiryDate: '2031-08-20',
      verified: true
    },
    drivingLicense: {
      number: '44/198204',
      issuingCountry: 'Morocco',
      issueDate: '2008-06-10',
      expiryDate: '2028-06-10',
      categories: ['B'],
      yearsExperience: 18,
      verified: true
    },
    trustScore: 'vip',
    totalBookings: 6,
    totalSpentMAD: 24800,
    depositHistory: {
      totalHeldMAD: 12000,
      refundedFullMAD: 12000,
      withheldMAD: 0
    },
    disputeCount: 0,
    rating: 5.0,
    preferredCity: 'Agadir & Casablanca',
    preferredCategory: 'Sedan & Compact Premium',
    joinedDate: '2023-11-04',
    activeBookingId: 'book-001',
    notes: 'VIP customer. Always returns cars spotless with fuel tank 100% full. Instant booking approval recommended.'
  },
  {
    id: 'client-sophie-dubois',
    fullName: 'Sophie Dubois',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    email: 'sophie.dubois@wanadoo.fr',
    phone: '+33 6 12 34 56 78',
    whatsapp: '+33 6 12 34 56 78',
    nationality: 'French',
    flag: '🇫🇷',
    country: 'France',
    dateOfBirth: '1992-11-22',
    age: 33,
    address: '42 Rue de la République, 69002 Lyon, France',
    cinOrPassport: {
      type: 'passport',
      number: '21FRA889104',
      expiryDate: '2032-04-15',
      verified: true
    },
    drivingLicense: {
      number: 'FR-140928109',
      issuingCountry: 'France',
      issueDate: '2012-03-18',
      expiryDate: '2027-03-18',
      categories: ['B', 'AM'],
      yearsExperience: 14,
      verified: true
    },
    trustScore: 'verified_good',
    totalBookings: 4,
    totalSpentMAD: 19400,
    depositHistory: {
      totalHeldMAD: 10500,
      refundedFullMAD: 10500,
      withheldMAD: 0
    },
    disputeCount: 0,
    rating: 4.95,
    preferredCity: 'Agadir & Taghazout',
    preferredCategory: 'Premium SUV & Luxury Sedan',
    joinedDate: '2024-02-14',
    activeBookingId: 'book-002',
    notes: 'Expatriate and regular tourist in Souss-Massa region. Booked Audi A6 with Mayache Cars.'
  },
  {
    id: 'client-thomas-laurent',
    fullName: 'Thomas Laurent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    email: 't.laurent@outlook.com',
    phone: '+33 6 88 99 00 11',
    whatsapp: '+33 6 88 99 00 11',
    nationality: 'French',
    flag: '🇫🇷',
    country: 'France',
    dateOfBirth: '1995-03-10',
    age: 31,
    address: '18 Rue Paradis, 13006 Marseille, France',
    cinOrPassport: {
      type: 'passport',
      number: '23FRA901248',
      expiryDate: '2033-09-12',
      verified: true
    },
    drivingLicense: {
      number: 'FR-160492810',
      issuingCountry: 'France',
      issueDate: '2015-07-20',
      expiryDate: '2030-07-20',
      categories: ['B'],
      yearsExperience: 11,
      verified: true
    },
    trustScore: 'under_review',
    totalBookings: 2,
    totalSpentMAD: 5800,
    depositHistory: {
      totalHeldMAD: 3600,
      refundedFullMAD: 1800,
      withheldMAD: 1500
    },
    disputeCount: 1,
    rating: 4.5,
    preferredCity: 'Marrakech',
    preferredCategory: 'Economy Hatchback',
    joinedDate: '2025-06-18',
    activeBookingId: 'book-003',
    notes: 'Active dispute on booking AC-2405 regarding 1,500 MAD bumper scratch claim with Atlas Wheels Marrakech.'
  },
  {
    id: 'client-michael-schmidt',
    fullName: 'Michael Schmidt',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    email: 'm.schmidt@berlin-tech.de',
    phone: '+49 171 2345678',
    whatsapp: '+49 171 2345678',
    nationality: 'German',
    flag: '🇩🇪',
    country: 'Germany',
    dateOfBirth: '1982-08-04',
    age: 44,
    address: 'Kantstraße 140, 10623 Berlin, Germany',
    cinOrPassport: {
      type: 'passport',
      number: 'C01X00T47',
      expiryDate: '2031-10-30',
      verified: true
    },
    drivingLicense: {
      number: 'DE-B072R8910',
      issuingCountry: 'Germany',
      issueDate: '2001-09-14',
      expiryDate: '2036-09-14',
      categories: ['B', 'BE', 'A'],
      yearsExperience: 25,
      verified: true
    },
    trustScore: 'vip',
    totalBookings: 3,
    totalSpentMAD: 38400,
    depositHistory: {
      totalHeldMAD: 24000,
      refundedFullMAD: 24000,
      withheldMAD: 0
    },
    disputeCount: 0,
    rating: 5.0,
    preferredCity: 'Casablanca & Rabat',
    preferredCategory: 'Luxury & Sports (Porsche, AMG)',
    joinedDate: '2024-08-01',
    activeBookingId: 'book-004',
    notes: 'Corporate tech executive. High-value repeat renter for premium German luxury fleet.'
  }
];

export const initialAdminVehicles: AdminVehicle[] = [
  {
    id: 'veh-golf-1',
    agencyId: 'agency-mayache',
    agencyName: 'Mayache Cars',
    make: 'Volkswagen',
    model: 'Golf VII',
    year: 2025,
    plate: '4218-A-6',
    city: 'Agadir',
    dailyRate: 490,
    depositAmount: 2000,
    status: 'on_trip',
    isB2bEligible: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
    rating: 4.96,
    tripsCount: 42,
    insuranceExpiry: '2027-01-15',
    technicalInspectionDate: '2026-11-20',
    complianceStatus: 'compliant'
  },
  {
    id: 'veh-audi-1',
    agencyId: 'agency-mayache',
    agencyName: 'Mayache Cars',
    make: 'Audi',
    model: 'A6 40 TDI S-Line',
    year: 2024,
    plate: '9102-B-33',
    city: 'Agadir',
    dailyRate: 720,
    depositAmount: 3500,
    status: 'on_trip',
    isB2bEligible: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
    rating: 4.98,
    tripsCount: 31,
    insuranceExpiry: '2026-12-30',
    technicalInspectionDate: '2026-10-15',
    complianceStatus: 'compliant'
  },
  {
    id: 'veh-amg-1',
    agencyId: 'agency-mayache',
    agencyName: 'Mayache Cars',
    make: 'Mercedes-Benz',
    model: 'AMG GT Coupe',
    year: 2023,
    plate: '1154-A-6',
    city: 'Agadir',
    dailyRate: 1880,
    depositAmount: 8000,
    status: 'available',
    isB2bEligible: false,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
    rating: 5.0,
    tripsCount: 14,
    insuranceExpiry: '2026-10-01',
    technicalInspectionDate: '2026-09-25',
    complianceStatus: 'compliant'
  },
  {
    id: 'veh-clio-rak',
    agencyId: 'agency-atlas-marrakech',
    agencyName: 'Atlas Wheels Marrakech',
    make: 'Renault',
    model: 'Clio 5 Intens',
    year: 2025,
    plate: '7829-B-26',
    city: 'Marrakech',
    dailyRate: 340,
    depositAmount: 1800,
    status: 'on_trip',
    isB2bEligible: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80',
    rating: 4.91,
    tripsCount: 56,
    insuranceExpiry: '2027-02-10',
    technicalInspectionDate: '2026-12-01',
    complianceStatus: 'compliant'
  },
  {
    id: 'veh-range-rak',
    agencyId: 'agency-atlas-marrakech',
    agencyName: 'Atlas Wheels Marrakech',
    make: 'Land Rover',
    model: 'Range Rover Velar',
    year: 2024,
    plate: '3310-A-26',
    city: 'Marrakech',
    dailyRate: 1650,
    depositAmount: 9000,
    status: 'available',
    isB2bEligible: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
    rating: 4.95,
    tripsCount: 22,
    insuranceExpiry: '2026-11-15',
    technicalInspectionDate: '2026-10-10',
    complianceStatus: 'compliant'
  },
  {
    id: 'veh-duster-ozt',
    agencyId: 'agency-sahara-ouarzazate',
    agencyName: 'Sahara Desert Overland',
    make: 'Dacia',
    model: 'Duster 4x4 Prestige',
    year: 2024,
    plate: '8491-D-53',
    city: 'Ouarzazate',
    dailyRate: 480,
    depositAmount: 2500,
    status: 'on_trip',
    isB2bEligible: true,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
    rating: 4.97,
    tripsCount: 38,
    insuranceExpiry: '2026-09-30',
    technicalInspectionDate: '2026-09-15',
    complianceStatus: 'inspection_due'
  },
  {
    id: 'veh-porsche-casa',
    agencyId: 'agency-casa-prestige',
    agencyName: 'Casa Prestige Auto',
    make: 'Porsche',
    model: 'Macan GTS',
    year: 2025,
    plate: '5519-A-1',
    city: 'Casablanca',
    dailyRate: 2100,
    depositAmount: 12000,
    status: 'available',
    isB2bEligible: false,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    rating: 5.0,
    tripsCount: 18,
    insuranceExpiry: '2027-03-01',
    technicalInspectionDate: '2027-01-10',
    complianceStatus: 'compliant'
  }
];

export const initialAdminBookings: AdminBooking[] = [
  {
    id: 'book-001',
    bookingNumber: 'AC-2418',
    agencyId: 'agency-mayache',
    agencyName: 'Mayache Cars',
    clientId: 'client-karim-bennani',
    renterName: 'Karim Bennani',
    renterEmail: 'karim.bennani@gmail.com',
    renterPhone: '+212 661-234567',
    renterCountry: 'Morocco',
    renterFlag: '🇲🇦',
    vehicleId: 'veh-golf-1',
    vehicleName: 'Volkswagen Golf VII',
    vehiclePlate: '4218-A-6',
    vehicleImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
    pickupDate: '2026-09-02',
    pickupTime: '10:00',
    returnDate: '2026-09-09',
    returnTime: '18:00',
    pickupLocation: 'Aéroport Agadir Al Massira (Terminal 1)',
    returnLocation: 'Aéroport Agadir Al Massira (Terminal 1)',
    flightNumber: 'RAM AT-420',
    city: 'Agadir',
    totalAmountMAD: 3430,
    escrowDepositMAD: 2000,
    platformCommissionMAD: 514.5,
    agencyNetMAD: 2915.5,
    status: 'on_trip',
    escrowStatus: 'held',
    createdAt: '2026-08-25T14:22:10Z',

    deviceInfo: {
      channel: 'web',
      ipAddress: '196.200.184.22 (Maroc Telecom ADSL)',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0',
      geoCity: 'Casablanca, Morocco'
    },
    paymentDetails: {
      method: 'cmi_morocco',
      gatewayTransactionId: 'CMI-TXN-9948201',
      authCode: 'AUTH-771920',
      cardLast4: '4219',
      cardBrand: 'Visa / Attijariwafa Gold',
      escrowAccountNumber: 'BAM-ESCROW-007-4491028',
      paidAt: '2026-08-25T14:25:33Z'
    },
    digitalContract: {
      contractNumber: 'CTR-MAY-2026-0881',
      signedAt: '2026-08-25T14:26:01Z',
      signMethod: 'sms_otp',
      sha256Hash: 'a89f3c4e912b7a9f88c340d12e4b6c7a889f3c4e912b7a9f88c340d12e4b6c7a',
      hasSecondDriver: false
    },
    checkInInspection: {
      completedAt: '2026-09-02T10:14:00Z',
      agentName: 'Amine Ayache (Mayache Cars)',
      initialMileageKm: 34120,
      initialFuelLevel: '8/8 (Full Tank)',
      photos: [
        { url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80', angle: 'Front 3/4 Passenger View' },
        { url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80', angle: 'Rear Bumper & Trunk' }
      ],
      notes: 'Car hand-delivered clean outside terminal. Clean rims and original spare tire present.'
    },
    escrowResolution: {
      depositAmountMAD: 2000,
      refundedAmountMAD: 0,
      deductedAmountMAD: 0,
    },
    flowTimeline: [
      {
        step: 1,
        name: 'booking_created',
        title: 'Booking Reservation Submitted',
        description: 'Client selected Golf VII for 7 days in Agadir. Total rental: 3,430 MAD.',
        timestamp: 'Aug 25, 2026 • 14:22',
        status: 'completed',
        actor: 'client'
      },
      {
        step: 2,
        name: 'escrow_captured',
        title: 'Payment & Deposit Secured in Escrow',
        description: 'CMI Morocco pre-authorization: 3,430 MAD rental + 2,000 MAD deposit isolated in Bank Al-Maghrib escrow account.',
        timestamp: 'Aug 25, 2026 • 14:25',
        status: 'completed',
        actor: 'platform_escrow'
      },
      {
        step: 3,
        name: 'agency_confirmed',
        title: 'Agency Accepted & Assigned Vehicle',
        description: 'Mayache Cars confirmed booking in 8 minutes. Assigned plate 4218-A-6.',
        timestamp: 'Aug 25, 2026 • 14:33',
        status: 'completed',
        actor: 'agency'
      },
      {
        step: 4,
        name: 'contract_signed',
        title: 'Digital Contract Signed via OTP',
        description: 'Renter signed contract CTR-MAY-2026-0881. Verified via SMS OTP code to +212 661-234567.',
        timestamp: 'Aug 25, 2026 • 14:36',
        status: 'completed',
        actor: 'client'
      },
      {
        step: 5,
        name: 'check_in_delivery',
        title: 'Key Handover & Check-In Inspection',
        description: 'Vehicle delivered at Agadir Al Massira Airport Terminal 1. Mileage: 34,120 km. Fuel: 8/8. Digital walkaround photos signed.',
        timestamp: 'Sep 02, 2026 • 10:14',
        status: 'completed',
        actor: 'agency'
      },
      {
        step: 6,
        name: 'trip_active',
        title: 'Active Trip On Road',
        description: 'Currently on day 5 of 7. GPS telemetry healthy. Expected return: Sep 09 at 18:00.',
        timestamp: 'Ongoing (Active)',
        status: 'in_progress',
        actor: 'driver'
      },
      {
        step: 7,
        name: 'check_out_return',
        title: 'Return Inspection & Mileage Verification',
        description: 'Scheduled for Sep 09 at Agadir Al Massira Airport Terminal 1.',
        timestamp: 'Sep 09, 2026 • 18:00',
        status: 'pending',
        actor: 'agency'
      },
      {
        step: 8,
        name: 'escrow_release',
        title: 'Security Deposit Release / Settlement',
        description: 'Auto-release of 2,000 MAD back to client card within 2 hours of clean checkout.',
        timestamp: 'Pending Checkout',
        status: 'pending',
        actor: 'platform_escrow'
      }
    ]
  },
  {
    id: 'book-002',
    bookingNumber: 'AC-2419',
    agencyId: 'agency-mayache',
    agencyName: 'Mayache Cars',
    clientId: 'client-sophie-dubois',
    renterName: 'Sophie Dubois',
    renterEmail: 'sophie.dubois@wanadoo.fr',
    renterPhone: '+33 6 12 34 56 78',
    renterCountry: 'France',
    renterFlag: '🇫🇷',
    vehicleId: 'veh-audi-1',
    vehicleName: 'Audi A6 40 TDI S-Line',
    vehiclePlate: '9102-B-33',
    vehicleImage: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=600&q=80',
    pickupDate: '2026-09-04',
    pickupTime: '15:30',
    returnDate: '2026-09-12',
    returnTime: '12:00',
    pickupLocation: 'Aéroport Agadir Al Massira VIP Exit',
    returnLocation: 'Hôtel Paradis Plage Taghazout',
    flightNumber: 'Transavia TO-3120',
    city: 'Agadir',
    totalAmountMAD: 5760,
    escrowDepositMAD: 3500,
    platformCommissionMAD: 864,
    agencyNetMAD: 4896,
    status: 'on_trip',
    escrowStatus: 'held',
    createdAt: '2026-08-28T09:15:00Z',

    deviceInfo: {
      channel: 'mobile_app',
      ipAddress: '82.127.88.19 (Orange France)',
      userAgent: 'AirbcarApp-iOS/2.4.0 (iPhone 15 Pro)',
      geoCity: 'Lyon, France'
    },
    paymentDetails: {
      method: 'apple_pay',
      gatewayTransactionId: 'STRIPE-APPLE-881920',
      authCode: 'APAY-441029',
      cardLast4: '8810',
      cardBrand: 'Mastercard World Elite',
      escrowAccountNumber: 'BAM-ESCROW-007-4491028',
      paidAt: '2026-08-28T09:18:22Z'
    },
    digitalContract: {
      contractNumber: 'CTR-MAY-2026-0889',
      signedAt: '2026-08-28T09:20:00Z',
      signMethod: 'digital_canvas',
      sha256Hash: 'b49f2c1e882a1a8c77d230f11e3b5c6b778e2c3d881b6a8e77c230d11e3b5c6b',
      hasSecondDriver: false
    },
    checkInInspection: {
      completedAt: '2026-09-04T15:45:00Z',
      agentName: 'Yassine Ayache (Mayache Cars)',
      initialMileageKm: 18450,
      initialFuelLevel: '8/8 (Full Tank)',
      photos: [
        { url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=400&q=80', angle: 'Audi A6 Exterior Walkaround' }
      ],
      notes: 'Customer met at airport terminal. Delivered with bottle of mineral water and phone charger.'
    },
    escrowResolution: {
      depositAmountMAD: 3500,
      refundedAmountMAD: 0,
      deductedAmountMAD: 0,
    },
    flowTimeline: [
      {
        step: 1,
        name: 'booking_created',
        title: 'Booking Reservation Submitted',
        description: 'Audi A6 40 TDI S-Line requested for 8 days in Agadir & Taghazout.',
        timestamp: 'Aug 28, 2026 • 09:15',
        status: 'completed',
        actor: 'client'
      },
      {
        step: 2,
        name: 'escrow_captured',
        title: 'Escrow Deposit Held (3,500 MAD)',
        description: 'Apple Pay transaction confirmed. 3,500 MAD security deposit isolated.',
        timestamp: 'Aug 28, 2026 • 09:18',
        status: 'completed',
        actor: 'platform_escrow'
      },
      {
        step: 3,
        name: 'agency_confirmed',
        title: 'Agency Accepted Booking',
        description: 'Mayache Cars confirmed booking. Special delivery to Taghazout acknowledged.',
        timestamp: 'Aug 28, 2026 • 09:25',
        status: 'completed',
        actor: 'agency'
      },
      {
        step: 4,
        name: 'contract_signed',
        title: 'Digital Contract Completed',
        description: 'Signed on mobile app with biometric touch signature.',
        timestamp: 'Aug 28, 2026 • 09:30',
        status: 'completed',
        actor: 'client'
      },
      {
        step: 5,
        name: 'check_in_delivery',
        title: 'Vehicle Handed Over at Airport',
        description: 'Mileage: 18,450 km. Fuel: 8/8 full tank.',
        timestamp: 'Sep 04, 2026 • 15:45',
        status: 'completed',
        actor: 'agency'
      },
      {
        step: 6,
        name: 'trip_active',
        title: 'Active Rental In Progress',
        description: 'Vehicle currently at Taghazout Bay. Due for return on Sep 12.',
        timestamp: 'Ongoing (Active)',
        status: 'in_progress',
        actor: 'driver'
      },
      {
        step: 7,
        name: 'check_out_return',
        title: 'Return Inspection',
        description: 'Pickup scheduled at Paradis Plage Taghazout.',
        timestamp: 'Sep 12, 2026 • 12:00',
        status: 'pending',
        actor: 'agency'
      },
      {
        step: 8,
        name: 'escrow_release',
        title: 'Release 3,500 MAD Escrow',
        description: 'Automatic release upon checkout completion.',
        timestamp: 'Pending Return',
        status: 'pending',
        actor: 'platform_escrow'
      }
    ]
  },
  {
    id: 'book-003',
    bookingNumber: 'AC-2405',
    agencyId: 'agency-atlas-marrakech',
    agencyName: 'Atlas Wheels Marrakech',
    clientId: 'client-thomas-laurent',
    renterName: 'Thomas Laurent',
    renterEmail: 't.laurent@outlook.com',
    renterPhone: '+33 6 88 99 00 11',
    renterCountry: 'France',
    renterFlag: '🇫🇷',
    vehicleId: 'veh-clio-rak',
    vehicleName: 'Renault Clio 5 Intens',
    vehiclePlate: '7829-B-26',
    vehicleImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80',
    pickupDate: '2026-08-20',
    pickupTime: '11:00',
    returnDate: '2026-08-27',
    returnTime: '11:00',
    pickupLocation: 'Aéroport Marrakech Menara (RAK)',
    returnLocation: 'Aéroport Marrakech Menara (RAK)',
    flightNumber: 'Air France AF-1422',
    city: 'Marrakech',
    totalAmountMAD: 2380,
    escrowDepositMAD: 1800,
    platformCommissionMAD: 309.4,
    agencyNetMAD: 2070.6,
    status: 'disputed',
    escrowStatus: 'disputed_freeze',
    createdAt: '2026-08-15T16:40:00Z',

    deviceInfo: {
      channel: 'web',
      ipAddress: '88.164.210.45 (Free SAS Marseille)',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      geoCity: 'Marseille, France'
    },
    paymentDetails: {
      method: 'visa_mastercard',
      gatewayTransactionId: 'CMI-TXN-8829104',
      authCode: 'AUTH-339102',
      cardLast4: '5521',
      cardBrand: 'Visa Classic BNP Paribas',
      escrowAccountNumber: 'BAM-ESCROW-101-9988102',
      paidAt: '2026-08-15T16:44:11Z'
    },
    digitalContract: {
      contractNumber: 'CTR-ATL-2026-0492',
      signedAt: '2026-08-15T16:45:00Z',
      signMethod: 'sms_otp',
      sha256Hash: 'c77e2b1a889f3c4e912b7a9f88c340d12e4b6c7aa89f3c4e912b7a9f88c340d1',
      hasSecondDriver: false
    },
    checkInInspection: {
      completedAt: '2026-08-20T11:15:00Z',
      agentName: 'Tariq Alami (Atlas Wheels Marrakech)',
      initialMileageKm: 42100,
      initialFuelLevel: '8/8 (Full Tank)',
      photos: [
        { url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=400&q=80', angle: 'Pre-trip Walkaround (Shows minor rear scuff)' }
      ],
      notes: 'Vehicle inspected in daylight at RAK Menara terminal parking.'
    },
    checkOutInspection: {
      completedAt: '2026-08-27T11:30:00Z',
      agentName: 'Mehdi Benjelloun (Atlas Wheels Marrakech)',
      returnMileageKm: 43240,
      returnFuelLevel: '8/8',
      photos: [
        { url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80', angle: 'Agency return photo claiming scratch enlarged' }
      ],
      conditionVerdict: 'damage_claim',
      notes: 'Agency flagged 1,500 MAD deduction for paint buffing. Client contested claiming pre-existing damage.'
    },
    escrowResolution: {
      depositAmountMAD: 1800,
      refundedAmountMAD: 0,
      deductedAmountMAD: 0,
      deductionReason: 'Frozen in escrow pending Admin arbitration decision (Case DISP-2026-081).'
    },
    flowTimeline: [
      {
        step: 1,
        name: 'booking_created',
        title: 'Booking Reservation Submitted',
        description: 'Clio 5 reserved for 7 days in Marrakech.',
        timestamp: 'Aug 15, 2026 • 16:40',
        status: 'completed',
        actor: 'client'
      },
      {
        step: 2,
        name: 'escrow_captured',
        title: '1,800 MAD Deposit Secured in Escrow',
        description: 'Payment authorized and deposit held.',
        timestamp: 'Aug 15, 2026 • 16:44',
        status: 'completed',
        actor: 'platform_escrow'
      },
      {
        step: 3,
        name: 'agency_confirmed',
        title: 'Atlas Wheels Confirmed',
        description: 'Agency accepted booking.',
        timestamp: 'Aug 15, 2026 • 16:50',
        status: 'completed',
        actor: 'agency'
      },
      {
        step: 4,
        name: 'contract_signed',
        title: 'Digital Contract Executed',
        description: 'Signed via SMS OTP.',
        timestamp: 'Aug 15, 2026 • 16:55',
        status: 'completed',
        actor: 'client'
      },
      {
        step: 5,
        name: 'check_in_delivery',
        title: 'Vehicle Handed Over at Airport',
        description: 'Mileage: 42,100 km. Walkaround photo uploaded.',
        timestamp: 'Aug 20, 2026 • 11:15',
        status: 'completed',
        actor: 'agency'
      },
      {
        step: 6,
        name: 'trip_completed',
        title: 'Trip Finished & Returned',
        description: 'Vehicle returned to RAK airport.',
        timestamp: 'Aug 27, 2026 • 11:30',
        status: 'completed',
        actor: 'driver'
      },
      {
        step: 7,
        name: 'dispute_raised',
        title: 'Dispute Raised by Agency / Contested by Renter',
        description: 'Agency claimed 1,500 MAD from deposit. Renter filed dispute showing check-in video.',
        timestamp: 'Aug 28, 2026 • 10:00',
        status: 'disputed',
        actor: 'agency'
      },
      {
        step: 8,
        name: 'escrow_freeze',
        title: 'Escrow Frozen for HQ Arbitration',
        description: 'Deposit locked. Awaiting Super Admin decision in Dispute Desk.',
        timestamp: 'Aug 28, 2026 • 10:15',
        status: 'disputed',
        actor: 'platform_escrow'
      }
    ]
  },
  {
    id: 'book-004',
    bookingNumber: 'AC-2398',
    agencyId: 'agency-casa-prestige',
    agencyName: 'Casa Prestige Auto',
    clientId: 'client-michael-schmidt',
    renterName: 'Michael Schmidt',
    renterEmail: 'm.schmidt@berlin-tech.de',
    renterPhone: '+49 171 2345678',
    renterCountry: 'Germany',
    renterFlag: '🇩🇪',
    vehicleId: 'veh-porsche-casa',
    vehicleName: 'Porsche Macan GTS',
    vehiclePlate: '5519-A-1',
    vehicleImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    pickupDate: '2026-08-18',
    pickupTime: '09:00',
    returnDate: '2026-08-24',
    returnTime: '18:00',
    pickupLocation: 'Aéroport Mohammed V (CMN) Terminal 2 VIP',
    returnLocation: 'Aéroport Mohammed V (CMN) Terminal 2 VIP',
    flightNumber: 'Lufthansa LH-1330',
    city: 'Casablanca',
    totalAmountMAD: 12600,
    escrowDepositMAD: 12000,
    platformCommissionMAD: 1890,
    agencyNetMAD: 10710,
    status: 'completed',
    escrowStatus: 'released_to_renter',
    createdAt: '2026-08-10T11:00:00Z',

    deviceInfo: {
      channel: 'web',
      ipAddress: '194.39.218.11 (Deutsche Telekom)',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      geoCity: 'Frankfurt, Germany'
    },
    paymentDetails: {
      method: 'visa_mastercard',
      gatewayTransactionId: 'CMI-TXN-7719203',
      authCode: 'AUTH-991024',
      cardLast4: '9918',
      cardBrand: 'Visa Infinite Commerzbank',
      escrowAccountNumber: 'BAM-ESCROW-011-3391028',
      paidAt: '2026-08-10T11:05:00Z'
    },
    digitalContract: {
      contractNumber: 'CTR-CAS-2026-0312',
      signedAt: '2026-08-10T11:08:00Z',
      signMethod: 'sms_otp',
      sha256Hash: 'e99b2c1a889f3c4e912b7a9f88c340d12e4b6c7aa89f3c4e912b7a9f88c340d2',
      hasSecondDriver: false
    },
    checkInInspection: {
      completedAt: '2026-08-18T09:10:00Z',
      agentName: 'Salma Tazi (Casa Prestige Auto)',
      initialMileageKm: 14200,
      initialFuelLevel: '8/8 (Full Tank)',
      photos: [
        { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80', angle: 'Pristine Porsche Macan condition' }
      ],
      notes: 'VIP client welcome at VIP lounge Casablanca Mohammed V.'
    },
    checkOutInspection: {
      completedAt: '2026-08-24T18:15:00Z',
      agentName: 'Kenza Benmoussa (Casa Prestige Auto)',
      returnMileageKm: 15380,
      returnFuelLevel: '8/8',
      photos: [
        { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80', angle: 'Pristine condition verified' }
      ],
      conditionVerdict: 'clean_perfect',
      notes: 'Returned in flawless condition with full tank of Total Excellium 98.'
    },
    escrowResolution: {
      depositAmountMAD: 12000,
      refundedAmountMAD: 12000,
      deductedAmountMAD: 0,
      releasedAt: '2026-08-24T18:30:00Z',
      transactionRef: 'CMI-REFUND-9918203'
    },
    flowTimeline: [
      {
        step: 1,
        name: 'booking_created',
        title: 'Booking Created',
        description: 'Porsche Macan GTS reserved for 6 days in Casablanca.',
        timestamp: 'Aug 10, 2026 • 11:00',
        status: 'completed',
        actor: 'client'
      },
      {
        step: 2,
        name: 'escrow_captured',
        title: 'Escrow Secured (12,000 MAD)',
        description: 'Deposit and rental pre-authorized on Visa Infinite.',
        timestamp: 'Aug 10, 2026 • 11:05',
        status: 'completed',
        actor: 'platform_escrow'
      },
      {
        step: 3,
        name: 'agency_confirmed',
        title: 'Casa Prestige Confirmed',
        description: 'VIP preparation of vehicle.',
        timestamp: 'Aug 10, 2026 • 11:15',
        status: 'completed',
        actor: 'agency'
      },
      {
        step: 4,
        name: 'contract_signed',
        title: 'Digital Contract Signed',
        description: 'Signed via OTP.',
        timestamp: 'Aug 10, 2026 • 11:20',
        status: 'completed',
        actor: 'client'
      },
      {
        step: 5,
        name: 'check_in_delivery',
        title: 'Key Handover at Terminal 2',
        description: 'Mileage: 14,200 km. Tank 8/8.',
        timestamp: 'Aug 18, 2026 • 09:10',
        status: 'completed',
        actor: 'agency'
      },
      {
        step: 6,
        name: 'trip_completed',
        title: 'Trip Completed',
        description: 'Total distance driven: 1,180 km.',
        timestamp: 'Aug 24, 2026 • 18:15',
        status: 'completed',
        actor: 'driver'
      },
      {
        step: 7,
        name: 'check_out_return',
        title: 'Check-Out Return Inspection',
        description: 'Zero damage detected. Inspection verified clean.',
        timestamp: 'Aug 24, 2026 • 18:20',
        status: 'completed',
        actor: 'agency'
      },
      {
        step: 8,
        name: 'escrow_release',
        title: '12,000 MAD Deposit Released to Card',
        description: 'Instant CMI refund issued. Authorization released.',
        timestamp: 'Aug 24, 2026 • 18:30',
        status: 'completed',
        actor: 'platform_escrow'
      }
    ]
  }
];

export const initialAdminDisputes: AdminDispute[] = [
  {
    id: 'disp-001',
    disputeNumber: 'DISP-2026-081',
    bookingNumber: 'AC-2405',
    agencyId: 'agency-atlas-marrakech',
    agencyName: 'Atlas Wheels Marrakech',
    renterName: 'Thomas Laurent',
    renterEmail: 't.laurent@outlook.com',
    renterPhone: '+33 6 88 99 00 11',
    vehicleName: 'Renault Clio 5 Intens',
    vehiclePlate: '7829-B-26',
    amountInDisputeMAD: 1500,
    dateOpened: '2026-08-28',
    status: 'open',
    issueType: 'deposit_deduction',
    renterClaim: 'The agency charged 1,500 MAD from my deposit for a surface scratch on the lower rear bumper. I provided my check-in walkaround video timestamped Aug 20 showing the exact scratch was already there when I collected the car at Marrakech Menara Airport.',
    agencyClaim: 'Our inspection staff claims the scratch was enlarged and scuffed into the underbody paint. The pre-trip digital contract has a signature acknowledging car condition.',
    evidencePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80',
        caption: 'Renter Pre-Trip Walkaround Photo showing pre-existing mark on bumper (Aug 20)',
        uploadedBy: 'renter'
      },
      {
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
        caption: 'Agency Return Inspection sheet noting scratch at airport terminal (Aug 27)',
        uploadedBy: 'agency'
      }
    ]
  },
  {
    id: 'disp-002',
    disputeNumber: 'DISP-2026-079',
    bookingNumber: 'AC-2412',
    agencyId: 'agency-med-tangier',
    agencyName: 'Med Express Location',
    renterName: 'Sarah Jenkins',
    renterEmail: 'sarah.j@london-travel.co.uk',
    renterPhone: '+44 7700 900123',
    vehicleName: 'Hyundai Tucson N-Line',
    vehiclePlate: '6102-A-40',
    amountInDisputeMAD: 450,
    dateOpened: '2026-09-01',
    status: 'under_investigation',
    issueType: 'pickup_delay',
    renterClaim: 'Flight from London Gatwick to Tangier was delayed by 2.5 hours. I updated the agency via WhatsApp 3 hours prior. When I landed at 23:45, the agent charged a 450 MAD "out-of-hours delivery fee" that was not disclosed in the listing policies.',
    agencyClaim: 'Airport staff had to wait beyond midnight (00:30). Our night surcharge is standard practice in Tangier during peak summer season.',
    evidencePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
        caption: 'Boarding pass and flight delay notification from airline',
        uploadedBy: 'renter'
      }
    ]
  }
];

export const initialAdminPayoutBatches: AdminPayoutBatch[] = [
  {
    id: 'batch-2026-w35',
    batchNumber: 'BATCH-SEP-2026-W1',
    period: 'Aug 25, 2026 – Aug 31, 2026',
    totalAmountMAD: 318400,
    totalCommissionMAD: 56188,
    agenciesCount: 6,
    status: 'draft',
    createdAt: '2026-09-01',
    items: [
      {
        agencyId: 'agency-atlas-marrakech',
        agencyName: 'Atlas Wheels Marrakech',
        rib: '101 220 2121100984728192 18',
        bankName: 'Banque Populaire (BCP)',
        grossVolumeMAD: 159540,
        commissionMAD: 20740,
        netPayoutMAD: 138800,
        tripsCount: 28,
        status: 'pending'
      },
      {
        agencyId: 'agency-casa-prestige',
        agencyName: 'Casa Prestige Auto',
        rib: '011 780 0004928172910482 91',
        bankName: 'BMCE Bank of Africa',
        grossVolumeMAD: 97650,
        commissionMAD: 14650,
        netPayoutMAD: 83000,
        tripsCount: 16,
        status: 'pending'
      },
      {
        agencyId: 'agency-med-tangier',
        agencyName: 'Med Express Location',
        rib: '230 640 0019283746192837 55',
        bankName: 'CIH Bank',
        grossVolumeMAD: 44700,
        commissionMAD: 6700,
        netPayoutMAD: 38000,
        tripsCount: 9,
        status: 'pending'
      },
      {
        agencyId: 'agency-mayache',
        agencyName: 'Mayache Cars',
        rib: '007 010 0001234567890123 44',
        bankName: 'Attijariwafa Bank',
        grossVolumeMAD: 42700,
        commissionMAD: 6400,
        netPayoutMAD: 36300,
        tripsCount: 8,
        status: 'pending'
      },
      {
        agencyId: 'agency-sahara-ouarzazate',
        agencyName: 'Sahara Desert Overland',
        rib: '225 790 0009182736451928 32',
        bankName: 'Crédit Agricole du Maroc (CAM)',
        grossVolumeMAD: 26740,
        commissionMAD: 3740,
        netPayoutMAD: 23000,
        tripsCount: 6,
        status: 'pending'
      }
    ]
  },
  {
    id: 'batch-2026-w34',
    batchNumber: 'BATCH-AUG-2026-W4',
    period: 'Aug 18, 2026 – Aug 24, 2026',
    totalAmountMAD: 284500,
    totalCommissionMAD: 50200,
    agenciesCount: 5,
    status: 'settled',
    createdAt: '2026-08-25',
    executedAt: '2026-08-26',
    items: []
  }
];

export const initialPlatformSettings: PlatformSettings = {
  platformCommissionPct: 15,
  minimumDepositMAD: 1000,
  minimumRenterAge: 21,
  disputeResolutionWindowHours: 48,
  instantPayoutThresholdMAD: 50000,
  maintenanceMode: false,
  activeCities: [
    { city: 'Marrakech', region: 'Marrakech-Safi', enabled: true, agenciesCount: 14, vehiclesCount: 112 },
    { city: 'Casablanca', region: 'Casablanca-Settat', enabled: true, agenciesCount: 12, vehiclesCount: 98 },
    { city: 'Agadir', region: 'Souss-Massa', enabled: true, agenciesCount: 9, vehiclesCount: 64 },
    { city: 'Tangier', region: 'Tanger-Tétouan-Al Hoceïma', enabled: true, agenciesCount: 8, vehiclesCount: 58 },
    { city: 'Rabat', region: 'Rabat-Salé-Kénitra', enabled: true, agenciesCount: 6, vehiclesCount: 42 },
    { city: 'Fes', region: 'Fès-Meknès', enabled: true, agenciesCount: 5, vehiclesCount: 36 },
    { city: 'Ouarzazate', region: 'Drâa-Tafilalet', enabled: true, agenciesCount: 3, vehiclesCount: 22 },
    { city: 'Essaouira', region: 'Marrakech-Safi', enabled: true, agenciesCount: 2, vehiclesCount: 16 },
    { city: 'Nador', region: 'Oriental', enabled: false, agenciesCount: 1, vehiclesCount: 8 }
  ]
};
