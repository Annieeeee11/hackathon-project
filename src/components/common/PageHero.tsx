import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  icon: ReactNode;
  title: string | ReactNode;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHero({
  icon,
  title,
  description,
  actions,
  className,
}: PageHeroProps) {
  return (
    <div className={cn('text-center mb-8', className)}>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <div className="[&>*]:w-8 [&>*]:h-8 [&>*]:text-primary-foreground">
            {icon}
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          {description}
        </p>
      )}
      {actions && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {actions}
        </div>
      )}
    </div>
  );
}

