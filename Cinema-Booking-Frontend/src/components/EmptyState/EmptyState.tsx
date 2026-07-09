import { Film } from 'lucide-react';

interface EmptyStateProps {
  searchTerm?: string;
  selectedGenre?: string;
}

export default function EmptyState({ searchTerm, selectedGenre }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
        <Film className="h-8 w-8 text-neutral-600" />
      </div>
      <p className="text-neutral-300 text-sm font-medium mb-1">No movies found.</p>
      <p className="text-neutral-500 text-xs">
        {searchTerm || selectedGenre
          ? 'Try another keyword or genre.'
          : 'No movies currently available.'}
      </p>
    </div>
  );
}
