import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { consultationService } from '../../services/consultation.service';
import { clientService } from '../../services/client.service';
import type { Consultation } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SearchBar from '../../components/shared/SearchBar';
import Pagination from '../../components/shared/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

const consultationSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  concern: z.string().min(2, 'Concern is required'),
  discussionNotes: z.string().min(10, 'Discussion notes are required (min 10 chars)'),
  recommendations: z.string().optional(),
  followUpDate: z.string().optional(),
});

type ConsultationForm = z.infer<typeof consultationSchema>;

const ConsultationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['consultations', page, search],
    queryFn: () => consultationService.getConsultations(page, 10, search),
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients-list'],
    queryFn: () => clientService.getClients(1, 1000),
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ConsultationForm>({
    resolver: zodResolver(consultationSchema),
  });

  const discussionNotesVal = watch('discussionNotes');

  const createMutation = useMutation({
    mutationFn: consultationService.createConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Consultation saved successfully');
      handleCloseModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to save consultation'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => consultationService.updateConsultation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      toast.success('Consultation updated successfully');
      handleCloseModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update consultation'),
  });

  const deleteMutation = useMutation({
    mutationFn: consultationService.deleteConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Consultation deleted successfully');
      setDeletingId(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to delete consultation'),
  });

  const handleOpenModal = (consultation?: Consultation) => {
    if (consultation) {
      setEditingConsultation(consultation);
      setGeneratedSummary(consultation.aiSummary || '');
      reset({
        clientId: consultation.clientId._id,
        concern: consultation.concern,
        discussionNotes: consultation.discussionNotes,
        recommendations: consultation.recommendations || '',
        followUpDate: consultation.followUpDate ? consultation.followUpDate.split('T')[0] : '',
      });
    } else {
      setEditingConsultation(null);
      setGeneratedSummary('');
      reset({});
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingConsultation(null);
    setGeneratedSummary('');
    reset({});
  };

  const onSubmit = (formData: ConsultationForm) => {
    const payload = { ...formData, aiSummary: generatedSummary };
    if (editingConsultation) {
      updateMutation.mutate({ id: editingConsultation._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const generateSummary = async () => {
    if (!discussionNotesVal || discussionNotesVal.length < 10) {
      toast.error('Please enter at least 10 characters in discussion notes first');
      return;
    }

    setIsGenerating(true);
    
    // If we have an ID, we can use the backend endpoint directly
    if (editingConsultation) {
      try {
        const res = await consultationService.generateAISummary(editingConsultation._id);
        setGeneratedSummary(res.aiSummary);
        queryClient.invalidateQueries({ queryKey: ['consultations'] });
        toast.success('Summary generated successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to generate summary');
      } finally {
        setIsGenerating(false);
      }
    } else {
      // For new consultations, we have to wait to save or mock it if backend doesn't support stateless generation.
      // Assuming backend supports a stateless /api/consultations/generate-summary-preview endpoint (We will add it, or we just save and then generate)
      toast.error('Please save the consultation first before generating an AI summary.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Consultation Records</h1>
          <p className="text-sm text-slate-400">Manage session notes and AI summaries</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
          Add Record
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <SearchBar onSearch={(val) => { setSearch(val); setPage(1); }} placeholder="Search by client or concern..." />
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : data?.data.length === 0 ? (
          <EmptyState
            title="No consultations found"
            description={search ? "No records match your search." : "You haven't recorded any consultations yet."}
            actionLabel={search ? undefined : "Add First Record"}
            onAction={search ? undefined : () => handleOpenModal()}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="table-header">Date</th>
                  <th className="table-header">Client</th>
                  <th className="table-header">Primary Concern</th>
                  <th className="table-header max-w-xs">AI Summary</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((consultation) => (
                  <tr key={consultation._id} className="table-row">
                    <td className="table-cell whitespace-nowrap">
                      {format(new Date(consultation.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="table-cell font-medium text-white">
                      {consultation.clientId?.name || 'Unknown'}
                    </td>
                    <td className="table-cell truncate max-w-[150px]">
                      {consultation.concern}
                    </td>
                    <td className="table-cell max-w-[300px]">
                      {consultation.aiSummary ? (
                        <div className="flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                          <span className="truncate text-slate-300">{consultation.aiSummary}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Not generated</span>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(consultation)}
                          className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-400 hover:text-white transition-colors"
                          title="View / Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(consultation._id)}
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
        title={editingConsultation ? 'Edit Consultation Record' : 'Add Consultation Record'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <label className="label">Client *</label>
              <select className="select-field" {...register('clientId')} disabled={!!editingConsultation}>
                <option value="">Select a client</option>
                {clientsData?.data.map(client => (
                  <option key={client._id} value={client._id}>{client.name}</option>
                ))}
              </select>
              {errors.clientId && <p className="mt-1 text-xs text-red-400">{errors.clientId.message}</p>}
            </div>
            <Input label="Primary Concern *" {...register('concern')} error={errors.concern?.message} />
          </div>

          <div className="w-full">
            <label className="label">Discussion Notes *</label>
            <textarea
              className="input-field min-h-[120px] resize-y"
              placeholder="Detailed notes from the session..."
              {...register('discussionNotes')}
            />
            {errors.discussionNotes && <p className="mt-1 text-xs text-red-400">{errors.discussionNotes.message}</p>}
          </div>

          <div className="w-full">
            <label className="label">Recommendations</label>
            <textarea
              className="input-field min-h-[80px] resize-y"
              placeholder="Remedies or actionable advice provided..."
              {...register('recommendations')}
            />
          </div>

          <div className="w-1/2">
            <Input label="Follow Up Date" type="date" {...register('followUpDate')} />
          </div>

          {/* AI Summary Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <label className="label !mb-0 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                AI Generated Summary
              </label>
              {editingConsultation && (
                <button
                  type="button"
                  onClick={generateSummary}
                  disabled={isGenerating}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-indigo-500/10 px-2 py-1 rounded transition-colors"
                >
                  {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {generatedSummary ? 'Regenerate' : 'Generate Summary'}
                </button>
              )}
            </div>
            
            <div className={`p-4 rounded-xl text-sm leading-relaxed ${generatedSummary ? 'bg-indigo-900/20 ai-glow text-slate-200' : 'bg-white/5 border border-white/10 text-slate-500 italic'}`}>
              {!editingConsultation ? (
                "Save this consultation first to generate an AI summary."
              ) : isGenerating ? (
                <div className="flex items-center justify-center py-4 gap-3 text-indigo-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing notes...
                </div>
              ) : generatedSummary ? (
                generatedSummary
              ) : (
                "Click 'Generate Summary' to create a professional summary of your discussion notes using Gemini AI."
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingConsultation ? 'Save Changes' : 'Create Record'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        title="Delete Record"
        message="Are you sure you want to delete this consultation record? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ConsultationsPage;
