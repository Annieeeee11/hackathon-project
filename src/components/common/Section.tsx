import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'muted';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

const paddingClasses = {
  sm: 'py-8 px-6',
  md: 'py-12 px-6',
  lg: 'py-16 px-6',
  xl: 'py-20 px-6',
};

export function Section({
  children,
  className,
  containerClassName,
  maxWidth = '6xl',
  padding = 'lg',
  background = 'default',
}: SectionProps) {
  return (
    <section
      className={cn(
        paddingClasses[padding],
        background === 'muted' && 'bg-muted/50',
        className
      )}
    >
      <div className={cn(maxWidthClasses[maxWidth], 'mx-auto', containerClassName)}>
        {children}
      </div>
    </section>
  );
}

