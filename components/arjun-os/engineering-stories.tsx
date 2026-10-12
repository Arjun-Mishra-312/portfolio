"use client";

import type { ComponentType } from "react";
import { engineeringStories, type StoryVisual } from "@/lib/arjun-os/engineering-stories";
import type { ProjectId } from "@/lib/arjun-os/types";
import { ModelFit } from "./motion/model-fit";
import { RecallRace } from "./motion/recall-race";
import { ReleasePipeline } from "./motion/release-pipeline";
import { RoadpackConvoy } from "./motion/roadpack-convoy";
import { SessionStream } from "./motion/session-stream";

const VISUALS: Record<StoryVisual, ComponentType> = {
  convoy: RoadpackConvoy,
  pipeline: ReleasePipeline,
  recall: RecallRace,
  "session-stream": SessionStream,
  "model-fit": ModelFit,
};

const BEATS = [
  ["problem", "Problem"],
  ["constraint", "Constraint"],
  ["move", "What I did"],
  ["proof", "Proof"],
] as const;

export function EngineeringStories({ projectId }: { projectId: ProjectId }) {
  const stories = engineeringStories[projectId];
  if (!stories?.length) return null;
  const headingId = `engineering-${projectId}`;
  return (
    <section className="pf-eng" aria-labelledby={headingId}>
      <p className="pf-eyebrow">The engineering</p>
      <h3 id={headingId}>Hard problems, and how I solved them.</h3>
      {stories.map((story) => {
        const Visual = story.visual ? VISUALS[story.visual] : null;
        return (
          <article key={story.title} className="pf-eng-story">
            <h4>{story.title}</h4>
            <dl className="pf-eng-beats">
              {BEATS.map(([key, label]) => (
                <div key={key} className={key === "move" ? "is-move" : undefined}>
                  <dt>{label}</dt>
                  <dd>{story[key]}</dd>
                </div>
              ))}
            </dl>
            {Visual && <Visual />}
          </article>
        );
      })}
    </section>
  );
}
