import api from './api';
import type { ApiResponse, DashboardStats } from '../types';

export const dashboardService = {
  getStats: async () => {
    const res = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return res.data.data;
  },
};
