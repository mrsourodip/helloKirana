'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { FiShoppingCart, FiHeart, FiMapPin, FiUser, FiPackage, FiLogOut } from 'react-icons/fi';
import { HiShoppingCart } from 'react-icons/hi';
import { useCart } from '@/lib/cart';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { items } = useCart();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Kirana Store</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {status === 'authenticated' ? (
              <>
                <Link 
                  href="/cart" 
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 relative group"
                >
                  {items.length > 0 ? (
                    <>
                      <HiShoppingCart className="w-6 h-6 text-blue-500" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-medium rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center transform -translate-y-1/4 translate-x-1/4">
                        {items.length}
                      </span>
                    </>
                  ) : (
                    <FiShoppingCart className="w-5 h-5" />
                  )}
                  <span className="hidden md:inline ml-1">Cart</span>
                </Link>
                
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="hidden md:inline">{session.user?.name}</span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                      <Link
                        href="/orders"
                        onClick={handleMenuItemClick}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiPackage className="w-4 h-4" />
                        Orders
                      </Link>
                      <Link
                        href="/favorites"
                        onClick={handleMenuItemClick}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiHeart className="w-4 h-4" />
                        Favorites
                      </Link>
                      <Link
                        href="/addresses"
                        onClick={handleMenuItemClick}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiMapPin className="w-4 h-4" />
                        Saved Addresses
                      </Link>
                      <button
                        onClick={() => {
                          handleMenuItemClick();
                          signOut();
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 