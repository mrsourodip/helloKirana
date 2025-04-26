import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import crypto from 'crypto';
// import { razorpay } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('Razorpay webhook secret is not configured');
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    await connectDB();

    if (event.event === 'payment.captured') {
      const { order_id, payment_id } = event.payload.payment.entity;

      // Update order status
      await Order.findOneAndUpdate(
        { razorpayOrderId: order_id },
        {
          paymentStatus: 'completed',
          razorpayPaymentId: payment_id,
          status: 'processing',
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 