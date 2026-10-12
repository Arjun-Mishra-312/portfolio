"use client";

import { useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { accessibilityPublication as paper, researchSubmissions } from "@/lib/arjun-os/research-data";
import { ProjectArt } from "../project-art";
import { RecallRace } from "../motion/recall-race";

export function ResearchApp() {
  const [step, setStep] = useState(0);
  const sourceLink = useRef<HTMLAnchorElement>(null);
  const item = paper.trace[step];
  return (
    <article className="pf-document pf-research">
      <header className="pf-research-hero">
        <p className="pf-eyebrow"><FileText size={14} aria-hidden />Research · {paper.status}</p>
        <h2>{paper.shortTitle}</h2>
        <p className="pf-lede">{paper.summary}</p>
        <div className="pf-actions"><a className="pf-button" href={paper.url} target="_blank" rel="noreferrer">Read the preprint<ArrowUpRight size={16} aria-hidden /></a><a className="pf-link" href={paper.pdf} target="_blank" rel="noreferrer">Open PDF<ArrowUpRight size={14} aria-hidden /></a></div>
        <figure className="pf-research-art"><ProjectArt id="ai-accessibility-analyzer" priority /><figcaption>Requirements → agents → inspectable evidence. Editorial concept illustration.</figcaption></figure>
        <p className="pf-paper-title">{paper.title}</p><p className="pf-caption">{paper.authors.join(" · ")}</p>
        <p className="pf-caption">{paper.authorship} · {paper.submission}</p>
      </header>
      <div className="pf-research-metrics">{paper.metrics.map(metric => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span><small>{metric.detail}</small></div>)}</div>
      <RecallRace />
      <p className="pf-research-limitation">{paper.limitation} <a className="pf-link" href={paper.url} target="_blank" rel="noreferrer">Source: preprint v2<ArrowUpRight size={12} aria-hidden /></a></p>
      <section className="pf-section" aria-labelledby="trace-heading">
        <p className="pf-eyebrow">Explore the evidence</p><h3 id="trace-heading">From a requirement<br />to a recorded finding.</h3>
        <p className="pf-section-intro">Step through a real worked example from the paper’s public supporting artifacts.</p>
        <div className="pf-trace">
          <div className="pf-trace-nav" aria-label="Evidence walkthrough">{paper.trace.map((entry, i) => <button key={entry.id} aria-pressed={step === i} onClick={() => setStep(i)}><span>{String(i + 1).padStart(2, "0")}</span>{entry.label}</button>)}</div>
          <div className="pf-trace-content" aria-live="polite" aria-atomic="true"><p className="pf-eyebrow">Step {step + 1} of {paper.trace.length}</p><h4>{item.title}</h4><p>{item.body}</p><code>{item.code}</code></div>
          <div className="pf-trace-footer"><a ref={sourceLink} className="pf-link" href={paper.traceUrl} target="_blank" rel="noreferrer">Inspect the source trace<ArrowUpRight size={14} aria-hidden /></a>{step < paper.trace.length - 1 && <button className="pf-link" onClick={() => {
            setStep(step + 1);
            // Keep keyboard visitors in the walkthrough when the last Next button disappears.
            if (step === paper.trace.length - 2) sourceLink.current?.focus({ preventScroll: true });
          }}>Next step<ArrowRight size={15} aria-hidden /></button>}</div>
        </div>
      </section>
      <section className="pf-section" aria-labelledby="submissions-heading"><p className="pf-eyebrow">At UBC SOCIUS Lab</p><h3 id="submissions-heading">Research submissions</h3><div className="pf-research-threads">{researchSubmissions.map(submission => <section key={submission.id}><p className="pf-eyebrow">{submission.authorship} · {submission.status}</p><h4>{submission.title}</h4><p>{submission.summary}</p>{submission.url && <a className="pf-link" href={submission.url} target="_blank" rel="noreferrer">Read the public preprint<ArrowUpRight size={14} aria-hidden /></a>}</section>)}</div></section>
      <section className="pf-section"><p className="pf-eyebrow">The bigger question</p><h3>Useful AI needs<br />a human point of view.</h3><div className="pf-research-threads">{portfolioData.research.map((thread, index) => <section key={thread.id}><span className="pf-eyebrow">0{index + 1}</span><h4>{thread.title}</h4><p>{thread.summary}</p><div className="pf-tags">{thread.themes.map(theme => <span key={theme}>{theme}</span>)}</div></section>)}</div></section>
    </article>
  );
}
