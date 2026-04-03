const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  isEmailVerified: boolean;
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('vibely_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      throw new Error('Invalid response from server');
    }
    
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  }

  // Authentication endpoints
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    console.log('Attempting registration with:', { ...userData, password: '[HIDDEN]' });
    console.log('API URL:', `${API_BASE_URL}/auth/register`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      console.log('Registration response status:', response.status);
      const result = await this.handleResponse<AuthResponse>(response);
      
      // Store token if registration successful
      if (result.success && result.data?.token) {
        localStorage.setItem('vibely_token', result.data.token);
        localStorage.setItem('vibely_user', JSON.stringify(result.data.user));
        console.log('Registration successful, token stored');
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    console.log('Attempting login with:', { ...credentials, password: '[HIDDEN]' });
    console.log('API URL:', `${API_BASE_URL}/auth/login`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(credentials)
      });

      console.log('Login response status:', response.status);
      const result = await this.handleResponse<AuthResponse>(response);
      
      // Store token if login successful
      if (result.success && result.data?.token) {
        localStorage.setItem('vibely_token', result.data.token);
        localStorage.setItem('vibely_user', JSON.stringify(result.data.user));
        console.log('Login successful, token stored');
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response);
      
      // Clear local storage regardless of API response
      localStorage.removeItem('vibely_token');
      localStorage.removeItem('vibely_user');
      
      return result;
    } catch (error) {
      // Clear local storage even if API call fails
      localStorage.removeItem('vibely_token');
      localStorage.removeItem('vibely_user');
      throw error;
    }
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ user: User }>(response);
  }

  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ user: User }>(response);
  }

  // User profile endpoints
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ user: User }>(response);
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    const result = await this.handleResponse<{ user: User }>(response);
    
    // Update stored user data if successful
    if (result.success && result.data?.user) {
      localStorage.setItem('vibely_user', JSON.stringify(result.data.user));
    }
    
    return result;
  }

  async updatePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/user/password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });

    return this.handleResponse(response);
  }

  async getUserStats(): Promise<ApiResponse<{ stats: any }>> {
    const response = await fetch(`${API_BASE_URL}/user/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ stats: any }>(response);
  }

  async deactivateAccount(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/user/account`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    const result = await this.handleResponse(response);
    
    // Clear local storage if account deactivated
    if (result.success) {
      localStorage.removeItem('vibely_token');
      localStorage.removeItem('vibely_user');
    }
    
    return result;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
export type { User, ApiResponse, AuthResponse };