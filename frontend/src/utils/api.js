// API configuration utility
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:5174';

export const API_ENDPOINTS = {
  // User endpoints
  LOGIN: `${API_BASE_URL}/api/v1/user/login`,
  REGISTER: `${API_BASE_URL}/api/v1/user/patient/register`,
  LOGOUT: `${API_BASE_URL}/api/v1/user/patient/logout`,
  GET_USER: `${API_BASE_URL}/api/v1/user/patient/me`,
  
  // Doctor endpoints
  GET_DOCTORS: `${API_BASE_URL}/api/v1/user/doctors`,
  GET_DOCTOR_BY_ID: (id) => `${API_BASE_URL}/api/v1/user/doctor/${id}`,
  ADD_DOCTOR: `${API_BASE_URL}/api/v1/user/doctor/addnew`,
  UPDATE_DOCTOR: (id) => `${API_BASE_URL}/api/v1/user/doctor/${id}`,
  
  // Admin endpoints
  ADD_ADMIN: `${API_BASE_URL}/api/v1/user/admin/addnew`,
  ADMIN_LOGOUT: `${API_BASE_URL}/api/v1/user/admin/logout`,
  
  // Appointment endpoints
  POST_APPOINTMENT: `${API_BASE_URL}/api/v1/appointment/post`,
  GET_APPOINTMENTS: `${API_BASE_URL}/api/v1/appointment/getall`,
  UPDATE_APPOINTMENT: (id) => `${API_BASE_URL}/api/v1/appointment/${id}`,
  DELETE_APPOINTMENT: (id) => `${API_BASE_URL}/api/v1/appointment/${id}`,
  
  // Message endpoints
  SEND_MESSAGE: `${API_BASE_URL}/api/v1/message/send`,
  GET_MESSAGES: `${API_BASE_URL}/api/v1/message/getall`,
  
  // Dashboard URL
  DASHBOARD_URL: DASHBOARD_URL,
};

export default API_BASE_URL; 