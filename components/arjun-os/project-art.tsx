import Image from "next/image";
import type { ProjectId } from "@/lib/arjun-os/types";
import { cn } from "@/utils/cn";

export const projectEditorial: Record<ProjectId, { headline: string; caption: string }> = {
  roadpack: { headline: "Separate cars. One shared adventure.", caption: "Concept lifestyle image featuring the Roadpack interface." },
  buildstory: { headline: "The story behind the build.", caption: "The live BuildStory website, featuring an example build report." },
  mune: { headline: "Your money. A little more clarity.", caption: "An actual Mune app capture from askmune.app." },
  "ai-accessibility-analyzer": { headline: "Accessibility audits that show their work.", caption: "Editorial illustration of requirements becoming inspectable evidence." },
  "llm-pro-max": { headline: "A codebase. With more context.", caption: "The LLM Pro Max product presentation." },
  "re-plate": { headline: "Good food deserves a second chance.", caption: "The Re-Plate donation and analytics interfaces." },
};

/** Real product captures stay separate from decorative editorial artwork. */
export function ProjectArt({ id, priority = false, compact = false }: { id: ProjectId; priority?: boolean; compact?: boolean }) {
  const src = id === "roadpack" ? "/editorial/roadpack-lifestyle.webp"
    : id === "buildstory" ? "/editorial/buildstory-home.webp"
    : id === "ai-accessibility-analyzer" ? "/editorial/research-evidence.webp"
    : id === "llm-pro-max" ? "/LLM_Pro_Max.jpg" : "/Re-Plate.jpg";
  return (
    <div className={cn("pf-art", "pf-art-" + id, compact && "pf-art-compact")} aria-hidden="true">
      {id === "mune" ? <>
        <div className="pf-mune-orbit"><Image src="/editorial/mune-icon.webp" alt="" width={70} height={70} /><span>On-device AI.<br />Everyday clarity.</span></div>
        <div className="pf-mune-phone"><Image src="/editorial/mune-screen.webp" alt="" width={780} height={1688} sizes="(max-width: 640px) 45vw, 260px" priority={priority} /></div>
      </> : <div className="pf-art-image"><Image src={src} alt="" fill sizes="(max-width: 640px) 100vw, 960px" priority={priority} /></div>}
    </div>
  );
}
