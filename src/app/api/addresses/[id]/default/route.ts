import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Address from '@/models/Address';
import mongoose from 'mongoose';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be signed in to set default address' },
        { status: 401 }
      );
    }

    await connectDB();

    const addressId = await params.id;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return NextResponse.json(
        { error: 'Invalid address ID' },
        { status: 400 }
      );
    }

    // First, set all addresses of the user to non-default
    await Address.updateMany(
      { user: session.user.id },
      { isDefault: false }
    );

    // Then set the specified address as default
    const address = await Address.findOneAndUpdate(
      { 
        _id: new mongoose.Types.ObjectId(addressId),
        user: session.user.id 
      },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json(
      { error: 'Failed to set default address' },
      { status: 500 }
    );
  }
} 