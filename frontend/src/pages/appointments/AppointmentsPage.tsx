import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { appointmentService } from '../../services/appointment.service';
import { clientService } from '../../services/client.service';
import type { Appointment } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SearchBar from '../../components/shared/SearchBar';
import Pagination from '../../components/shared/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import Badge, { getStatusBadgeVariant } from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const appointmentSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  consultationType: z.enum(['Career', 'Marriage', 'Health', 'Finance', 'General Guidance']),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled']).default('Scheduled'),
  notes: z.string().optional(),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

const AppointmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', page, statusFilter, search],
    queryFn: () => appointmentService.getAppointments(page, 10, statusFilter, search),
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients-list'],
    queryFn: () => clientService.getClients(1, 1000), // Get all clients for dropdown
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
  });

  const createMutation = useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Appointment scheduled successfully');
      handleCloseModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to schedule appointment'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => appointmentService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Appointment updated successfully');
      handleCloseModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update appointment'),
  });

  const deleteMutation = useMutation({
    mutationFn: appointmentService.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Appointment deleted successfully');
      setDeletingId(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to delete appointment'),
  });

  const handleOpenModal = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      reset({
        clientId: appointment.clientId._id,
        date: appointment.date.split('T')[0],
        time: appointment.time,
        consultationType: appointment.consultationType,
        status: appointment.status,
        notes: appointment.notes || '',
      });
    } else {
      setEditingAppointment(null);
      reset({
        status: 'Scheduled',
        consultationType: 'General Guidance',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    reset({});
  };

  const onSubmit = (formData: AppointmentForm) => {
    if (editingAppointment) {
      updateMutation.mutate({ id: editingAppointment._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const statusTabs = [
    { id: '', label: 'All' },
    { id: 'Scheduled', label: 'Scheduled' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Appointments</h1>
          <p className="text-sm text-slate-400">Manage your scheduled sessions</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          Schedule Appointment
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex space-x-1 bg-surface border border-white/5 p-1 rounded-lg">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setStatusFilter(tab.id); setPage(1); }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <SearchBar onSearch={(val) => { setSearch(val); setPage(1); }} placeholder="Search by client name..." />
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : data?.data.length === 0 ? (
          <EmptyState
            title="No appointments found"
            description={search || statusFilter ? "No appointments match your filters." : "You haven't scheduled any appointments yet."}
            actionLabel={search || statusFilter ? undefined : "Schedule First Appointment"}
            onAction={search || statusFilter ? undefined : () => handleOpenModal()}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="table-header">Client</th>
                  <th className="table-header">Date & Time</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((appointment) => (
                  <tr key={appointment._id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-white">{appointment.clientId?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{appointment.clientId?.phone || ''}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-white">{format(new Date(appointment.date), 'MMM dd, yyyy')}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{appointment.time}</div>
                    </td>
                    <td className="table-cell">{appointment.consultationType}</td>
                    <td className="table-cell">
                      <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(appointment)}
                          className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(appointment._id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAppointment ? 'Edit Appointment' : 'Schedule Appointment'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full">
            <label className="label">Client *</label>
            <select className="select-field" {...register('clientId')} disabled={!!editingAppointment}>
              <option value="">Select a client</option>
              {clientsData?.data.map(client => (
                <option key={client._id} value={client._id}>{client.name} ({client.phone})</option>
              ))}
            </select>
            {errors.clientId && <p className="mt-1 text-xs text-red-400">{errors.clientId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Date *" type="date" {...register('date')} error={errors.date?.message} />
            <Input label="Time *" type="time" {...register('time')} error={errors.time?.message} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="label">Consultation Type *</label>
              <select className="select-field" {...register('consultationType')}>
                <option value="Career">Career</option>
                <option value="Marriage">Marriage</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="General Guidance">General Guidance</option>
              </select>
            </div>
            {editingAppointment && (
              <div className="w-full">
                <label className="label">Status</label>
                <select className="select-field" {...register('status')}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="w-full">
            <label className="label">Notes (Optional)</label>
            <textarea
              className="input-field min-h-[80px] resize-y"
              placeholder="Any specific context or requirements..."
              {...register('notes')}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingAppointment ? 'Update' : 'Schedule'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AppointmentsPage;
