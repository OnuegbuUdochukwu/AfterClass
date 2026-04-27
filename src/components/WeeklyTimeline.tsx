"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import TopicBanner from "@/components/TopicBanner";

type WeeklyTopic = {
  id: string;
  weekNumber: number;
  title: string;
  noteUrl: string | null;
  fileSize: string | null;
  isVerified: boolean;
  facilitatorName: string;
  facilitatorAvatar: string | null;
};

type WeeklyTimelineProps = {
  courseId: string;
  topics: WeeklyTopic[];
  accentColor: string;
  canVerify: boolean;
};

export default function WeeklyTimeline({
  courseId,
  topics,
  accentColor,
  canVerify,
}: WeeklyTimelineProps) {
  const grouped = useMemo(() => {
    const map = new Map<number, WeeklyTopic[]>();
    for (const topic of topics) {
      const list = map.get(topic.weekNumber) ?? [];
      list.push(topic);
      map.set(topic.weekNumber, list);
    }

    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([weekNumber, weekTopics]) => ({
        weekNumber,
        topics: weekTopics,
      }));
  }, [topics]);

  const latestWeek = grouped[grouped.length - 1]?.weekNumber ?? null;
  const [openWeek, setOpenWeek] = useState<number | null>(latestWeek);
  const latestRef = useRef<HTMLDivElement | null>(null);

  const jumpToLatest = () => {
    if (latestWeek !== null) {
      setOpenWeek(latestWeek);
    }
    latestRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (grouped.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-outline-variant/30 p-8 text-center">
        <p className="text-sm text-on-surface-variant">
          No topics have been posted for this course yet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pb-20">
      <div className="space-y-4">
        {grouped.map((week) => {
          const isOpen = openWeek === week.weekNumber;
          const isLatest = week.weekNumber === latestWeek;

          return (
            <section
              key={week.weekNumber}
              ref={isLatest ? latestRef : null}
              className={`overflow-hidden rounded-xl border transition-all ${
                isOpen
                  ? "border-2 border-violet-500/50 shadow-lg shadow-violet-500/5"
                  : isLatest
                  ? "border border-violet-500/30"
                  : "border border-outline-variant/20"
              } bg-surface-container-low`}
            >
              <button
                onClick={() =>
                  setOpenWeek((prev) =>
                    prev === week.weekNumber ? null : week.weekNumber
                  )
                }
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-surface-container/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-on-surface">
                    Week {String(week.weekNumber).padStart(2, "0")}
                  </h2>
                  {isLatest && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      Current Week
                    </span>
                  )}
                </div>
                <div className="text-on-surface-variant">
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 px-5 pb-5">
                      {week.topics.map((topic) => (
                        <TopicBanner
                          key={topic.id}
                          topicId={topic.id}
                          courseId={courseId}
                          title={topic.title}
                          noteUrl={topic.noteUrl}
                          fileSize={topic.fileSize}
                          facilitatorName={topic.facilitatorName}
                          facilitatorAvatar={topic.facilitatorAvatar}
                          accentColor={accentColor}
                          isVerified={topic.isVerified}
                          canVerify={canVerify}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>

      {/* Jump to Latest FAB */}
      <button
        onClick={jumpToLatest}
        className="fixed bottom-24 md:bottom-8 right-6 rounded-full bg-[#7F56D9] hover:bg-[#6941C6] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all active:scale-95 flex items-center gap-2"
      >
        <ChevronDown size={16} />
        Jump to Latest
      </button>
    </div>
  );
}
