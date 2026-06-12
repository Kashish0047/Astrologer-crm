import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, MessageSquare, IndianRupee } from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/shared/StatCard';
import { SkeletonCard, SkeletonTable } from '../components/ui/Skeleton';
import Badge, { getStatusBadgeVariant } from '../components/ui/Badge';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          AstroManager Dashboard
        </div>
        <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200 tracking-wide mb-1.5">
          Welcome back, {user?.name}! ✨
        </h1>
        <p className="text-slate-400 text-sm font-light">Your professional cosmic practice is aligned and online.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Clients"
            value={stats?.totalClients || 0}
            icon={<Users className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            label="Upcoming Appointments"
            value={stats?.upcomingAppointments || 0}
            icon={<Calendar className="w-5 h-5" />}
            color="purple"
          />
          <StatCard
            label="Completed Consultations"
            value={stats?.completedConsultations || 0}
            icon={<MessageSquare className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            label="Total Revenue"
            value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
            icon={<IndianRupee className="w-5 h-5" />}
            color="amber"
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="space-y-4">
          <h2 className="font-cinzel text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-wide">
            Upcoming Appointments
          </h2>
          {isLoading ? (
            <SkeletonTable rows={4} cols={4} />
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="table-header">Client</th>
                      <th className="table-header">Date & Time</th>
                      <th className="table-header">Type</th>
                      <th className="table-header">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.upcomingAppointmentsList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-400">
                          No upcoming appointments
                        </td>
                      </tr>
                    ) : (
                      stats?.upcomingAppointmentsList.map((apt) => (
                        <tr key={apt._id} className="table-row">
                          <td className="table-cell font-medium text-white">{apt.clientId.name}</td>
                          <td className="table-cell">
                            {format(new Date(apt.date), 'MMM dd, yyyy')} <br />
                            <span className="text-xs text-slate-500">{apt.time}</span>
                          </td>
                          <td className="table-cell">{apt.consultationType}</td>
                          <td className="table-cell">
                            <Badge variant={getStatusBadgeVariant(apt.status)}>{apt.status}</Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="space-y-4">
          <h2 className="font-cinzel text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-wide">
            Recent Payments
          </h2>
          {isLoading ? (
            <SkeletonTable rows={4} cols={4} />
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="table-header">Client</th>
                      <th className="table-header">Amount</th>
                      <th className="table-header">Method</th>
                      <th className="table-header">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentPayments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-400">
                          No recent payments
                        </td>
                      </tr>
                    ) : (
                      stats?.recentPayments.map((payment) => (
                        <tr key={payment._id} className="table-row">
                          <td className="table-cell font-medium text-white">{payment.clientId.name}</td>
                          <td className="table-cell font-medium text-emerald-400">
                            ₹{payment.amount.toLocaleString()}
                          </td>
                          <td className="table-cell">{payment.paymentMethod}</td>
                          <td className="table-cell">
                            <Badge variant={getStatusBadgeVariant(payment.status)}>{payment.status}</Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
