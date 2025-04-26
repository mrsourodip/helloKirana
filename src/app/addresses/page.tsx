'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiHome, FiPlus, FiMapPin, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Address {
  _id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function Addresses() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/addresses');
        const data = await response.json();
        setAddresses(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchAddresses();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newAddress = await response.json();
        setAddresses([...addresses, newAddress]);
        setShowAddForm(false);
        setFormData({
          type: 'home',
          street: '',
          city: '',
          state: '',
          pincode: '',
        });
        toast.success('Address added successfully');
      } else {
        throw new Error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleDelete = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAddresses(addresses.filter(addr => addr._id !== addressId));
        toast.success('Address deleted successfully');
      } else {
        throw new Error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}/default`, {
        method: 'PUT',
      });

      if (response.ok) {
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === addressId,
        })));
        toast.success('Default address updated');
      } else {
        throw new Error('Failed to update default address');
      }
    } catch (error) {
      console.error('Error updating default address:', error);
      toast.error('Failed to update default address');
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please sign in to manage your addresses</h2>
        <Link
          href="/login"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Addresses</h1>
        <div className="animate-pulse">
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <FiPlus className="w-5 h-5" />
          Add New Address
        </button>
      </div>

      {showAddForm ? (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Address</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  required
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  placeholder="Enter your street address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  placeholder="Enter your state"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  placeholder="Enter 6-digit PIN code"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Enter a valid 6-digit PIN code</p>
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-100 text-gray-800 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white rounded-lg shadow-md p-6 relative hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-full">
                    {address.type === 'home' ? (
                      <FiHome className="w-5 h-5" />
                    ) : address.type === 'work' ? (
                      <FiMapPin className="w-5 h-5" />
                    ) : (
                      <FiMapPin className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold capitalize text-gray-900">
                        {address.type}
                      </h3>
                      {address.isDefault && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      title="Set as default"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="Delete address"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 