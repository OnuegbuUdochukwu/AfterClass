"use client";

import { useActionState, useRef, useState } from "react";
import { Upload, X, FileUp } from "lucide-react";
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
  const [state, formAction, isPending] = useActionState(
    createTopicWithUpload,
    initialState
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[#7F56D9] hover:bg-[#6941C6] px-4 py-2 text-sm font-semibold text-white transition-all active:scale-95 shadow-lg shadow-violet-500/20"
      >
        <Upload size={16} />
        Upload Topic
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl border border-outline-variant/20 bg-surface-container-low p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-on-surface">
                Create Topic
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-slate-400 hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container-high"
              >
                <X size={18} />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="courseId" value={courseId} />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-on-surface-variant">
                    Week Number
                  </span>
                  <input
                    type="number"
                    name="weekNumber"
                    min={1}
                    required
                    className="w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-on-surface-variant">
                    Facilitator Name
                  </span>
                  <input
                    type="text"
                    name="facilitatorName"
                    placeholder="Dr. Jane Doe"
                    className="w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-on-surface-variant">
                  Topic Title
                </span>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Week 5: Recursion Deep Dive"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                />
              </label>

              {/* File Drop Zone */}
              <label
                className={`block rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                  dragging
                    ? "border-violet-500 bg-violet-500/5"
                    : "border-outline-variant/30 bg-surface-container hover:border-outline-variant/50"
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
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mb-1">
                    <FileUp size={24} className="text-violet-400" />
                  </div>
                  <p className="text-sm font-medium text-on-surface">
                    Drag and drop a PDF file, or click to select
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedFileName ?? "No file selected"}
                  </p>
                </div>
              </label>

              {state?.error && (
                <p className="text-sm font-medium text-red-400">
                  {state.error}
                </p>
              )}
              {state?.success && (
                <p className="text-sm font-medium text-emerald-400">
                  {state.success}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-[#7F56D9] hover:bg-[#6941C6] px-4 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg shadow-violet-500/20"
              >
                {isPending ? "Uploading..." : "Upload Topic"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
