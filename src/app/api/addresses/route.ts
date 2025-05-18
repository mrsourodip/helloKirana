import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {connectDB} from '@/lib/mongodb';
import Address from '@/models/Address';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const addresses = await Address.find({ user: session.user.email }).sort({ createdAt: -1 });
    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, street, city, state, pincode } = body;

    if (!type || !street || !city || !state || !pincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // If this is the first address, make it default
    const addressCount = await Address.countDocuments({ user: session.user.email });
    const isDefault = addressCount === 0;

    // If this address is set as default, unset default for other addresses
    if (body.isDefault || isDefault) {
      await Address.updateMany(
        { user: session.user.email },
        { $set: { isDefault: false } }
      );
    }

    const address = await Address.create({
      user: session.user.email,
      type,
      street,
      city,
      state,
      pincode,
      isDefault: body.isDefault || isDefault,
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 