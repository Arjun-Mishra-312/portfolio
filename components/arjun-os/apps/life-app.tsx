"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, Box, ChevronLeft, ChevronRight, Clapperboard, Images, MapPin, Trophy, X } from "lucide-react";
import { portfolioData } from "@/lib/arjun-os/portfolio-data";
import { fieldBuilds, fieldFilms, fieldPlaces, fieldWins, type FieldPhoto } from "@/lib/arjun-os/field-notes";
import { PHOTO_VIEWER_EVENT } from "@/lib/arjun-os/constants";
import { cinematicItem, staggerContainer, useOsReducedMotion } from "@/lib/arjun-os/motion";
import { useOSState } from "@/lib/arjun-os/os-context";
import { ThemeBridge } from "@/lib/theme-context";
import { PhoneLargeTitle, PhoneSegmented, usePhonePresentationState } from "@/components/arjun-os/phone-ui";
import { LegoViewerModal, getLegoPreviewSrc } from "@/components/arjun-os/lego-viewer-modal";
import { LoopVideo } from "@/components/arjun-os/motion/loop-video";
import { PlacesMap } from "@/components/arjun-os/motion/places-map";
import { cn } from "@/utils/cn";

const ModelViewerCard = dynamic(
  () => import("@/components/ui/model-viewer-card").then((mod) => mod.ModelViewerCard),
  { ssr: false, loading: () => <div className="h-[240px] animate-pulse rounded-2xl border border-os-hairline bg-os-fill" /> },
);

const DomeGalleryServer = dynamic(() => import("@/components/ui/dome-gallery-server"), {
  ssr: false,
  loading: () => <div className="os-photos-dome-loading animate-pulse rounded-2xl border border-os-hairline bg-os-fill" />,
});

type LifeAlbum = "Places" | "Films" | "Builds" | "Wins" | "Library";
const ALBUM_IDS = ["Places", "Films", "Builds", "Wins", "Library"] as const;

const ALBUMS: { id: LifeAlbum; count: string; cover: string; icon: typeof Images }[] = [
  { id: "Places", count: `${fieldPlaces.length} places`, cover: "/life/photos/fuji-fujiyoshida.webp", icon: MapPin },
  { id: "Films", count: `${fieldFilms.length} films`, cover: "/life/films/fuji-kawaguchiko.webp", icon: Clapperboard },
  { id: "Builds", count: `${fieldBuilds.photos.length} photos · 3D`, cover: "/life/photos/lego-laferrari-p1.webp", icon: Box },
  { id: "Wins", count: `${fieldWins.length} hackathons`, cover: "/life/photos/win-youcode-2025.webp", icon: Trophy },
  { id: "Library", count: "50+ photos", cover: portfolioData.life.libraryPreview, icon: Images },
];

const LIBRARY_STILLS = [
  { src: "/experiences_photos/IMG-20250915-WA0004.jpg", alt: "Arjun sitting on a driftwood log at a Vancouver beach" },
  { src: "/experiences_photos/IMG-20250915-WA0010.jpg", alt: "A photograph from Arjun’s personal collection" },
  { src: "/experiences_photos/IMG-20250915-WA0020.jpg", alt: "A photograph from Arjun’s personal collection" },
  { src: "/experiences_photos/IMG-20250915-WA0030.jpg", alt: "A photograph from Arjun’s personal collection" },
  { src: "/experiences_photos/IMG-20250915-WA0040.jpg", alt: "A photograph from Arjun’s personal collection" },
  { src: "/experiences_photos/IMG-20250915-WA0050.jpg", alt: "A photograph from Arjun’s personal collection" },
];

const filmById = (id: string) => fieldFilms.find((film) => film.id === id)!;

function usePortalReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

function useModalKeys(open: boolean, onClose: () => void, onStep?: (delta: number) => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onStep?.(1);
      if (event.key === "ArrowLeft") onStep?.(-1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose, onStep]);
}

