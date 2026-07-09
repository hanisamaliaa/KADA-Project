import type { MovieQueryParams } from '@/types';

export function buildMovieQueryString(params: MovieQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set('search', params.search);
  if (params.genre) searchParams.set('genre', params.genre);
  if (params.page && params.page > 1) searchParams.set('page', String(params.page));
  if (params.limit && params.limit !== 10) searchParams.set('limit', String(params.limit));

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export function parseMovieQueryFromURL(searchParams: URLSearchParams): MovieQueryParams {
  return {
    search: searchParams.get('search') || '',
    genre: searchParams.get('genre') || '',
    page: Math.max(1, Number(searchParams.get('page')) || 1),
    limit: Math.max(1, Number(searchParams.get('limit')) || 10),
  };
}
