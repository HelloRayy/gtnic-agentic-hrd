import { cn } from '@/lib/utils.js';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export function Spinner({ size = 'sm', className, color }: SpinnerProps) {
  const sizeMap = {
    xs: 'w-3 h-3 border-[1.5px]',
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-6 h-6 border-[2.5px]',
  };

  return (
    <span
      className={cn(
        'inline-block rounded-full animate-spin border-t-transparent',
        sizeMap[size],
        color ? '' : 'border-[#7285d5]',
        className
      )}
      style={color ? { borderColor: `${color} transparent transparent transparent` } : undefined}
      role="status"
      aria-label="Memuat..."
    />
  );
}
