/**
 * Airbcar OAuth Service
 * Implements popup-based OAuth for Google Authentication adhering to AI Studio iframe constraints.
 */

import { AuthUser } from '../types/auth';

export const DEV_APP_URL = 'https://ais-dev-dtnqj3tbwmo5l4ilheahld-434897609204.europe-west1.run.app';
export const SHARED_APP_URL = 'https://ais-pre-dtnqj3tbwmo5l4ilheahld-434897609204.europe-west1.run.app';

export const getRedirectUri = (): string => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  return `${DEV_APP_URL}/auth/callback`;
};

export const getGoogleAuthUrl = (clientId: string): string => {
  const redirectUri = getRedirectUri();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: 'openid email profile',
    prompt: 'select_account',
    include_granted_scopes: 'true',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/**
 * Opens the OAuth provider popup and waits for the callback postMessage
 */
export const launchOAuthPopup = (url: string): Promise<{ token?: string; code?: string; raw?: string }> => {
  return new Promise((resolve, reject) => {
    const width = 520;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      url,
      'airbcar_oauth_popup',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      reject(new Error('Popup blocked! Please allow popups for this site to complete OAuth login.'));
      return;
    }

    let isResolved = false;

    // Check if result was already deposited into localStorage
    const checkLocalStorageResult = () => {
      try {
        const item = localStorage.getItem('airbcar_oauth_result');
        if (item) {
          const parsed = JSON.parse(item);
          if (Date.now() - (parsed.timestamp || 0) < 60000) {
            localStorage.removeItem('airbcar_oauth_result');
            if (parsed.type === 'OAUTH_AUTH_SUCCESS') {
              isResolved = true;
              cleanup();
              resolve({
                token: parsed.token,
                code: parsed.code,
                raw: parsed.raw,
              });
              return true;
            } else if (parsed.type === 'OAUTH_AUTH_ERROR') {
              isResolved = true;
              cleanup();
              reject(new Error(parsed.error || 'Authentication failed.'));
              return true;
            }
          }
        }
      } catch (_) {}
      return false;
    };

    const cleanup = () => {
      window.removeEventListener('message', messageListener);
      window.removeEventListener('storage', storageListener);
      clearInterval(timer);
    };

    const messageListener = (event: MessageEvent) => {
      // Accept messages from same origin, run.app domains, or localhost
      const origin = event.origin;
      const isAllowedOrigin = 
        !origin || 
        origin === window.location.origin || 
        origin.endsWith('.run.app') || 
        origin.includes('localhost') || 
        origin.endsWith('.google.com');

      if (!isAllowedOrigin) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        isResolved = true;
        cleanup();
        resolve({
          token: event.data.token,
          code: event.data.code,
          raw: event.data.raw,
        });
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        isResolved = true;
        cleanup();
        reject(new Error(event.data.error || 'Authentication failed.'));
      }
    };

    const storageListener = (event: StorageEvent) => {
      if (event.key === 'airbcar_oauth_result') {
        checkLocalStorageResult();
      }
    };

    window.addEventListener('message', messageListener);
    window.addEventListener('storage', storageListener);

    // Poll for closed popup or localStorage result
    const timer = setInterval(() => {
      if (checkLocalStorageResult()) {
        return;
      }

      if (popup.closed) {
        // Wait one tick in case the callback message or storage is being processed
        setTimeout(() => {
          if (checkLocalStorageResult()) {
            return;
          }
          cleanup();
          if (!isResolved) {
            const err = new Error('Sign-in window was closed before completing authentication.');
            (err as any).code = 'auth/popup-closed-by-user';
            reject(err);
          }
        }, 500);
      }
    }, 600);
  });
};

/**
 * Fetches Google User Profile via access token
 */
export const fetchGoogleUserInfo = async (accessToken: string): Promise<Partial<AuthUser>> => {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to retrieve user info from Google');
    const data = await res.json();
    return {
      id: data.sub || `google-${Date.now()}`,
      name: data.name || data.email?.split('@')[0] || 'Google User',
      email: data.email,
      avatar: data.picture,
      verified: data.email_verified ?? true,
    };
  } catch (err) {
    console.warn('Google userinfo fetch fallback:', err);
    return {
      name: 'Google User',
      email: 'user@gmail.com',
      verified: true,
    };
  }
};
