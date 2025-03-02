import { useState, useEffect } from 'react';
import { animeClient, type Anime, type AnimeListResponse } from '../lib/apis/anime-client';
import toast from 'react-hot-toast';

interface UseAnimeListOptions {
  initialPage?: number;
  onError?: (error: Error) => void;
}

export function useAnimeList(options: UseAnimeListOptions = {}) {
  const [data, setData] = useState<AnimeListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(options.initialPage || 1);

  useEffect(() => {
    let mounted = true;

    async function fetchAnimeList() {
      try {
        setLoading(true);
        const response = await animeClient.getTopAnime(page);
        
        if (mounted) {
          setData(response);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch anime list:', err);
        const error = err instanceof Error ? err : new Error('Failed to fetch anime list');
        
        if (mounted) {
          setError(error);
          options.onError?.(error);
          toast.error(error.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAnimeList();

    return () => {
      mounted = false;
    };
  }, [page, options.onError]);

  return {
    data,
    loading,
    error,
    page,
    setPage,
    hasNextPage: data?.pagination.has_next_page ?? false,
    hasPreviousPage: page > 1,
  };
}

export function useAnimeDetails(id: number) {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAnimeDetails() {
      try {
        setLoading(true);
        const data = await animeClient.getAnimeById(id);
        
        if (mounted) {
          setAnime(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch anime details:', err);
        const error = err instanceof Error ? err : new Error('Failed to fetch anime details');
        
        if (mounted) {
          setError(error);
          toast.error(error.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAnimeDetails();

    return () => {
      mounted = false;
    };
  }, [id]);

  return {
    anime,
    loading,
    error,
  };
}

export function useAnimeSearch(query: string, page = 1) {
  const [results, setResults] = useState<AnimeListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    async function performSearch() {
      if (!query.trim()) {
        setResults(null);
        return;
      }

      try {
        setLoading(true);
        const data = await animeClient.searchAnime(query, page);
        
        if (mounted) {
          setResults(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to search anime:', err);
        const error = err instanceof Error ? err : new Error('Failed to search anime');
        
        if (mounted) {
          setError(error);
          toast.error(error.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Debounce search to avoid rate limiting
    timeoutId = setTimeout(performSearch, 300);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [query, page]);

  return {
    results,
    loading,
    error,
  };
}