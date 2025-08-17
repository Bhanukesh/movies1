'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Heart, Home, Film } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { selectFavoriteIds } from '@/store/slices/favorites';
import type { RootState } from '@/store';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Favorites',
    href: '/favorites',
    icon: Heart,
  },
];

export function Navigation() {
  const pathname = usePathname();
  const favoriteCount = useSelector((state: RootState) => selectFavoriteIds(state).length);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Film className="h-6 w-6" />
            Movie Collection
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'default' : 'ghost'}
                  asChild
                  className="relative"
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                    {item.name === 'Favorites' && favoriteCount > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 h-5 min-w-[20px] px-1 text-xs"
                      >
                        {favoriteCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}