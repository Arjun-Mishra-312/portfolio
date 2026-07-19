"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Box, ChevronLeft, ChevronRight, Images, MapPin, Sparkles, X } from "lucide-react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { PHOTO_VIEWER_EVENT } from "@/lib/arjun-os/constants";
import { cinematicItem, staggerContainer, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { useOSState } from "@/lib/arjun-os/os-context";
import { ThemeBridge } from "@/lib/theme-context";
import { PhoneLargeTitle, PhoneSegmented, usePhonePresentationState } from "@/components/arjun-os/phone-ui";
import { LegoViewerModal, getLegoPreviewSrc } from "@/components/arjun-os/lego-viewer-modal";
import { cn } from "@/utils/cn";

const ModelViewerCard = dynamic(
  () => import("@/components/ui/model-viewer-card").then((mod) => mod.ModelViewerCard),
  { ssr: false, loading: () => <div className="h-[240px] animate-pulse rounded-2xl border border-os-hairline bg-os-fill" /> },
);

const DomeGalleryServer = dynamic(() => import("@/components/ui/dome-gallery-server"), {
  ssr: false,
  loading: () => <div className="os-photos-dome-loading animate-pulse rounded-2xl border border-os-hairline bg-os-fill" />,
});

type LifeAlbum = "Library" | "Vancouver" | "Builds" | "Interests";

const ALBUMS: {
  id: LifeAlbum;
  label: string;
  count: string;
  cover: string;
  icon: typeof Images;
}[] = [
  {
    id: "Library",
    label: "Library",
    count: "50+ photos",
    cover: portfolioData.life.libraryPreview,
    icon: Images,
  },
  {
    id: "Vancouver",
    label: "Vancouver",
    count: "1 model",
    cover: portfolioData.life.vancouverPreview,
    icon: MapPin,
  },
  {
    id: "Builds",
    label: "Builds",
    count: "1 model",
    cover: portfolioData.life.legoPreviewDark,
    icon: Box,
  },
  {
    id: "Interests",
    label: "Interests",
    count: `${portfolioData.life.interests.length} items`,
    cover: "/fun-widget/gallery-light.png",
    icon: Sparkles,
  },
];

const LIBRARY_STILLS = [
  "/experiences_photos/IMG-20250915-WA0004.jpg",
  "/experiences_photos/IMG-20250915-WA0010.jpg",
  "/experiences_photos/IMG-20250915-WA0020.jpg",
  "/experiences_photos/IMG-20250915-WA0030.jpg",
  "/experiences_photos/IMG-20250915-WA0040.jpg",
  "/experiences_photos/IMG-20250915-WA0050.jpg",
];

function LegoPreviewCard({ onOpen }: { onOpen: () => void }) {
  const { theme } = useOSState();
  const previewSrc = getLegoPreviewSrc(theme);

  return (
    <button type="button" className="os-lego-preview" onClick={onOpen} aria-label="Open LEGO McLaren P1 3D model">
      <div className={cn("os-lego-preview-media", theme === "dawn" && "is-light")}>
        <Image
          key={previewSrc}
          src={previewSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 420px"
          priority
        />
        <span className="os-lego-preview-badge">3D · Tap to expand</span>
      </div>
      <div className="os-lego-preview-copy">
        <strong>LEGO McLaren P1</strong>
        <span>{portfolioData.life.lego}</span>
      </div>
    </button>
  );
}

function VancouverPreviewCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" className="os-lego-preview" onClick={onOpen} aria-label="Open Vancouver 3D city model">
      <div className="os-lego-preview-media is-light">
        <Image
          src={portfolioData.life.vancouverPreview}
          alt=""
          fill
          className="object-contain p-3"
          sizes="(max-width: 768px) 100vw, 420px"
          priority
        />
        <span className="os-lego-preview-badge">3D · Tap to expand</span>
      </div>
      <div className="os-lego-preview-copy">
        <strong>Vancouver skyline</strong>
        <span>{portfolioData.life.vancouver}</span>
      </div>
    </button>
  );
}

