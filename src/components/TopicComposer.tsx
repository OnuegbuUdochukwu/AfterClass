"use client";

import { useActionState } from "react";
import { createTopicPost } from "@/app/courses/[courseId]/topics/actions";

type TopicComposerState = { error?: string; success?: string };
const initialState: TopicComposerState = {};

type TopicComposerProps = {
  courseId: string;
  topicId: string;
  quotedPost?: {
    id: string;
    content: string;
    authorName: string;
  };
};

export default function TopicComposer({ courseId, topicId, quotedPost }: TopicComposerProps) {
  const [state, formAction, isPending] = useActionState(createTopicPost, initialState);

  return (
    <form action={formAction} className="mb-6 rounded-xl border border-gray-200 bg-white/70 p-4 dark:border-gray-800 dark:bg-white/5">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="topicId" value={topicId} />
      <input type="hidden" name="quotedId" value={quotedPost?.id ?? ""} />
      <label className="mb-2 block text-sm font-medium text-foreground">Ask a question</label>
      {quotedPost ? (
        <div className="mb-2 rounded-lg border-l-2 border-primary bg-primary/5 px-3 py-2 text-xs">
          <p className="font-semibold text-gray-700 dark:text-gray-200">{quotedPost.authorName}</p>
          <p className="text-gray-600 dark:text-gray-300">{quotedPost.content}</p>
        </div>
      ) : null}
      <div className="flex gap-2">
        <input
          name="content"
          required
          placeholder="Type your question..."
          className="h-10 flex-1 rounded-full border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#15202B]"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          Post
        </button>
      </div>
      {state?.error ? <p className="mt-2 text-xs text-red-500">{state.error}</p> : null}
      {state?.success ? <p className="mt-2 text-xs text-emerald-500">{state.success}</p> : null}
    </form>
  );
}
