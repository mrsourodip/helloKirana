import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

// Define category groups for similar products
// const categoryGroups = {
//   staples: ['rice', 'flour', 'pulses'],
//   cooking: ['oil', 'spices'],
//   consumables: ['snacks', 'beverages']
// };

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // First get the current product to find its category
    const currentProduct = await Product.findById(params.id);
    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Find 4 random products from the same category, excluding the current product
    const relatedProducts = await Product.aggregate([
      { $match: { 
        category: currentProduct.category,
        _id: { $ne: currentProduct._id }
      }},
      { $sample: { size: 4 } }
    ]);

    return NextResponse.json(relatedProducts);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related products' },
      { status: 500 }
    );
  }
} 