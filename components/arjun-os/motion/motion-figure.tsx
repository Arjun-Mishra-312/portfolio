import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/** The dark "instrument" stage every mechanism animation sits on, in both themes. */
export function MotionFigure({
  title,
  note,
  readout,
  children,
  className,
}: {
  title: string;
  note?: string;
  readout?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("mo-stage", className)}>
      <figcaption className="mo-caption">
        <strong>{title}</strong>
        {note && <span>{note}</span>}
      </figcaption>
      {children}
      {readout && <div className="mo-readout">{readout}</div>}
    </figure>
  );
}
