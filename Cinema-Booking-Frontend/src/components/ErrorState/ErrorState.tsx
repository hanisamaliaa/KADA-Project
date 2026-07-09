import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = 'Something went wrong while loading movies.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <p className="text-neutral-300 text-sm font-medium mb-1">{message}</p>
      <p className="text-neutral-500 text-xs mb-5">Please check your connection and try again.</p>
      <button onClick={onRetry} className="btn btn-secondary btn-sm">
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </button>
    </div>
  );
}
