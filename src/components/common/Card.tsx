import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'white' | 'muted';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
}: CardProps) {
  const baseClasses = 'rounded-lg';
  
  const variantClasses = {
    default: 'bg-card border',
    white: 'bg-white rounded-lg shadow-sm border',
    muted: 'bg-muted',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
}

