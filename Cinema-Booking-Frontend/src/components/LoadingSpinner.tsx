import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  className,
  loading = true,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-[2px]',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
  };

  return (
    <span
      aria-label="Loading"
      role="status"
      className={clsx(
        'inline-block rounded-full border-primary-500/30 border-t-primary-500',
        loading && 'animate-spin',
        sizeClasses[size],
        className,
      )}
    />
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={clsx('skeleton', className)} />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden backdrop-blur-sm">
      <Skeleton className="aspect-[2/3]" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-3.5 w-1/2 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-6 w-12 rounded-lg" />
        </div>
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden p-6 backdrop-blur-sm">
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-8 flex-1 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
