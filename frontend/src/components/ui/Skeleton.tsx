import React from 'react';

export const SkeletonText: React.FC<{ width?: string; height?: string }> = ({
  width = '100%',
  height = '16px',
}) => (
  <div className="skeleton rounded" style={{ width, height }} />
);

export const SkeletonCard: React.FC = () => (
  <div className="glass-card p-6 space-y-3">
    <SkeletonText width="40%" height="14px" />
    <SkeletonText width="60%" height="28px" />
    <SkeletonText width="30%" height="12px" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => (
  <div className="glass-card overflow-hidden">
    <div className="border-b border-white/10 px-4 py-3 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonText key={i} width={`${100 / cols}%`} height="12px" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="px-4 py-3.5 flex gap-4 border-b border-white/5">
        {Array.from({ length: cols }).map((_, colIdx) => (
          <SkeletonText key={colIdx} width={`${100 / cols}%`} height="14px" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr className="border-b border-white/5">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <SkeletonText height="14px" />
      </td>
    ))}
  </tr>
);
