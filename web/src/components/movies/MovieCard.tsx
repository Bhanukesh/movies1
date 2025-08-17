'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDeleteMovieMutation, useToggleMovieFavoriteMutation } from '@/store/api';
import { toggleFavorite, selectIsFavorite } from '@/store/slices/favorites';
import type { Movie } from '@/store/api/enhanced/movies';
import type { RootState } from '@/store';

interface MovieCardProps {
  movie: Movie;
  onEdit?: (movie: Movie) => void;
  showActions?: boolean;
  className?: string;
}

export function MovieCard({ movie, onEdit, showActions = true, className }: MovieCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  
  const isFavorite = useSelector((state: RootState) => selectIsFavorite(state, movie.id));
  const [toggleFavoriteMutation] = useToggleMovieFavoriteMutation();
  const [deleteMovie] = useDeleteMovieMutation();

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic update
    dispatch(toggleFavorite(movie));
    
    try {
      await toggleFavoriteMutation({
        id: movie.id,
        isFavorite: !isFavorite,
      }).unwrap();
      
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      // Revert optimistic update
      dispatch(toggleFavorite(movie));
      toast.error('Failed to update favorites');
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      await deleteMovie({ id: movie.id }).unwrap();
      toast.success('Movie deleted successfully');
    } catch {
      toast.error('Failed to delete movie');
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(movie);
  };

  const handleCardClick = () => {
    router.push(`/movies/${movie.id}`);
  };

  const formatYear = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear();
  };

  const formatRuntime = (runtime?: number | null) => {
    if (!runtime) return 'N/A';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${className}`}
      onClick={handleCardClick}
    >
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1">
            {movie.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteToggle}
            className={`shrink-0 ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        {movie.overview && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {movie.overview}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatYear(movie.release_date)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRuntime(movie.runtime)}
            </div>
            {movie.vote_average && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                {movie.vote_average.toFixed(1)}
              </div>
            )}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 3).map((genre, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {typeof genre === 'string' ? genre : (genre as { name: string }).name}
                </Badge>
              ))}
              {movie.genres.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{movie.genres.length - 3}
                </Badge>
              )}
            </div>
          )}

          {movie.personal_rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3 w-3 text-blue-500 fill-current" />
              <span className="text-blue-600 font-medium">
                {movie.personal_rating}/10
              </span>
              <span className="text-muted-foreground">(Your rating)</span>
            </div>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0">
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={isDeleting}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}