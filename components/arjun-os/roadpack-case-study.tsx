"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject } from "@/lib/arjun-os/portfolio-data";
import { MediaPlayer } from "./media-player";
import { EngineeringStories } from "./engineering-stories";
import { RoadpackSurfaces } from "./roadpack-surfaces";
import launchTranscript from "@/lib/arjun-os/roadpack-launch-transcript.json";

const captures = [
  { id: "map", title: "The whole pack, at a glance.", label: "Live map", description: "Shared arrival time, pack spread, and the next stop stay beside the map." },
  { id: "coffee", title: "Find a stop that fits the route.", label: "Find a stop", description: "Compare nearby coffee options by the best match or the fastest detour." },
  { id: "stop-detail", title: "A decision with useful context.", label: "Place details", description: "See arrival time and route context before adding a place to the itinerary." },
  { id: "vote", title: "Give every vehicle a say.", label: "Pack votes", description: "One vote per vehicle turns a proposed stop into a shared decision." },
  { id: "itinerary", title: "One plan for what happens next.", label: "Itinerary", description: "Starting point, next stop, and destination form a clear shared timeline." },
  { id: "pack", title: "People travel as a vehicle.", label: "The pack", description: "Each vehicle has its own status and arrival time, with the pack's spread in view." },
  { id: "activity", title: "Keep everyone in the loop.", label: "Activity", description: "An activity record makes stop changes, votes, and requests for help visible." },
] as const;

export function RoadpackCaseStudy({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState(0);
  const capture = captures[selected];
  const project = getProject("roadpack")!;
  return (
    <article className="pf-document roadpack-case">
      <button className="pf-link pf-back" onClick={onBack}>← Selected Work</button>
      <header className="roadpack-film-intro">
        <p className="pf-eyebrow">Roadpack · Shipped on the App Store</p>
        <h2>Separate cars. One shared adventure.</h2>
      </header>
      <section className="roadpack-film-hero" id="roadpack-film" aria-label="Roadpack launch film">
        <MediaPlayer hero src="/roadpack/launch.mp4" poster="/roadpack/launch-hero.jpg" title="Roadpack launch film" description="A 65-second introduction to a trip shared across vehicles: the plan, the road, the stops, and the memories." captions="/roadpack/launch-captions.vtt" durationLabel="1:05" />
      </section>
      <div className="roadpack-overview">
        <p className="pf-lede">{project.summary}</p>
        <div className="pf-actions">
          <a className="pf-button" href={project.links[0].href} target="_blank" rel="noreferrer">Get Roadpack<ArrowUpRight size={16} aria-hidden /></a>
          <a className="pf-link" href="https://roadpack.app" target="_blank" rel="noreferrer">Visit the website<ArrowUpRight size={14} aria-hidden /></a>
        </div>
        <details className="pf-transcript"><summary>Read the film transcript</summary><p>{launchTranscript.join(" ")}</p></details>
      </div>
      <div className="pf-case-facts"><span><small>My role</small>Independent product builder · native iPhone and iPad</span><span><small>Releases</small>1.0.0, 1.0.1, 1.1.0 · shipped from Windows</span><span><small>Traction</small>First Pro subscriber within the first six downloads</span></div>
      <EngineeringStories projectId="roadpack" />
      <section className="pf-section roadpack-captures" aria-labelledby="roadpack-captures">
        <div><p className="pf-eyebrow">Inside the real app</p><h3 id="roadpack-captures">Small decisions.<br />A better trip.</h3>
          <div className="pf-capture-nav" aria-label="App screenshots">{captures.map((item, index) => <button key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.label}</button>)}</div>
          <div className="pf-capture-description" aria-live="polite"><h4>{capture.title}</h4><p>{capture.description}</p></div>
          <p className="pf-caption">Actual app captures. Select a feature to explore.</p>
        </div>
        <figure className="pf-device-shot"><Image key={capture.id} src={`/roadpack/screens/${capture.id}.webp`} alt={`Roadpack — ${capture.label}. ${capture.description}`} width={780} height={1690} sizes="(max-width: 640px) 80vw, 300px" /></figure>
      </section>
      <RoadpackSurfaces />
      <section className="pf-section"><p className="pf-eyebrow">From a real trip</p><h3>Built for the road.<br />And everything along it.</h3>
        <div className="pf-recordings">
          <MediaPlayer portrait src="/roadpack/trip-demo.mp4" poster="/roadpack/trip-poster.jpg" title="A shared trip in Vancouver" description="A 38-second screen recording of the live trip interface, pack coordination, and stops along the route." />
          <MediaPlayer portrait src="/roadpack/photos-demo.mp4" poster="/roadpack/photos-poster.jpg" title="Keep a moment from the trip" description="A 10-second recording showing a photo being attached to Momo Factory, a stop on the shared trip." />
        </div>
      </section>
      <section className="pf-section pf-case-writing"><p className="pf-eyebrow">Behind the product</p><h3>One shared state.<br />Less coordination.</h3>
        <div className="pf-two-column"><div><h4>The problem</h4><p>{project.problem}</p><h4>The product decision</h4><p>{project.approach}</p><h4>Engineering highlights</h4><ul className="pf-engineering-highlights">{project.results.slice(1).map(result => <li key={result}>{result}</li>)}</ul></div><div><h4>How I built it</h4><p>{project.architecture}</p><div className="pf-tags">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div><h4>What I learned</h4><p>{project.learnings[0]} {project.learnings[1]}</p></div></div>
      </section>
      <figure className="pf-ipad-shot"><Image src="/roadpack/screens/ipad.webp" alt="Roadpack's spacious iPad layout showing the Whistler trip and shared arrival time over a 3D map" width={1600} height={1118} sizes="(max-width: 640px) 100vw, 900px" /><figcaption>The same trip, with room to breathe on iPad.</figcaption></figure>
      <footer className="pf-case-footer"><h3>Stay with your pack.</h3><div className="pf-actions"><a className="pf-button" href={project.links[0].href} target="_blank" rel="noreferrer">Find Roadpack on the App Store<ArrowUpRight size={16} aria-hidden /></a><button className="pf-link" onClick={onBack}>Explore more work<ArrowRight size={16} aria-hidden /></button></div></footer>
    </article>
  );
}
