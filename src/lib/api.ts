import { sessionManager } from './session';

// Determine API base URL - handles both local and production environments
const getApiBaseUrl = () => {
  // Check if running on localhost/127.0.0.1
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  
  // If on localhost, use the backend server
  if (isLocalhost) {
    return 'http://localhost:3001/api';
  }
  
  // Otherwise, use relative paths (works on Vercel and other hosts)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('[v0] API Base URL:', API_BASE_URL);

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  signup: async (name: string, email: string, password: string, dateOfBirth: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, dateOfBirth }),
    });
    return response.json();
  },

  getCurrentUser: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`);
    return response.json();
  },

  updateUser: async (userId: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Medications APIs
export const medicationAPI = {
  getAll: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/medications/user/${userId}`);
    return response.json();
  },

  createMedication: async (name: string, dose: string, frequency: string, prescriber?: string, notes?: string) => {
    const userId = sessionManager.getUserId();
    const response = await fetch(`${API_BASE_URL}/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, dose, frequency, prescriber, notes }),
    });
    return response.json();
  },

  updateMedication: async (id: string, name: string, dose: string, frequency: string, prescriber?: string, notes?: string) => {
    const userId = sessionManager.getUserId();
    const response = await fetch(`${API_BASE_URL}/medications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, dose, frequency, prescriber, notes }),
    });
    return response.json();
  },

  deleteMedication: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/medications/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Allergies APIs
export const allergyAPI = {
  getAll: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/allergies/user/${userId}`);
    return response.json();
  },

  createAllergy: async (name: string, severity: string, notes?: string) => {
    const userId = sessionManager.getUserId();
    const response = await fetch(`${API_BASE_URL}/allergies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, severity, notes }),
    });
    return response.json();
  },

  updateAllergy: async (id: string, name: string, severity: string, notes?: string) => {
    const userId = sessionManager.getUserId();
    const response = await fetch(`${API_BASE_URL}/allergies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, severity, notes }),
    });
    return response.json();
  },

  deleteAllergy: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/allergies/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Conditions APIs
export const conditionAPI = {
  getAll: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/conditions/user/${userId}`);
    return response.json();
  },

  createCondition: async (name: string, notes?: string) => {
    const userId = sessionManager.getUserId();
    const response = await fetch(`${API_BASE_URL}/conditions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, notes }),
    });
    return response.json();
  },

  updateCondition: async (id: string, name: string, notes?: string) => {
    const userId = sessionManager.getUserId();
    const response = await fetch(`${API_BASE_URL}/conditions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, notes }),
    });
    return response.json();
  },

  deleteCondition: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/conditions/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Files APIs
export const fileAPI = {
  getAll: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/files/user/${userId}`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Reports APIs
export const reportAPI = {
  getAll: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/reports/user/${userId}`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
