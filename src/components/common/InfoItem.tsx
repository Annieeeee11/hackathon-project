import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  className?: string;
}

export function InfoItem({ icon, label, className }: InfoItemProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

export function InfoList({
  children,
  className,
  spacing = 'md',
}: {
  children: ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}) {
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={cn('flex items-center flex-wrap text-sm text-muted-foreground', spacingClasses[spacing], className)}>
      {children}
    </div>
  );
}

