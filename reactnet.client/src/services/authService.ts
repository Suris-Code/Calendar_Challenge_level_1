import axios from 'axios';
import { User } from '../stores/authStore';

const API_URL = '/api/AuthManagement';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return {
      user: response.data?.data,
      token: ''
    }
  },
  
  logout: async (): Promise<void> => {
    await axios.get(`${API_URL}/logout`);
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/me`);
    return response.data.data;
  },
  
  register: async (registerData: RegisterRequest): Promise<any> => {
    const response = await axios.post(`${API_URL}/register`, registerData);
    return response.data;
  },
  
  verifyEmail: async (token: string, email: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/verify-email`, { token, email });
    return response.data;
  },
  
  forgotPassword: async (email: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },
  
  resetPassword: async (token: string, email: string, password: string, confirmPassword: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/reset-password`, { 
      token, 
      email, 
      password, 
      confirmPassword 
    });
    return response.data;
  }
};

export default authService; 