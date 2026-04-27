"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Bell, HelpCircle } from "lucide-react";

const navLinks = [
  { href: "/courses", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
  { href: "/courses", label: "Discussions" },
  { href: "/courses", label: "Library" },
];

export function GlassNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getInitials = (email: string) =>
    email
      .split("@")[0]
      .slice(0, 2)
      .toUpperCase();

  return (
    <header
      className={cn(
        "fixed top-0 w-full h-16 z-50 border-b border-gray-800/50 transition-colors duration-200",
        "glass-nav shadow-sm",
        className
      )}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            AfterClass
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.label === "Courses" && pathname.startsWith("/courses");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-colors duration-200",
                    isActive
                      ? "text-violet-400 border-b-2 border-violet-500 pb-1"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search (hidden on small screens) */}
          <div className="relative hidden lg:block">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search discussions..."
              className="bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface placeholder:text-slate-500 focus:ring-2 focus:ring-primary-container focus:outline-none w-56 xl:w-64 transition-all"
            />
          </div>

          {user ? (
            <>
              {/* Create Post Button */}
              <Link
                href="/courses"
                className="hidden sm:inline-flex items-center bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all active:scale-95"
              >
                Create Post
              </Link>

              {/* Notification Icons */}
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:bg-slate-800/50 rounded-md transition-all">
                  <Bell size={20} />
                </button>
                <button className="hidden sm:flex p-2 text-slate-400 hover:bg-slate-800/50 rounded-md transition-all">
                  <HelpCircle size={20} />
                </button>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-slate-700 flex items-center justify-center text-xs font-bold text-violet-300 overflow-hidden">
                {user.user_metadata?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(user.email ?? "AC")
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.99]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
