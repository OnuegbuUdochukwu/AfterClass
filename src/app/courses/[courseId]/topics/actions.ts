"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type PostActionState = {
  error?: string;
  success?: string;
};

async function assertEnrollment(courseId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("You are not enrolled in this course.");
}

export async function createTopicPost(
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const courseId = String(formData.get("courseId") ?? "");
  const topicId = String(formData.get("topicId") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!courseId || !topicId || !content) {
    return { error: "Course, topic, and content are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  try {
    await assertEnrollment(courseId, user.id);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unauthorized." };
  }

  const { error } = await supabase.from("posts").insert({
    topic_id: topicId,
    user_id: user.id,
    content,
  });

  if (error) return { error: error.message };

  revalidatePath(`/courses/${courseId}/topics/${topicId}`);
  return { success: "Post created." };
}

export async function createReplyPost(
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const courseId = String(formData.get("courseId") ?? "");
  const topicId = String(formData.get("topicId") ?? "");
  const parentId = String(formData.get("parentId") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!courseId || !topicId || !parentId || !content) {
    return { error: "Course, topic, parent post, and content are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  try {
    await assertEnrollment(courseId, user.id);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unauthorized." };
  }

  const { error } = await supabase.from("posts").insert({
    topic_id: topicId,
    user_id: user.id,
    content,
    parent_id: parentId,
  });

  if (error) return { error: error.message };

  revalidatePath(`/courses/${courseId}/topics/${topicId}/${parentId}`);
  revalidatePath(`/courses/${courseId}/topics/${topicId}`);
  return { success: "Reply posted." };
}

export async function incrementPostUpvote(courseId: string, topicId: string, postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");

  await assertEnrollment(courseId, user.id);

  const { data: existing, error: fetchError } = await supabase
    .from("posts")
    .select("upvote_count")
    .eq("id", postId)
    .eq("topic_id", topicId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const nextCount = (existing.upvote_count ?? 0) + 1;
  const { error } = await supabase
    .from("posts")
    .update({ upvote_count: nextCount })
    .eq("id", postId)
    .eq("topic_id", topicId);

  if (error) throw new Error(error.message);

  revalidatePath(`/courses/${courseId}/topics/${topicId}`);
  revalidatePath(`/courses/${courseId}/topics/${topicId}/${postId}`);
}
