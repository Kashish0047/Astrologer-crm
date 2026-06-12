import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface-card border border-white/10 rounded-2xl shadow-2xl fade-in p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-400 mb-6">{message}</p>
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1 justify-center" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1 justify-center" onClick={onConfirm} isLoading={isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
