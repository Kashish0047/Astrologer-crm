import api from './api';
import type { ApiResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { email, password });
    return res.data.data;
  },

  register: async (name: string, email: string, password: string) => {
    const res = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', { name, email, password });
    return res.data.data;
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: { name?: string; email?: string; password?: string }) => {
    const res = await api.put<ApiResponse<User>>('/auth/update', data);
    return res.data.data;
  },
};
