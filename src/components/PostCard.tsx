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
  isVerified?: boolean;
  isInstructor?: boolean;
};

function getRelativeTime(dateString: string | null) {
  if (!dateString) return "just now";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
  accentColor = "#7F56D9",
  isVerified = false,
  isInstructor = false,
}: PostCardProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hydrate = usePostVotesStore((state) => state.hydrate);
  const optimisticIncrement = usePostVotesStore(
    (state) => state.optimisticIncrement
  );
  const voteCounts = usePostVotesStore((state) => state.counts);
  const displayUpvotes = voteCounts[postId] ?? upvoteCount;

  useEffect(() => {
    hydrate(postId, upvoteCount);
  }, [hydrate, postId, upvoteCount]);

  return (
    <article
      className={`py-6 border-b border-outline-variant/20 transition-colors ${
        isVerified
          ? "bg-violet-500/5 -mx-5 px-5 border-l-4 border-l-violet-500"
          : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-xs font-bold flex-shrink-0 border border-outline-variant/30">
          {getInitials(authorName)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Author Row */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-on-surface">
              {authorName}
            </span>
            <span className="text-xs text-outline">•</span>
            <span className="text-xs text-outline">
              {getRelativeTime(createdAt)}
            </span>
            {isInstructor && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-400 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                Instructor
              </span>
            )}
          </div>

          {/* Verified Response Label */}
          {isVerified && (
            <div className="flex items-center gap-1.5 text-violet-400 mb-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Verified Response
              </span>
            </div>
          )}

          {/* Content */}
          <div className="text-sm text-on-surface-variant leading-relaxed mb-4">
            <p>{content}</p>
          </div>

          {/* Quoted Preview */}
          {quotedPreview && (
            <div
              className="mb-4 rounded-r-lg border-l-2 bg-surface-container-highest/40 px-4 py-3 text-xs"
              style={{ borderColor: `${accentColor}66` }}
            >
              <p className="font-semibold text-on-surface-variant mb-1 italic">
                &ldquo;{quotedPreview.content}&rdquo;
              </p>
              <p className="text-outline text-[11px] font-semibold">
                — {quotedPreview.authorName}
              </p>
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex items-center gap-5 text-xs">
            <button className="flex items-center gap-1.5 text-outline hover:text-violet-400 transition-colors font-semibold">
              <MessageCircle size={16} />
              <span>{repliesCount} Replies</span>
            </button>
            <button className="flex items-center gap-1.5 text-outline hover:text-violet-400 transition-colors font-semibold">
              <Repeat2 size={16} />
              <span>{quotesCount} Quotes</span>
            </button>
            <button
              type="button"
              onClick={() =>
                startTransition(async () => {
                  try {
                    setError(null);
                    optimisticIncrement(postId);
                    await incrementPostUpvote(courseId, topicId, postId);
                  } catch (upvoteError) {
                    setError(
                      upvoteError instanceof Error
                        ? upvoteError.message
                        : "Failed to upvote."
                    );
                  }
                })
              }
              className="flex items-center gap-1.5 text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full font-semibold transition-all hover:bg-violet-500/15"
              disabled={isPending}
            >
              <ThumbsUp size={14} />
              <span>{displayUpvotes} Upvotes</span>
            </button>

            {showThreadLink && (
              <Link
                href={`/courses/${courseId}/topics/${topicId}/${postId}`}
                className="ml-auto text-xs font-semibold text-violet-400 hover:text-violet-300 hover:underline"
              >
                View thread →
              </Link>
            )}
            {quoteHref && (
              <Link
                href={quoteHref}
                className="text-xs font-semibold text-outline hover:text-violet-400"
              >
                Quote
              </Link>
            )}
          </div>

          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </article>
  );
}
