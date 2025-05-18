'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import { FiSearch, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi';
import { useCart } from '@/lib/cart';
import { useFavorites } from '@/lib/favorites';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  image: string;
  isPieceProduct: boolean;
  pricePerPiece?: number;
  pricePerKg?: number;
  category: string;
}

interface Order {
  _id: string;
  createdAt: string;
}

const categories = [
  { name: 'All', value: '', icon: '🏪' },
  { name: 'Rice', value: 'rice', icon: '🍚' },
  { name: 'Flour', value: 'flour', icon: '🌾' },
  { name: 'Pulses', value: 'pulses', icon: '🫘' },
  { name: 'Essentials', value: 'essentials', icon: '🛒' },
  { name: 'Oil', value: 'oil', icon: '🫗' },
];

const SearchLoader = () => (
  <div className="flex items-center justify-center space-x-1">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="relative h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">🔍</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
    <p className="text-gray-600">Try adjusting your search or filter to find what you&apos;re looking for.</p>
  </div>
);

export default function Home() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const { addItem, items } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const fetchProducts = useCallback(async (search: string, category: string) => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`/api/products?${params.toString()}`);
      const { data } = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useMemo(
    () => debounce((search: string, category: string) => {
      fetchProducts(search, category);
    }, 300),
    [fetchProducts]
  );

  useEffect(() => {
    fetchProducts(searchTerm, selectedCategory);
    
    return () => {
      debouncedFetch.cancel();
    };
  }, [selectedCategory, debouncedFetch, fetchProducts, searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      debouncedFetch(searchTerm, selectedCategory);
    }
  }, [searchTerm, selectedCategory, debouncedFetch]);

  useEffect(() => {
    const fetchLastOrder = async () => {
      if (!session) return;
      
      try {
        const response = await fetch('/api/orders/latest');
        const data = await response.json();
        if (data.order) {
          setLastOrder(data.order);
        }
      } catch (error) {
        console.error('Error fetching last order:', error);
      }
    };

    fetchLastOrder();
  }, [session]);

  const handleAddToCart = (product: Product) => {
    if (!session) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    addItem({
      id: product._id,
      name: product.name,
      price: product.isPieceProduct ? product.pricePerPiece! : product.pricePerKg!,
      quantity: 1,
      image: product.image,
      isPieceProduct: product.isPieceProduct,
    });

    toast.success(`${product.name} added to cart!`, {
      position: 'bottom-center',
      duration: 2000,
      style: {
        background: '#333',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };

  const formatLastOrderDate = (dateString: string) => {
    const orderDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (orderDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (orderDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return orderDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Featured Products
          </h1>
          {session ? (
            <p className="text-gray-600">
              Welcome back, {session.user?.name?.split(' ')[0]}! 👋
            </p>
          ) : (
            <p className="text-gray-600">
              <Link href="/login" className="text-blue-500 hover:text-blue-600">
                Sign in
              </Link>{' '}
              to save your shopping list and track orders
            </p>
          )}
        </div>
        
        {session && (
          <div className="hidden md:flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <Link
              href="/orders"
              className="text-center hover:bg-white p-3 rounded-md transition-colors duration-200"
            >
              <p className="text-sm text-gray-600">Last Order</p>
              <p className="font-semibold text-gray-800">
                {lastOrder ? formatLastOrderDate(lastOrder.createdAt) : 'No orders yet'}
              </p>
            </Link>
            <div className="h-8 w-px bg-gray-200"></div>
            <Link
              href="/cart"
              className="text-center hover:bg-white p-3 rounded-md transition-colors duration-200"
            >
              <p className="text-sm text-gray-600">Cart Items</p>
              <p className="font-semibold text-gray-800">{items.length} items</p>
            </Link>
          </div>
        )}
      </div>

      <div className="mb-8 relative">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <SearchLoader />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedCategory === category.value
                ? 'bg-blue-500 text-white shadow-md scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 group relative"
            >
              <Link href={`/product/${product._id}`} className="block md:hidden absolute inset-0 z-10" />
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors duration-200 text-gray-700"
                    title="Add to cart"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleFavorite({
                      _id: product._id,
                      name: product.name,
                      image: product.image,
                      price: product.isPieceProduct ? product.pricePerPiece! : product.pricePerKg!,
                      isPieceProduct: product.isPieceProduct,
                    })}
                    className={`p-2 bg-white rounded-full shadow-md transition-colors duration-200 ${
                      isFavorite(product._id)
                        ? 'text-red-500 hover:bg-red-500 hover:text-white'
                        : 'text-gray-700 hover:bg-red-500 hover:text-white'
                    }`}
                    title={isFavorite(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {isFavorite(product._id) ? (
                      <HiHeart className="w-5 h-5" />
                    ) : (
                      <FiHeart className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.isPieceProduct ? product.pricePerPiece : product.pricePerKg}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                      per {product.isPieceProduct ? 'piece' : 'kg'}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/product/${product._id}`}
                  className="hidden md:block w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center"
                >
                  Show Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
