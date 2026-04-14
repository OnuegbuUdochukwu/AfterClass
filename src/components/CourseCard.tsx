import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CourseLobbyItem } from "@/app/courses/data";

type CourseCardProps = {
  course: CourseLobbyItem;
};

export default function CourseCard({ course }: CourseCardProps) {
  const accent = course.accent_color ?? "#1D9BF0";

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg dark:border-gray-800 dark:bg-[#101828]/70"
      style={{ borderLeftColor: accent, borderLeftWidth: "4px" }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {course.code}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            course.hasNewNote
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-gray-200/60 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {course.hasNewNote ? "New Note" : "No New Note"}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">{course.name}</h2>
        <ArrowRight
          size={18}
          className="mt-1 text-gray-500 transition group-hover:translate-x-1 group-hover:text-primary"
        />
      </div>
    </Link>
  );
}
