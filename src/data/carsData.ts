import { CarListing } from '../types';

export const allCarsData: CarListing[] = [
  {
    id: '1',
    name: 'Honda Civic R 2024',
    brand: 'Honda',
    model: 'Civic Type R',
    year: 2024,
    category: 'Sedan',
    location: 'Tetouan',
    city: 'Tetouan',
    coordinates: {
      lat: 35.5840,
      lng: -5.3520
    },
    rating: 0.0,
    reviewsCount: 0,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuel: 'gasoline',
    airConditioning: true,
    dailyRate: 900,
    currency: 'DH',
    images: [
      'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    agency: {
      id: '1',
      name: 'Rif Express Location',
      city: 'Tetouan',
      verified: true,
      rating: 4.9,
      completedTrips: 184,
      phone: '+212 539 96 12 34',
      address: 'Avenue 9 Avril, Tetouan Centre'
    },
    features: [
      'Brembo Performance Brakes',
      'Apple CarPlay & Android Auto',
      'Digital Cockpit Display',
      'Rearview Camera & Park Sensors',
      'Dual-Zone Automatic Climate Control',
      'Adaptive Cruise Control'
    ],
    depositAmount: 5000,
    minAge: 23,
    mileageLimit: 'Unlimited km included',
    description: 'The 2024 Honda Civic Type R pairs racetrack-inspired performance with refined daily comfort. Perfectly suited for scenic coastal routes along Martil, Cabo Negro, and the Mediterranean Rif corniche.'
  },
  {
    id: '4',
    name: 'Mercedes-Benz C-Class 2024',
    brand: 'Mercedes-Benz',
    model: 'C-Class AMG Line',
    year: 2024,
    category: 'Sedan',
    location: 'Tetouan',
    city: 'Tetouan',
    coordinates: {
      lat: 35.5785,
      lng: -5.3684
    },
    rating: 0.0,
    reviewsCount: 0,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuel: 'gasoline',
    airConditioning: true,
    dailyRate: 950,
    currency: 'DH',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    agency: {
      id: '5',
      name: 'Mayache Prestige Cars',
      city: 'Tetouan',
      verified: true,
      rating: 4.95,
      completedTrips: 310,
      phone: '+212 539 98 44 20',
      address: 'Boulevard Mohamed V, Tetouan'
    },
    features: [
      'AMG Line Exterior Styling',
      'Burmester 3D Surround Sound',
      'MBUX Augmented Reality Navigation',
      'Heated Leather Seats with Memory',
      '360° Parking Camera',
      'Panoramic Sliding Sunroof'
    ],
    depositAmount: 7000,
    minAge: 25,
    mileageLimit: 'Unlimited km included',
    description: 'Travel through northern Morocco in executive prestige. This brand new Mercedes C-Class offers supreme acoustic insulation, mild-hybrid fuel efficiency, and state-of-the-art driver assistance.'
  },
  {
    id: '2',
    name: 'BMW M4 2024',
    brand: 'BMW',
    model: 'M4 Competition',
    year: 2024,
    category: 'Coupe',
    location: 'Tetouan',
    city: 'Tetouan',
    coordinates: {
      lat: 35.5670,
      lng: -5.3850
    },
    rating: 0.0,
    reviewsCount: 0,
    seats: 5,
    doors: 2,
    transmission: 'automatic',
    fuel: 'gasoline',
    airConditioning: true,
    dailyRate: 1250,
    currency: 'DH',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    agency: {
      name: 'Tamouda Luxury Fleet',
      city: 'Tetouan',
      verified: true,
      rating: 4.88,
      completedTrips: 98,
      phone: '+212 539 71 88 00',
      address: 'Marina Smir / Cabo Negro Avenue'
    },
    features: [
      'M xDrive All-Wheel System',
      'Harman Kardon Premium Audio',
      'Carbon Fiber Interior Package',
      'Active M Differential',
      'Head-Up Display',
      'Wireless Smartphone Charging'
    ],
    depositAmount: 10000,
    minAge: 26,
    mileageLimit: '300 km/day (5 DH/extra km)',
    description: 'A pure adrenaline machine tailored for Morocco coastal boulevards and mountain routes. Alpine white finish with striking silhouette and thrilling acceleration.'
  },
  {
    id: '3',
    name: 'Dacia Duster 4x4 2024',
    brand: 'Dacia',
    model: 'Duster Prestige 4x4',
    year: 2024,
    category: '4x4',
    location: 'Tetouan',
    city: 'Tetouan',
    coordinates: {
      lat: 35.5910,
      lng: -5.3400
    },
    rating: 4.9,
    reviewsCount: 42,
    seats: 5,
    doors: 4,
    transmission: 'manual',
    fuel: 'diesel',
    airConditioning: true,
    dailyRate: 450,
    currency: 'DH',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    agency: {
      name: 'Rif Express Location',
      city: 'Tetouan',
      verified: true,
      rating: 4.9,
      completedTrips: 184,
      phone: '+212 539 96 12 34',
      address: 'Avenue 9 Avril, Tetouan Centre'
    },
    features: [
      'Genuine 4x4 All-Terrain Mode',
      'High Ground Clearance (217 mm)',
      'Hill Descent Control',
      'Multi-view 4-Camera System',
      'Rugged Roof Bars for luggage',
      'Very Economical Diesel Engine (4.8L/100km)'
    ],
    depositAmount: 3000,
    minAge: 21,
    mileageLimit: 'Unlimited km included',
    description: 'The national champion for exploring Morocco. Ready for the winding mountain roads between Tetouan, Chefchaouen, and Akchour waterfalls.'
  },
  {
    id: '5',
    name: 'Range Rover Velar 2024',
    brand: 'Land Rover',
    model: 'Velar R-Dynamic',
    year: 2024,
    category: 'SUV',
    location: 'Tetouan',
    city: 'Tetouan',
    coordinates: {
      lat: 35.5720,
      lng: -5.3610
    },
    rating: 4.98,
    reviewsCount: 19,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuel: 'diesel',
    airConditioning: true,
    dailyRate: 1600,
    currency: 'DH',
    images: [
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    agency: {
      name: 'Tamouda Luxury Fleet',
      city: 'Tetouan',
      verified: true,
      rating: 4.88,
      completedTrips: 98,
      phone: '+212 539 71 88 00',
      address: 'Marina Smir / Cabo Negro Avenue'
    },
    features: [
      'Terrain Response 2 AWD',
      'Meridian 3D Audio System',
      'Flush Deployable Door Handles',
      'Interactive Driver Display',
      'Electronic Air Suspension',
      'Matrix LED Headlamps'
    ],
    depositAmount: 12000,
    minAge: 26,
    mileageLimit: 'Unlimited km included',
    description: 'Avant-garde luxury meets all-weather capability. Flawlessly smooth ride with striking road presence across Tetouan, Tangier, and Asilah.'
  },
  {
    id: '6',
    name: 'Volkswagen Golf 8 2024',
    brand: 'Volkswagen',
    model: 'Golf 8 R-Line',
    year: 2024,
    category: 'City',
    location: 'Casablanca',
    city: 'Casablanca',
    coordinates: {
      lat: 33.5731,
      lng: -7.5898
    },
    rating: 4.92,
    reviewsCount: 65,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuel: 'diesel',
    airConditioning: true,
    dailyRate: 650,
    currency: 'DH',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
    ],
    agency: {
      name: 'Atlas Drive Casablanca',
      city: 'Casablanca',
      verified: true,
      rating: 4.9,
      completedTrips: 420,
      phone: '+212 522 30 11 22',
      address: 'Bd d’Anfa, Casablanca'
    },
    features: [
      'Digital Cockpit Pro',
      'Keyless Entry & Start',
      'Front & Rear Parking Sensors',
      'CarPlay / Android Auto'
    ],
    depositAmount: 4000,
    minAge: 22,
    mileageLimit: 'Unlimited km included',
    description: 'Compact, nimble, and refined. The definitive hatchback for city navigation and intercity highway transit.'
  },
  {
    id: '7',
    name: 'Porsche 911 Carrera Cabrio 2024',
    brand: 'Porsche',
    model: '911 Carrera Cabriolet',
    year: 2024,
    category: 'Convertible',
    location: 'Marrakech',
    city: 'Marrakech',
    coordinates: {
      lat: 31.6295,
      lng: -7.9811
    },
    rating: 5.0,
    reviewsCount: 14,
    seats: 4,
    doors: 2,
    transmission: 'automatic',
    fuel: 'gasoline',
    airConditioning: true,
    dailyRate: 2800,
    currency: 'DH',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
    ],
    agency: {
      name: 'Marrakech Royal Prestige',
      city: 'Marrakech',
      verified: true,
      rating: 4.98,
      completedTrips: 215,
      phone: '+212 524 43 90 00',
      address: 'Hivernage Luxury District, Marrakech'
    },
    features: [
      'Fabric Cabriolet Roof opens in 12s',
      'PASM Sport Suspension',
      'Sport Chrono Package',
      'Bose Surround Sound'
    ],
    depositAmount: 18000,
    minAge: 27,
    mileageLimit: '250 km/day',
    description: 'Unfiltered open-top exhilaration under the Moroccan sun with the Atlas mountains on the horizon.'
  },
  {
    id: '8',
    name: 'Peugeot 208 2024',
    brand: 'Peugeot',
    model: '208 Allure',
    year: 2024,
    category: 'City',
    location: 'Tetouan',
    city: 'Tetouan',
    coordinates: {
      lat: 35.5800,
      lng: -5.3600
    },
    rating: 4.87,
    reviewsCount: 29,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuel: 'gasoline',
    airConditioning: true,
    dailyRate: 350,
    currency: 'DH',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    agency: {
      name: 'Rif Express Location',
      city: 'Tetouan',
      verified: true,
      rating: 4.9,
      completedTrips: 184,
      phone: '+212 539 96 12 34',
      address: 'Avenue 9 Avril, Tetouan Centre'
    },
    features: [
      'i-Cockpit 3D Display',
      'Touchscreen Infotainment',
      'Rear Camera & Sensors',
      'Low Fuel Consumption'
    ],
    depositAmount: 2500,
    minAge: 21,
    mileageLimit: 'Unlimited km included',
    description: 'Nimble and elegant city vehicle for easy parking and touring the coastal towns of Tetouan, Mdiq, and Martil.'
  },
  {
    id: '9',
    name: 'Porsche Macan GTS 2024',
    brand: 'Porsche',
    model: 'Macan GTS',
    year: 2024,
    category: 'SUV',
    location: 'Tetouan',
    city: 'Tetouan',
    coordinates: {
      lat: 35.5790,
      lng: -5.3650
    },
    rating: 5.0,
    reviewsCount: 38,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuel: 'gasoline',
    airConditioning: true,
    dailyRate: 1850,
    currency: 'DH',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80'
    ],
    agency: {
      id: '5',
      name: 'Mayache Prestige Cars',
      city: 'Tetouan',
      verified: true,
      rating: 4.95,
      completedTrips: 310,
      phone: '+212 539 98 44 20',
      address: 'Boulevard Mohamed V, Tetouan'
    },
    features: [
      'Sport Chrono Package',
      'Adaptive Air Suspension with PASM',
      'Bose Surround Sound System',
      'Panoramic Sunroof',
      'Sport Exhaust System'
    ],
    depositAmount: 14000,
    minAge: 26,
    mileageLimit: 'Unlimited km included',
    description: 'Dynamic sports car performance in a luxury SUV format. Engineered to conquer the northern coast and winding mountain passes with effortless precision.'
  },
  {
    id: '10',
    name: 'Mercedes-Benz CLA Coupé 2024',
    brand: 'Mercedes-Benz',
    model: 'CLA 200 AMG Line',
    year: 2024,
    category: 'Coupe',
    location: 'Tetouan',
    city: 'Tetouan',
    coordinates: {
      lat: 35.5810,
      lng: -5.3710
    },
    rating: 4.93,
    reviewsCount: 22,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuel: 'gasoline',
    airConditioning: true,
    dailyRate: 850,
    currency: 'DH',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    agency: {
      id: '5',
      name: 'Mayache Prestige Cars',
      city: 'Tetouan',
      verified: true,
      rating: 4.95,
      completedTrips: 310,
      phone: '+212 539 98 44 20',
      address: 'Boulevard Mohamed V, Tetouan'
    },
    features: [
      'AMG Aerodynamic Styling',
      'Dual 10.25-inch Digital Screens',
      'Ambient Interior Lighting (64 colors)',
      'Blind Spot Assist & Parktronic'
    ],
    depositAmount: 6000,
    minAge: 24,
    mileageLimit: 'Unlimited km included',
    description: 'Sensual four-door coupe styling paired with modern high-tech luxury. Ideal for cruising the Mediterranean coastline from Tetouan to Cabo Negro.'
  }
];

export const getCarById = (id: string | number): CarListing | undefined => {
  return allCarsData.find(car => car.id === String(id));
};

export const getCarsByPartnerId = (partnerId: string): CarListing[] => {
  return allCarsData.filter(car => car.agency.id === partnerId || (partnerId === '5' && car.agency.name.includes('Mayache')));
};
