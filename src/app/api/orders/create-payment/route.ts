import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { razorpay } from '@/lib/razorpay';

interface CreatePaymentRequest {
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    isPieceProduct: boolean;
  }>;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, total, shippingAddress } = await req.json() as CreatePaymentRequest;

    // Create a Razorpay order
    const order = await razorpay.orders.create({
      amount: total * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    });

    // Save order details in database
    await connectDB();
    await Order.create({
      user: session.user.id,
      items,
      total,
      shippingAddress,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      razorpayOrderId: order.id,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 