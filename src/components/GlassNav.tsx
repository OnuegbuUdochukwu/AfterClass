import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';

export function GlassNav({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "fixed top-0 w-full h-16 z-50 border-b border-border transition-colors duration-200",
        "bg-[var(--color-nav-bg-light)] dark:bg-[var(--color-nav-bg-dark)] backdrop-blur-[20px]",
        className
      )}
    >
      <div className="max-w-[1280px] mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center text-xl font-bold tracking-tight">
          AfterClass<span className="text-primary text-2xl leading-none">.</span>
        </Link>
        
        {/* Action Area */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">
            Log in
          </Link>
          <Link href="/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
