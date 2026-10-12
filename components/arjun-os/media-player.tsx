"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

/** Mount the video source only after a visitor chooses to play it. */
export function MediaPlayer({ src, poster, title, description, portrait = false, captions, hero = false, durationLabel }: {
  src: string; poster: string; title: string; description: string; portrait?: boolean; captions?: string; hero?: boolean; durationLabel?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (playing) videoRef.current?.focus({ preventScroll: true });
  }, [playing]);
  return (
    <figure className={`pf-media ${portrait ? "pf-media-portrait" : ""} ${hero ? "pf-media-hero" : ""}`}>
      <div className="pf-media-frame">
        {playing ? <video ref={videoRef} tabIndex={0} controls autoPlay playsInline preload="none" poster={poster} aria-label={title} onError={() => setFailed(true)}>
          <source src={src} type="video/mp4" />
          {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
        </video> : <button className="pf-play-cover" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
          <Image src={poster} alt="" fill priority={hero} sizes={portrait ? "(max-width: 640px) 80vw, 320px" : "(max-width: 640px) 100vw, 1000px"} />
          <span className="pf-play-label"><Play size={hero ? 21 : 18} fill="currentColor" aria-hidden />{hero ? "Watch the film" : `Play ${portrait ? "recording" : "launch film"}`}{durationLabel && <span className="pf-media-duration">{durationLabel}</span>}</span>
        </button>}
      </div>
      <figcaption className={hero && !failed ? "sr-only" : undefined}><strong>{title}</strong><p>{description}</p>{failed && <a className="pf-link" href={src}>Open the video directly</a>}</figcaption>
    </figure>
  );
}
