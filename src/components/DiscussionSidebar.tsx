import { BookOpen, Hash, TrendingUp, Users } from "lucide-react";

type DiscussionSidebarProps = {
  courseCode: string;
  courseName: string;
  activeStudents?: number;
  weeklyPosts?: number;
  trendingTopics?: string[];
};

export default function DiscussionSidebar({
  courseCode,
  courseName,
  activeStudents = 142,
  weeklyPosts = 89,
  trendingTopics = [
    "Synaptic Plasticity",
    "Glial Cell Function",
    "Neurotransmitters",
  ],
}: DiscussionSidebarProps) {
  return (
    <aside className="sticky top-24 space-y-4">
      {/* Course Info Card */}
      <div className="p-5 rounded-xl border border-outline-variant/20 bg-surface-container-low">
        <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4">
          <BookOpen size={24} className="text-violet-400" />
        </div>
        <h3 className="text-xl font-semibold text-on-surface mb-1">
          {courseCode}
        </h3>
        <p className="text-sm text-on-surface-variant mb-6">{courseName}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={12} />
              Active Students
            </span>
            <span className="text-xs text-violet-400 font-bold">
              {activeStudents}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={12} />
              Weekly Posts
            </span>
            <span className="text-xs text-violet-400 font-bold">
              {weeklyPosts}
            </span>
          </div>
        </div>
      </div>

      {/* Trending Topics Card */}
      <div className="p-5 rounded-xl border border-outline-variant/20 bg-surface-container-low">
        <h4 className="text-xs font-semibold text-on-surface uppercase tracking-widest opacity-60 mb-4">
          Trending Topics
        </h4>
        <ul className="space-y-2.5">
          {trendingTopics.map((topic) => (
            <li
              key={topic}
              className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-violet-400 cursor-pointer transition-colors"
            >
              <Hash size={14} className="text-outline flex-shrink-0" />
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
