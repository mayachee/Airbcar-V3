import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AuthUser, 
  AuthProvider, 
  MockProfileKey, 
  MockProfileInfo, 
  EXCLUSIVE_ADMIN_EMAIL, 
  EXCLUSIVE_ADMIN_PASSWORD 
} from '../types/auth';
import {
  getGoogleAuthUrl,
  launchOAuthPopup,
  fetchGoogleUserInfo,
  getRedirectUri,
  DEV_APP_URL,
  SHARED_APP_URL,
} from '../services/oauth';
import { testFirestoreConnection, syncUserToFirestore } from '../services/firebase';
import firebaseConfig from '../../firebase-applet-config.json';

export const MOCK_PROFILES: MockProfileInfo[] = [
  {
    key: 'camille',
    name: 'Camille Dubois',
    email: 'camille.d@mail.com',
    role: 'renter',
    roleLabel: 'Verified Traveler',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+212 6 12 34 56 78',
    cin: 'L-849201',
    drivingLicenceNumber: 'FR-9204812',
    badge: 'Dahir 2026 Verified',
    description: 'Verified renter profile with driving licence & active contract history in Tetouan',
  },
  {
    key: 'yassine',
    name: 'Yassine Ayache',
    email: EXCLUSIVE_ADMIN_EMAIL,
    role: 'renter',
    roleLabel: 'Verified Moroccan Driver',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+212 661 28 49 50',
    cin: 'L482910',
    drivingLicenceNumber: 'MA-2849102',
    badge: '1-Click Instant Login',
    description: 'Verified profile for zero-configuration testing',
  },
  {
    key: 'agency',
    name: 'Yassine Ayache (Partner Desk)',
    email: 'partner@mayachecars.ma',
    role: 'partner',
    roleLabel: 'Agency Fleet Partner',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    phone: '+212 661 28 49 50',
    cin: 'L482910',
    drivingLicenceNumber: 'MA-2849102',
    badge: 'Mayache Cars',
    description: 'Fleet agency operator managing 18 vehicles and booking requests',
  },
  {
    key: 'admin',
    name: 'Yassine Ayache (HQ Superadmin)',
    email: EXCLUSIVE_ADMIN_EMAIL,
    role: 'admin',
    roleLabel: 'Authorized HQ Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    phone: '+212 661 28 49 50',
    cin: 'HQ-99001',
    drivingLicenceNumber: 'MA-1002931',
    badge: 'Exclusive Admin',
    description: 'Sole administrator for Morocco Drive & Airbcar HQ ecosystem',
  },
];

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPartner: boolean;
  isLoading: boolean;
  authError: string | null;
  googleClientId: string;
  setGoogleClientId: (id: string) => void;
  redirectUri: string;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signin' | 'signup' | 'otp' | 'setup';
  openAuthModal: (mode?: 'login' | 'signin' | 'signup' | 'otp' | 'setup') => void;
  closeAuthModal: () => void;
  loginWithGoogle: (customId?: string) => Promise<boolean>;
  loginWithPassword: (email: string, pass: string, requestedRole?: 'renter' | 'partner' | 'admin') => Promise<boolean>;
  loginWithDemo: (role?: 'renter' | 'partner' | 'admin') => void;
  loginWithMockProfile: (profileKey?: MockProfileKey) => void;
  verifyAdminCredentials: (email: string, pass: string) => boolean;
  mockProfiles: MockProfileInfo[];
  logout: () => void;
  updateUserProfile: (updates: Partial<AuthUser>) => void;
  isDbConnected: boolean;
  dbInfo: { projectId: string; databaseId: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const STORAGE_KEY = 'airbcar_user_session';
const CLIENT_ID_STORAGE_KEY = 'airbcar_google_client_id';

export const AuthProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signin' | 'signup' | 'otp' | 'setup'>('signin');
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  const [googleClientId, setGoogleClientIdState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
      if (stored) return stored;
    }
    return ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string) || firebaseConfig.oAuthClientId || '';
  });

  const redirectUri = getRedirectUri();

  const setGoogleClientId = (id: string) => {
    setGoogleClientIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CLIENT_ID_STORAGE_KEY, id);
    }
  };

  // Restore session from localStorage and test Firestore connectivity
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        // Sync user doc to Firestore
        syncUserToFirestore(parsed);
      }
    } catch (e) {
      console.warn('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }

    // Verify Firestore database connection on startup
    testFirestoreConnection().then((connected) => {
      setIsDbConnected(connected);
    });
  }, []);

  const openAuthModal = (mode: 'login' | 'signin' | 'signup' | 'otp' | 'setup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  const loginWithGoogle = async (customId?: string): Promise<boolean> => {
    setAuthError(null);
    const activeClientId = customId || googleClientId;

    if (!activeClientId) {
      // Prompt user with modal to configure or demo
      openAuthModal('setup');
      setAuthError('Please provide your Google OAuth Client ID or connect with the Instant Verified Account.');
      return false;
    }

    try {
      setIsLoading(true);
      const authUrl = getGoogleAuthUrl(activeClientId);
      const result = await launchOAuthPopup(authUrl);

      if (result.token) {
        const profile = await fetchGoogleUserInfo(result.token);
        // If logging in via Google with the admin email, elevate role to admin
        const isAdminUser = profile.email?.toLowerCase().trim() === EXCLUSIVE_ADMIN_EMAIL.toLowerCase().trim();
        const assignedRole: 'renter' | 'partner' | 'admin' = isAdminUser ? 'admin' : 'renter';

        const newUser: AuthUser = {
          id: profile.id || `google-${Date.now()}`,
          name: profile.name || (isAdminUser ? 'Yassine Ayache (HQ Superadmin)' : 'Google Traveler'),
          email: profile.email || 'traveler@gmail.com',
          avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          role: assignedRole,
          provider: 'google',
          token: result.token,
          verified: true,
          phone: '+212 661 28 49 50',
          cin: isAdminUser ? 'HQ-99001' : 'L482910',
        };

        setUser(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        syncUserToFirestore(newUser);
        closeAuthModal();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setAuthError(err.message || 'Google authentication encountered an error.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAdminCredentials = (inputEmail: string, inputPass: string): boolean => {
    return (
      inputEmail.toLowerCase().trim() === EXCLUSIVE_ADMIN_EMAIL.toLowerCase().trim() &&
      inputPass === EXCLUSIVE_ADMIN_PASSWORD
    );
  };

  const loginWithPassword = async (
    inputEmail: string, 
    inputPass: string, 
    requestedRole: 'renter' | 'partner' | 'admin' = 'renter'
  ): Promise<boolean> => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const normalizedEmail = inputEmail.toLowerCase().trim();
      const isAdminEmail = normalizedEmail === EXCLUSIVE_ADMIN_EMAIL.toLowerCase().trim();

      // If user asks for admin role OR attempts to log in with admin email
      if (requestedRole === 'admin' || isAdminEmail) {
        if (!isAdminEmail) {
          setAuthError('Access denied: Administrative privileges are restricted to the verified Airbcar HQ account.');
          return false;
        }
        if (inputPass !== EXCLUSIVE_ADMIN_PASSWORD) {
          setAuthError('Incorrect password for administrator account. Please enter the valid HQ security credentials.');
          return false;
        }

        // Successfully authenticated admin
        const adminUser: AuthUser = {
          id: 'usr-admin-exclusive',
          name: 'Yassine Ayache (HQ Superadmin)',
          email: EXCLUSIVE_ADMIN_EMAIL,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
          role: 'admin',
          provider: 'password',
          token: `airbcar-admin-token-${Date.now()}`,
          verified: true,
          phone: '+212 661 28 49 50',
          cin: 'HQ-99001',
          drivingLicenceNumber: 'MA-1002931',
        };

        setUser(adminUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
        syncUserToFirestore(adminUser);
        closeAuthModal();
        return true;
      }

      // Non-admin login
      if (!inputEmail || !inputPass) {
        setAuthError('Please enter both email and password.');
        return false;
      }

      if (inputPass.length < 6) {
        setAuthError('Password must be at least 6 characters.');
        return false;
      }

      const standardUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: inputEmail.split('@')[0].replace(/[._-]/g, ' '),
        email: inputEmail,
        role: requestedRole === 'partner' ? 'partner' : 'renter',
        provider: 'password',
        token: `airbcar-user-token-${Date.now()}`,
        verified: true,
        phone: '+212 6 12 34 56 78',
        cin: 'MA-749201',
        agencyName: requestedRole === 'partner' ? 'Verified Agency Partner' : undefined,
      };

      setUser(standardUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(standardUser));
      syncUserToFirestore(standardUser);
      closeAuthModal();
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please verify credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithMockProfile = (profileKey: MockProfileKey = 'camille') => {
    const selected = MOCK_PROFILES.find((p) => p.key === profileKey) || MOCK_PROFILES[0];
    const mockUser: AuthUser = {
      id: `usr-${selected.key}`,
      name: selected.name,
      email: selected.email,
      avatar: selected.avatar,
      role: selected.role,
      provider: 'demo',
      token: `airbcar-mock-token-${selected.key}`,
      verified: true,
      phone: selected.phone,
      cin: selected.cin,
      drivingLicenceNumber: selected.drivingLicenceNumber,
      agencyName: selected.role === 'partner' ? 'Mayache Prestige Cars' : undefined,
    };

    setUser(mockUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    syncUserToFirestore(mockUser);
    closeAuthModal();
  };

  const loginWithDemo = (role: 'renter' | 'partner' | 'admin' = 'renter') => {
    if (role === 'partner') {
      loginWithMockProfile('agency');
    } else if (role === 'admin') {
      loginWithMockProfile('admin');
    } else {
      loginWithMockProfile('camille');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUserProfile = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    syncUserToFirestore(updated);
  };

  const isAdmin = user?.role === 'admin' && user?.email?.toLowerCase().trim() === EXCLUSIVE_ADMIN_EMAIL.toLowerCase().trim();
  const isPartner = user?.role === 'partner' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isPartner,
        isLoading,
        authError,
        googleClientId,
        setGoogleClientId,
        redirectUri,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithPassword,
        loginWithDemo,
        loginWithMockProfile,
        verifyAdminCredentials,
        mockProfiles: MOCK_PROFILES,
        logout,
        updateUserProfile,
        isDbConnected,
        dbInfo: {
          projectId: firebaseConfig.projectId,
          databaseId: firebaseConfig.firestoreDatabaseId,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProviderComponent');
  }
  return context;
};
