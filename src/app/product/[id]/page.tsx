'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';

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

interface RelatedProduct {
  _id: string;
  name: string;
  image: string;
  pricePerPiece?: number;
  pricePerKg?: number;
  isPieceProduct: boolean;
}

const weightQuantities = [
  { label: '100g', value: 0.1 },
  { label: '250g', value: 0.25 },
  { label: '500g', value: 0.5 },
  { label: '1kg', value: 1 },
  { label: '1.5kg', value: 1.5 },
  { label: '2kg', value: 2 },
];

const pieceQuantities = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1} piece${i > 0 ? 's' : ''}`,
  value: i + 1,
}));

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const { addItem, items } = useCart();

  useEffect(() => {
    if (!id) {
      router.push('/');
      return;
    }

    const fetchProduct = async () => {
      try {
        console.log('Fetching product and related products for ID:', id);
        const [productResponse, relatedResponse] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/products/related/${id}`)
        ]);

        if (!productResponse.ok) {
          throw new Error('Product not found');
        }

        const productData = await productResponse.json();
        const relatedData = await relatedResponse.json();
        
        console.log('Product data:', productData);
        console.log('Related products:', relatedData);
        
        setProduct(productData);
        setRelatedProducts(relatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (product) {
      const existingItem = items.find((item: { id: string; }) => item.id === product._id);
      const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
      
      addItem({
        id: product._id,
        name: product.name,
        price: product.isPieceProduct ? product.pricePerPiece! : product.pricePerKg!,
        quantity,
        image: product.image,
        isPieceProduct: product.isPieceProduct,
      });

      toast.success(
        `${product.name} ${existingItem ? 'quantity updated to' : 'added to cart'} ${newQuantity} ${product.isPieceProduct ? 'pieces' : 'kg'}!`,
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
    }
  };

  const handleQuantitySelect = (value: number) => {
    setQuantity(value);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg text-gray-700">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">₹{product.pricePerKg?.toFixed(2)}</span>
            <span className="text-sm text-gray-500">per kg</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Quantity</h3>
            {product.isPieceProduct ? (
              <select
                value={quantity}
                onChange={(e) => handleQuantitySelect(Number(e.target.value))}
                className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                {pieceQuantities.map((qty) => (
                  <option key={qty.value} value={qty.value}>
                    {qty.label}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <div className="flex flex-wrap gap-3">
                  {weightQuantities.map((qty) => (
                    <button
                      key={qty.label}
                      onClick={() => handleQuantitySelect(qty.value)}
                      className={`px-4 py-2 rounded-lg border ${
                        quantity === qty.value
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 text-gray-900 hover:border-blue-500'
                      }`}
                    >
                      {qty.label}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Quantity:
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="0.1"
                      step="0.1"
                      className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <span className="ml-2 text-gray-600">kg</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Customers also bought</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                href={`/product/${relatedProduct._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{relatedProduct.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-gray-900 font-medium">₹{relatedProduct.isPieceProduct ? relatedProduct.pricePerPiece : relatedProduct.pricePerKg}</span>
                    <span className="text-gray-600">{relatedProduct.isPieceProduct ? 'per piece' : 'per kg'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 