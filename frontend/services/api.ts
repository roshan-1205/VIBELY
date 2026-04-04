const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Add logging for debugging
if (typeof window !== 'undefined') {
  console.log('API_BASE_URL:', API_BASE_URL);
}

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
  bio?: string;
  location?: string;
  website?: string;
  isEmailVerified: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing?: boolean | null;
}

interface Post {
  _id: string;
  author: User;
  content: string;
  images?: Array<{
    url: string;
    alt?: string;
  }>;
  likes: Array<{
    user: User;
    createdAt: string;
  }>;
  comments: Array<{
    _id: string;
    user: User;
    content: string;
    createdAt: string;
  }>;
  likeCount: number;
  commentCount: number;
  isLikedBy?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationItem {
  _id: string;
  recipient: string;
  sender: User;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'welcome';
  message: string;
  targetPost?: Post;
  isRead: boolean;
  timeAgo: string;
  createdAt: string;
}

interface Activity {
  _id: string;
  user: User;
  type: string;
  targetUser?: User;
  targetPost?: Post;
  message: string;
  createdAt: string;
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
      console.error('Response status:', response.status);
      console.error('Response headers:', response.headers);
      throw new Error('Invalid response from server');
    }
    
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      data,
      url: response.url
    });
    
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data,
        url: response.url
      });
      
      // Provide more specific error messages based on status codes
      let errorMessage = data.message || 'An error occurred';
      
      switch (response.status) {
        case 400:
          // Bad request - usually validation errors or wrong credentials
          if (data.message?.includes('Invalid email or password')) {
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          } else if (data.message?.includes('already exists')) {
            errorMessage = 'An account with this email already exists. Please try signing in instead.';
          } else if (data.message?.includes('deactivated')) {
            errorMessage = 'Your account has been deactivated. Please contact support for assistance.';
          } else if (data.errors && Array.isArray(data.errors)) {
            // Handle validation errors
            errorMessage = data.errors.map((err: any) => err.message).join(', ');
          }
          break;
        case 401:
          errorMessage = 'Your session has expired. Please sign in again.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          errorMessage = data.message || `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
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
      console.log('Registration response headers:', Object.fromEntries(response.headers.entries()));
      
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
      console.log('Login response headers:', Object.fromEntries(response.headers.entries()));
      
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
    bio?: string;
    location?: string;
    website?: string;
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

  async getUserProfile(userId: string): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ user: User }>(response);
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
    try {
      console.log('Health check URL:', `${API_BASE_URL}/health`);
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  // Posts endpoints
  async getPosts(page = 1, limit = 10): Promise<ApiResponse<{ posts: Post[] }>> {
    const response = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ posts: Post[] }>(response);
  }

  async getUserPosts(userId: string, page = 1, limit = 10): Promise<ApiResponse<{ posts: Post[] }>> {
    const response = await fetch(`${API_BASE_URL}/posts/user/${userId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ posts: Post[] }>(response);
  }

  async createPost(postData: {
    content: string;
    images?: Array<{ url: string; alt?: string }>;
  }): Promise<ApiResponse<{ post: Post }>> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(postData)
    });

    return this.handleResponse<{ post: Post }>(response);
  }

  async likePost(postId: string): Promise<ApiResponse<{ post: Post; isLiked: boolean; likeCount: number }>> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ post: Post; isLiked: boolean; likeCount: number }>(response);
  }

  async commentOnPost(postId: string, content: string): Promise<ApiResponse<{ post: Post; commentCount: number }>> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content })
    });

    return this.handleResponse<{ post: Post; commentCount: number }>(response);
  }

  async deletePost(postId: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  // Social endpoints
  async followUser(userId: string): Promise<ApiResponse<{ isFollowing: boolean; followerCount: number; followingCount: number }>> {
    const response = await fetch(`${API_BASE_URL}/social/follow/${userId}`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ isFollowing: boolean; followerCount: number; followingCount: number }>(response);
  }

  async getFollowers(userId: string, page = 1, limit = 20): Promise<ApiResponse<{ followers: User[]; totalCount: number }>> {
    const response = await fetch(`${API_BASE_URL}/social/followers/${userId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ followers: User[]; totalCount: number }>(response);
  }

  async getFollowing(userId: string, page = 1, limit = 20): Promise<ApiResponse<{ following: User[]; totalCount: number }>> {
    const response = await fetch(`${API_BASE_URL}/social/following/${userId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ following: User[]; totalCount: number }>(response);
  }

  async getSocialStats(userId: string): Promise<ApiResponse<{ followerCount: number; followingCount: number; isFollowing: boolean | null }>> {
    const response = await fetch(`${API_BASE_URL}/social/stats/${userId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ followerCount: number; followingCount: number; isFollowing: boolean | null }>(response);
  }

  async searchUsers(query: string, page = 1, limit = 20): Promise<ApiResponse<{ users: User[] }>> {
    const response = await fetch(`${API_BASE_URL}/social/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ users: User[] }>(response);
  }

  async discoverUsers(page = 1, limit = 20): Promise<ApiResponse<{ users: User[] }>> {
    const response = await fetch(`${API_BASE_URL}/social/discover?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ users: User[] }>(response);
  }

  async getOnlineUsers(limit = 50): Promise<ApiResponse<{ users: User[] }>> {
    const response = await fetch(`${API_BASE_URL}/social/online?limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ users: User[] }>(response);
  }

  // Notifications endpoints
  async getNotifications(page = 1, limit = 20): Promise<ApiResponse<{ notifications: NotificationItem[] }>> {
    const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ notifications: NotificationItem[] }>(response);
  }

  async getUnreadNotificationCount(): Promise<ApiResponse<{ count: number }>> {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ count: number }>(response);
  }

  async markNotificationsAsRead(notificationIds: string[] = []): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-read`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ notificationIds })
    });

    return this.handleResponse(response);
  }

  async deleteNotification(notificationId: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  // Activities endpoints
  async getActivityFeed(page = 1, limit = 20): Promise<ApiResponse<{ activities: Activity[] }>> {
    const response = await fetch(`${API_BASE_URL}/activities/feed?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ activities: Activity[] }>(response);
  }

  async getUserActivities(userId: string, page = 1, limit = 20): Promise<ApiResponse<{ activities: Activity[] }>> {
    const response = await fetch(`${API_BASE_URL}/activities/user/${userId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ activities: Activity[] }>(response);
  }
}

export const apiService = new ApiService();
export type { User, Post, NotificationItem, Activity, ApiResponse, AuthResponse };