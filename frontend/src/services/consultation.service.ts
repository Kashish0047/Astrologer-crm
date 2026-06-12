import api from './api';
import type { ApiResponse, Consultation, PaginatedResponse } from '../types';

export const consultationService = {
  getConsultations: async (page = 1, limit = 10, search = '') => {
    const res = await api.get<ApiResponse<PaginatedResponse<Consultation>>>('/consultations', {
      params: { page, limit, search },
    });
    return res.data.data;
  },

  getConsultation: async (id: string) => {
    const res = await api.get<ApiResponse<Consultation>>(`/consultations/${id}`);
    return res.data.data;
  },

  createConsultation: async (data: Record<string, unknown>) => {
    const res = await api.post<ApiResponse<Consultation>>('/consultations', data);
    return res.data.data;
  },

  updateConsultation: async (id: string, data: Record<string, unknown>) => {
    const res = await api.put<ApiResponse<Consultation>>(`/consultations/${id}`, data);
    return res.data.data;
  },

  deleteConsultation: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/consultations/${id}`);
    return res.data;
  },

  generateAISummary: async (id: string) => {
    const res = await api.post<ApiResponse<{ aiSummary: string }>>(`/consultations/${id}/generate-summary`);
    return res.data.data;
  },
};
