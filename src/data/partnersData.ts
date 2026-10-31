import { PartnerProfileData } from '../types';

export const partnersData: Record<string, PartnerProfileData> = {
  '5': {
    id: '5',
    name: 'Mayache Prestige Cars',
    tradingName: 'Mayache Location & Luxury Fleet SARL',
    licenseNumber: 'DAHIR-2026-TTU-0058',
    city: 'Tetouan',
    address: 'Boulevard Mohamed V, Imm. Al Andalous, 93000 Tetouan, Morocco',
    phone: '+212 539 98 44 20',
    whatsapp: '+212 661 24 55 88',
    email: 'contact@mayachecars.ma',
    rating: 4.95,
    reviewCount: 310,
    completedTrips: 1840,
    responseRate: '100%',
    responseTime: '< 15 mins',
    zeroDisputeRate: '99.4%',
    foundedYear: 2018,
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80',
    logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=300&q=80',
    bio: 'Family-owned mobility artisan based in Tetouan for over 8 years. We specialize in pristine premium sedans, dune-ready 4x4s, and reliable family vehicles for travelers exploring the Rif mountains, the Mediterranean corniche, and northern imperial cities.',
    manifesto: 'We believe renting a car in Morocco should be as dignified and unhurried as sharing a pot of mint tea. No hidden franchises, no scratched bumper traps, and no middlemen taking 30% from local people who know these roads by heart.',
    operatingHours: 'Monday – Sunday: 08:00 – 21:00 (Airport Handover 24/7 on Reservation)',
    airportDelivery: [
      'Tetouan Sania Ramel Airport (TTU) — Free meet & greet',
      'Tangier Ibn Battouta Airport (TNG) — Direct delivery (100 DH)',
      'Port Tanger Med / Passenger Terminal',
      'Hotel & Riad delivery across Martil, Cabo Negro, Marina Smir & Mdiq'
    ],
    features: [
      'Dahir 2026 Certified Digital Contracts with biometric e-signature',
      'CMI Pre-Authorized Security Deposits — never debited, auto-released in 48h',
      'Wafa Assurance All-Risks Fleet Insurance with zero customer excess',
      'Child booster seats & high-speed 4G Morocco travel Wi-Fi on request',
      '24/7 Local Rif Roadside Assistance & vehicle replacement guarantee'
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Karim Bennani',
        location: 'Casablanca',
        rating: 5,
        date: 'August 2026',
        carRented: 'Mercedes-Benz C-Class 2024',
        comment: 'Incredible experience in Tetouan. Car delivered spotless at Sania Ramel airport with digital contract ready on tablet. No awkward paper negotiations. Returning was just a 3-minute walkaround. Outstanding agency.',
        verified: true
      },
      {
        id: 'rev-2',
        author: 'Sophie & Marc Laurent',
        location: 'Lyon, France',
        rating: 5,
        date: 'July 2026',
        carRented: 'Honda Civic Type R 2024',
        comment: 'We spent 10 days driving from Tetouan through Chefchaouen to Akchour. The Honda was in showroom condition and Mayache team gave us the best local scenic tips. Highly recommended!',
        verified: true
      },
      {
        id: 'rev-3',
        author: 'Youssef El Amrani',
        location: 'Madrid, Spain',
        rating: 5,
        date: 'June 2026',
        carRented: 'Range Rover Velar 2024',
        comment: 'Pre-authorized deposit via Moroccan CMI bank was seamless and released right after my flight took off. Very polite staff and honest pricing. Will definitely book again next summer.',
        verified: true
      },
      {
        id: 'rev-4',
        author: 'Nadia Mansouri',
        location: 'Rabat',
        rating: 5,
        date: 'May 2026',
        carRented: 'Dacia Duster 4x4 2024',
        comment: 'The Duster tackled the steep mountain roads effortlessly. Clean, full tank of fuel, and rapid WhatsApp replies when we needed parking advice in Cabo Negro.',
        verified: true
      }
    ]
  },
  '1': {
    id: '1',
    name: 'Rif Express Location',
    tradingName: 'Rif Express Car & Tourism Services SARL',
    licenseNumber: 'DAHIR-2026-TTU-0021',
    city: 'Tetouan',
    address: 'Avenue 9 Avril, Tetouan Centre, Morocco',
    phone: '+212 539 96 12 34',
    whatsapp: '+212 662 11 33 55',
    email: 'contact@rifexpress.ma',
    rating: 4.90,
    reviewCount: 184,
    completedTrips: 920,
    responseRate: '98%',
    responseTime: '< 20 mins',
    zeroDisputeRate: '99.1%',
    foundedYear: 2020,
    coverImage: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&w=1600&q=80',
    logo: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=300&q=80',
    bio: 'Dedicated local fleet in northern Morocco specializing in sports and compact sedans for independent adventurers and summer families.',
    manifesto: 'Clear terms, spotless motors, and genuine hospitality from our family to yours.',
    operatingHours: 'Monday – Sunday: 08:30 – 20:30',
    airportDelivery: [
      'Tetouan Sania Ramel Airport (TTU)',
      'Tangier Port & Train Station'
    ],
    features: [
      'Dahir 2026 compliant e-signature contracts',
      'CMI deposit guarantee',
      'All-inclusive comprehensive insurance',
      'Free additional driver included'
    ],
    reviews: [
      {
        id: 'rev-rif-1',
        author: 'Amine Kabbaj',
        location: 'Tangier',
        rating: 5,
        date: 'August 2026',
        carRented: 'Honda Civic Type R 2024',
        comment: 'Great team, very fast pickup process in central Tetouan.',
        verified: true
      }
    ]
  }
};

export const getPartnerById = (id: string): PartnerProfileData | undefined => {
  return partnersData[id] || partnersData['5'];
};
