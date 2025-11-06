import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Stat {
  number: string | number;
  label: string;
  icon?: ReactNode;
}

interface StatsGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-8', gridColsClass[columns], className)}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          {stat.icon && (
            <div className="flex justify-center mb-2">{stat.icon}</div>
          )}
          <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
          <div className="text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

