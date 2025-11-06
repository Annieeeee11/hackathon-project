import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
  icon?: ReactNode;
}

export function FilterSelect({
  value,
  onChange,
  options,
  className,
  icon,
}: FilterSelectProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {icon && (
        <div className="[&>*]:w-4 [&>*]:h-4 [&>*]:text-muted-foreground">
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

