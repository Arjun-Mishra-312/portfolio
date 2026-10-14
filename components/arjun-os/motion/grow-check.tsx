import type { CSSProperties } from "react";

/**
 * The films' check mark: a dot that opens into a ring, then the tick draws through it. It plays when an
 * ancestor gains `.is-in` (see useInViewOnce) and rests fully drawn under reduced motion.
 */
export function GrowCheck({ delay = 0, size = 18 }: { delay?: number; size?: number }) {
  return (
    <svg className="gc" width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ "--gc-delay": `${delay}ms` } as CSSProperties}>
      <circle className="gc-ring" cx="12" cy="12" r="10" />
      <path className="gc-tick" d="M7.2 12.4l3.1 3.1 6.5-6.8" />
    </svg>
  );
}
