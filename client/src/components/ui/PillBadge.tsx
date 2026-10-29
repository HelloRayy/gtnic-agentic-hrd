import React from 'react';
import { cn } from '@/lib/utils.js';

export interface PillBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'verified' | 'partial' | 'unverified' | 'neutral' | 'live' | 'warning';
  showDot?: boolean;
  dotColor?: string;
  size?: 'xs' | 'sm' | 'md';
}

export function PillBadge({
  variant = 'neutral',
  showDot = true,
  dotColor,
  size = 'sm',
  className,
  children,
  ...props
}: PillBadgeProps) {
  const variantStyles = {
    verified: 'bg-[#edf3ec] text-[#2f5535] border-[#d4e4d4]',
    partial: 'bg-[#fbf5eb] text-[#7a5c24] border-[#ebd9bd]',
    unverified: 'bg-[#fdf0ef] text-[#912d26] border-[#f6cbc7]',
    neutral: 'bg-[#f0eee9] text-[#4d4f59] border-[#e2dfd7]',
    live: 'bg-[#eeeffa] text-[#465799] border-[#d8dcf7]',
    warning: 'bg-[#fef8e7] text-[#82611a] border-[#fae5a8]',
  };

  const dotStyles = {
    verified: 'bg-[#8cac91]',
    partial: 'bg-[#b6a17b]',
    unverified: 'bg-[#d9756c]',
    neutral: 'bg-[#8c8d97]',
    live: 'bg-[#7285d5]',
    warning: 'bg-[#d9a441]',
  };

  const sizeStyles = {
    xs: 'text-[9.5px] px-1.5 py-0.5 gap-1 rounded',
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 rounded-md font-medium',
  };

  const dotSizeStyles = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border tracking-tight leading-none select-none transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            'rounded-full shrink-0',
            dotSizeStyles[size],
            dotColor ? '' : dotStyles[variant]
          )}
          style={dotColor ? { backgroundColor: dotColor } : undefined}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
