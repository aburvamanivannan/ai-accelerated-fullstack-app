// API Base URL
export const API_BASE_URL = 'http://localhost:8080';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTHENTICATE: `${API_BASE_URL}/api/authenticate`,
  SIGNUP: `${API_BASE_URL}/api/signup`,
  
  // Events
  EVENTS: `${API_BASE_URL}/api/events`,
  EVENTS_MINE: `${API_BASE_URL}/api/events/mine`,
  
  // Admin Events
  ADMIN_EVENTS: `${API_BASE_URL}/api/admin/events`,
  ADMIN_EVENTS_APPROVE: (eventId: number) => `${API_BASE_URL}/api/admin/events/${eventId}/approve`,
  ADMIN_EVENTS_REJECT: (eventId: number) => `${API_BASE_URL}/api/admin/events/${eventId}/reject`,
} as const;
