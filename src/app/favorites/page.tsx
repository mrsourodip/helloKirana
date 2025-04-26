'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi';
import { useFavorites } from '@/lib/favorites';
import { useCart } from '@/lib/cart';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { favorites, isLoading, toggleFavorite } = useFavorites();
  const { addItem } = useCart();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      isPieceProduct: product.isPieceProduct,
    });
    toast.success(`${product.name} added to cart!`);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-4">Start adding products to your favorites!</p>
          <Link
            href="/"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 group"
            >
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors duration-200 text-gray-700"
                    title="Add to cart"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(product)}
                    className="p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
                    title="Remove from favorites"
                  >
                    <HiHeart className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <Link href={`/product/${product._id}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-500 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                      per {product.isPieceProduct ? 'piece' : 'kg'}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/product/${product._id}`}
                  className="block w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 