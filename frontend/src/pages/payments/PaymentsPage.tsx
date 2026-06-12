import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { paymentService } from '../../services/payment.service';
import { clientService } from '../../services/client.service';
import type { Payment } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SearchBar from '../../components/shared/SearchBar';
import Pagination from '../../components/shared/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import Badge, { getStatusBadgeVariant } from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const paymentSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['UPI', 'Cash', 'Card', 'Bank Transfer']),
  status: z.enum(['Paid', 'Pending', 'Refunded']).default('Pending'),
  paymentDate: z.string().optional(),
});

type PaymentForm = z.infer<typeof paymentSchema>;

const PaymentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['payments', page, statusFilter, search],
    queryFn: () => paymentService.getPayments(page, 10, statusFilter, search),
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients-list'],
    queryFn: () => clientService.getClients(1, 1000),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
  });

  const createMutation = useMutation({
    mutationFn: paymentService.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Payment recorded successfully');
      handleCloseModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to record payment'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => paymentService.updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Payment updated successfully');
      handleCloseModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update payment'),
  });

  const deleteMutation = useMutation({
    mutationFn: paymentService.deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Payment deleted successfully');
      setDeletingId(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to delete payment'),
  });

  const handleOpenModal = (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      reset({
        clientId: payment.clientId._id,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        paymentDate: payment.paymentDate ? payment.paymentDate.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setEditingPayment(null);
      reset({
        status: 'Paid',
        paymentMethod: 'UPI',
        paymentDate: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayment(null);
    reset({});
  };

  const onSubmit = (formData: PaymentForm) => {
    if (editingPayment) {
      updateMutation.mutate({ id: editingPayment._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const statusTabs = [
    { id: '', label: 'All' },
    { id: 'Paid', label: 'Paid' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Refunded', label: 'Refunded' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Payments</h1>
          <p className="text-sm text-slate-400">Manage your revenue and transactions</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          Record Payment
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
            title="No payments found"
            description={search || statusFilter ? "No transactions match your filters." : "You haven't recorded any payments yet."}
            actionLabel={search || statusFilter ? undefined : "Record First Payment"}
            onAction={search || statusFilter ? undefined : () => handleOpenModal()}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="table-header">Date</th>
                  <th className="table-header">Client</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Method</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((payment) => (
                  <tr key={payment._id} className="table-row">
                    <td className="table-cell">
                      {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="table-cell font-medium text-white">
                      {payment.clientId?.name || 'Unknown'}
                    </td>
                    <td className="table-cell font-medium text-emerald-400">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="table-cell">{payment.paymentMethod}</td>
                    <td className="table-cell">
                      <Badge variant={getStatusBadgeVariant(payment.status)}>{payment.status}</Badge>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(payment)}
                          className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(payment._id)}
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
        title={editingPayment ? 'Edit Payment Record' : 'Record New Payment'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full">
            <label className="label">Client *</label>
            <select className="select-field" {...register('clientId')} disabled={!!editingPayment}>
              <option value="">Select a client</option>
              {clientsData?.data.map(client => (
                <option key={client._id} value={client._id}>{client.name}</option>
              ))}
            </select>
            {errors.clientId && <p className="mt-1 text-xs text-red-400">{errors.clientId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Amount (₹) *" 
              type="number" 
              step="0.01"
              {...register('amount')} 
              error={errors.amount?.message} 
            />
            <Input 
              label="Payment Date" 
              type="date" 
              {...register('paymentDate')} 
              error={errors.paymentDate?.message} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="label">Payment Method *</label>
              <select className="select-field" {...register('paymentMethod')}>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div className="w-full">
              <label className="label">Status</label>
              <select className="select-field" {...register('status')}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingPayment ? 'Save Changes' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        title="Delete Payment"
        message="Are you sure you want to delete this payment record? This will affect your total revenue calculations. This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default PaymentsPage;
