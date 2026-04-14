import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PostCard from "@/components/PostCard";
import TopicComposer from "@/components/TopicComposer";
import { createClient } from "@/utils/supabase/server";
import { getAuthenticatedUser, getTopicWithPosts } from "@/app/courses/data";

type TopicPostsPageProps = {
  params: Promise<{ courseId: string; topicId: string }>;
  searchParams: Promise<{ quote?: string }>;
};

export default async function TopicPostsPage({ params, searchParams }: TopicPostsPageProps) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const { courseId, topicId } = await params;
  const supabase = await createClient();
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!enrollment) notFound();

  const { topic, posts, authors } = await getTopicWithPosts(courseId, topicId);
  const { quote } = await searchParams;
  const authorMap = new Map(authors.map((author) => [author.id, author]));
  const topLevelPosts = posts.filter((post) => post.parent_id === null);
  const courseAccent = "#1D9BF0";

  const repliesCountMap = new Map<string, number>();
  const quotesCountMap = new Map<string, number>();
  for (const post of posts) {
    if (post.parent_id) {
      repliesCountMap.set(post.parent_id, (repliesCountMap.get(post.parent_id) ?? 0) + 1);
    }
    if (post.quoted_id) {
      quotesCountMap.set(post.quoted_id, (quotesCountMap.get(post.quoted_id) ?? 0) + 1);
    }
  }

  const quotedPost = quote ? posts.find((post) => post.id === quote) : undefined;
  const quotedAuthor = quotedPost ? authorMap.get(quotedPost.user_id) : undefined;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-12 pt-24 sm:px-6">
      <div className="mb-6">
        <Link
          href={`/courses/${courseId}`}
          className="mb-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Back to Timeline
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{topic.title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Layer 1 feed: top-level questions in this topic.
        </p>
      </div>

      <TopicComposer
        courseId={courseId}
        topicId={topicId}
        quotedPost={
          quotedPost
            ? {
                id: quotedPost.id,
                content: quotedPost.content,
                authorName: quotedAuthor?.full_name ?? quotedAuthor?.email ?? "Student",
              }
            : undefined
        }
      />

      <div className="space-y-3">
        {topLevelPosts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No questions yet for this topic.
          </p>
        ) : (
          topLevelPosts.map((post) => {
            const author = authorMap.get(post.user_id);
            return (
              <PostCard
                key={post.id}
                postId={post.id}
                content={post.content}
                authorName={author?.full_name ?? author?.email ?? "Student"}
                createdAt={post.created_at}
                repliesCount={repliesCountMap.get(post.id) ?? 0}
                quotesCount={quotesCountMap.get(post.id) ?? 0}
                upvoteCount={post.upvote_count ?? 0}
                courseId={courseId}
                topicId={topicId}
                quoteHref={`/courses/${courseId}/topics/${topicId}?quote=${post.id}`}
                quotedPreview={
                  post.quoted_id
                    ? (() => {
                        const parent = posts.find((candidate) => candidate.id === post.quoted_id);
                        if (!parent) return undefined;
                        const parentAuthor = authorMap.get(parent.user_id);
                        return {
                          content: parent.content,
                          authorName: parentAuthor?.full_name ?? parentAuthor?.email ?? "Student",
                        };
                      })()
                    : undefined
                }
                accentColor={courseAccent}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
