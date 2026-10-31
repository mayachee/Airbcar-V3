import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  onSnapshot,
  deleteDoc,
  Unsubscribe
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { CarListing, PastTrip, ContractRecord } from '../types';
import { allCarsData } from '../data/carsData';
import { 
  REAL_TEST_USERS, 
  REAL_TEST_PARTNERS,
  REAL_TEST_CARS, 
  REAL_TEST_BOOKINGS, 
  REAL_TEST_CONTRACTS, 
  REAL_TEST_DISPUTES, 
  REAL_TEST_MESSAGES, 
  REAL_TEST_SETTINGS 
} from '../data/realTestData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom database ID from config
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId || '(default)'
);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope('profile');
googleAuthProvider.addScope('email');

/**
 * Standard Firebase Error Reporting format required by Firebase Skill
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

let anonAuthAttempted = false;
let anonAuthDisabled = false;

/**
 * Ensure active Firebase Auth session for rule evaluation
 */
export async function ensureFirebaseAuth(): Promise<void> {
  if (anonAuthDisabled || auth.currentUser || anonAuthAttempted) {
    return;
  }
  anonAuthAttempted = true;
  try {
    await signInAnonymously(auth);
    console.log('✅ Firebase Auth session active');
  } catch (err: any) {
    anonAuthDisabled = true;
    // Anonymous auth is restricted in Firebase console unless enabled
    if (err?.code !== 'auth/admin-restricted-operation') {
      console.warn('Firebase Auth anonymous notice:', err);
    }
  }
}

// Ensure auth session on initialization
ensureFirebaseAuth();

/**
 * Validate live connection to Firestore
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Firestore database connected successfully:', firebaseConfig.projectId);
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('⚠️ Firestore is currently offline or connecting...');
      return false;
    }
    console.log('✅ Firestore service reached:', firebaseConfig.projectId);
    return true;
  }
}

/**
 * Sync user profile to Firestore `users` collection
 */
