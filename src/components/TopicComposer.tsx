"use client";

import { useActionState } from "react";
import { createTopicPost } from "@/app/courses/[courseId]/topics/actions";
import { Send } from "lucide-react";

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

export default function TopicComposer({
  courseId,
  topicId,
  quotedPost,
}: TopicComposerProps) {
  const [state, formAction, isPending] = useActionState(
    createTopicPost,
    initialState
  );

  return (
    <form
      action={formAction}
      className="mb-6 rounded-xl border border-outline-variant/20 bg-surface-container-low p-5"
    >
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="topicId" value={topicId} />
      <input type="hidden" name="quotedId" value={quotedPost?.id ?? ""} />

      <label className="mb-3 block text-sm font-semibold text-on-surface">
        Ask a question
      </label>

      {quotedPost && (
        <div className="mb-3 rounded-lg border-l-2 border-violet-500 bg-violet-500/5 px-4 py-3 text-xs">
          <p className="font-semibold text-on-surface-variant">
            {quotedPost.authorName}
          </p>
          <p className="text-on-surface-variant/80 italic">
            &ldquo;{quotedPost.content}&rdquo;
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <input
          name="content"
          required
          placeholder="Type your question..."
          className="h-10 flex-1 rounded-lg border border-outline-variant bg-surface-container px-4 text-sm text-on-surface placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#7F56D9] hover:bg-[#6941C6] px-4 py-2 text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
        >
          <Send size={14} />
          Post
        </button>
      </div>

      {state?.error && (
        <p className="mt-2 text-xs text-red-400">{state.error}</p>
      )}
      {state?.success && (
        <p className="mt-2 text-xs text-emerald-400">{state.success}</p>
      )}
    </form>
  );
}
