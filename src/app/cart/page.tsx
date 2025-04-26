'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isPieceProduct: boolean;
  image: string;
}

export default function Cart() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, updateQuantity, removeItem, total } = useCart();

  const handleCheckout = () => {
    if (!session) {
      toast.error('Please sign in to checkout');
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
    toast.success(
      `${item.name} quantity updated to ${newQuantity} ${item.isPieceProduct ? 'pieces' : 'kg'}!`,
      {
        position: 'bottom-center',
        duration: 2000,
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      }
    );
  };

  const handleRemoveItem = (item: CartItem) => {
    removeItem(item.id);
    toast.success(`${item.name} removed from cart!`, {
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

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Please sign in to view your cart</h2>
        <Link
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4 text-gray-900">Your cart is empty</p>
          <Link
            href="/"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex items-center border-b border-gray-200 py-4"
              >
                <div className="relative w-24 h-24 mr-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">
                    ₹{item.price} {item.isPieceProduct ? 'per piece' : 'per kg'}
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      className="px-2 py-1 border border-gray-300 rounded-l-md text-gray-900 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b border-gray-300 text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      className="px-2 py-1 border border-gray-300 rounded-r-md text-gray-900 hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Subtotal</span>
                  <span className="text-gray-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Shipping</span>
                  <span className="text-gray-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 