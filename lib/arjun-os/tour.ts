import type { AppId, ProjectId } from "./types";
import { defaultBoundsFor, snappedBounds } from "./constants";
import type { Bounds, WorkArea, WindowState } from "./types";

export interface TourStep {
  id: string;
  title: string;
  summary: string;
  appId: AppId;
  projectId?: ProjectId;
  arrange: (workArea: WorkArea) => Partial<Record<AppId, { isOpen: boolean; bounds?: Bounds; mode?: WindowState["mode"] }>>;
}

export const RECRUITER_TOUR_STEPS: TourStep[] = [
  {
    id: "positioning",
    title: "Positioning + availability",
    summary: "Start with who Arjun is, where he’s based, and what he’s looking for next.",
    appId: "profile",
    arrange: (workArea) => ({
      profile: { isOpen: true, bounds: defaultBoundsFor("profile", workArea), mode: "normal" },
      work: { isOpen: false },
      experience: { isOpen: false },
      research: { isOpen: false },
      life: { isOpen: false },
    }),
  },
  {
    id: "strongest-project",
    title: "Strongest project",
    summary: "Roadpack — a shipped native iPhone app. Watch the launch film and explore the real interface.",
    appId: "work",
    projectId: "roadpack",
    arrange: (workArea) => ({
      profile: { isOpen: false },
      work: { isOpen: true, bounds: defaultBoundsFor("work", workArea), mode: "normal" },
      experience: { isOpen: false },
      research: { isOpen: false },
      life: { isOpen: false },
    }),
  },
  {
    id: "experience-impact",
    title: "Experience + impact",
    summary: "Offered a part-time role at IFS Copperleaf when his AI engineering internship ended: an ROI Analytics Portal adopted by Senior Leadership, and a Data Validation Portal for data-quality checks.",
    appId: "experience",
    arrange: (workArea) => ({
      profile: { isOpen: false },
      work: { isOpen: false },
      experience: {
        isOpen: true,
        bounds: snappedBounds("left", workArea),
        mode: "snapped-left",
      },
      research: { isOpen: false },
      life: { isOpen: false },
    }),
  },
  {
    id: "research-depth",
    title: "Research depth",
    summary: "First-author agentic accessibility research, second-author WRAP, and two CHI 2027 submissions. Explore the public preprint and its evidence walkthrough.",
    appId: "research",
    arrange: (workArea) => ({
      profile: { isOpen: false },
      work: { isOpen: false },
      experience: { isOpen: false },
      research: { isOpen: true, bounds: defaultBoundsFor("research", workArea), mode: "normal" },
      life: { isOpen: false },
    }),
  },
  {
    id: "life-vancouver",
    title: "Life, Vancouver, and LEGO",
    summary: "Personality without distraction — Vancouver, builds, and interests that show how Arjun thinks.",
    appId: "life",
    arrange: (workArea) => ({
      profile: { isOpen: false },
      work: { isOpen: false },
      experience: { isOpen: false },
      research: { isOpen: false },
      life: { isOpen: true, bounds: defaultBoundsFor("life", workArea), mode: "normal" },
    }),
  },
  {
    id: "resume-contact",
    title: "Resume + contact",
    summary: "Finish with the résumé and direct contact paths for next steps.",
    appId: "profile",
    arrange: (workArea) => ({
      profile: { isOpen: true, bounds: defaultBoundsFor("profile", workArea), mode: "normal" },
      work: { isOpen: false },
      experience: { isOpen: false },
      research: { isOpen: false },
      life: { isOpen: false },
    }),
  },
];

export const TOUR_STEP_COUNT = RECRUITER_TOUR_STEPS.length;
