export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Client {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  dob?: string;
  birthTime?: string;
  birthPlace?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  occupation?: string;
  createdAt: string;
}

export interface Appointment {
  _id: string;
  clientId: { _id: string; name: string; phone: string; email: string };
  date: string;
  time: string;
  consultationType: 'Career' | 'Marriage' | 'Health' | 'Finance' | 'General Guidance';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface Consultation {
  _id: string;
  clientId: { _id: string; name: string; phone: string };
  appointmentId?: { _id: string; date: string; consultationType: string };
  concern: string;
  discussionNotes: string;
  recommendations?: string;
  aiSummary?: string;
  followUpDate?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  clientId: { _id: string; name: string; phone: string };
  amount: number;
  paymentMethod: 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';
  status: 'Paid' | 'Pending' | 'Refunded';
  paymentDate: string;
  createdAt: string;
}

export interface DashboardStats {
  totalClients: number;
  upcomingAppointments: number;
  completedConsultations: number;
  totalRevenue: number;
  recentClients: Client[];
  upcomingAppointmentsList: Appointment[];
  recentPayments: Payment[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
