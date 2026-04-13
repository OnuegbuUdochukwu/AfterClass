import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Home, Search, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col md:flex-row bg-background text-foreground">
        <AuthProvider>
          {/* Desktop Sidebar (hidden on mobile) */}
          <aside className="hidden md:flex flex-col w-64 h-screen border-r border-surface sticky top-0 bg-background/95 backdrop-blur z-50">
            <div className="p-4 text-xl font-bold text-primary">AfterClass</div>
            <nav className="flex-1 p-4 space-y-4">
              <Link href="/" className="flex items-center space-x-3 hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface">
                <Home size={24} />
                <span className="text-lg">Home</span>
              </Link>
              <Link href="/search" className="flex items-center space-x-3 hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface">
                <Search size={24} />
                <span className="text-lg">Search</span>
              </Link>
              <Link href="/notifications" className="flex items-center space-x-3 hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface">
                <Bell size={24} />
                <span className="text-lg">Notifications</span>
              </Link>
              <Link href="/profile" className="flex items-center space-x-3 hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface">
                <User size={24} />
                <span className="text-lg">Profile</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 pb-16 md:pb-0">
            {children}
          </main>

          {/* Mobile Bottom Navigation (hidden on desktop) */}
          <nav className="md:hidden fixed bottom-0 w-full bg-background border-t border-surface flex justify-around items-center h-16 z-50">
            <Link href="/" className="p-2 text-foreground hover:text-primary">
              <Home size={24} />
            </Link>
            <Link href="/search" className="p-2 text-foreground hover:text-primary">
              <Search size={24} />
            </Link>
            <Link href="/notifications" className="p-2 text-foreground hover:text-primary">
              <Bell size={24} />
            </Link>
            <Link href="/profile" className="p-2 text-foreground hover:text-primary">
              <User size={24} />
            </Link>
          </nav>
        </AuthProvider>
      </body>
    </html>
  );
}