function VancouverViewerModal({
  open,
  onClose,
  reduced,
}: {
  open: boolean;
  onClose: () => void;
  reduced: boolean;
}) {
  const [portalReady, setPortalReady] = useState(false);

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
    <div className="os-lego-modal" role="dialog" aria-modal="true" aria-label="Vancouver 3D city model" onClick={onClose}>
      <div className="os-lego-modal-panel" onClick={(event) => event.stopPropagation()}>
        <header>
          <div>
            <p className="os-phone-eyebrow">Vancouver</p>
            <h2>City model</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close Vancouver model">
            <X aria-hidden />
          </button>
        </header>
        <div className="os-vancouver-modal-stage">
          <ModelViewerCard reducedMotion={reduced} />
        </div>
        <p className="os-lego-modal-hint">Drag to orbit · Scroll to zoom</p>
      </div>
    </div>,
    document.body,
  );
}

function AlbumContent({
  album,
  reduced,
  chatTheme,
  onOpenLego,
  onOpenVancouver,
  onOpenStill,
  showHeader = true,
}: {
  album: LifeAlbum;
  reduced: boolean;
  chatTheme: "light" | "dark";
  onOpenLego: () => void;
  onOpenVancouver: () => void;
  onOpenStill?: (index: number) => void;
  showHeader?: boolean;
}) {
  const meta =
    album === "Library"
      ? { title: "Library", detail: "50+ photos · Dome gallery" }
      : album === "Vancouver"
        ? { title: "Vancouver", detail: "City model" }
        : album === "Builds"
          ? { title: "Builds", detail: "Kiri Engine" }
          : { title: "Interests", detail: `${portfolioData.life.interests.length} collections` };

  return (
    <div className="os-photos-album-pane">
      {showHeader && (
        <header className="os-photos-album-header">
          <div>
            <p className="os-phone-eyebrow">Albums</p>
            <h2>{meta.title}</h2>
          </div>
          <span>{meta.detail}</span>
        </header>
      )}

      {album === "Library" && (
        <>
          <p className="os-photos-intro">Explore adventures in an immersive 3D dome — drag to orbit the collection.</p>
          <div className="os-photos-dome">
            <ThemeBridge theme={chatTheme}>
              <DomeGalleryServer
                embedded
                overlayBlurColor={chatTheme === "light" ? "#f4f6f8" : "#0b1218"}
              />
            </ThemeBridge>
          </div>
          {onOpenStill && (
            <div className="os-photos-mosaic" aria-label="Recent stills">
              {LIBRARY_STILLS.map((src, index) => (
                <button key={src} type="button" onClick={() => onOpenStill(index)} aria-label={`Open photograph ${index + 1}`}>
                  <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 640px) 33vw, 120px" />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {album === "Vancouver" && (
        <>
          <p className="os-photos-intro">{portfolioData.life.vancouver}</p>
          <VancouverPreviewCard onOpen={onOpenVancouver} />
        </>
      )}

      {album === "Builds" && (
        <>
          <p className="os-photos-intro">{portfolioData.life.lego}</p>
          <LegoPreviewCard onOpen={onOpenLego} />
        </>
      )}

      {album === "Interests" && (
        <div className="os-interest-list">
          {portfolioData.life.interests.map((interest, index) => (
            <div key={interest}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{interest}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LifeApp() {
  const reduced = useOsReducedMotion();
  const { layoutMode, theme } = useOSState();
  const [album, setAlbum] = usePhonePresentationState<LifeAlbum>("life-album", "Library");
  const [photoIndex, setPhotoIndex] = usePhonePresentationState<number | null>("life-photo", null);
  const [legoOpen, setLegoOpen] = useState(false);
  const [vancouverOpen, setVancouverOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const legoCover = getLegoPreviewSrc(theme);
  const chatTheme = theme === "dawn" ? "light" : "dark";

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const handlePopState = () => setPhotoIndex(null);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setPhotoIndex]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(PHOTO_VIEWER_EVENT, { detail: photoIndex !== null }));
    return () => {
      window.dispatchEvent(new CustomEvent(PHOTO_VIEWER_EVENT, { detail: false }));
    };
  }, [photoIndex]);

  const openPhoto = (index: number) => {
    window.history.pushState({ ...window.history.state, arjunOsPhoto: true }, "", window.location.href);
    setPhotoIndex(index);
  };

  const closePhoto = () => {
    if (window.history.state?.arjunOsPhoto) window.history.back();
    else setPhotoIndex(null);
  };

  const albumCover = (id: LifeAlbum, fallback: string) => {
    if (id === "Builds") return legoCover;
    return fallback;
  };

  if (layoutMode === "phone") {
    if (photoIndex !== null) {
      const viewer = (
        <div className="os-photo-viewer" role="dialog" aria-modal="true" aria-label={`Photo ${photoIndex + 1} of ${LIBRARY_STILLS.length}`}>
          <header>
            <button type="button" onClick={closePhoto}>
              <ChevronLeft aria-hidden /> Library
            </button>
            <span>
              {photoIndex + 1} of {LIBRARY_STILLS.length}
            </span>
          </header>
          <motion.div
            className="relative flex-1"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) setPhotoIndex((photoIndex + 1) % LIBRARY_STILLS.length);
              if (info.offset.x > 60) setPhotoIndex((photoIndex - 1 + LIBRARY_STILLS.length) % LIBRARY_STILLS.length);
            }}
          >
            <Image
              src={LIBRARY_STILLS[photoIndex]}
              alt={`Vancouver gallery photograph ${photoIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </motion.div>
          <footer>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setPhotoIndex((photoIndex - 1 + LIBRARY_STILLS.length) % LIBRARY_STILLS.length)}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setPhotoIndex((photoIndex + 1) % LIBRARY_STILLS.length)}
            >
              <ChevronRight />
            </button>
          </footer>
        </div>
      );
      return (
        <>
          {portalReady ? createPortal(viewer, document.body) : viewer}
          <LegoViewerModal open={legoOpen} onClose={() => setLegoOpen(false)} />
          <VancouverViewerModal open={vancouverOpen} onClose={() => setVancouverOpen(false)} reduced={reduced} />
        </>
      );
    }

    return (
      <div className="os-phone-screen os-photos-screen">
        <PhoneLargeTitle title="Life + Play" eyebrow="Arjun OS · Photos" />
        <PhoneSegmented
          value={album}
          options={["Library", "Vancouver", "Builds", "Interests"] as const}
          onChange={setAlbum}
          label="Life albums"
        />
        <AlbumContent
          album={album}
          reduced={reduced}
          chatTheme={chatTheme}
          onOpenLego={() => setLegoOpen(true)}
          onOpenVancouver={() => setVancouverOpen(true)}
          onOpenStill={album === "Library" ? openPhoto : undefined}
          showHeader={false}
        />
        <LegoViewerModal open={legoOpen} onClose={() => setLegoOpen(false)} />
        <VancouverViewerModal open={vancouverOpen} onClose={() => setVancouverOpen(false)} reduced={reduced} />
      </div>
    );
  }

  return (
    <div className="os-photos-desktop h-full">
      <aside className="os-photos-album-rail" aria-label="Albums">
        <p className="os-phone-eyebrow">Albums</p>
        <h3 className="os-photos-rail-title">Life + Play</h3>
        <motion.nav
          className="os-photos-album-list"
          variants={staggerContainer(reduced, 0.06)}
          initial="initial"
          animate="animate"
        >
          {ALBUMS.map((item) => {
            const Icon = item.icon;
            const active = album === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                variants={cinematicItem(reduced)}
                className={cn("os-photos-album-row", active && "is-active")}
                onClick={() => setAlbum(item.id)}
                aria-current={active ? "page" : undefined}
              >
                <span className="os-photos-album-cover">
                  <Image
                    src={albumCover(item.id, item.cover)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <strong>{item.label}</strong>
                  <small>{item.count}</small>
                </span>
                <Icon className="os-photos-album-icon" aria-hidden />
              </motion.button>
            );
          })}
        </motion.nav>
      </aside>

      <div className="os-photos-desktop-main">
        <AlbumContent
          album={album}
          reduced={reduced}
          chatTheme={chatTheme}
          onOpenLego={() => setLegoOpen(true)}
          onOpenVancouver={() => setVancouverOpen(true)}
        />
      </div>

      <LegoViewerModal open={legoOpen} onClose={() => setLegoOpen(false)} />
      <VancouverViewerModal open={vancouverOpen} onClose={() => setVancouverOpen(false)} reduced={reduced} />
    </div>
  );
}
