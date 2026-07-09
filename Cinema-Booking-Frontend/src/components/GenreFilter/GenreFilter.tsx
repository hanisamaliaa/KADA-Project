import { Filter } from 'lucide-react';

interface GenreFilterProps {
  genres: string[];
  value: string;
  onChange: (genre: string) => void;
}

export default function GenreFilter({ genres, value, onChange }: GenreFilterProps) {
  return (
    <div className="relative group">
      <Filter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4 group-focus-within:text-primary-400 transition-colors duration-300" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input pl-10 pr-8 py-2.5 appearance-none cursor-pointer"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}
