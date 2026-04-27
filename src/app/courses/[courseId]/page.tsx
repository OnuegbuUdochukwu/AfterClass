import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import WeeklyTimeline from "@/components/WeeklyTimeline";
import UploadModal from "@/components/UploadModal";
import CourseSearch from "@/components/CourseSearch";
import { createClient } from "@/utils/supabase/server";
import { getAuthenticatedUser, getCourseAndTopics } from "../data";
import { ArrowLeft, BookOpen } from "lucide-react";

type CoursePageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const { courseId } = await params;
  const supabase = await createClient();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, role")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!enrollment) notFound();

  const { course, topics, authors } = await getCourseAndTopics(courseId);
  if (!course) notFound();

  const accentColor = course.accent_color ?? "#7F56D9";
  const canUpload =
    enrollment.role === "rep" || enrollment.role === "lecturer" || user.email === process.env.ADMIN_EMAIL;
  const canVerify = enrollment.role === "lecturer" || user.email === process.env.ADMIN_EMAIL;
  const authorMap = new Map(authors.map((author) => [author.id, author]));

  const topicItems = await Promise.all(
    topics.map(async (topic) => {
      const author = topic.created_by ? authorMap.get(topic.created_by) : undefined;
      let noteUrl = topic.note_url;

      if (noteUrl && !noteUrl.startsWith("http")) {
        const { data } = supabase.storage.from("afterclass-notes").getPublicUrl(noteUrl);
        noteUrl = data.publicUrl;
      }

      return {
        id: topic.id,
        weekNumber: topic.week_number,
        title: topic.title,
        noteUrl,
        fileSize: topic.file_size,
        isVerified: Boolean(topic.is_verified),
        facilitatorName: author?.full_name ?? author?.email ?? "Course Facilitator",
        facilitatorAvatar: author?.avatar_url ?? null,
      };
    })
  );

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <div className="max-w-[960px] mx-auto px-6 md:px-8 pt-8">
        {/* Back Link */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-violet-400 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Course Lobby
        </Link>

        {/* Course Header */}
        <div className="mb-8 p-6 rounded-xl bg-surface-container-low border border-outline-variant/20">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <BookOpen size={24} style={{ color: accentColor }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400">
                    {course.code}
                  </span>
                  <span className="text-xs text-slate-500">Fall 2024</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
                  {course.name}
                </h1>
              </div>
            </div>

            {canUpload && (
              <UploadModal courseId={courseId} />
            )}
          </div>

          {/* Search */}
          <div className="mt-4">
            <CourseSearch courseId={courseId} />
          </div>
        </div>

        {/* Weekly Timeline */}
        <WeeklyTimeline
          courseId={courseId}
          topics={topicItems}
          accentColor={accentColor}
          canVerify={canVerify}
        />
      </div>
    </div>
  );
}
