import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'purple';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  const variants = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};

export const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'Scheduled': return 'info';
    case 'Completed': return 'success';
    case 'Cancelled': return 'danger';
    case 'Paid': return 'success';
    case 'Pending': return 'warning';
    case 'Refunded': return 'purple';
    default: return 'info';
  }
};

export default Badge;
