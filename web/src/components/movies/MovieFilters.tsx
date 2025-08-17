'use client';

import { useState, useCallback } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import type { MovieFilters as MovieFiltersType } from '@/hooks/useUrlSync';

interface MovieFiltersProps {
  filters: MovieFiltersType;
  onFiltersChange: (filters: MovieFiltersType) => void;
  className?: string;
}

const GENRE_OPTIONS = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
  'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
];

const SORT_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'year', label: 'Year' },
  { value: 'rating', label: 'Rating' },
  { value: 'popularity', label: 'Popularity' },
] as const;

export function MovieFilters({ filters, onFiltersChange, className }: MovieFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { searchTerm, updateSearchTerm, isSearching } = useDebouncedSearch(
    filters.search || '',
    300,
    useCallback((search: string) => {
      onFiltersChange({ ...filters, search: search || undefined, page: 1 });
    }, [filters, onFiltersChange])
  );

  const handleGenreToggle = (genre: string) => {
    const currentGenres = filters.genres || [];
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];
    
    onFiltersChange({
      ...filters,
      genres: newGenres.length > 0 ? newGenres : undefined,
      page: 1,
    });
  };

  const handleYearChange = (field: 'yearFrom' | 'yearTo', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    onFiltersChange({
      ...filters,
      [field]: numValue,
      page: 1,
    });
  };

  const handleRatingChange = (field: 'ratingFrom' | 'ratingTo', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    onFiltersChange({
      ...filters,
      [field]: numValue,
      page: 1,
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as MovieFiltersType['sortBy'],
      page: 1,
    });
  };

  const handleSortOrderChange = () => {
    const newOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({
      ...filters,
      sortOrder: newOrder,
      page: 1,
    });
  };

  const clearFilters = () => {
    updateSearchTerm('');
    onFiltersChange({
      page: 1,
      size: filters.size,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.genres?.length ||
    filters.yearFrom ||
    filters.yearTo ||
    filters.ratingFrom ||
    filters.ratingTo ||
    filters.sortBy
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Less' : 'More'}
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => updateSearchTerm(e.target.value)}
            className="pl-10"
          />
          {isSearching && (
            <div className="absolute right-3 top-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>

        {/* Genres */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Genres</Label>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.slice(0, showAdvanced ? GENRE_OPTIONS.length : 8).map((genre) => {
              const isSelected = filters.genres?.includes(genre) || false;
              return (
                <Badge
                  key={genre}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => handleGenreToggle(genre)}
                >
                  {genre}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Sort */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Sort by</Label>
            <select
              value={filters.sortBy || ''}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full p-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">Default</option>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Order</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSortOrderChange}
              disabled={!filters.sortBy}
              className="w-full"
            >
              {filters.sortOrder === 'desc' ? '↓ Descending' : '↑ Ascending'}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Year From</Label>
                <Input
                  type="number"
                  placeholder="1990"
                  value={filters.yearFrom || ''}
                  onChange={(e) => handleYearChange('yearFrom', e.target.value)}
                  min="1900"
                  max="2030"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Year To</Label>
                <Input
                  type="number"
                  placeholder="2024"
                  value={filters.yearTo || ''}
                  onChange={(e) => handleYearChange('yearTo', e.target.value)}
                  min="1900"
                  max="2030"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Min Rating</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.ratingFrom || ''}
                  onChange={(e) => handleRatingChange('ratingFrom', e.target.value)}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Max Rating</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={filters.ratingTo || ''}
                  onChange={(e) => handleRatingChange('ratingTo', e.target.value)}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}