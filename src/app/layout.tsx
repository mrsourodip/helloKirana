import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kirana Store',
  description: 'Your neighborhood grocery store, now online!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Toaster position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
