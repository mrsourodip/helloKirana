'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
    isPieceProduct: boolean;
    pricePerKg?: number;
    pricePerPiece?: number;
  } | null;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function Orders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) return;

      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your orders</h1>
          <Link
            href="/login"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-900">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Orders</h1>
        <div className="text-center">
          <p className="text-xl mb-4 text-gray-900">You haven&apos;t placed any orders yet</p>
          <Link
            href="/"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>
                <p className="text-gray-900">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'processing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
              </span>
            </div>

            <div className="border-t pt-4">
              {order.items.map((item) => (
                <div
                  key={item.product?._id}
                  className="flex justify-between items-center py-2"
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 relative mr-4">
                      <Image
                        src={item.product?.image || ''}
                        alt={item.product?.name || ''}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product?.name || 'Product no longer available'}</h3>
                      <p className="text-sm text-gray-900">
                        {item.quantity} {item.product?.isPieceProduct ? 'piece(s)' : 'kg'} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-900">Shipping Address</p>
                  <p className="text-gray-900">
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">Subtotal: ₹{order.totalAmount.toFixed(2)}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Total: ₹{(order.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 