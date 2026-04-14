import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PostCard from "@/components/PostCard";
import ReplyBox from "@/components/ReplyBox";
import { createClient } from "@/utils/supabase/server";
import { getAuthenticatedUser, getTopicWithPosts } from "@/app/courses/data";

type ThreadPageProps = {
  params: Promise<{ courseId: string; topicId: string; postId: string }>;
  searchParams: Promise<{ quote?: string }>;
};

export default async function ThreadPage({ params, searchParams }: ThreadPageProps) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const { courseId, topicId, postId } = await params;
  const { quote } = await searchParams;
  const supabase = await createClient();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!enrollment) notFound();

  const { topic, posts, authors } = await getTopicWithPosts(courseId, topicId);
  const authorMap = new Map(authors.map((author) => [author.id, author]));
  const rootPost = posts.find((post) => post.id === postId && post.parent_id === null);
  if (!rootPost) notFound();

  const replies = posts.filter((post) => post.parent_id === postId);
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

  const rootAuthor = authorMap.get(rootPost.user_id);
  const courseAccent = "#1D9BF0";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-28 pt-24 sm:px-6">
      <div className="mb-6">
        <Link
          href={`/courses/${courseId}/topics/${topicId}`}
          className="mb-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Back to Topic Feed
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{topic.title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Layer 2 thread view with direct replies.
        </p>
      </div>

      <div className="space-y-4">
        <PostCard
          postId={rootPost.id}
          content={rootPost.content}
          authorName={rootAuthor?.full_name ?? rootAuthor?.email ?? "Student"}
          createdAt={rootPost.created_at}
          repliesCount={repliesCountMap.get(rootPost.id) ?? 0}
          quotesCount={quotesCountMap.get(rootPost.id) ?? 0}
          upvoteCount={rootPost.upvote_count ?? 0}
          courseId={courseId}
          topicId={topicId}
          showThreadLink={false}
          quoteHref={`/courses/${courseId}/topics/${topicId}/${postId}?quote=${rootPost.id}`}
          quotedPreview={
            rootPost.quoted_id
              ? (() => {
                  const parent = posts.find((candidate) => candidate.id === rootPost.quoted_id);
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

        <section className="space-y-3">
          {replies.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              No replies yet. Start the discussion below.
            </p>
          ) : (
            replies.map((reply) => {
              const replyAuthor = authorMap.get(reply.user_id);
              return (
                <PostCard
                  key={reply.id}
                  postId={reply.id}
                  content={reply.content}
                  authorName={replyAuthor?.full_name ?? replyAuthor?.email ?? "Student"}
                  createdAt={reply.created_at}
                  repliesCount={repliesCountMap.get(reply.id) ?? 0}
                  quotesCount={quotesCountMap.get(reply.id) ?? 0}
                  upvoteCount={reply.upvote_count ?? 0}
                  courseId={courseId}
                  topicId={topicId}
                  showThreadLink={false}
                  quoteHref={`/courses/${courseId}/topics/${topicId}/${postId}?quote=${reply.id}`}
                  quotedPreview={
                    reply.quoted_id
                      ? (() => {
                          const parent = posts.find((candidate) => candidate.id === reply.quoted_id);
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
        </section>
      </div>

      <ReplyBox courseId={courseId} topicId={topicId} parentId={postId} quotedId={quote} />
    </div>
  );
}
