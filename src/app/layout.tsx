import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { GlassNav } from '@/components/GlassNav';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
      <head>
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <AuthProvider>
          {/* Global Navigation Bar */}
          <GlassNav />

          {/* Main Content Area */}
          <main className="flex-1 pt-16 relative w-full">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* Mobile Bottom Navigation */}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
