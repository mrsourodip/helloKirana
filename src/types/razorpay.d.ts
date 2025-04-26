declare module 'razorpay' {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  }

  interface RazorpayPayment {
    id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: string;
  }

  class Razorpay {
    constructor(options: RazorpayOptions);
    orders: {
      create(options: {
        amount: number;
        currency: string;
        receipt: string;
      }): Promise<RazorpayOrder>;
    };
    payments: {
      fetch(paymentId: string): Promise<RazorpayPayment>;
    };
  }

  export default Razorpay;
} 