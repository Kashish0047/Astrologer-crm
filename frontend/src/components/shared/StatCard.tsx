import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'amber';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  const colors = {
    blue: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      glow: 'shadow-blue-500/10',
    },
    purple: {
      bg: 'bg-purple-500/15',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
      glow: 'shadow-purple-500/10',
    },
    green: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
    },
    amber: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
    },
  };

  const c = colors[color];

  return (
    <div className={`glass-card p-5 hover:bg-white/[0.07] transition-all duration-300 shadow-lg ${c.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
