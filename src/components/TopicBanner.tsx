import { Download, FileText } from "lucide-react";

type TopicBannerProps = {
  title: string;
  noteUrl: string | null;
  fileSize: string | null;
  facilitatorName: string;
  facilitatorAvatar: string | null;
  accentColor: string;
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
  title,
  noteUrl,
  fileSize,
  facilitatorName,
  facilitatorAvatar,
  accentColor,
}: TopicBannerProps) {
  return (
    <article
      className="rounded-2xl border bg-white/60 p-4 shadow-sm backdrop-blur-md dark:bg-white/5"
      style={{ borderColor: `${accentColor}66` }}
    >
      <div className="mb-4 flex items-center gap-3">
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
    </article>
  );
}
