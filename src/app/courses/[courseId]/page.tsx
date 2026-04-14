import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import WeeklyTimeline from "@/components/WeeklyTimeline";
import UploadModal from "@/components/UploadModal";
import CourseSearch from "@/components/CourseSearch";
import { createClient } from "@/utils/supabase/server";
import { getAuthenticatedUser, getCourseAndTopics } from "../data";

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

  const accentColor = course.accent_color ?? "#1D9BF0";
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
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-12 pt-24 sm:px-6">
      <div className="mb-8">
        <Link
          href="/courses"
          className="mb-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Back to Course Lobby
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{course.code}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{course.name}</p>
        <div className="mt-4">
          <CourseSearch courseId={courseId} />
        </div>
        {canUpload ? (
          <div className="mt-4">
            <UploadModal courseId={courseId} />
          </div>
        ) : null}
      </div>

      <WeeklyTimeline
        courseId={courseId}
        topics={topicItems}
        accentColor={accentColor}
        canVerify={canVerify}
      />
    </div>
  );
}
