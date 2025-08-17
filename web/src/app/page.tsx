'use client';

import { useEffect, useState, Suspense, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Toaster } from 'sonner';

// import { useGetMoviesQuery } from '@/store/api';
import { hydrateFavorites } from '@/store/slices/favorites';
import { useUrlSync, type MovieFilters } from '@/hooks/useUrlSync';
import { MovieFilters as MovieFiltersComponent } from '@/components/movies/MovieFilters';
import { MovieList } from '@/components/movies/MovieList';
import { Pagination } from '@/components/ui/pagination';
import { ErrorBoundary } from '@/components/ui/error-boundary';

function HomePage() {
  const dispatch = useDispatch();
  const { updateUrl } = useUrlSync();
  const [filters, setFilters] = useState<MovieFilters>({
    page: 1,
    size: 20,
  });

  // Hydrate favorites from localStorage on mount
  useEffect(() => {
    dispatch(hydrateFavorites());
  }, [dispatch]);

  // Build API query from filters
  const apiQuery = {
    page: filters.page || 1,
    size: filters.size || 20,
    ...(filters.search && { search: filters.search }),
    ...(filters.genres?.length && { genres: filters.genres }),
    ...(filters.yearFrom && { year_from: filters.yearFrom }),
    ...(filters.yearTo && { year_to: filters.yearTo }),
    ...(filters.ratingFrom && { rating_from: filters.ratingFrom }),
    ...(filters.ratingTo && { rating_to: filters.ratingTo }),
  };

  // Mock data for development when API isn't available
  const mockMoviesResponse = {
    items: [
      {
        id: 1,
        title: "Sample Movie 1",
        overview: "This is a sample movie for testing the UI without API",
        genres: [{ name: "Action" }, { name: "Adventure" }],
        release_date: "2023-01-01",
        vote_average: 8.5,
        popularity: 1000,
        is_favorite: false,
        personal_rating: null,
        personal_notes: null
      },
      {
        id: 2,
        title: "Sample Movie 2", 
        overview: "Another sample movie for UI testing",
        genres: [{ name: "Comedy" }, { name: "Drama" }],
        release_date: "2023-06-15",
        vote_average: 7.2,
        popularity: 850,
        is_favorite: true,
        personal_rating: 9,
        personal_notes: "Great movie!"
      }
    ],
    total: 2,
    page: 1,
    size: 20,
    pages: 1
  };

  // Use mock data instead of API for now
  const moviesResponse = mockMoviesResponse;
  const isLoading = false;
  const isError = false;
  const refetch = () => console.log('Refetch called');

  const handleFiltersChange = useCallback((newFilters: MovieFilters) => {
    setFilters(newFilters);
    // Temporarily disable URL sync to debug infinite loop
    // updateUrl(newFilters, true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(current => ({ ...current, page }));
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setFilters(current => ({ ...current, size, page: 1 }));
  }, []);

  // Sort movies client-side based on filters
  const sortedMovies = moviesResponse?.items ? [...moviesResponse.items].sort((a, b) => {
    if (!filters.sortBy) return 0;
    
    let aValue: string | number, bValue: string | number;
    
    switch (filters.sortBy) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'year':
        aValue = a.release_date ? new Date(a.release_date).getFullYear() : 0;
        bValue = b.release_date ? new Date(b.release_date).getFullYear() : 0;
        break;
      case 'rating':
        aValue = a.vote_average || 0;
        bValue = b.vote_average || 0;
        break;
      case 'popularity':
        aValue = a.popularity || 0;
        bValue = b.popularity || 0;
        break;
      default:
        return 0;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const result = aValue.localeCompare(bValue);
      return filters.sortOrder === 'desc' ? -result : result;
    }
    
    const result = (aValue as number) - (bValue as number);
    return filters.sortOrder === 'desc' ? -result : result;
  }) : [];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Toaster richColors position="top-right" />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Movie Collection</h1>
            <p className="text-muted-foreground">
              Discover, organize, and rate your favorite movies
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <MovieFiltersComponent
                filters={filters}
                onFiltersChange={handleFiltersChange}
                className="sticky top-8"
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <MovieList
                movies={sortedMovies}
                isLoading={isLoading}
                isError={isError}
                onRetry={refetch}
                showCreateButton={true}
              />

              {/* Pagination */}
              {moviesResponse && moviesResponse.pages > 1 && (
                <Pagination
                  currentPage={moviesResponse.page}
                  totalPages={moviesResponse.pages}
                  totalItems={moviesResponse.total}
                  pageSize={moviesResponse.size}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default function PageWithSuspense() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}