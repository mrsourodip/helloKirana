'use client';

import { SessionProvider } from "next-auth/react";
import { CartProvider } from '@/lib/cart';
import { FavoritesProvider } from '@/lib/favorites';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </CartProvider>
    </SessionProvider>
  );
} 