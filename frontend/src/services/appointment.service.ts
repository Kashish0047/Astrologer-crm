import api from './api';
import type { ApiResponse, Appointment, PaginatedResponse } from '../types';

export const appointmentService = {
  getAppointments: async (page = 1, limit = 10, status = '', search = '') => {
    const res = await api.get<ApiResponse<PaginatedResponse<Appointment>>>('/appointments', {
      params: { page, limit, status, search },
    });
    return res.data.data;
  },

  getAppointment: async (id: string) => {
    const res = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return res.data.data;
  },

  createAppointment: async (data: Record<string, unknown>) => {
    const res = await api.post<ApiResponse<Appointment>>('/appointments', data);
    return res.data.data;
  },

  updateAppointment: async (id: string, data: Record<string, unknown>) => {
    const res = await api.put<ApiResponse<Appointment>>(`/appointments/${id}`, data);
    return res.data.data;
  },

  deleteAppointment: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/appointments/${id}`);
    return res.data;
  },
};
