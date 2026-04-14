"use client";

import { useActionState, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { createTopicWithUpload } from "@/app/courses/[courseId]/actions";

type UploadModalProps = {
  courseId: string;
};

type UploadState = { error?: string; success?: string };
const initialState: UploadState = {};

export default function UploadModal({ courseId }: UploadModalProps) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [state, formAction, isPending] = useActionState(createTopicWithUpload, initialState);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
      >
        <Upload size={16} />
        Upload Topic
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#101828]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Create Topic</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="courseId" value={courseId} />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Week Number</span>
                  <input
                    type="number"
                    name="weekNumber"
                    min={1}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-[#15202B]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Facilitator Name</span>
                  <input
                    type="text"
                    name="facilitatorName"
                    placeholder="Dr. Jane Doe"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-[#15202B]"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Topic Title</span>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Week 5: Recursion Deep Dive"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-[#15202B]"
                />
              </label>

              <label
                className={`block rounded-xl border-2 border-dashed p-6 text-center transition ${
                  dragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-white/5"
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  const dropped = event.dataTransfer.files?.[0];
                  if (dropped && fileInputRef.current) {
                    const transfer = new DataTransfer();
                    transfer.items.add(dropped);
                    fileInputRef.current.files = transfer.files;
                    setSelectedFileName(dropped.name);
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="noteFile"
                  required
                  accept="application/pdf"
                  className="hidden"
                  onChange={(event) => {
                    const selected = event.target.files?.[0];
                    setSelectedFileName(selected ? selected.name : null);
                  }}
                />
                <p className="text-sm font-medium text-foreground">
                  Drag and drop a PDF file, or click to select
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {selectedFileName ?? "No file selected"}
                </p>
              </label>

              {state?.error ? (
                <p className="text-sm font-medium text-red-500">{state.error}</p>
              ) : state?.success ? (
                <p className="text-sm font-medium text-emerald-500">{state.success}</p>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
              >
                {isPending ? "Uploading..." : "Upload Topic"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
