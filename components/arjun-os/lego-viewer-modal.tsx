"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { useOSState } from "@/lib/arjun-os/os-context";
import { cn } from "@/utils/cn";

type LegoViewerModalProps = {
  open: boolean;
  onClose: () => void;
};

export function getLegoPreviewSrc(theme: "dawn" | "dusk") {
  return theme === "dawn"
    ? portfolioData.life.legoPreviewLight
    : portfolioData.life.legoPreviewDark;
}

export function getLegoEmbedUrl(theme: "dawn" | "dusk") {
  const bg = theme === "dawn" ? "white" : "transparent";
  return `${portfolioData.life.legoEmbedBase}&bg_theme=${bg}`;
}

export function LegoViewerModal({ open, onClose }: LegoViewerModalProps) {
  const [portalReady, setPortalReady] = useState(false);
  const { theme } = useOSState();
  const isLight = theme === "dawn";
  const embedUrl = getLegoEmbedUrl(theme);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open || !portalReady) return null;

  return createPortal(
    <div
      className="os-lego-modal"
      role="dialog"
      aria-modal="true"
      aria-label="LEGO McLaren P1 3D model"
      onClick={onClose}
    >
      <div className="os-lego-modal-panel" onClick={(event) => event.stopPropagation()}>
        <header>
          <div>
            <p className="os-phone-eyebrow">Builds</p>
            <h2>LEGO McLaren P1</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close 3D model">
            <X aria-hidden />
          </button>
        </header>
        <div className={cn("os-lego-modal-frame", isLight && "is-light")}>
          <iframe
            key={embedUrl}
            title="Interactive 3D Model - Lego McLaren P1"
            src={embedUrl}
            allow="autoplay; fullscreen"
          />
        </div>
        <p className="os-lego-modal-hint">Drag to orbit · Scroll to zoom · Pinch on touch</p>
      </div>
    </div>,
    document.body,
  );
}
