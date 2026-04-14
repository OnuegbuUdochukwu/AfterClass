"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
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
      <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300">
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
              className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
              style={
                isLatest
                  ? {
                      borderColor: `${accentColor}88`,
                      boxShadow: `0 0 0 1px ${accentColor}22`,
                    }
                  : undefined
              }
            >
              <button
                onClick={() => setOpenWeek((prev) => (prev === week.weekNumber ? null : week.weekNumber))}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-foreground">Week {week.weekNumber}</h2>
                  {isLatest ? (
                    <span
                      className="rounded-full px-2 py-1 text-[11px] font-semibold"
                      style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
                    >
                      Current Week
                    </span>
                  ) : null}
                </div>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
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
                ) : null}
              </AnimatePresence>
            </section>
          );
        })}
      </div>

      <button
        onClick={jumpToLatest}
        className="fixed bottom-24 right-6 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-hover"
      >
        Jump to Latest
      </button>
    </div>
  );
}
