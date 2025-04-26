import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const latestOrder = await Order.findOne({ user: session.user.id })
      .sort({ createdAt: -1 })
      .select('_id createdAt')
      .lean();

    return NextResponse.json({ order: latestOrder });
  } catch (error) {
    console.error('Error fetching latest order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest order' },
      { status: 500 }
    );
  }
} 