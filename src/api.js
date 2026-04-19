const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Store token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Get headers with authorization
export const getHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// User API calls
export const userAPI = {
  register: async (username, password, confirmPassword, phone) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password, confirmPassword, phone }),
    });
    return response.json();
  },

  login: async (username, password) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  updateProfile: async (username, phone, password, confirmPassword) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ username, phone, password, confirmPassword }),
    });
    return response.json();
  },
};

// Ride API calls
export const rideAPI = {
  createRide: async (pickup, destination, departureTime, availableSeats, vehicleType, notes) => {
    const response = await fetch(`${API_URL}/rides`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ pickup, destination, departureTime, availableSeats, vehicleType, notes }),
    });
    return response.json();
  },

  getAllRides: async () => {
    const response = await fetch(`${API_URL}/rides`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  getRideById: async (id) => {
    const response = await fetch(`${API_URL}/rides/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  bookRide: async (rideId) => {
    const response = await fetch(`${API_URL}/rides/book`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rideId }),
    });
    return response.json();
  },

  getUserBookings: async () => {
    const response = await fetch(`${API_URL}/rides/bookings/my-bookings`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  updateRide: async (id, updates) => {
    const response = await fetch(`${API_URL}/rides/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  deleteRide: async (id) => {
    const response = await fetch(`${API_URL}/rides/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Request API calls
export const requestAPI = {
  createRequest: async (pickup, destination, departureTime, vehicleType, notes) => {
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ pickup, destination, departureTime, vehicleType, notes }),
    });
    return response.json();
  },

  getAllRequests: async () => {
    const response = await fetch(`${API_URL}/requests`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  getRequestById: async (id) => {
    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  fulfillRequest: async (requestId) => {
    const response = await fetch(`${API_URL}/requests/fulfill`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ requestId }),
    });
    return response.json();
  },

  getUserResponses: async () => {
    const response = await fetch(`${API_URL}/requests/responses/my-responses`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  updateRequest: async (id, updates) => {
    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  deleteRequest: async (id) => {
    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },
};
