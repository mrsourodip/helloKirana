import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await connectDB();
    
    if (!db.connection.db) {
      throw new Error('Database connection not established');
    }

    // Test the connection by listing databases
    const dbs = await db.connection.db.admin().listDatabases();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      databases: dbs.databases.map(db => db.name)
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to MongoDB' },
      { status: 500 }
    );
  }
} 