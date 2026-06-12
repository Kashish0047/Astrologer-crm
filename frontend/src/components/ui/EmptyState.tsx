import React from 'react';
import { InboxIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        {icon || <InboxIcon className="w-8 h-8 text-slate-500" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 text-center max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
