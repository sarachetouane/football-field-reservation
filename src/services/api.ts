const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  token: string;
}

export interface Field {
  id: string;
  name: string;
  address: string;
  price: number;
  description: string;
  image: string;
  features: string[];
  availableSlots: TimeSlot[];
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  price?: number;
  fieldId: string;
  date: string;
}

export interface Reservation {
  id: string;
  fieldId: string | { _id: string; name: string; address: string; price: number; image: string; features: string[]; availableSlots: TimeSlot[]; rating?: number; createdAt: string; updatedAt: string; };
  userId: string;
  date: string;
  timeSlot: TimeSlot;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/users/profile');
  }

  async updateProfile(userData: {
    name: string;
    phone: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Fields
  async getFields(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<Field[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request<Field[]>(`/fields${query ? `?${query}` : ''}`);
  }

  async getFieldById(id: string): Promise<ApiResponse<Field>> {
    return this.request<Field>(`/fields/${id}`);
  }

  // Reservations
  async createReservation(reservationData: {
    fieldId: string;
    date: string;
    timeSlot: TimeSlot;
    totalPrice: number;
  }): Promise<ApiResponse<Reservation>> {
    return this.request<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  }

  async getMyReservations(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<Reservation[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    // Add cache-busting parameter
    const cacheBuster = query ? `&_t=${Date.now()}` : `?_t=${Date.now()}`;
    const response = await this.request<any[]>(`/reservations/my${query ? `?${query}${cacheBuster}` : cacheBuster}`);
    
    // Transform MongoDB data to match frontend interface
    if (response.success && response.data) {
      response.data = response.data.map((res: any) => ({
        id: res._id != null ? String(res._id) : String(res.id ?? ''),
        fieldId: res.fieldId,
        userId: res.userId,
        date: res.date,
        timeSlot: res.timeSlot,
        totalPrice: res.totalPrice,
        status: res.status,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt
      }));
    }
    
    return response;
  }

  async getReservationById(id: string): Promise<ApiResponse<Reservation>> {
    return this.request<Reservation>(`/reservations/${id}`);
  }

  async cancelReservation(id: string): Promise<ApiResponse<Reservation>> {
    return this.request<Reservation>(`/reservations/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async getAdminStats(): Promise<ApiResponse<any>> {
    return this.request('/admin/dashboard/stats');
  }

  async deleteField(id: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/fields/${id}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const apiService = new ApiService();
export default apiService;
