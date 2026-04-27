import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/app/courses/data";
import {
  Award,
  BookOpen,
  CheckCircle,
  ExternalLink,
  Flame,
  Code,
  Globe,
  GraduationCap,
  Mail,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const displayName =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Student";
  const avatarUrl = user.user_metadata?.avatar_url ?? null;
  const email = user.email ?? "";

  const initials = displayName
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 pt-8">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* =========== LEFT COLUMN: Profile Card =========== */}
          <aside className="col-span-12 lg:col-span-4 space-y-5">
            {/* Profile Card */}
            <div className="glass-card rounded-xl p-8 flex flex-col items-center text-center">
              {/* Avatar with Glow */}
              <div className="relative group mb-5">
                <div className="absolute -inset-1 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative w-28 h-28 rounded-full border-4 border-surface bg-secondary-container flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-on-secondary-container">
                      {initials}
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-2xl font-semibold text-on-surface mb-1">
                {displayName}
              </h1>
              <p className="text-sm text-on-surface-variant mb-5">{email}</p>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                <span className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-xs font-semibold">
                  Student
                </span>
                <span className="px-3 py-1 bg-surface-container-high text-slate-300 border border-outline-variant/30 rounded-full text-xs font-semibold">
                  Active Learner
                </span>
              </div>

              <p className="text-sm text-on-surface-variant text-center mb-6 leading-relaxed">
                Passionate about learning and collaborative education. Always
                eager to help peers bridge the gap between theory and practice.
              </p>

              {/* Actions */}
              <div className="w-full space-y-3">
                <button className="w-full py-2.5 bg-[#7F56D9] hover:bg-[#6941C6] text-white rounded-lg text-sm font-semibold transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20">
                  Edit Profile
                </button>
                <div className="flex justify-between items-center px-4 py-2.5 rounded-lg border border-outline-variant/20 bg-surface-container">
                  <span className="text-xs font-semibold text-slate-400">
                    Socials
                  </span>
                  <div className="flex gap-3">
                    <Globe
                      size={16}
                      className="text-slate-400 hover:text-violet-400 cursor-pointer transition-colors"
                    />
                    <Mail
                      size={16}
                      className="text-slate-400 hover:text-violet-400 cursor-pointer transition-colors"
                    />
                    <Code
                      size={16}
                      className="text-slate-400 hover:text-violet-400 cursor-pointer transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-xs font-semibold text-on-surface uppercase tracking-widest mb-5">
                Achievements
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary">
                    <Award size={22} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 text-center">
                    Top Contributor
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <CheckCircle size={22} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 text-center">
                    Verified Tutor
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-error/10 border border-error/30 flex items-center justify-center text-error">
                    <Flame size={22} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 text-center">
                    30 Day Streak
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* =========== RIGHT COLUMN: Dashboard =========== */}
          <section className="col-span-12 lg:col-span-8 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-5 border-l-4 border-l-violet-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <GraduationCap size={20} className="text-violet-400" />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
                    <TrendingUp size={12} /> 12%
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mb-1">
                  Enrolled Courses
                </p>
                <h2 className="text-3xl font-semibold text-on-surface">14</h2>
              </div>

              <div className="glass-card rounded-xl p-5 border-l-4 border-l-tertiary">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-tertiary/10 rounded-lg">
                    <MessageSquare size={20} className="text-tertiary" />
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">
                    Avg. Response
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mb-1">
                  Total Discussions
                </p>
                <h2 className="text-3xl font-semibold text-on-surface">156</h2>
              </div>

              <div className="glass-card rounded-xl p-5 border-l-4 border-l-primary-light">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <CheckCircle size={20} className="text-primary-light" />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
                    <TrendingUp size={12} /> +4
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mb-1">
                  Verified Answers
                </p>
                <h2 className="text-3xl font-semibold text-on-surface">42</h2>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-on-surface">
                  Recent Activity
                </h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-surface-container-high border border-outline-variant/30 text-slate-300 rounded-lg text-xs font-semibold hover:bg-surface-container-highest transition-colors">
                    Filter
                  </button>
                  <button className="px-3 py-1.5 bg-surface-container-high border border-outline-variant/30 text-slate-300 rounded-lg text-xs font-semibold hover:bg-surface-container-highest transition-colors">
                    Export
                  </button>
                </div>
              </div>

              <div className="divide-y divide-outline-variant/20">
                {/* Activity 1 */}
                <div className="p-5 flex gap-4 hover:bg-surface-container-high/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 flex-shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-semibold text-on-surface">
                        Completed &ldquo;Advanced Data Structures&rdquo; Module
                      </h4>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        2h ago
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 mb-3">
                      Achieved a score of 94/100. Earned the &ldquo;Architecture
                      Pioneer&rdquo; badge.
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                        Grade: A+
                      </span>
                      <button className="text-xs text-violet-400 font-semibold hover:underline">
                        View Review
                      </button>
                    </div>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="p-5 flex gap-4 hover:bg-surface-container-high/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/20 flex-shrink-0">
                    <ExternalLink size={18} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-semibold text-on-surface">
                        New Submission in &ldquo;System Design 301&rdquo;
                      </h4>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        5h ago
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 mb-3">
                      Uploaded &ldquo;Distributed_Framework_v2.pdf&rdquo;.
                      Awaiting peer review.
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-slate-400 font-semibold px-2 py-1 bg-surface-container-high rounded border border-outline-variant/30">
                        Status: Pending
                      </span>
                      <button className="text-xs text-violet-400 font-semibold hover:underline">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Activity 3 */}
                <div className="p-5 flex gap-4 hover:bg-surface-container-high/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 flex-shrink-0">
                    <MessageSquare size={18} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-semibold text-on-surface">
                        Answered a Question in &ldquo;Community&rdquo;
                      </h4>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        Yesterday
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 mb-3">
                      &ldquo;How to optimize PostgreSQL queries for large
                      datasets?&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-violet-400 font-semibold flex items-center gap-1">
                        <ThumbsUp size={12} /> 24 Upvotes
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Load More */}
              <div className="p-4 text-center bg-surface-container/30">
                <button className="text-xs text-violet-400 font-semibold hover:text-violet-300 transition-colors">
                  Load More Activity
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
