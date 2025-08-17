'use client';

import { useState, useMemo } from 'react';
import { MovieCard } from './MovieCard';
import { MovieListSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { MovieForm } from '@/components/forms/MovieForm';
import { Button } from '@/components/ui/button';
import { Plus, Grid, List } from 'lucide-react';
import { toast } from 'sonner';
import type { Movie } from '@/store/api/enhanced/movies';

interface MovieListProps {
  movies: Movie[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  showCreateButton?: boolean;
  className?: string;
}

type ViewMode = 'grid' | 'list';

export function MovieList({ 
  movies, 
  isLoading, 
  isError, 
  onRetry,
  showCreateButton = true,
  className 
}: MovieListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      // Prioritize favorited movies
      if (a.is_favorite && !b.is_favorite) return -1;
      if (!a.is_favorite && b.is_favorite) return 1;
      
      // Then sort by title
      return a.title.localeCompare(b.title);
    });
  }, [movies]);

  const handleEditSuccess = () => {
    setEditingMovie(null);
    toast.success('Movie updated successfully!');
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    toast.success('Movie created successfully!');
  };

  if (isLoading) {
    return <MovieListSkeleton count={6} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          Failed to load movies
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          No movies found
        </p>
        {showCreateButton && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Movie
          </Button>
        )}
        
        {showCreateForm && (
          <div className="mt-8 w-full max-w-2xl">
            <div className="bg-background border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Create New Movie</h3>
              <MovieForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={className}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
              Movies ({movies.length})
            </h2>
            
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {showCreateButton && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </Button>
          )}
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="mb-8 bg-background border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Movie</h3>
            <MovieForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* Edit Form Modal */}
        {editingMovie && (
          <div className="mb-8 bg-background border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Movie</h3>
            <MovieForm
              movie={editingMovie}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingMovie(null)}
            />
          </div>
        )}

        {/* Movie Grid/List */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {sortedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onEdit={setEditingMovie}
              className={viewMode === 'list' ? 'flex flex-row' : ''}
            />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}