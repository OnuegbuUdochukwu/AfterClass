"use client";

import { create } from "zustand";

type PostVotesStore = {
  counts: Record<string, number>;
  hydrate: (postId: string, count: number) => void;
  optimisticIncrement: (postId: string) => void;
};

export const usePostVotesStore = create<PostVotesStore>((set) => ({
  counts: {},
  hydrate: (postId, count) =>
    set((state) => ({
      counts: state.counts[postId] === undefined ? { ...state.counts, [postId]: count } : state.counts,
    })),
  optimisticIncrement: (postId) =>
    set((state) => ({
      counts: { ...state.counts, [postId]: (state.counts[postId] ?? 0) + 1 },
    })),
}));
