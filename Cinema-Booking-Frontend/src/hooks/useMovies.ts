import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { IMovie, MovieQueryParams } from '@/types';
import { movieService } from '@/services/movieService';

export interface UseMoviesReturn {
  movies: IMovie[];
  loading: boolean;
  fetching: boolean;
  error: string | null;
  search: string;
  genre: string;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  genres: string[];
  setSearch: (search: string) => void;
  setGenre: (genre: string) => void;
  setPage: (page: number) => void;
  retry: () => void;
}

export function useMovies(defaultLimit = 8): UseMoviesReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const genre = searchParams.get('genre') || '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.max(1, Number(searchParams.get('limit')) || defaultLimit);

  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<string[]>([]);

  const fetchIdRef = useRef(0);
  const mountedRef = useRef(true);

  const updateParams = useCallback(
    (updates: Partial<MovieQueryParams>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        const merged: MovieQueryParams = {
          search,
          genre,
          page,
          limit,
          ...updates,
        };

        if (merged.search) next.set('search', merged.search);
        else next.delete('search');

        if (merged.genre) next.set('genre', merged.genre);
        else next.delete('genre');

        if (merged.page > 1) next.set('page', String(merged.page));
        else next.delete('page');

        if (merged.limit !== defaultLimit) next.set('limit', String(merged.limit));
        else next.delete('limit');

        return next;
      }, { replace: true });
    },
    [searchParams, setSearchParams, search, genre, page, limit, defaultLimit],
  );

  const fetchMovies = useCallback(
    async (params: MovieQueryParams, isInitial = false) => {
      const id = ++fetchIdRef.current;

      if (isInitial) {
        setLoading(true);
      } else {
        setFetching(true);
      }
      setError(null);

      try {
        const result = await movieService.getMoviesPaginated({
          search: params.search,
          genre: params.genre,
          page: params.page,
          limit: params.limit,
        });

        if (id !== fetchIdRef.current || !mountedRef.current) return;

        setMovies(result.data);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
      } catch (err) {
        if (id !== fetchIdRef.current || !mountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Failed to load movies.');
      } finally {
        if (id === fetchIdRef.current && mountedRef.current) {
          setLoading(false);
          setFetching(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const isInitial = isFirstRender.current;
    isFirstRender.current = false;
    fetchMovies({ search, genre, page, limit }, isInitial);
  }, [search, genre, page, limit, fetchMovies]);

  useEffect(() => {
    let cancelled = false;
    movieService.getMovies().then((all) => {
      if (cancelled) return;
      const unique = [...new Set(all.map((m) => m.genre).filter(Boolean))].sort();
      setGenres(unique);
    });
    return () => { cancelled = true; };
  }, []);

  const setSearch = useCallback(
    (value: string) => updateParams({ search: value, page: 1 }),
    [updateParams],
  );

  const setGenre = useCallback(
    (value: string) => updateParams({ genre: value, page: 1 }),
    [updateParams],
  );

  const setPage = useCallback(
    (value: number) => updateParams({ page: value }),
    [updateParams],
  );

  const retry = useCallback(() => {
    fetchMovies({ search, genre, page, limit }, true);
  }, [fetchMovies, search, genre, page, limit]);

  return {
    movies,
    loading,
    fetching,
    error,
    search,
    genre,
    page,
    limit,
    totalItems,
    totalPages,
    genres,
    setSearch,
    setGenre,
    setPage,
    retry,
  };
}