/** Full-size photo with captions; arrow keys step through the set it was opened from. */
function PhotoLightbox({ photos, index, onIndex, onClose }: { photos: FieldPhoto[]; index: number | null; onIndex: (index: number) => void; onClose: () => void }) {
  const ready = usePortalReady();
  const open = index !== null;
  const step = (delta: number) => index !== null && onIndex((index + delta + photos.length) % photos.length);
  useModalKeys(open, onClose, step);
  if (!open || !ready) return null;
  const photo = photos[index];
  return createPortal(
    <div className="fn-lightbox" role="dialog" aria-modal="true" aria-label={photo.alt} onClick={onClose}>
      <figure onClick={(event) => event.stopPropagation()}>
        <div className="fn-lightbox-image"><Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" priority /></div>
        <figcaption>{photo.alt}<span>{index + 1} of {photos.length}</span></figcaption>
      </figure>
      <button type="button" className="fn-lightbox-close" onClick={onClose} aria-label="Close photo"><X aria-hidden /></button>
      {photos.length > 1 && <>
        <button type="button" className="fn-lightbox-step is-prev" onClick={(event) => { event.stopPropagation(); step(-1); }} aria-label="Previous photo"><ChevronLeft aria-hidden /></button>
        <button type="button" className="fn-lightbox-step is-next" onClick={(event) => { event.stopPropagation(); step(1); }} aria-label="Next photo"><ChevronRight aria-hidden /></button>
      </>}
    </div>,
    document.body,
  );
}

