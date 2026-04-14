import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    return NextResponse.json({ topics: [], questions: [], replies: [] });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!enrollment) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { data: topicIdsData, error: topicIdsError } = await supabase
    .from("topics")
    .select("id")
    .eq("course_id", courseId);

  if (topicIdsError) {
    return NextResponse.json({ error: topicIdsError.message }, { status: 500 });
  }

  const topicIds = (topicIdsData ?? []).map((row) => row.id);
  if (topicIds.length === 0) {
    return NextResponse.json({ topics: [], questions: [], replies: [] });
  }

  const [topicsResult, questionsResult, repliesResult] = await Promise.all([
    supabase
      .from("topics")
      .select("id, title")
      .eq("course_id", courseId)
      .ilike("title", `%${q}%`)
      .limit(3),
    supabase
      .from("posts")
      .select("id, content, topic_id, parent_id")
      .is("parent_id", null)
      .in("topic_id", topicIds)
      .ilike("content", `%${q}%`)
      .limit(5),
    supabase
      .from("posts")
      .select("id, content, topic_id, parent_id")
      .not("parent_id", "is", null)
      .in("topic_id", topicIds)
      .ilike("content", `%${q}%`)
      .limit(5),
  ]);

  if (topicsResult.error || questionsResult.error || repliesResult.error) {
    return NextResponse.json({ error: "Search failed." }, { status: 500 });
  }

  return NextResponse.json({
    topics: topicsResult.data ?? [],
    questions: questionsResult.data ?? [],
    replies: repliesResult.data ?? [],
  });
}
