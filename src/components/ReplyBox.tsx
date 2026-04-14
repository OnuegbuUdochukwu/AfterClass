"use client";

import { useActionState } from "react";
import { createReplyPost } from "@/app/courses/[courseId]/topics/actions";

type ReplyState = { error?: string; success?: string };
const initialState: ReplyState = {};

type ReplyBoxProps = {
  courseId: string;
  topicId: string;
  parentId: string;
};

export default function ReplyBox({ courseId, topicId, parentId }: ReplyBoxProps) {
  const [state, formAction, isPending] = useActionState(createReplyPost, initialState);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/90 p-3 backdrop-blur-md dark:border-gray-800 dark:bg-[#101828]/90">
      <div className="mx-auto w-full max-w-5xl">
        <form action={formAction} className="flex items-center gap-2">
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="topicId" value={topicId} />
          <input type="hidden" name="parentId" value={parentId} />
          <input
            type="text"
            name="content"
            placeholder="Write a reply..."
            required
            className="h-10 flex-1 rounded-full border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#15202B]"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            Reply
          </button>
        </form>
        {state?.error ? <p className="mt-1 text-xs text-red-500">{state.error}</p> : null}
        {state?.success ? <p className="mt-1 text-xs text-emerald-500">{state.success}</p> : null}
      </div>
    </div>
  );
}
