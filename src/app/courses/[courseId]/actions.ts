"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type TopicUploadState = {
  error?: string;
  success?: string;
};

function toMb(sizeInBytes: number) {
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function sanitizeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
}

async function getEnrollmentRole(courseId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("role")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.role ?? null;
}

export async function createTopicWithUpload(
  _prevState: TopicUploadState,
  formData: FormData
): Promise<TopicUploadState> {
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const weekNumber = Number(formData.get("weekNumber"));
  const file = formData.get("noteFile");

  if (!courseId || !title || !weekNumber || Number.isNaN(weekNumber)) {
    return { error: "Course, title, and week number are required." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please upload a PDF note file." };
  }

  if (!file.type.includes("pdf")) {
    return { error: "Only PDF files are supported." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const role = await getEnrollmentRole(courseId, user.id);
  const isDeveloperAdmin = user.email === process.env.ADMIN_EMAIL;
  if (!isDeveloperAdmin && role !== "rep" && role !== "lecturer") {
    return { error: "Only reps and lecturers can upload topics." };
  }

  const filePath = `${courseId}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from("afterclass-notes")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: "application/pdf",
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { error: insertError } = await supabase.from("topics").insert({
    course_id: courseId,
    week_number: weekNumber,
    title,
    note_url: filePath,
    file_size: toMb(file.size),
    created_by: user.id,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/courses/${courseId}`);
  return { success: "Topic uploaded successfully." };
}

export async function updateTopicVerification(topicId: string, courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be signed in.");

  const role = await getEnrollmentRole(courseId, user.id);
  const isDeveloperAdmin = user.email === process.env.ADMIN_EMAIL;
  if (!isDeveloperAdmin && role !== "lecturer") {
    throw new Error("Only lecturers can verify topics.");
  }

  const { error } = await supabase
    .from("topics")
    .update({ is_verified: true })
    .eq("id", topicId)
    .eq("course_id", courseId);

  if (error) throw new Error(error.message);

  revalidatePath(`/courses/${courseId}`);
}
