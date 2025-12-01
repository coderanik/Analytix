const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface ApiError {
  message: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{
      _id: string;
      name: string;
      email: string;
      role: string;
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, role?: string, country?: string, currency?: string) {
    return this.request<{
      _id: string;
      name: string;
      email: string;
      role: string;
      token: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, country, currency }),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  // Dashboard endpoints
  async getKPIs() {
    return this.request<any>('/dashboard/kpis');
  }

  async getRevenue() {
    return this.request<any[]>('/dashboard/revenue');
  }

  async getActivity() {
    return this.request<any[]>('/dashboard/activity');
  }

  async getTraffic() {
    return this.request<any[]>('/dashboard/traffic');
  }

  async getUsers(params?: { search?: string; status?: string; sortBy?: string; sortOrder?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return this.request<any>(`/dashboard/users${query ? `?${query}` : ''}`);
  }

  // Analytics endpoints
  async getAnalyticsRevenue(period: string = '30d') {
    return this.request<any[]>(`/analytics/revenue?period=${period}`);
  }

  async getAnalyticsActivity(period: string = '7d') {
    return this.request<any[]>(`/analytics/activity?period=${period}`);
  }

  async getAnalyticsTraffic(period: string = '30d') {
    return this.request<any[]>(`/analytics/traffic?period=${period}`);
  }

  async getRevenueBreakdown() {
    return this.request<any[]>('/analytics/revenue-breakdown');
  }

  // Users endpoints
  async getAllUsers(params?: { search?: string; status?: string; sortBy?: string; sortOrder?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return this.request<any>(`/users${query ? `?${query}` : ''}`);
  }

  async getUser(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async createUser(data: { name: string; email: string; password?: string; role?: string; status?: string }) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: Partial<{ name: string; email: string; role: string; status: string; revenue: number }>) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications endpoints
  async getNotifications(read?: boolean) {
    const query = read !== undefined ? `?read=${read}` : '';
    return this.request<any[]>(`/notifications${query}`);
  }

  async markNotificationAsRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request<any>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string) {
    return this.request<any>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Reports endpoints
  async getReports() {
    return this.request<any[]>('/reports');
  }

  async getScheduledReports() {
    return this.request<any[]>('/reports/scheduled');
  }

  async createReport(data: { title?: string; description?: string; type?: string }) {
    return this.request<any>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteReport(id: string) {
    return this.request<any>(`/reports/${id}`, {
      method: 'DELETE',
    });
  }

  async downloadReport(id: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/reports/${id}/download`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message || 'Failed to download report');
    }

    const blob = await response.blob();
    return blob;
  }

  // Profile endpoints
  async getProfile() {
    return this.request<any>('/profile');
  }

  async updateProfile(data: Partial<{ name: string; email: string; company: string; location: string; bio: string; achievements: string[] }>) {
    return this.request<any>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getProfileActivity() {
    return this.request<any[]>('/profile/activity');
  }

  // Settings endpoints
  async getSettings() {
    return this.request<any>('/settings');
  }

  async updateSettings(data: Partial<{ timezone: string; language: string; theme: string; country: string; currency: string; notifications: any; display: any }>) {
    return this.request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updatePassword(currentPassword: string, newPassword: string) {
    return this.request<any>('/settings/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);

