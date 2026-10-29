import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export interface NoticeProps {
  appearance?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Notice({
  appearance = 'info',
  title,
  children,
  actions,
  className,
}: NoticeProps) {
  const styles = {
    info: {
      container: 'bg-[#eeeffa]/70 border-[#d8dcf7] text-[#333641]',
      icon: <Info className="w-4 h-4 text-[#7285d5] shrink-0 mt-0.5" />,
    },
    success: {
      container: 'bg-[#edf3ec]/80 border-[#dae7da] text-[#2f5535]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#8cac91] shrink-0 mt-0.5" />,
    },
    warning: {
      container: 'bg-[#fbf5eb] border-[#ebd9bd] text-[#7a5c24]',
      icon: <AlertTriangle className="w-4 h-4 text-[#b6a17b] shrink-0 mt-0.5" />,
    },
    danger: {
      container: 'bg-[#fdf0ef] border-[#f6cbc7] text-[#912d26]',
      icon: <AlertOctagon className="w-4 h-4 text-[#d9756c] shrink-0 mt-0.5" />,
    },
    neutral: {
      container: 'bg-[#f8f7f4] border-[#e9e8e6] text-[#333641]',
      icon: <Info className="w-4 h-4 text-[#8c8d97] shrink-0 mt-0.5" />,
    },
  };

  const current = styles[appearance] || styles.info;

  return (
    <div
      className={cn(
        'flex gap-2.5 p-3 rounded-xl border text-xs leading-relaxed',
        current.container,
        className
      )}
    >
      {current.icon}
      <div className="flex-1 space-y-1">
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-[11.5px] opacity-90">{children}</div>
        {actions && <div className="pt-1.5 flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}
