/**
 * Airbcar Backend API Client
 * Base URL: https://airbcar-backend.onrender.com
 * Supports JWT auth, DRF pagination, multipart/form-data, and API health testing.
 */

export const API_BASE_URL = 'https://airbcar-backend.onrender.com';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status_code?: number;
}

class AirbcarApiClient {
  private baseUrl: string = API_BASE_URL;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Attempt to load tokens from localStorage if in browser
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('airbcar_access_token');
      this.refreshToken = localStorage.getItem('airbcar_refresh_token');
      const customBase = localStorage.getItem('airbcar_custom_base_url');
      if (customBase) {
        this.baseUrl = customBase;
      }
    }
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url;
    if (typeof window !== 'undefined') {
      localStorage.setItem('airbcar_custom_base_url', url);
    }
  }

  public setTokens(access: string, refresh?: string) {
    this.accessToken = access;
    if (typeof window !== 'undefined') {
      localStorage.setItem('airbcar_access_token', access);
      if (refresh) {
        this.refreshToken = refresh;
        localStorage.setItem('airbcar_refresh_token', refresh);
      }
    }
  }

  public clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('airbcar_access_token');
      localStorage.removeItem('airbcar_refresh_token');
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let json: any = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        json = await response.json();
      }

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: json?.error || json?.message || `HTTP ${response.status} ${response.statusText}`,
          data: json,
        };
      }

      return {
        ok: true,
        status: response.status,
        data: json as T,
      };
    } catch (err: any) {
      return {
        ok: false,
        status: 0,
        error: err.message || 'Network error / CORS restriction when reaching backend',
      };
    }
  }

  // 1. Root & Health
  public async checkHealth(): Promise<{ ok: boolean; status: number; data?: any; error?: string }> {
    return this.request('/api/health/');
  }

  public async checkRoot(): Promise<{ ok: boolean; status: number; data?: any; error?: string }> {
    return this.request('/');
  }

  // 2. Authentication
  public async login(email: string, password: string) {
    return this.request<{ access: string; refresh: string; user: any }>('/api/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // 3. Listings (Vehicles)
  public async getListings(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/listings/${qs}`);
  }

  public async createBlackout(listingId: string, data: { start_date: string; end_date: string; reason: string }) {
    return this.request(`/listings/${listingId}/blackouts/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 4. Partner
  public async getPartnerMe() {
    return this.request('/partners/me/');
  }

  public async getPartnerEarnings() {
    return this.request('/partners/me/earnings/');
  }

  public async getPartnerAnalytics() {
    return this.request('/partners/me/analytics/');
  }

  public async getPartnerReviews() {
    return this.request('/partners/me/reviews/');
  }

  // 6. Bookings
  public async getAgencyBookings() {
    return this.request('/api/agency/bookings/', { method: 'POST' });
  }

  public async getPendingAgencyBookings() {
    return this.request('/api/agency/bookings/pending/');
  }

  public async sendContract(bookingId: string) {
    return this.request(`/api/agency/bookings/${bookingId}/send-contract/`, {
      method: 'POST',
    });
  }

  public async createManualBooking(payload: any) {
    return this.request('/api/agency/bookings/manual/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 8. Messaging
  public async getConversations(role: 'agency' | 'renter' = 'agency') {
    return this.request(`/api/conversations/?role=${role}`);
  }

  public async sendMessage(conversationId: string, text: string) {
    return this.request(`/api/conversations/${conversationId}/messages/`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  public async getSavedReplies() {
    return this.request('/api/agency/saved-replies/');
  }

  // 16. B2B Car-Share
  public async getCarShares() {
    return this.request('/partners/car-shares/');
  }

  public async createCarShareInspection(carShareId: string, payload: any) {
    return this.request(`/partners/car-shares/${carShareId}/inspections/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new AirbcarApiClient();
