import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#15202B] text-[#F7F9F9] flex flex-col">
      <header className="border-b border-gray-800 bg-[#1E2732] p-4 text-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-[#D4AF37]">
          Developer God View
        </h1>
        <p className="text-xs text-[#8B98A5]">Restricted Area</p>
      </header>
      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
