"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { MessageCircle, Repeat2, ThumbsUp } from "lucide-react";
import { incrementPostUpvote } from "@/app/courses/[courseId]/topics/actions";
import { usePostVotesStore } from "@/stores/postVotes";

type PostCardProps = {
  postId: string;
  content: string;
  authorName: string;
  createdAt: string | null;
  repliesCount: number;
  quotesCount: number;
  upvoteCount: number;
  courseId: string;
  topicId: string;
  showThreadLink?: boolean;
  quoteHref?: string;
  quotedPreview?: {
    content: string;
    authorName: string;
  };
  accentColor?: string;
};

function getRelativeTime(dateString: string | null) {
  if (!dateString) return "just now";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function PostCard({
  postId,
  content,
  authorName,
  createdAt,
  repliesCount,
  quotesCount,
  upvoteCount,
  courseId,
  topicId,
  showThreadLink = true,
  quoteHref,
  quotedPreview,
  accentColor = "#1D9BF0",
}: PostCardProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hydrate = usePostVotesStore((state) => state.hydrate);
  const optimisticIncrement = usePostVotesStore((state) => state.optimisticIncrement);
  const voteCounts = usePostVotesStore((state) => state.counts);
  const displayUpvotes = voteCounts[postId] ?? upvoteCount;

  useEffect(() => {
    hydrate(postId, upvoteCount);
  }, [hydrate, postId, upvoteCount]);

  return (
    <article className="rounded-xl border border-gray-200 bg-white/70 p-4 transition hover:border-primary/40 dark:border-gray-800 dark:bg-white/5">
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="font-medium">{authorName}</span>
        <span>{getRelativeTime(createdAt)}</span>
      </div>

      <p className="mb-4 text-sm leading-6 text-foreground">{content}</p>

      {quotedPreview ? (
        <div
          className="mb-4 rounded-lg border-l-2 bg-gray-100/70 px-3 py-2 text-xs dark:bg-black/20"
          style={{ borderColor: accentColor }}
        >
          <p className="mb-1 font-semibold text-gray-700 dark:text-gray-300">{quotedPreview.authorName}</p>
          <p className="text-gray-600 dark:text-gray-400">{quotedPreview.content}</p>
        </div>
      ) : null}

      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
        <span className="inline-flex items-center gap-1">
          <MessageCircle size={14} />
          {repliesCount}
        </span>
        <span className="inline-flex items-center gap-1">
          <Repeat2 size={14} />
          {quotesCount}
        </span>
        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              try {
                setError(null);
                optimisticIncrement(postId);
                await incrementPostUpvote(courseId, topicId, postId);
              } catch (upvoteError) {
                setError(upvoteError instanceof Error ? upvoteError.message : "Failed to upvote.");
              }
            })
          }
          className="inline-flex items-center gap-1 text-primary"
          disabled={isPending}
        >
          <ThumbsUp size={14} />
          {displayUpvotes}
        </button>
        {showThreadLink ? (
          <Link
            href={`/courses/${courseId}/topics/${topicId}/${postId}`}
            className="ml-auto text-xs font-semibold text-primary hover:underline"
          >
            View thread
          </Link>
        ) : null}
        {quoteHref ? (
          <Link href={quoteHref} className="text-xs font-semibold text-primary hover:underline">
            Quote
          </Link>
        ) : null}
      </div>

      {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
    </article>
  );
}
