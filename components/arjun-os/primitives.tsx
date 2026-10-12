"use client";

import { cn } from "@/utils/cn";

export function WindowControls({
  onMinimize,
  onMaximize,
  onClose,
  maximized,
  showMaximize = true,
}: {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  maximized?: boolean;
  showMaximize?: boolean;
}) {
  const btn =
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--os-text-secondary)] transition hover:bg-os-hover hover:text-[var(--os-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--os-accent-cobalt)]";

  return (
    <div
      className="flex items-center gap-0.5"
      role="toolbar"
      aria-label="Window controls"
      onPointerDown={event => event.stopPropagation()}
    >
      <button type="button" className={btn} onClick={onMinimize} aria-label="Minimize">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {showMaximize && <button
        type="button"
        className={btn}
        onClick={onMaximize}
        aria-label={maximized ? "Restore" : "Maximize"}
      >
        {maximized ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M5 3h6v6M3 5h6v6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M4 5.5 7 2.5 10 5.5M4 8.5 7 11.5 10 8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>}
      <button type="button" className={cn(btn, "hover:text-red-300")} onClick={onClose} aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

