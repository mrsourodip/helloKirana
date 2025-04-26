import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Favorite from '@/models/Favorite';
import Product from '@/models/Product';

// Get user's favorites
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const favorites = await Favorite.find({ user: session.user.id })
      .populate('product')
      .sort({ createdAt: -1 });

    // Filter out favorites where the product no longer exists
    const validFavorites = favorites.filter(fav => fav.product !== null);

    // Transform the data to match the FavoriteProduct interface
    const transformedFavorites = validFavorites.map(fav => ({
      _id: fav.product._id.toString(),
      name: fav.product.name,
      image: fav.product.image,
      price: fav.product.isPieceProduct ? fav.product.pricePerPiece : fav.product.pricePerKg,
      isPieceProduct: fav.product.isPieceProduct,
    }));

    // Delete invalid favorites
    const invalidFavorites = favorites.filter(fav => fav.product === null);
    if (invalidFavorites.length > 0) {
      await Favorite.deleteMany({
        _id: { $in: invalidFavorites.map(fav => fav._id) }
      });
    }

    return NextResponse.json(transformedFavorites);
  } catch (error) {
    console.error('Error in GET /api/favorites:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Add to favorites
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectDB();

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Create favorite
    await Favorite.create({
      user: session.user.id,
      product: productId,
    });

    return NextResponse.json({ message: 'Added to favorites' });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Already in favorites' }, { status: 400 });
    }
    console.error('Error in POST /api/favorites:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Remove from favorites
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectDB();

    await Favorite.findOneAndDelete({
      user: session.user.id,
      product: productId,
    });

    return NextResponse.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error in DELETE /api/favorites:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 