'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface FavoriteProduct {
  _id: string;
  name: string;
  image: string;
  price: number;
  isPieceProduct: boolean;
}

interface FavoritesContextType {
  favorites: FavoriteProduct[];
  isLoading: boolean;
  toggleFavorite: (product: FavoriteProduct) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch favorites when session changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (session) {
        try {
          const response = await fetch('/api/favorites');
          if (response.ok) {
            const data = await response.json();
            setFavorites(data);
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      } else {
        setFavorites([]);
      }
      setIsLoading(false);
    };

    fetchFavorites();
  }, [session]);

  const toggleFavorite = async (product: FavoriteProduct) => {
    if (!session) {
      toast.error('Please sign in to add favorites');
      return;
    }

    const isFav = favorites.some(fav => fav._id === product._id);
    
    try {
      const response = await fetch('/api/favorites', {
        method: isFav ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (response.ok) {
        if (isFav) {
          setFavorites(favorites.filter(fav => fav._id !== product._id));
          toast.success('Removed from favorites');
        } else {
          setFavorites([...favorites, product]);
          toast.success('Added to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav._id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isLoading, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 