export const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`
  },
  user: {
    profile: `${API_BASE_URL}/users/profile`,
    all: `${API_BASE_URL}/users/all`
  }
}