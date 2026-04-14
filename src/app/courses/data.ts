import { createClient } from "@/utils/supabase/server";

export type CourseLobbyItem = {
  id: string;
  code: string;
  name: string;
  accent_color: string | null;
  hasNewNote: boolean;
};

export type TopicItem = {
  id: string;
  course_id: string;
  week_number: number;
  title: string;
  note_url: string | null;
  file_size: string | null;
  created_by: string | null;
  created_at: string | null;
};

export type TopicAuthor = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

type CourseRecord = {
  id: string;
  code: string;
  name: string;
  accent_color: string | null;
};

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getEnrolledCourses(userId: string): Promise<CourseLobbyItem[]> {
  const supabase = await createClient();
  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select("course_id, courses(id, code, name, accent_color)")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const courseMap = new Map<string, CourseRecord>();
  const courseIds: string[] = [];

  for (const enrollment of enrollments ?? []) {
    const course = enrollment.courses as unknown as CourseRecord | CourseRecord[] | null;
    const normalizedCourse = Array.isArray(course) ? course[0] : course;
    if (!normalizedCourse || !normalizedCourse.id) continue;

    courseMap.set(normalizedCourse.id, normalizedCourse);
    courseIds.push(normalizedCourse.id);
  }

  const latestTopicByCourse = new Map<string, string>();
  if (courseIds.length > 0) {
    const { data: topics, error: topicsError } = await supabase
      .from("topics")
      .select("course_id, created_at")
      .in("course_id", courseIds)
      .order("created_at", { ascending: false });

    if (topicsError) {
      throw new Error(topicsError.message);
    }

    for (const topic of topics ?? []) {
      if (!topic.course_id || !topic.created_at || latestTopicByCourse.has(topic.course_id)) {
        continue;
      }
      latestTopicByCourse.set(topic.course_id, topic.created_at);
    }
  }

  const now = Date.now();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

  return Array.from(courseMap.values()).map((course) => {
    const latestTopicAt = latestTopicByCourse.get(course.id);
    const hasNewNote = latestTopicAt
      ? now - new Date(latestTopicAt).getTime() <= sevenDaysInMs
      : false;

    return {
      ...course,
      hasNewNote,
    };
  });
}

export async function getCourseAndTopics(courseId: string) {
  const supabase = await createClient();

  const [{ data: course, error: courseError }, { data: topics, error: topicsError }] =
    await Promise.all([
      supabase
        .from("courses")
        .select("id, code, name, accent_color")
        .eq("id", courseId)
        .single(),
      supabase
        .from("topics")
        .select("id, course_id, week_number, title, note_url, file_size, created_by, created_at")
        .eq("course_id", courseId)
        .order("week_number", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

  if (courseError) throw new Error(courseError.message);
  if (topicsError) throw new Error(topicsError.message);

  const authorIds = Array.from(
    new Set((topics ?? []).map((topic) => topic.created_by).filter(Boolean) as string[])
  );

  let authors: TopicAuthor[] = [];
  if (authorIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, full_name, avatar_url, email")
      .in("id", authorIds);

    if (usersError) throw new Error(usersError.message);
    authors = users ?? [];
  }

  return {
    course,
    topics: (topics ?? []) as TopicItem[],
    authors,
  };
}
