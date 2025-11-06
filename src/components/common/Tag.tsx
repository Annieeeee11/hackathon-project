import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  onRemove?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const variantClasses = {
  default: 'bg-secondary text-secondary-foreground border-border',
  primary: 'bg-primary text-primary-foreground border-primary',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Tag({
  children,
  variant = 'default',
  size = 'md',
  onRemove,
  onClick,
  disabled = false,
  className,
}: TagProps) {
  const isInteractive = Boolean(onClick);

  return (
    <span
      onClick={disabled ? undefined : onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium border transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        isInteractive && !disabled && 'cursor-pointer hover:opacity-80',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          disabled={disabled}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove tag"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

export function TagList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {children}
    </div>
  );
}

