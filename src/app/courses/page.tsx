import { redirect } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import { getAuthenticatedUser, getEnrolledCourses } from "./data";
import { Sparkles } from "lucide-react";

export default async function CoursesPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const courses = await getEnrolledCourses(user.id);

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-8 pt-12">
        {/* Announcement Badge */}
        <div className="mb-6 flex justify-center md:justify-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400">
            <Sparkles size={14} />
            <span>New Feature — Discussion threads with verified answers</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-on-surface tracking-tight leading-tight mb-4">
            Your Academic Discussion,{" "}
            <span className="text-violet-400">Simplified</span>
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl">
            Access your enrolled courses, explore weekly timelines, download lecture notes, and engage in threaded discussions.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button className="px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-sm font-semibold text-violet-400 transition-all">
            Enrolled
          </button>
          <button className="px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/30 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-surface-container-highest transition-all">
            Available
          </button>
          <button className="px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/30 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-surface-container-highest transition-all">
            Completed
          </button>
        </div>
      </section>

      {/* Course Grid */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-8">
        {courses.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-outline-variant/30 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/10 flex items-center justify-center">
              <Sparkles size={28} className="text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              No courses yet
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              You are not enrolled in any courses yet. Check with your institution to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses
              .sort((a, b) => a.code.localeCompare(b.code))
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
