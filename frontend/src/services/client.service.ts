import api from './api';
import type { ApiResponse, Client, PaginatedResponse } from '../types';

export const clientService = {
  getClients: async (page = 1, limit = 10, search = '') => {
    const res = await api.get<ApiResponse<PaginatedResponse<Client>>>('/clients', {
      params: { page, limit, search },
    });
    return res.data.data;
  },

  getClient: async (id: string) => {
    const res = await api.get<ApiResponse<Client>>(`/clients/${id}`);
    return res.data.data;
  },

  createClient: async (data: Partial<Client>) => {
    const res = await api.post<ApiResponse<Client>>('/clients', data);
    return res.data.data;
  },

  updateClient: async (id: string, data: Partial<Client>) => {
    const res = await api.put<ApiResponse<Client>>(`/clients/${id}`, data);
    return res.data.data;
  },

  deleteClient: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/clients/${id}`);
    return res.data;
  },
};
