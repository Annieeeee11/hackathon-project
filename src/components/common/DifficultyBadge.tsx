import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  className?: string;
}

const difficultyStyles = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium',
        difficultyStyles[difficulty],
        className
      )}
    >
      {difficulty}
    </span>
  );
}

