import api from './api';
import type { ApiResponse, Payment, PaginatedResponse } from '../types';

export const paymentService = {
  getPayments: async (page = 1, limit = 10, status = '', search = '') => {
    const res = await api.get<ApiResponse<PaginatedResponse<Payment>>>('/payments', {
      params: { page, limit, status, search },
    });
    return res.data.data;
  },

  getPayment: async (id: string) => {
    const res = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
    return res.data.data;
  },

  createPayment: async (data: Record<string, unknown>) => {
    const res = await api.post<ApiResponse<Payment>>('/payments', data);
    return res.data.data;
  },

  updatePayment: async (id: string, data: Record<string, unknown>) => {
    const res = await api.put<ApiResponse<Payment>>(`/payments/${id}`, data);
    return res.data.data;
  },

  deletePayment: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/payments/${id}`);
    return res.data;
  },
};
