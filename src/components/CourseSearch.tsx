"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type TopicResult = { id: string; title: string };
type PostResult = {
  id: string;
  content: string;
  topic_id: string;
  parent_id: string | null;
};

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
  const [results, setResults] = useState<SearchResponse>({
    topics: [],
    questions: [],
    replies: [],
  });
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
        const response = await fetch(
          `/api/courses/${courseId}/search?q=${encodeURIComponent(term)}`
        );
        if (!response.ok) return;
        const payload = (await response.json()) as SearchResponse;
        setResults(payload);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [courseId, query]);

  const hasResults =
    results.topics.length > 0 ||
    results.questions.length > 0 ||
    results.replies.length > 0;

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search topics, questions, replies..."
          className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container pl-10 pr-4 text-sm text-on-surface placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
        />
      </div>

      {query.trim() && (
        <div className="absolute left-0 right-0 z-40 mt-2 rounded-xl border border-outline-variant/20 bg-surface-container-low p-2 shadow-xl">
          {loading && (
            <p className="px-3 py-2 text-xs text-slate-500">Searching...</p>
          )}
          {!loading && !hasResults && (
            <p className="px-3 py-2 text-xs text-slate-500">
              No results found.
            </p>
          )}

          {results.topics.length > 0 && (
            <div className="mb-1">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Topics
              </p>
              {results.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/courses/${courseId}/topics/${topic.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          )}

          {results.questions.length > 0 && (
            <div className="mb-1">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Questions
              </p>
              {results.questions.map((question) => (
                <Link
                  key={question.id}
                  href={`/courses/${courseId}/topics/${question.topic_id}/${question.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  {question.content}
                </Link>
              ))}
            </div>
          )}

          {results.replies.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Replies
              </p>
              {results.replies.map((reply) => (
                <Link
                  key={reply.id}
                  href={`/courses/${courseId}/topics/${reply.topic_id}/${reply.parent_id ?? reply.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  {reply.content}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
