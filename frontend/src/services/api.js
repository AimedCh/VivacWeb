import axios from 'axios';

// API client configuration - Mock mode since backend is removed
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vivacweb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vivacweb_token');
      localStorage.removeItem('vivacweb_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Authentication API - Mock implementation
  register: async (userData) => {
    // Mock registration
    const mockUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      experience_level: userData.experience || 'Beginner',
      equipment: [],
      preferences: {},
      total_routes: 0,
      total_distance: 0
    };
    
    const mockToken = 'mock_token_' + Date.now();
    localStorage.setItem('vivacweb_token', mockToken);
    localStorage.setItem('vivacweb_user', JSON.stringify(mockUser));
    
    return {
      success: true,
      message: 'Registration successful',
      user: mockUser,
      token: mockToken
    };
  },

  login: async (credentials) => {
    // Mock login - accept demo credentials or any email/password
    if (credentials.email === 'admin@gmail.com' && credentials.password === 'admin123') {
      const mockUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@gmail.com',
        experience_level: 'Intermediate',
        equipment: ['Sleeping Bag', 'Tent', 'GPS'],
        preferences: { difficulty: 'Medium', terrain: 'Mountain' },
        total_routes: 5,
        total_distance: 45.2
      };
      
      const mockToken = 'mock_token_' + Date.now();
      localStorage.setItem('vivacweb_token', mockToken);
      localStorage.setItem('vivacweb_user', JSON.stringify(mockUser));
      
      return {
        success: true,
        message: 'Login successful',
        user: mockUser,
        token: mockToken
      };
    }
    
    // For any other credentials, create a mock user
    const mockUser = {
      id: Date.now(),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      experience_level: 'Beginner',
      equipment: [],
      preferences: {},
      total_routes: 0,
      total_distance: 0
    };
    
    const mockToken = 'mock_token_' + Date.now();
    localStorage.setItem('vivacweb_token', mockToken);
    localStorage.setItem('vivacweb_user', JSON.stringify(mockUser));
    
    return {
      success: true,
      message: 'Login successful',
      user: mockUser,
      token: mockToken
    };
  },

  logout: () => {
    localStorage.removeItem('vivacweb_token');
    localStorage.removeItem('vivacweb_user');
  },

  // Routes API
  getRoutes: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.terrain) params.append('terrain', filters.terrain);

      const response = await apiClient.get(`/api/routes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
  },

  createRoute: async (routeData) => {
    try {
      const response = await apiClient.post('/api/routes', routeData);
      return response.data;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  },

  generateRouteWithAI: async (request) => {
    try {
      const response = await apiClient.post('/api/routes/generate-ai', request);
      return response.data;
    } catch (error) {
      console.error('Error generating route:', error);
      throw error;
    }
  },

  // Alias for generateRouteWithAI (used by RightPanel)
  generateRoute: async (request) => {
    try {
      const response = await apiClient.post('/api/routes/generate-ai', request);
      return response.data;
    } catch (error) {
      console.error('Error generating route:', error);
      throw error;
    }
  },

  getRoute: async (routeId) => {
    try {
      const response = await apiClient.get(`/api/routes/${routeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching route:', error);
      throw error;
    }
  },

  deleteRoute: async (routeId) => {
    try {
      const response = await apiClient.delete(`/api/routes/${routeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  },

  // Ratings API
  getRatings: async (routeId) => {
    try {
      const response = await apiClient.get(`/api/routes/${routeId}/ratings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ratings:', error);
      return [];
    }
  },

  rateRoute: async (routeId, ratingData) => {
    try {
      const response = await apiClient.post(`/api/routes/${routeId}/rate`, ratingData);
      return response.data;
    } catch (error) {
      console.error('Error rating route:', error);
      throw error;
    }
  },

  // Guides API
  getGuides: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty_level) params.append('difficulty_level', filters.difficulty_level);

      const response = await apiClient.get(`/api/guides?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching guides:', error);
      return [];
    }
  },

  getGuide: async (slug) => {
    try {
      const response = await apiClient.get(`/api/guides/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching guide:', error);
      throw error;
    }
  },

  // Trails API
  getTrails: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.terrain) params.append('terrain', filters.terrain);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await apiClient.get(`/api/trails?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trails:', error);
      return [
        {
          id: '1',
          name: 'Evening Peak Trail',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
          time: '11am',
          distance: '11.0km',
          description: 'Sunset views',
          rating: 4.3,
          reviews: 52,
          difficulty: 'Easy',
          terrain: 'Mountain'
        },
        {
          id: '2',
          name: 'Whispering Woods',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
          time: '1.5hrs',
          distance: '7.5km',
          description: 'Forest trail',
          rating: 4.7,
          reviews: 24,
          difficulty: 'Medium',
          terrain: 'Forest/Flat'
        }
      ];
    }
  },

  searchTrails: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.terrain) params.append('terrain', filters.terrain);

      const response = await apiClient.get(`/trails/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching trails:', error);
      return [];
    }
  },

  // Profile API - Mock implementation
  getUserProfile: async () => {
    const storedUser = localStorage.getItem('vivacweb_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  },

  updateUserProfile: async (profileData) => {
    // Mock profile update
    const storedUser = localStorage.getItem('vivacweb_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('vivacweb_user', JSON.stringify(updatedUser));
      return {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      };
    }
    return {
      success: false,
      message: 'User not found'
    };
  },

  // Weather API
  getWeather: async (lat, lng) => {
    try {
      const response = await apiClient.get(`/weather/${lat}/${lng}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return {
        temperature: '18°C',
        condition: 'Sunny',
        forecast: '23 mins clear'
      };
    }
  },

  // Country routes API
  getCountryRoutes: async (country, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.terrain) params.append('terrain', filters.terrain);

      const response = await apiClient.get(`/api/countries/${country}/routes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching country routes:', error);
      return { success: false, routes: [], total: 0 };
    }
  },

  // Health check
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      return { message: 'API not available' };
    }
  }
};