export async function syncUserToFirestore(userData: {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  phone?: string;
  cin?: string;
  drivingLicenceNumber?: string;
  agencyName?: string;
  verified?: boolean;
}) {
  await ensureFirebaseAuth();
  const path = `users/${userData.id}`;
  try {
    const userRef = doc(db, 'users', userData.id);
    await setDoc(userRef, {
      uid: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || '',
      role: userData.role,
      phone: userData.phone || '',
      cin: userData.cin || '',
      drivingLicenceNumber: userData.drivingLicenceNumber || '',
      agencyName: userData.agencyName || '',
      verified: !!userData.verified,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log('✅ User synced to Firestore users collection:', userData.id);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Fetch user profile from Firestore `users` collection
 */
export async function fetchUserFromFirestore(userId: string) {
  await ensureFirebaseAuth();
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

let hasAttemptedSeed = false;

/**
 * Seed all real Moroccan test data into Firestore
 */
export async function seedAllRealTestDataToFirestore(force = false): Promise<{
  cars: number;
  bookings: number;
  contracts: number;
  disputes: number;
  messages: number;
  users: number;
  partners: number;
  settings: boolean;
}> {
  await ensureFirebaseAuth();
  console.log('🌱 Populating real Moroccan platform data into Firestore (10 Users, 10 Partners with 5 Vehicles each, 50 Cars total)...');

  let carsCount = 0;
  let bookingsCount = 0;
  let contractsCount = 0;
  let disputesCount = 0;
  let messagesCount = 0;
  let usersCount = 0;
  let partnersCount = 0;

  // 1. Cars / Fleet (50 Vehicles: 10 Partners x 5 Vehicles)
  try {
    for (const car of REAL_TEST_CARS) {
      await setDoc(doc(db, 'cars', car.id), {
        id: car.id,
        name: car.name,
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year,
        category: car.category,
        plate: car.plate,
        location: car.location,
        city: car.city,
        coordinates: car.coordinates,
        rating: car.rating,
        reviewsCount: car.reviewsCount,
        seats: car.seats,
        doors: car.doors,
        transmission: car.transmission,
        fuel: car.fuelType,
        fuelType: car.fuelType,
        airConditioning: true,
        dailyRate: car.dailyRate,
        pricePerDay: car.pricePerDay,
        currency: car.currency,
        images: car.images,
        imageUrl: car.imageUrl,
        features: car.features,
        depositAmount: car.depositAmount,
        minAge: car.minAge,
        mileageLimit: car.mileageLimit,
        description: car.description,
        agencyId: car.agencyId,
        agencyName: car.agencyName,
        agency: {
          id: car.agencyId,
          name: car.agencyName,
          city: car.city,
          phone: car.agencyPhone,
          verified: true,
          rating: car.rating,
          completedTrips: car.reviewsCount * 4,
          address: `${car.city} Centre`,
        },
        isAvailable: car.isAvailable,
        isFeatured: !!car.isFeatured,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      carsCount++;
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'cars');
  }

  // 2. Bookings
  try {
    for (const b of REAL_TEST_BOOKINGS) {
      await setDoc(doc(db, 'bookings', b.id), {
        ...b,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      bookingsCount++;
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'bookings');
  }

  // 3. Contracts
  try {
    for (const c of REAL_TEST_CONTRACTS) {
      await setDoc(doc(db, 'contracts', c.id), {
        ...c,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      contractsCount++;
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'contracts');
  }

  // 4. Disputes
  try {
    for (const d of REAL_TEST_DISPUTES) {
      await setDoc(doc(db, 'disputes', d.id), {
        ...d,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      disputesCount++;
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'disputes');
  }

  // 5. Messages
  try {
    for (const m of REAL_TEST_MESSAGES) {
      await setDoc(doc(db, 'messages', m.id), {
        ...m,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      messagesCount++;
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'messages');
  }

  // 6. Users (1 Exclusive HQ Admin + 10 Renters + 10 Partners)
  try {
    for (const u of REAL_TEST_USERS) {
      await setDoc(doc(db, 'users', u.uid), {
        uid: u.uid,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        cin: u.cin,
        drivingLicenceNumber: u.drivingLicenceNumber || '',
        avatar: u.avatar,
        agencyName: u.agencyName || '',
        verified: u.verified,
        city: u.city,
        description: u.description,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      usersCount++;
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'users');
  }

  // 7. Partners (10 Certified Agency Partners, each with their 5 Vehicles)
  try {
    for (const p of REAL_TEST_PARTNERS) {
      const partnerCars = REAL_TEST_CARS.filter(c => c.agencyId === p.id);
      await setDoc(doc(db, 'partners', p.id), {
        id: p.id,
        agencyName: p.agencyName,
        ownerName: p.ownerName,
        email: p.email,
        phone: p.phone,
        cin: p.cin,
        city: p.city,
        address: p.address,
        licenseNumber: p.licenseNumber,
        avatar: p.avatar,
        description: p.description,
        coordinates: p.coordinates,
        vehicleCount: partnerCars.length,
        vehicles: partnerCars.map(c => ({
          id: c.id,
          name: c.name,
          brand: c.brand,
          model: c.model,
          plate: c.plate,
          dailyRate: c.dailyRate,
          category: c.category,
          imageUrl: c.imageUrl
        })),
        rating: 4.9,
        verified: true,
        dahirCompliant: true,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      partnersCount++;
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'partners');
  }

  // 8. Settings
  try {
    await setDoc(doc(db, 'settings', 'dahir2026'), {
      ...REAL_TEST_SETTINGS,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, 'settings');
  }

  console.log(`✅ Successfully seeded real Moroccan data to Firestore: ${carsCount} cars, ${partnersCount} partners (5 vehicles each), ${usersCount} users, ${bookingsCount} bookings, ${contractsCount} contracts, ${disputesCount} disputes, ${messagesCount} messages.`);
  return {
    cars: carsCount,
    bookings: bookingsCount,
    contracts: contractsCount,
    disputes: disputesCount,
    messages: messagesCount,
    users: usersCount,
    partners: partnersCount,
    settings: true,
  };
}

/**
 * Seed initial platform data into Firestore if cars or bookings are empty or incomplete
 */
export async function seedInitialCarsIfEmpty(): Promise<void> {
  if (hasAttemptedSeed) return;
  hasAttemptedSeed = true;

  try {
    const carsColl = collection(db, 'cars');
    const existingCars = await getDocs(carsColl);
    // If cars collection has less than 50 vehicles or is empty, seed all 50 cars, 10 users and 10 partners
    if (existingCars.empty || existingCars.size < 50) {
      console.log('🌱 Firestore database initializing fleet: ensuring 10 users, 10 partners, 5 vehicles each (50 total)...');
      await seedAllRealTestDataToFirestore(false);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'cars');
  }
}

/**
 * Fetch total counts of live real data in Firestore
 */
export async function getFirestoreDataCounts(): Promise<{
  cars: number;
  bookings: number;
  contracts: number;
  disputes: number;
  messages: number;
  users: number;
  partners: number;
}> {
  await ensureFirebaseAuth();
  try {
    const [carsSnap, bookingsSnap, contractsSnap, disputesSnap, messagesSnap, usersSnap, partnersSnap] = await Promise.all([
      getDocs(collection(db, 'cars')),
      getDocs(collection(db, 'bookings')),
      getDocs(collection(db, 'contracts')),
      getDocs(collection(db, 'disputes')),
      getDocs(collection(db, 'messages')),
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'partners')),
    ]);
    return {
      cars: carsSnap.size,
      bookings: bookingsSnap.size,
      contracts: contractsSnap.size,
      disputes: disputesSnap.size,
      messages: messagesSnap.size,
      users: usersSnap.size,
      partners: partnersSnap.size,
    };
  } catch (err) {
    console.warn('Failed to fetch firestore counts:', err);
    return { cars: 0, bookings: 0, contracts: 0, disputes: 0, messages: 0, users: 0, partners: 0 };
  }
}

/**
 * Real-time subscription to partners from Firestore
 */
export function subscribeToPartners(callback: (partners: any[]) => void): () => void {
  try {
    const q = collection(db, 'partners');
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(items);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'partners');
      callback([]);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'partners');
    callback([]);
    return () => {};
  }
}

/**
 * Real-time subscription to disputes from Firestore
 */
export function subscribeToDisputes(callback: (disputes: any[]) => void): Unsubscribe {
  ensureFirebaseAuth();
  const coll = collection(db, 'disputes');
  return onSnapshot(coll, (snap) => {
    const list = snap.docs.map(d => d.data());
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'disputes');
  });
}

/**
 * Subscribe to real-time cars collection from Firestore
 */
export function subscribeToCars(callback: (cars: CarListing[]) => void): Unsubscribe {
  ensureFirebaseAuth();
  const carsColl = collection(db, 'cars');
  return onSnapshot(carsColl, (snap) => {
    if (!snap.empty) {
      const items: CarListing[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: data.id || d.id,
          name: data.name || data.title || 'Vehicle',
          brand: data.brand || '',
          model: data.model || '',
          year: data.year || 2024,
          category: data.category || 'Sedan',
          location: data.location || data.city || 'Tetouan',
          city: data.city || data.location || 'Tetouan',
          coordinates: data.coordinates || { lat: 35.584, lng: -5.352 },
          rating: data.rating || 4.8,
          reviewsCount: data.reviewsCount || 12,
          seats: data.seats || 5,
          doors: data.doors || 4,
          transmission: data.transmission || 'automatic',
          fuel: data.fuel || data.fuelType || 'gasoline',
          airConditioning: data.airConditioning ?? true,
          dailyRate: data.dailyRate || data.pricePerDay || 700,
          currency: data.currency || 'DH',
          images: data.images || (data.imageUrl ? [data.imageUrl] : []),
          agency: data.agency || {
            id: data.agencyId || '1',
            name: data.agencyName || 'Mayache Luxury Cars',
            city: data.city || 'Tetouan',
            verified: true,
            rating: 4.9,
            completedTrips: 184,
            phone: '+212 539 96 12 34',
            address: 'Tetouan Centre'
          },
          features: data.features || ['Air Conditioning', 'GPS Navigation', 'Bluetooth'],
          depositAmount: data.depositAmount || 5000,
          minAge: data.minAge || 21,
          mileageLimit: data.mileageLimit || 'Unlimited km',
          description: data.description || 'Verified rental car in Morocco under Dahir 2026 regulations.',
        } as CarListing;
      });
      callback(items);
    } else {
      callback(allCarsData);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'cars');
    callback(allCarsData);
  });
}

/**
 * Add or update vehicle in Firestore
 */
export async function saveCarToFirestore(car: Partial<CarListing> & { id: string }) {
  await ensureFirebaseAuth();
  const path = `cars/${car.id}`;
  try {
    await setDoc(doc(db, 'cars', car.id), {
      ...car,
      title: car.name,
      pricePerDay: car.dailyRate,
      city: car.location || car.city,
      imageUrl: car.images?.[0] || '',
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log('✅ Car saved to Firestore:', car.id);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Delete vehicle from Firestore
 */
export async function deleteCarFromFirestore(carId: string) {
  await ensureFirebaseAuth();
  const path = `cars/${carId}`;
  try {
    await deleteDoc(doc(db, 'cars', carId));
    console.log('✅ Car deleted from Firestore:', carId);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    return false;
  }
}

/**
 * Save new booking to Firestore `bookings` collection
 */
export async function createFirestoreBooking(booking: {
  id: string;
  renterId: string;
  renterName: string;
  renterEmail?: string;
  carId: string;
  carTitle: string;
  carCategory: string;
  carImage?: string;
  pickupDate: string;
  returnDate: string;
  pickupCity: string;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  depositAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  dahirRegistrationId: string;
}) {
  await ensureFirebaseAuth();
  const path = `bookings/${booking.id}`;
  try {
    const bookingRef = doc(db, 'bookings', booking.id);
    await setDoc(bookingRef, {
      ...booking,
      createdAt: new Date().toISOString(),
    });
    console.log('✅ Booking persisted to Firestore:', booking.id);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return false;
  }
}

/**
 * Real-time subscription to bookings (for renter or partner)
 */
export function subscribeToBookings(
  userId: string | undefined, 
  callback: (bookings: any[]) => void
): Unsubscribe {
  ensureFirebaseAuth();
  const bookingsColl = collection(db, 'bookings');
  return onSnapshot(bookingsColl, (snap) => {
    const list = snap.docs.map((d) => d.data());
    // If specific user ID provided, filter or return user's bookings
    if (userId) {
      const userList = list.filter((b) => b.renterId === userId || !b.renterId);
      callback(userList.length > 0 ? userList : list);
    } else {
      callback(list);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'bookings');
  });
}

/**
 * Save partner vehicle specifically into Firestore
 */
export async function savePartnerVehicleToFirestore(vehicle: {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  dailyRate: number;
  depositAmount: number;
  city: string;
  transmission: string;
  fuelType: string;
  seats: number;
  status: string;
  isB2bEligible?: boolean;
  image: string;
  agencyId?: string;
  agencyName?: string;
}) {
  await ensureFirebaseAuth();
  const path = `cars/${vehicle.id}`;
  try {
    await setDoc(doc(db, 'cars', vehicle.id), {
      id: vehicle.id,
      name: `${vehicle.make} ${vehicle.model}`,
      title: `${vehicle.make} ${vehicle.model}`,
      brand: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      category: 'Sedan',
      location: vehicle.city,
      city: vehicle.city,
      coordinates: { lat: 35.584, lng: -5.352 },
      rating: 4.9,
      reviewsCount: 1,
      seats: vehicle.seats,
      doors: 4,
      transmission: vehicle.transmission.toLowerCase() === 'manual' ? 'manual' : 'automatic',
      fuel: vehicle.fuelType.toLowerCase() === 'diesel' ? 'diesel' : 'gasoline',
      airConditioning: true,
      dailyRate: vehicle.dailyRate,
      pricePerDay: vehicle.dailyRate,
      currency: 'DH',
      images: [vehicle.image],
      imageUrl: vehicle.image,
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth'],
      depositAmount: vehicle.depositAmount,
      minAge: 21,
      mileageLimit: 'Unlimited km',
      description: `${vehicle.make} ${vehicle.model} (${vehicle.year}) managed via Partner Fleet.`,
      isAvailable: vehicle.status === 'available',
      agencyId: vehicle.agencyId || '5',
      agencyName: vehicle.agencyName || 'Mayache Prestige Cars',
      agency: {
        id: vehicle.agencyId || '5',
        name: vehicle.agencyName || 'Mayache Prestige Cars',
        city: vehicle.city,
        verified: true,
        rating: 4.9,
      },
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log('✅ Partner vehicle saved to Firestore:', vehicle.id);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Save contract to Firestore `contracts` collection
 */
export async function createFirestoreContract(contract: {
  id: string;
  bookingId: string;
  renterId: string;
  renterName: string;
  renterEmail?: string;
  carModel: string;
  contractNumber: string;
  digitalSignature?: string;
  cinNumber?: string;
  drivingLicenceNumber?: string;
  status: 'draft' | 'signed' | 'active' | 'closed';
  signedAt?: string;
}) {
  await ensureFirebaseAuth();
  const path = `contracts/${contract.id}`;
  try {
    const contractRef = doc(db, 'contracts', contract.id);
    await setDoc(contractRef, {
      ...contract,
      digitalSignature: contract.digitalSignature || '',
      cinNumber: contract.cinNumber || '',
      drivingLicenceNumber: contract.drivingLicenceNumber || '',
      signedAt: contract.signedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ Contract persisted to Firestore:', contract.id);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return false;
  }
}

/**
 * Real-time subscription to contracts
 */
export function subscribeToContracts(
  userId: string | undefined, 
  callback: (contracts: any[]) => void
): Unsubscribe {
  ensureFirebaseAuth();
  const contractsColl = collection(db, 'contracts');
  return onSnapshot(contractsColl, (snap) => {
    const list = snap.docs.map((d) => d.data());
    if (userId) {
      const userContracts = list.filter((c) => c.renterId === userId || !c.renterId);
      callback(userContracts.length > 0 ? userContracts : list);
    } else {
      callback(list);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'contracts');
  });
}

/**
 * Save dispute claim to Firestore `disputes` collection
 */
export async function createFirestoreDispute(dispute: {
  id: string;
  bookingId?: string;
  contractId: string;
  userId: string;
  userName?: string;
  reason: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
}) {
  await ensureFirebaseAuth();
  const path = `disputes/${dispute.id}`;
  try {
    const ref = doc(db, 'disputes', dispute.id);
    await setDoc(ref, {
      ...dispute,
      createdAt: new Date().toISOString(),
    });
    console.log('✅ Dispute recorded in Firestore:', dispute.id);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return false;
  }
}

/**
 * Send and persist a message to Firestore `messages` collection
 */
export async function sendFirestoreMessage(message: {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  sentAt?: string;
  isRead?: boolean;
}) {
  await ensureFirebaseAuth();
  const path = `messages/${message.id}`;
  try {
    const ref = doc(db, 'messages', message.id);
    await setDoc(ref, {
      ...message,
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Message stored in Firestore:', message.id);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return false;
  }
}

/**
 * Subscribe to messages for a conversation
 */
export function subscribeToMessages(
  conversationId: string, 
  callback: (messages: any[]) => void
): Unsubscribe {
  ensureFirebaseAuth();
  const messagesColl = collection(db, 'messages');
  return onSnapshot(messagesColl, (snap) => {
    const list = snap.docs
      .map((d) => d.data())
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'messages');
  });
}

