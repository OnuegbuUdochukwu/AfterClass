import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AfterClass | Academic Hub',
  description: 'The definitive third space for university learning',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <AuthProvider>
          {/* Global Navigation Bar */}
          <header className="fixed top-0 w-full h-16 bg-white/80 dark:bg-[#101828]/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center text-xl font-bold tracking-tight">
                AfterClass<span className="text-primary text-2xl leading-none">.</span>
              </Link>
              
              {/* Action Area */}
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 pt-16 relative">
            {children}
          </main>

          {/* Support Widget (FAB) */}
          <button className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover hover:-translate-y-1 transition-all z-50">
            <MessageSquare size={24} />
          </button>
        </AuthProvider>
      </body>
    </html>
  );
}
