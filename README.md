# Kirana Store - Full Stack E-commerce Application

A modern, mobile-first e-commerce application for a Kirana (grocery) store built with Next.js, MongoDB, and Tailwind CSS.

## Features

- User authentication (sign up/login)
- Product browsing and search
- Product details with per kg/per piece pricing
- Shopping cart functionality
- Order placement and history
- Mobile-first, responsive design
- Secure payment integration (Stripe)

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Payment**: Stripe
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kirana-store.git
   cd kirana-store
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one.

2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy to Vercel:
   ```bash
   vercel
   ```

5. Set up environment variables in Vercel dashboard:
   - Go to your project settings
   - Add the following environment variables:
     ```
     MONGODB_URI=your-production-mongodb-uri
     NEXTAUTH_SECRET=your-production-secret-key
     NEXTAUTH_URL=https://your-production-domain.com
     STRIPE_SECRET_KEY=your-production-stripe-secret-key
     STRIPE_PUBLISHABLE_KEY=your-production-stripe-publishable-key
     ```

6. Enable automatic deployments:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically deploy when you push to the main branch

### Production Build

1. Create a production build:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── cart/              # Cart page
│   ├── login/             # Login page
│   ├── orders/            # Orders page
│   ├── product/           # Product pages
│   └── register/          # Registration page
├── components/            # React components
├── lib/                   # Utility functions
├── models/                # MongoDB models
└── types/                 # TypeScript type definitions
```

## API Routes

- `/api/auth/[...nextauth]` - Authentication endpoints
- `/api/register` - User registration
- `/api/products` - Product management
- `/api/orders` - Order management
- `/api/payment` - Payment processing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
