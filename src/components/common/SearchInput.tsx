import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  icon?: ReactNode;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  icon,
}: SearchInputProps) {
  return (
    <div className={cn('flex-1 relative', className)}>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 [&>*]:w-4 [&>*]:h-4 [&>*]:text-muted-foreground">
          {icon}
        </div>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
          icon ? "pl-10" : "pl-4"
        )}
      />
    </div>
  );
}