function PhotoGrid({ photos, label }: { photos: FieldPhoto[]; label: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <div className="fn-photo-grid" aria-label={label}>
        {photos.map((photo, index) => (
          <button key={photo.src} type="button" className={cn("fn-photo", !photo.portrait && "is-wide")} onClick={() => setOpen(index)} aria-label={`Open photo: ${photo.alt}`}>
            <Image src={photo.src} alt="" fill sizes="(max-width: 640px) 50vw, 280px" className="object-cover" />
          </button>
        ))}
      </div>
      <PhotoLightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}

function FilmTile({ id }: { id: string }) {
  const film = filmById(id);
  return (
    <figure className={cn("fn-film", film.portrait && "is-portrait")}>
      <LoopVideo src={film.src} poster={film.poster} label={film.title} portrait={film.portrait} />
      <figcaption><strong>{film.title}</strong><span>{film.credit}</span></figcaption>
    </figure>
  );
}

function ModelCard({ onOpen, kind }: { onOpen: () => void; kind: "lego" | "vancouver" }) {
  const { theme } = useOSState();
  const lego = kind === "lego";
  return (
    <button type="button" className="os-lego-preview" onClick={onOpen} aria-label={lego ? "Open LEGO McLaren P1 3D model" : "Open Vancouver 3D city model"}>
      <div className={cn("os-lego-preview-media", (!lego || theme === "dawn") && "is-light")}>
        <Image src={lego ? getLegoPreviewSrc(theme) : portfolioData.life.vancouverPreview} alt="" fill className={lego ? "object-cover" : "object-contain p-3"} sizes="(max-width: 768px) 100vw, 420px" />
        <span className="os-lego-preview-badge">3D · Tap to expand</span>
      </div>
      <div className="os-lego-preview-copy">
        <strong>{lego ? "LEGO McLaren P1, in 3D" : "Vancouver skyline, in 3D"}</strong>
        <span>{lego ? "A 3D scan of the P1 you can orbit." : portfolioData.life.vancouver}</span>
      </div>
    </button>
  );
}

function VancouverViewerModal({ open, onClose, reduced }: { open: boolean; onClose: () => void; reduced: boolean }) {
  const ready = usePortalReady();
  useModalKeys(open, onClose);
  if (!open || !ready) return null;
  return createPortal(
    <div className="os-lego-modal" role="dialog" aria-modal="true" aria-label="Vancouver 3D city model" onClick={onClose}>
      <div className="os-lego-modal-panel" onClick={(event) => event.stopPropagation()}>
        <header>
          <div><p className="os-phone-eyebrow">Vancouver</p><h2>City model</h2></div>
          <button type="button" onClick={onClose} aria-label="Close Vancouver model"><X aria-hidden /></button>
        </header>
        <div className="os-vancouver-modal-stage"><ModelViewerCard reducedMotion={reduced} /></div>
        <p className="os-lego-modal-hint">Drag to orbit · Scroll to zoom</p>
      </div>
    </div>,
    document.body,
  );
}

function PlacesAlbum({ onOpenVancouver }: { onOpenVancouver: () => void }) {
  const [placeId, setPlaceId] = usePhonePresentationState("life-place", "fuji");
  const place = fieldPlaces.find((item) => item.id === placeId) ?? fieldPlaces[0];
  return (
    <>
      <div className="pf-life-heading"><p className="pf-eyebrow">On the map</p><h3>Everywhere the<br />camera has been.</h3><p>Pick a place on the route. Drone footage I flew and filmed, and photos from the road.</p></div>
      <PlacesMap places={fieldPlaces} selected={place.id} onSelect={setPlaceId} />
      <section className="fn-place" aria-live="polite" aria-label={place.name}>
        <header><h4>{place.name}</h4><p>{place.note}</p></header>
        {place.filmIds.length > 0 && <div className="fn-film-row">{place.filmIds.map((id) => <FilmTile key={id} id={id} />)}</div>}
        {place.photos.length > 0 && <PhotoGrid key={place.id} photos={place.photos} label={`Photos from ${place.name}`} />}
        {place.id === "vancouver" && <ModelCard kind="vancouver" onOpen={onOpenVancouver} />}
      </section>
    </>
  );
}

function FilmsAlbum() {
  return (
    <>
      <div className="pf-life-heading"><p className="pf-eyebrow">From the drone</p><h3>I fly a drone and<br />cut the footage.</h3><p>Short loops from the original files. They play while they’re on screen.</p></div>
      <div className="fn-film-grid">{fieldFilms.map((film) => <FilmTile key={film.id} id={film.id} />)}</div>
    </>
  );
}

function BuildsAlbum({ onOpenLego }: { onOpenLego: () => void }) {
  return (
    <>
      <div className="pf-life-heading"><p className="pf-eyebrow">Made by hand</p><h3>One piece.<br />Then another.</h3><p>{fieldBuilds.intro}</p></div>
      <PhotoGrid photos={fieldBuilds.photos} label="LEGO Technic builds" />
      <ModelCard kind="lego" onOpen={onOpenLego} />
    </>
  );
}

function WinsAlbum() {
  const [open, setOpen] = useState<number | null>(null);
  const youcode = fieldWins[1].photo!;
  return (
    <>
      <div className="pf-life-heading"><p className="pf-eyebrow">Hackathons</p><h3>Weekends that<br />went well.</h3><p>Two hackathon prizes, built with great teams.</p></div>
      <div className="fn-wins">
        {fieldWins.map((win) => (
          <article key={win.id} className="fn-win">
            {win.film ? (
              <LoopVideo src={win.film.src} poster={win.film.poster} label={`${win.title}: ${win.body}`} portrait />
            ) : (
              <button type="button" className="fn-photo is-tall" onClick={() => setOpen(0)} aria-label={`Open photo: ${youcode.alt}`}>
                <Image src={youcode.src} alt="" fill sizes="(max-width: 640px) 90vw, 360px" className="object-cover" />
              </button>
            )}
            <div>
              <p className="pf-eyebrow">{win.award}</p>
              <h4>{win.title}</h4>
              <p>{win.body}</p>
              <a className="pf-link" href={win.href} target="_blank" rel="noreferrer">View on Devpost<ArrowUpRight size={14} aria-hidden /></a>
            </div>
          </article>
        ))}
      </div>
      <PhotoLightbox photos={[youcode]} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}

function LibraryAlbum({ chatTheme, onOpenStill }: { chatTheme: "light" | "dark"; onOpenStill?: (index: number) => void }) {
  return (
    <>
      <div className="pf-life-heading"><p className="pf-eyebrow">Away from the keyboard</p><h3>A little life.<br />A lot to explore.</h3><p>Vancouver, adventures, and things built just for the joy of it.</p></div>
      <p className="os-photos-intro">Explore the collection in a 3D dome. Drag to orbit.</p>
      <div className="os-photos-dome">
        <ThemeBridge theme={chatTheme}>
          <DomeGalleryServer embedded overlayBlurColor={chatTheme === "light" ? "#f4f6f8" : "#0b1218"} />
        </ThemeBridge>
      </div>
      {onOpenStill && (
        <div className="os-photos-mosaic" aria-label="Recent stills">
          {LIBRARY_STILLS.map((still, index) => (
            <button key={still.src} type="button" onClick={() => onOpenStill(index)} aria-label={`Open photo: ${still.alt}`}>
              <Image src={still.src} alt="" fill className="object-cover" sizes="(max-width: 640px) 33vw, 120px" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function AlbumContent({ album, chatTheme, onOpenLego, onOpenVancouver, onOpenStill, showHeader = true }: {
  album: LifeAlbum;
  chatTheme: "light" | "dark";
  onOpenLego: () => void;
  onOpenVancouver: () => void;
  onOpenStill?: (index: number) => void;
  showHeader?: boolean;
}) {
  const meta = ALBUMS.find((item) => item.id === album)!;
  return (
    <div className="os-photos-album-pane">
      {showHeader && (
        <header className="os-photos-album-header">
          <div><p className="os-phone-eyebrow">Albums</p><h2>{album}</h2></div>
          <span>{meta.count}</span>
        </header>
      )}
      {album === "Places" && <PlacesAlbum onOpenVancouver={onOpenVancouver} />}
      {album === "Films" && <FilmsAlbum />}
      {album === "Builds" && <BuildsAlbum onOpenLego={onOpenLego} />}
      {album === "Wins" && <WinsAlbum />}
      {album === "Library" && <LibraryAlbum chatTheme={chatTheme} onOpenStill={onOpenStill} />}
    </div>
  );
}

export function LifeApp() {
  const reduced = useOsReducedMotion();
  const { layoutMode, theme } = useOSState();
  const [savedAlbum, setAlbum] = usePhonePresentationState<LifeAlbum>("life-album", "Places");
  const album = ALBUMS.some((item) => item.id === savedAlbum) ? savedAlbum : "Places";
  useEffect(() => {
    if (savedAlbum !== album) setAlbum(album);
  }, [album, savedAlbum, setAlbum]);
  const [photoIndex, setPhotoIndex] = usePhonePresentationState<number | null>("life-photo", null);
  const [legoOpen, setLegoOpen] = useState(false);
  const [vancouverOpen, setVancouverOpen] = useState(false);
  const portalReady = usePortalReady();
  const chatTheme = theme === "dawn" ? "light" : "dark";

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

  const modals = (
    <>
      <LegoViewerModal open={legoOpen} onClose={() => setLegoOpen(false)} />
      <VancouverViewerModal open={vancouverOpen} onClose={() => setVancouverOpen(false)} reduced={reduced} />
    </>
  );

  if (layoutMode === "phone") {
    if (photoIndex !== null) {
      const still = LIBRARY_STILLS[photoIndex];
      const step = (delta: number) => setPhotoIndex((photoIndex + delta + LIBRARY_STILLS.length) % LIBRARY_STILLS.length);
      const viewer = (
        <div className="os-photo-viewer" role="dialog" aria-modal="true" aria-label={`Photo ${photoIndex + 1} of ${LIBRARY_STILLS.length}`}>
          <header>
            <button type="button" onClick={closePhoto}><ChevronLeft aria-hidden /> Library</button>
            <span>{photoIndex + 1} of {LIBRARY_STILLS.length}</span>
          </header>
          <motion.div
            className="relative flex-1"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) step(1);
              if (info.offset.x > 60) step(-1);
            }}
          >
            <Image src={still.src} alt={still.alt} fill className="object-contain" sizes="100vw" priority />
          </motion.div>
          <footer>
            <button type="button" aria-label="Previous photo" onClick={() => step(-1)}><ChevronLeft /></button>
            <button type="button" aria-label="Next photo" onClick={() => step(1)}><ChevronRight /></button>
          </footer>
        </div>
      );
      return <>{portalReady ? createPortal(viewer, document.body) : viewer}{modals}</>;
    }

    return (
      <div className="os-phone-screen os-photos-screen">
        <PhoneLargeTitle title="Life + Play" eyebrow="Arjun OS · Photos" />
        <PhoneSegmented value={album} options={ALBUM_IDS} onChange={setAlbum} label="Life albums" />
        <AlbumContent
          album={album}
          chatTheme={chatTheme}
          onOpenLego={() => setLegoOpen(true)}
          onOpenVancouver={() => setVancouverOpen(true)}
          onOpenStill={album === "Library" ? openPhoto : undefined}
          showHeader={false}
        />
        {modals}
      </div>
    );
  }

  return (
    <div className="os-photos-desktop h-full">
      <aside className="os-photos-album-rail" aria-label="Albums">
        <p className="os-phone-eyebrow">Albums</p>
        <h3 className="os-photos-rail-title">Life + Play</h3>
        <motion.nav className="os-photos-album-list" variants={staggerContainer(reduced, 0.06)} initial="initial" animate="animate">
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
                  <Image src={item.cover} alt="" fill className="object-cover" sizes="56px" />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <strong>{item.id}</strong>
                  <small>{item.count}</small>
                </span>
                <Icon className="os-photos-album-icon" aria-hidden />
              </motion.button>
            );
          })}
        </motion.nav>
      </aside>

      <div className="os-photos-desktop-main" tabIndex={0} role="region" aria-label="Photo collection">
        <AlbumContent
          album={album}
          chatTheme={chatTheme}
          onOpenLego={() => setLegoOpen(true)}
          onOpenVancouver={() => setVancouverOpen(true)}
        />
      </div>
      {modals}
    </div>
  );
}
