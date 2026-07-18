"use client";

import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { cn } from "@/utils/cn";

export function AccessibilityPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { accessibility } = useOSState();
  const { setAccessibility } = useOSActions();

  if (!open) return null;

  const toggles: Array<{
    key: keyof typeof accessibility;
    label: string;
  }> = [
    { key: "reduceMotion", label: "Reduce motion" },
    { key: "reduceTransparency", label: "Reduce transparency" },
    { key: "highContrast", label: "High contrast" },
  ];

  return (
    <section
      className="os-widget pointer-events-auto fixed bottom-28 left-4 z-[65] w-[260px] p-4"
      aria-label="Accessibility"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--os-text-muted)]">
          Accessibility
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 min-w-11 rounded-md text-sm text-[var(--os-text-secondary)]"
          aria-label="Close accessibility panel"
        >
          ✕
        </button>
      </div>
      <ul className="space-y-3">
        {toggles.map((item) => {
          const on = accessibility[item.key];
          return (
            <li key={item.key} className="flex items-center justify-between gap-3">
              <span className="text-sm text-[var(--os-text-primary)]">{item.label}</span>
              <button
                type="button"
                role="switch"
                aria-label={item.label}
                aria-checked={on}
                onClick={() => setAccessibility({ [item.key]: !on })}
                className={cn(
                  "relative h-7 w-12 rounded-full border transition",
                  on
                    ? "border-cyan-300/50 bg-cyan-400/30"
                    : "border-os-hairline bg-os-fill-strong",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
                    on ? "left-6" : "left-0.5",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
