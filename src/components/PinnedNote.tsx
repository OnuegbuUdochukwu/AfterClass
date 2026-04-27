import { Pin, ExternalLink } from "lucide-react";

type PinnedNoteProps = {
  title: string;
  description?: string;
  onExpand?: () => void;
};

export default function PinnedNote({
  title,
  description,
  onExpand,
}: PinnedNoteProps) {
  return (
    <header className="glass-header border border-violet-500/30 rounded-xl p-5 mb-6 relative overflow-hidden">
      {/* Left Accent Bar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-violet-500" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Pin size={16} className="text-violet-400" />
          <span className="text-[11px] font-bold text-violet-400 uppercase tracking-widest">
            Reference Note
          </span>
        </div>
        {onExpand && (
          <button
            onClick={onExpand}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <ExternalLink size={18} />
          </button>
        )}
      </div>

      <h2 className="text-xl md:text-2xl font-semibold text-on-surface mb-2 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-on-surface-variant line-clamp-2">
          {description}
        </p>
      )}
    </header>
  );
}
