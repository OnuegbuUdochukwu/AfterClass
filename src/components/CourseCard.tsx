import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import type { CourseLobbyItem } from "@/app/courses/data";

type CourseCardProps = {
  course: CourseLobbyItem;
};

export default function CourseCard({ course }: CourseCardProps) {
  const accent = course.accent_color ?? "#7F56D9";

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group relative flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-low overflow-hidden transition-all hover:border-violet-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5"
    >
      {/* Top Gradient / Image Area */}
      <div
        className="relative h-36 w-full"
        style={{
          background: `linear-gradient(135deg, ${accent}33 0%, ${accent}11 50%, transparent 100%)`,
        }}
      >
        {/* Course Code Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-surface-container/80 backdrop-blur-sm border border-outline-variant/30 text-xs font-bold text-on-surface">
          {course.code}
        </div>

        {/* New Note Indicator */}
        {course.hasNewNote && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            New Note
          </div>
        )}

        {/* Decorative Icon */}
        <div className="absolute bottom-3 right-3 opacity-20 group-hover:opacity-40 transition-opacity">
          <BookOpen size={48} style={{ color: accent }} />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4">
        <h2 className="text-base font-semibold text-on-surface mb-1 group-hover:text-violet-400 transition-colors line-clamp-2">
          {course.name}
        </h2>

        <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">
          Access lecture notes, discussions, and weekly timelines for this course.
        </p>

        {/* Card Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-outline-variant/20">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users size={14} />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
            Open <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
