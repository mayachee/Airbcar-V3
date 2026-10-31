export type AuthProvider = 'google' | 'demo' | 'password';

export const EXCLUSIVE_ADMIN_EMAIL = 'ayacheyassine2000@gmail.com';
export const EXCLUSIVE_ADMIN_PASSWORD = 'Mayache+1234';

export type MockProfileKey = 'camille' | 'yassine' | 'agency' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'renter' | 'partner' | 'admin';
  provider: AuthProvider;
  token: string;
  verified: boolean;
  phone?: string;
  cin?: string;
  agencyName?: string;
  drivingLicenceNumber?: string;
  city?: string;
}

export interface MockProfileInfo {
  key: MockProfileKey;
  name: string;
  email: string;
  role: 'renter' | 'partner' | 'admin';
  roleLabel: string;
  avatar: string;
  phone: string;
  cin: string;
  drivingLicenceNumber: string;
  badge: string;
  description: string;
}

export interface OAuthConfig {
  googleClientId: string;
  customRedirectUri: string;
}

