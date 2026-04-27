"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Calendar, MessageSquare, User } from "lucide-react";

const tabs = [
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/courses", label: "Timeline", icon: Calendar },
  { href: "/courses", label: "Discuss", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 glass-nav border-t border-slate-800/50 shadow-2xl pb-safe">
      <div className="flex justify-around items-center h-16 w-full px-4">
        {tabs.map((tab) => {
          const isActive =
            tab.label === "Courses"
              ? pathname.startsWith("/courses")
              : tab.label === "Profile"
              ? pathname === "/profile"
              : false;

          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 transition-all",
                isActive
                  ? "text-violet-400 bg-violet-500/10 rounded-xl px-3 py-1"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
