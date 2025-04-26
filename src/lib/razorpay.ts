import Razorpay from 'razorpay';

// Only throw error in production
if (process.env.NODE_ENV === 'production' && (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET)) {
  throw new Error('Razorpay credentials are not configured');
}

// Create a mock Razorpay instance in development if credentials are missing
const razorpayInstance = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : {
      orders: {
        create: async () => ({
          id: 'mock_order_id',
          amount: 0,
          currency: 'INR',
        }),
      },
    };

export const razorpay = razorpayInstance; 