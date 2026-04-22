import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { AuthProvider } from '@/contexts/AuthContext';
import { GlassNav } from '@/components/GlassNav';

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
          <GlassNav />

          {/* Main Content Area */}
          <main className="flex-1 pt-16 relative w-full max-w-[1280px] mx-auto">
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
