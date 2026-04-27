"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Download, ChevronDown } from "lucide-react";

export default function TimelineAccordion() {
  const [openWeek, setOpenWeek] = useState<number | null>(1);

  const toggleWeek = (week: number) => {
    setOpenWeek(openWeek === week ? null : week);
  };

  const weeks = [
    {
      id: 1,
      title: "Week 01: Introduction to Data Structures",
      discussions: 3,
      verified: 2,
    },
    {
      id: 2,
      title: "Week 02: Trees and Graphs",
      discussions: 5,
      verified: 1,
    },
    {
      id: 3,
      title: "Week 03: Dynamic Programming",
      discussions: 1,
      verified: 0,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 flex flex-col">
      {weeks.map((week) => (
        <div
          key={week.id}
          className="border-b border-outline-variant/20 py-6"
        >
          <button
            onClick={() => toggleWeek(week.id)}
            className="w-full flex items-center justify-between text-left group"
          >
            <h3 className="text-xl font-semibold text-on-surface group-hover:text-violet-400 transition-colors">
              {week.title}
            </h3>
            <div className="text-on-surface-variant group-hover:text-violet-400 transition-colors">
              {openWeek === week.id ? (
                <Minus size={20} />
              ) : (
                <Plus size={20} />
              )}
            </div>
          </button>

          <AnimatePresence>
            {openWeek === week.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-6 pb-2 space-y-6">
                  {/* Note Download */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/20 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-medium text-on-surface">
                        Lecture_Slides_W{week.id}.pdf
                      </span>
                      <span className="text-sm text-slate-500">
                        1.4 MB • PDF Document
                      </span>
                    </div>
                    <div className="p-2 rounded-full bg-surface-container-high border border-outline-variant/30">
                      <Download
                        size={18}
                        className="text-on-surface-variant"
                      />
                    </div>
                  </div>

                  {/* Discussion Preview */}
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <span className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded-md font-medium">
                      {week.discussions} Unread Questions
                    </span>
                    {week.verified > 0 && (
                      <span className="px-2 py-1 bg-tertiary/10 text-tertiary rounded-md font-medium">
                        {week.verified} Lecturer Verified
                      </span>
                    )}
                  </div>

                  {/* Discussion Cards */}
                  <div className="relative pt-4 overflow-hidden">
                    <div
                      className="space-y-0"
                      style={{
                        maskImage:
                          "linear-gradient(to bottom, black 60%, transparent 100%)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, black 60%, transparent 100%)",
                      }}
                    >
                      {[1, 2, 3].map((_, i) => (
                        <div
                          key={i}
                          className="py-4 border-b border-outline-variant/10 last:border-0 hover:bg-surface-container/30 transition-colors rounded-lg px-2 -mx-2 cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-on-surface font-medium">
                              {i === 0
                                ? "Can someone explain the time complexity of QuickSort in the worst case?"
                                : "I don't understand the pointer logic on slide 14."}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center space-x-2">
                            <span>Alex S.</span>
                            <span>•</span>
                            <span>{i + 1}h ago</span>
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Show More Overlay */}
                    <div className="absolute bottom-0 w-full flex justify-center pb-2 pt-12">
                      <button className="flex items-center space-x-1 text-sm font-medium text-violet-400 hover:text-violet-300 bg-surface px-4 py-2 rounded-full shadow-sm border border-outline-variant/20 transition-all">
                        <span>Show more</span>
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
