import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { clientService } from '../../services/client.service';
import type { Client } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SearchBar from '../../components/shared/SearchBar';
import Pagination from '../../components/shared/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

const clientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  dob: z.string().optional(),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

const ClientsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['clients', page, search],
    queryFn: () => clientService.getClients(page, 10, search),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  });

  const createMutation = useMutation({
    mutationFn: clientService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Client added successfully');
      handleCloseModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to add client'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) => clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client updated successfully');
      handleCloseModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update client'),
  });

  const deleteMutation = useMutation({
    mutationFn: clientService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Client deleted successfully');
      setDeletingId(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to delete client'),
  });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      reset({
        name: client.name,
        phone: client.phone,
        email: client.email || '',
        dob: client.dob ? new Date(client.dob).toISOString().split('T')[0] : '',
        birthTime: client.birthTime || '',
        birthPlace: client.birthPlace || '',
        gender: client.gender,
        address: client.address || '',
        occupation: client.occupation || '',
      });
    } else {
      setEditingClient(null);
      reset({});
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    reset({});
  };

  const onSubmit = (data: ClientForm) => {
    if (editingClient) {
      updateMutation.mutate({ id: editingClient._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Clients</h1>
          <p className="text-sm text-slate-400">Manage your client directory</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          Add Client
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <SearchBar onSearch={(val) => { setSearch(val); setPage(1); }} placeholder="Search clients..." />
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : data?.data.length === 0 ? (
          <EmptyState
            title="No clients found"
            description={search ? "No clients match your search criteria." : "You haven't added any clients yet."}
            actionLabel={search ? undefined : "Add First Client"}
            onAction={search ? undefined : () => handleOpenModal()}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Contact</th>
                  <th className="table-header">Gender</th>
                  <th className="table-header">Occupation</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((client) => (
                  <tr key={client._id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-white">{client.name}</div>
                      {client.birthPlace && <div className="text-xs text-slate-500 mt-0.5">{client.birthPlace}</div>}
                    </td>
                    <td className="table-cell">
                      <div className="text-slate-300">{client.phone}</div>
                      {client.email && <div className="text-xs text-slate-500 mt-0.5">{client.email}</div>}
                    </td>
                    <td className="table-cell">{client.gender || '-'}</td>
                    <td className="table-cell">{client.occupation || '-'}</td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/clients/${client._id}`)}
                          className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(client)}
                          className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(client._id)}
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
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name *" {...register('name')} error={errors.name?.message} />
            <Input label="Phone Number *" {...register('phone')} error={errors.phone?.message} />
            <Input label="Email Address" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Date of Birth" type="date" {...register('dob')} error={errors.dob?.message} />
            <Input label="Time of Birth" type="time" {...register('birthTime')} error={errors.birthTime?.message} />
            <Input label="Place of Birth" {...register('birthPlace')} error={errors.birthPlace?.message} />
            
            <div className="w-full">
              <label className="label">Gender</label>
              <select className="select-field" {...register('gender')}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <Input label="Occupation" {...register('occupation')} error={errors.occupation?.message} />
          </div>
          
          <div className="w-full">
            <label className="label">Address</label>
            <textarea
              className="input-field min-h-[80px] resize-y"
              {...register('address')}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingClient ? 'Update Client' : 'Add Client'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        title="Delete Client"
        message="Are you sure you want to delete this client? This will permanently delete their profile and all associated appointments, consultations, and payment records. This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ClientsPage;
