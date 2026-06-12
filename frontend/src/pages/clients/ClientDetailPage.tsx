import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, User as UserIcon, Calendar, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { clientService } from '../../services/client.service';
import Button from '../../components/ui/Button';
import { SkeletonCard, SkeletonTable } from '../../components/ui/Skeleton';
import Badge, { getStatusBadgeVariant } from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'consultations' | 'payments'>('overview');

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClient(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Client not found</h2>
        <Button onClick={() => navigate('/clients')} variant="secondary">Back to Clients</Button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'consultations', label: 'Consultations' },
    { id: 'payments', label: 'Payments' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/clients')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </button>

      {/* Header Card */}
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl font-bold">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{client.name}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {client.phone}</span>
              {client.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {client.email}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <Button variant="secondary" icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/appointments', { state: { clientId: client._id } })}>
            Schedule
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/consultations', { state: { clientId: client._id } })}>
            Add Consultation
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-surface-card border border-white/10 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-card min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Personal Details</h3>
              <div className="space-y-4">
                <InfoRow icon={<UserIcon />} label="Gender" value={client.gender || 'Not specified'} />
                <InfoRow icon={<Calendar />} label="Date of Birth" value={client.dob ? format(new Date(client.dob), 'MMMM dd, yyyy') : 'Not specified'} />
                <InfoRow icon={<Clock />} label="Time of Birth" value={client.birthTime || 'Not specified'} />
                <InfoRow icon={<MapPin />} label="Place of Birth" value={client.birthPlace || 'Not specified'} />
                <InfoRow icon={<MapPin />} label="Current Address" value={client.address || 'Not specified'} />
                <InfoRow icon={<Briefcase />} label="Occupation" value={client.occupation || 'Not specified'} />
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">History Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Note: In a real app, these counts would come from the backend aggregation. Mocking for UI. */}
                <SummaryCard label="Appointments" value="0" />
                <SummaryCard label="Consultations" value="0" />
                <SummaryCard label="Total Spent" value="₹0" />
                <SummaryCard label="Member Since" value={format(new Date(client.createdAt), 'MMM yyyy')} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="p-0">
             <EmptyState
              title="No appointments"
              description="This client doesn't have any appointments yet."
              actionLabel="Schedule Appointment"
              onAction={() => navigate('/appointments', { state: { clientId: client._id } })}
            />
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="p-0">
             <EmptyState
              title="No consultations"
              description="No consultation records found for this client."
              actionLabel="Add Consultation"
              onAction={() => navigate('/consultations', { state: { clientId: client._id } })}
            />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="p-0">
             <EmptyState
              title="No payments"
              description="No payment history found."
              actionLabel="Add Payment"
              onAction={() => navigate('/payments', { state: { clientId: client._id } })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-slate-500 w-4 h-4 [&>svg]:w-full [&>svg]:h-full">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
      <p className="text-sm text-slate-200">{value}</p>
    </div>
  </div>
);

const SummaryCard = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-4">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className="text-xl font-semibold text-white">{value}</p>
  </div>
);

export default ClientDetailPage;
