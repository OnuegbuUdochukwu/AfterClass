"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Download, FileText } from "lucide-react";
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
    <article
      className="rounded-2xl border bg-white/60 p-4 shadow-sm backdrop-blur-md dark:bg-white/5"
      style={{ borderColor: isVerified ? "#D4AF37" : `${accentColor}66` }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
            {facilitatorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={facilitatorAvatar}
                alt={facilitatorName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/20 text-xs font-semibold text-primary">
                {getInitials(facilitatorName)}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{facilitatorName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Facilitator</p>
          </div>
        </div>

        {isVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/20 px-2.5 py-1 text-[11px] font-semibold text-[#D4AF37]">
            <CheckCircle2 size={12} />
            Lecturer Verified
          </span>
        ) : null}
      </div>

      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <FileText size={14} />
          <span>PDF</span>
          {fileSize ? <span>• {fileSize}</span> : null}
        </div>

        {noteUrl ? (
          <a
            href={noteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
          >
            <Download size={14} />
            Download
          </a>
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-400">No note uploaded</span>
        )}
      </div>

      <div className="mt-3">
        <Link
          href={`/courses/${courseId}/topics/${topicId}`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Open discussion
        </Link>
      </div>

      {canVerify && !isVerified ? (
        <button
          onClick={() =>
            startTransition(async () => {
              try {
                setVerifyError(null);
                await updateTopicVerification(topicId, courseId);
              } catch (error) {
                setVerifyError(error instanceof Error ? error.message : "Unable to verify topic.");
              }
            })
          }
          disabled={isPending}
          className="mt-3 inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/60 px-3 py-1.5 text-xs font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/10 disabled:opacity-50"
        >
          <CheckCircle2 size={13} />
          {isPending ? "Verifying..." : "Verify Content"}
        </button>
      ) : null}

      {verifyError ? <p className="mt-2 text-xs text-red-500">{verifyError}</p> : null}
    </article>
  );
}
