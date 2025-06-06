import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Address from '@/models/Address';
import mongoose from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Replace 'id' with your actual dynamic segment name
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;



    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be signed in to set default address' },
        { status: 401 }
      );
    }

    await connectDB();

    const addressId = id;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return NextResponse.json(
        { error: 'Invalid address ID' },
        { status: 400 }
      );
    }

    await Address.updateMany(
      { user: session.user.id },
      { isDefault: false }
    );

    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: session.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return NextResponse.json(
        { error: 'Address not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Default address updated successfully', address });
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json(
      { error: 'Failed to set default address' },
      { status: 500 }
    );
  }
}