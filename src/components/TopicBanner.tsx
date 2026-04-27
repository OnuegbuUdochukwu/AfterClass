"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Download, FileText, ArrowRight } from "lucide-react";
import { updateTopicVerification } from "@/app/courses/[courseId]/actions";

type TopicBannerProps = {
  topicId: string;
  courseId: string;
  title: string;
  noteUrl: string | null;
  fileSize: string | null;
  facilitatorName: string;
  facilitatorAvatar: string | null;
  accentColor: string;
  isVerified: boolean;
  canVerify: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TopicBanner({
  topicId,
  courseId,
  title,
  noteUrl,
  fileSize,
  facilitatorName,
  facilitatorAvatar,
  accentColor,
  isVerified,
  canVerify,
}: TopicBannerProps) {
  const [isPending, startTransition] = useTransition();
  const [verifyError, setVerifyError] = useState<string | null>(null);

  return (
    <article className="rounded-xl border border-outline-variant/20 bg-surface-container overflow-hidden transition-all hover:border-outline-variant/40">
      {/* Topic Header */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant/30 flex-shrink-0">
              {facilitatorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={facilitatorAvatar}
                  alt={facilitatorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-violet-500/10 text-xs font-bold text-violet-400">
                  {getInitials(facilitatorName)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {facilitatorName}
              </p>
              <p className="text-xs text-slate-500">Facilitator</p>
            </div>
          </div>

          {isVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary/10 border border-tertiary/20 px-2.5 py-1 text-[11px] font-bold text-tertiary">
              <CheckCircle2 size={12} />
              Verified
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-on-surface mb-3">
          {title}
        </h3>

        {/* PDF Download Row */}
        {noteUrl ? (
          <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-violet-500/30 bg-violet-500/5 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">
                  Lecture Notes
                </p>
                <p className="text-xs text-slate-500">
                  PDF {fileSize ? `• ${fileSize}` : ""}
                </p>
              </div>
            </div>
            <a
              href={noteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#7F56D9] hover:bg-[#6941C6] px-3.5 py-2 text-xs font-semibold text-white transition-all active:scale-95"
            >
              <Download size={14} />
              Download
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-outline-variant/30 bg-surface-container-low mb-3">
            <FileText size={16} className="text-slate-500" />
            <span className="text-xs text-slate-500">
              No lecture notes uploaded yet
            </span>
          </div>
        )}

        {/* Actions Row */}
        <div className="flex items-center flex-wrap gap-3">
          <Link
            href={`/courses/${courseId}/topics/${topicId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            Open discussion
            <ArrowRight size={13} />
          </Link>

          {canVerify && !isVerified && (
            <button
              onClick={() =>
                startTransition(async () => {
                  try {
                    setVerifyError(null);
                    await updateTopicVerification(topicId, courseId);
                  } catch (error) {
                    setVerifyError(
                      error instanceof Error
                        ? error.message
                        : "Unable to verify topic."
                    );
                  }
                })
              }
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-full border border-tertiary/40 px-3 py-1.5 text-xs font-semibold text-tertiary transition hover:bg-tertiary/10 disabled:opacity-50"
            >
              <CheckCircle2 size={13} />
              {isPending ? "Verifying..." : "Verify Content"}
            </button>
          )}
        </div>

        {verifyError && (
          <p className="mt-2 text-xs text-red-400">{verifyError}</p>
        )}
      </div>
    </article>
  );
}
