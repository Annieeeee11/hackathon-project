import { ReactNode } from 'react';
import Link from 'next/link';
import { ModeToggle } from '../modeToggle';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title?: string;
  logo?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title = 'AI Learning Assistant',
  logo,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('flex justify-between items-center p-6 border-b', className)}>
      <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        {logo}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </Link>
      <div className="flex items-center gap-4">
        {actions}
        <ModeToggle />
      </div>
    </header>
  );
}

