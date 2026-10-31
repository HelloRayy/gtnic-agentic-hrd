import React from 'react';
import { getTechAsset } from './techIcons.js';
import { cn } from '@/lib/utils.js';

export interface TechBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: 'sm' | 'md';
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  name,
  size = 'md',
  className,
  ...props
}) => {
  const asset = getTechAsset(name);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1.5 rounded-[6px]',
    md: 'px-2.5 py-1 text-[12.5px] gap-1.5 rounded-[7px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium bg-[#f8f7f4] border border-[#e3e2de] text-[#333641] transition-all duration-150 select-none hover:border-[#8292d6] hover:bg-white',
        sizeClasses[size],
        className
      )}
      title={asset ? `${name} (Terverifikasi asset icon)` : name}
      {...props}
    >
      {/* If asset icon exists, display it; otherwise fallback directly to clean text label */}
      {asset && <span className="inline-flex items-center shrink-0">{asset.icon}</span>}
      <span className="truncate">{name}</span>
    </span>
  );
};
