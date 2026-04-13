import { ArrowRight } from 'lucide-react';
import TimelineAccordion from '@/components/TimelineAccordion';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Hero Stack */}
      <section className="flex flex-col items-center text-center max-w-4xl w-full mt-12 mb-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Announcement Badge */}
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full cursor-pointer hover:bg-purple-500/20 transition-colors">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          <span className="text-sm font-medium text-primary">New Course Material Added: CSC 201</span>
          <ArrowRight size={14} className="text-primary" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Your Academic Discussion,<br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Simplified.</span>
        </h1>

        {/* Filter Tabs (Segmented Control) */}
        <div className="flex items-center justify-center p-1 bg-gray-100 dark:bg-gray-800/50 rounded-full mt-4">
          <button className="px-6 py-2 rounded-full bg-primary text-white text-sm font-medium shadow-sm">
            All Topics
          </button>
          <button className="px-6 py-2 rounded-full text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-foreground transition-colors">
            My Courses
          </button>
          <button className="px-6 py-2 rounded-full text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-foreground transition-colors">
            Unread
          </button>
        </div>

      </section>

      {/* Timeline Section */}
      <TimelineAccordion />

    </div>
  );
}
