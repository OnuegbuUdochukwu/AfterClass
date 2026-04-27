"use client";

import { useActionState } from "react";
import { createReplyPost } from "@/app/courses/[courseId]/topics/actions";
import { Send } from "lucide-react";

type ReplyState = { error?: string; success?: string };
const initialState: ReplyState = {};

type ReplyBoxProps = {
  courseId: string;
  topicId: string;
  parentId: string;
  quotedId?: string;
};

export default function ReplyBox({
  courseId,
  topicId,
  parentId,
  quotedId,
}: ReplyBoxProps) {
  const [state, formAction, isPending] = useActionState(
    createReplyPost,
    initialState
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-outline-variant/20 glass-nav p-3 md:pb-3 pb-safe">
      <div className="mx-auto w-full max-w-[960px]">
        <form action={formAction} className="flex items-center gap-3">
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="topicId" value={topicId} />
          <input type="hidden" name="parentId" value={parentId} />
          <input
            type="hidden"
            name="quotedId"
            value={quotedId ?? ""}
          />
          <input
            type="text"
            name="content"
            placeholder="Write a reply..."
            required
            className="h-10 flex-1 rounded-lg border border-outline-variant bg-surface-container px-4 text-sm text-on-surface placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-[#7F56D9] hover:bg-[#6941C6] px-4 py-2.5 text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
          >
            <Send size={14} />
            Reply
          </button>
        </form>
        {state?.error && (
          <p className="mt-1 text-xs text-red-400">{state.error}</p>
        )}
        {state?.success && (
          <p className="mt-1 text-xs text-emerald-400">{state.success}</p>
        )}
      </div>
    </div>
  );
}
