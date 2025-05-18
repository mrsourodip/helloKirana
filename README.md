# Hello Kirana - E-commerce Platform

A modern e-commerce platform built with Next.js, MongoDB, and NextAuth.js.

## Features

- User authentication with email/password and Google
- Product catalog with categories
- Shopping cart functionality
- Secure payment integration
- Admin dashboard
- Responsive design

## Tech Stack

- Next.js 15
- React 19
- MongoDB
- NextAuth.js
- Tailwind CSS
- TypeScript
- Zustand for state management

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hellokirana.git
   cd hellokirana
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add the following variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add the environment variables in Vercel's project settings
4. Deploy!

## License

This project is licensed under the MIT License.
