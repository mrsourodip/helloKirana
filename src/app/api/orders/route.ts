import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Order from '@/models/Order';
import connectDB from '@/lib/mongodb';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  isPieceProduct: boolean;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product');

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, total, shippingAddress } = await req.json();

    if (!items?.length || !total || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.create({
      user: session.user.id,
      items: items.map((item: OrderItem) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        isPieceProduct: item.isPieceProduct,
      })),
      totalAmount: total,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    return NextResponse.json({ orderId: order._id });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 