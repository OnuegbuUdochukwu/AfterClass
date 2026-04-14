"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TopicResult = { id: string; title: string };
type PostResult = { id: string; content: string; topic_id: string; parent_id: string | null };

type SearchResponse = {
  topics: TopicResult[];
  questions: PostResult[];
  replies: PostResult[];
};

type CourseSearchProps = {
  courseId: string;
};

export default function CourseSearch({ courseId }: CourseSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse>({ topics: [], questions: [], replies: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults({ topics: [], questions: [], replies: [] });
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/courses/${courseId}/search?q=${encodeURIComponent(term)}`);
        if (!response.ok) return;
        const payload = (await response.json()) as SearchResponse;
        setResults(payload);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [courseId, query]);

  const hasResults = results.topics.length > 0 || results.questions.length > 0 || results.replies.length > 0;

  return (
    <div className="relative w-full max-w-xl">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search topics, questions, replies..."
        className="h-10 w-full rounded-full border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#15202B]"
      />

      {query.trim() ? (
        <div className="absolute left-0 right-0 z-40 mt-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-[#101828]">
          {loading ? <p className="px-2 py-1 text-xs text-gray-500">Searching...</p> : null}
          {!loading && !hasResults ? <p className="px-2 py-1 text-xs text-gray-500">No results found.</p> : null}

          {results.topics.length > 0 ? (
            <div className="mb-1">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Topics</p>
              {results.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/courses/${courseId}/topics/${topic.id}`}
                  className="block rounded-lg px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          ) : null}

          {results.questions.length > 0 ? (
            <div className="mb-1">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Questions</p>
              {results.questions.map((question) => (
                <Link
                  key={question.id}
                  href={`/courses/${courseId}/topics/${question.topic_id}/${question.id}`}
                  className="block rounded-lg px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  {question.content}
                </Link>
              ))}
            </div>
          ) : null}

          {results.replies.length > 0 ? (
            <div>
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Replies</p>
              {results.replies.map((reply) => (
                <Link
                  key={reply.id}
                  href={`/courses/${courseId}/topics/${reply.topic_id}/${reply.parent_id ?? reply.id}`}
                  className="block rounded-lg px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  {reply.content}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
