"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { useOSActions } from "@/lib/arjun-os/os-context";
import { ProjectArt } from "../project-art";

export function ProfileApp() {
  const { openApp, openResume, startTour, runIslandAction } = useOSActions();
  const { profile } = portfolioData;
  const openProject = (id: "roadpack" | "buildstory" | "mune") => runIslandAction({ id: "home-" + id, label: "Explore " + id, type: "open-project", projectId: id });
  return (
    <div className="pf-document pf-home">
      <header className="pf-person">
        <Image src={profile.avatar} alt="Arjun Mishra" width={44} height={44} className="rounded-full object-cover" priority />
        <div><h3>{profile.name}</h3><p>{profile.title}</p></div>
        <span className="pf-location"><MapPin size={13} aria-hidden />Vancouver, BC</span>
      </header>
      <section className="pf-home-intro">
        <p className="pf-eyebrow">Software engineer · UBC CS, May 2027</p>
        <h2>Apps that ship.<br />Agents that show their work.</h2>
        <p>{profile.positioning}</p>
        <div className="pf-actions">
          <button className="pf-button" onClick={startTour}>Take a quick tour<ArrowRight size={16} aria-hidden /></button>
          <button className="pf-link" onClick={openResume}>Open Resume<ArrowUpRight size={15} aria-hidden /></button>
          <a className="pf-link" href={"mailto:" + profile.contact.email}>Say hello<ArrowUpRight size={15} aria-hidden /></a>
        </div>
        <dl className="pf-proof" aria-label="At a glance">{profile.proof.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
      </section>
      <div className="pf-section-heading"><h3>A little of what I’ve been building</h3><button className="pf-link" onClick={() => openApp("work")}>All work<ArrowRight size={14} aria-hidden /></button></div>
      <div className="pf-home-features">
        <button className="pf-feature pf-feature-roadpack" onClick={() => openProject("roadpack")}>
          <div className="pf-feature-copy"><p className="pf-eyebrow">Shipped · iPhone & iPad</p><h3>Roadpack</h3><p>Separate cars.<br />One shared adventure.</p><span className="pf-link">Watch the launch film<ArrowRight size={15} aria-hidden /></span></div>
          <ProjectArt id="roadpack" />
        </button>
        <button className="pf-feature pf-feature-research" onClick={() => openApp("research")}>
          <div className="pf-feature-copy"><p className="pf-eyebrow">Public preprint · UBC SOCIUS</p><h3>Can an AI audit<br />show its work?</h3><p>Criterion-specific agents.<br />Inspectable accessibility evidence.</p><span className="pf-link">Explore the research<ArrowRight size={15} aria-hidden /></span></div>
          <ProjectArt id="ai-accessibility-analyzer" />
        </button>
      </div>
      <section className="pf-recent-products" aria-label="More recent products">
        {[{ id: "buildstory" as const, title: "BuildStory", detail: "Open-source tooling · 330+ automated tests" }, { id: "mune" as const, title: "Mune", detail: "Shipped on iOS · On-device finance AI" }].map(item => (
          <button key={item.id} className="pf-feature" onClick={() => openProject(item.id)}>
            <div className="pf-feature-copy"><p className="pf-eyebrow">{item.id === "mune" ? "Personal finance" : "Developer tools"}</p><h3>{item.title}</h3><p>{item.detail}</p><span className="pf-link">Explore the project<ArrowRight size={15} aria-hidden /></span></div>
            <ProjectArt id={item.id} />
          </button>
        ))}
      </section>
      <div className="pf-home-notes">
        <button onClick={() => openApp("experience")}><span className="pf-eyebrow">In practice</span><strong>AI implementations<br />at IFS Copperleaf.</strong><span>Part-time engineer. HCI/AI research at UBC.<ArrowRight size={15} aria-hidden /></span></button>
        <button onClick={() => openApp("life")} className="pf-home-life"><span className="pf-home-life-photo"><Image src="/life/photos/fuji-fujiyoshida.webp" alt="" fill sizes="(max-width: 640px) 100vw, 420px" className="object-cover" /></span><span className="pf-eyebrow">Away from the keyboard</span><strong>Drone films, LEGO supercars,<br />and a good chai.</strong><span>Meet the person behind the projects.<ArrowRight size={15} aria-hidden /></span></button>
      </div>
      <section className="pf-credentials" aria-labelledby="education-heading">
        <p className="pf-eyebrow">University of British Columbia</p><h3 id="education-heading">{profile.education.degree}</h3>
        <p>{profile.education.minor} · {profile.education.graduation}</p><p className="pf-caption">{profile.education.period}</p>
        <details><summary>Technical skills</summary><div className="pf-skills-grid">{profile.skills.map(group => <div key={group.title}><h4>{group.title}</h4><p>{group.items.join(" · ")}</p></div>)}</div></details>
        <details><summary>Awards & recognition</summary><ul>{profile.education.awards.map(award => <li key={award}>{award}</li>)}</ul></details>
      </section>
      <footer className="pf-home-footer"><span>{profile.availability}</span><div><a className="pf-link" href={profile.contact.github} target="_blank" rel="noreferrer">GitHub</a><a className="pf-link" href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div></footer>
    </div>
  );
}
