'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { FiMapPin, FiPlus, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import Script from 'next/script';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  isPieceProduct: boolean;
}

interface Address {
  _id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/addresses');
        const data = await response.json();
        setAddresses(data);
        // Set the default address as selected, if available
        const defaultAddress = data.find((addr: Address) => addr.isDefault);
        setSelectedAddress(defaultAddress || data[0] || null);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to load addresses');
      } finally {
        setLoadingAddresses(false);
      }
    };

    if (session) {
      fetchAddresses();
    }
  }, [session]);

  const handlePayment = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        // Handle Cash on Delivery
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            total,
            shippingAddress: {
              street: selectedAddress.street,
              city: selectedAddress.city,
              state: selectedAddress.state,
              pincode: selectedAddress.pincode,
            },
            paymentMethod: 'cod',
            paymentStatus: 'pending',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to place order');
        }

        await response.json();
        clearCart();
        toast.success('Order placed successfully! You can track your order in the Orders section.');
        router.push('/');
      } else {
        // Handle Razorpay payment
        const response = await fetch('/api/orders/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            total,
            shippingAddress: {
              street: selectedAddress.street,
              city: selectedAddress.city,
              state: selectedAddress.state,
              pincode: selectedAddress.pincode,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment');
        }

        const { orderId, amount, currency } = await response.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency,
          name: 'Hello Kirana',
          description: 'Payment for your order',
          order_id: orderId,
          handler: async function (response: any) {
            try {
              const verifyResponse = await fetch('/api/orders/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              if (!verifyResponse.ok) {
                throw new Error('Payment verification failed');
              }

              clearCart();
              toast.success('Payment successful! Order placed.');
              router.push('/');
            } catch (error) {
              console.error('Error verifying payment:', error);
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: session.user?.name,
            email: session.user?.email,
          },
          theme: {
            color: '#3B82F6',
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-900">Please sign in to checkout</p>
        <button
          onClick={() => router.push('/login')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loadingAddresses) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h1>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h1>
      
      {addresses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <FiMapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900">No Delivery Address</h2>
          <p className="text-gray-600 mb-4">Please add a delivery address to continue with checkout</p>
          <button
            onClick={() => router.push('/addresses')}
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            <FiPlus className="w-5 h-5" />
            Add New Address
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Delivery Address</h2>
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedAddress?._id === address._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAddress?._id === address._id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}></div>
                  <div>
                    <h3 className="font-medium capitalize text-gray-900">
                      {address.type}
                      {address.isDefault && (
                        <span className="ml-2 text-sm text-blue-600">(Default)</span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm">{address.street}</p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => router.push('/addresses')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
            >
              <FiPlus className="w-4 h-4" />
              Add New Address
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Payment Method</h2>
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              paymentMethod === 'cod'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setPaymentMethod('cod')}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                paymentMethod === 'cod'
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}></div>
              <div className="flex items-center gap-2">
                <FiDollarSign className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
                  <p className="text-sm text-gray-600">Pay when you receive your order</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              paymentMethod === 'razorpay'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setPaymentMethod('razorpay')}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                paymentMethod === 'razorpay'
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}></div>
              <div className="flex items-center gap-2">
                <FiCreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Pay with Razorpay</h3>
                  <p className="text-sm text-gray-600">Secure payment with credit/debit card</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Order Summary</h2>
        {items.map((item: CartItem) => (
          <div key={item.id} className="flex justify-between mb-2 text-gray-700">
            <span>
              {item.name} x {item.quantity}
              {item.isPieceProduct ? ' pc(s)' : ' kg'}
            </span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading || items.length === 0 || !selectedAddress}
          className="w-full mt-6 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
        </button>
      </div>

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
    </div>
  );
} 