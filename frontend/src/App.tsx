import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/clients/ClientsPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import ConsultationsPage from './pages/consultations/ConsultationsPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<HomePage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/:id" element={<ClientDetailPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="consultations" element={<ConsultationsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
