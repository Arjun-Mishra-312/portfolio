// Life + Play content. Media lives in /public/life (web-sized WebP photos and short muted loops
// cut from the original 2.7K drone files; see docs/arjun-os/life-media.md).

export interface FieldPhoto {
  src: string;
  alt: string;
  portrait?: boolean;
}

export interface FieldFilm {
  id: string;
  src: string;
  poster: string;
  title: string;
  credit: string;
  portrait?: boolean;
}

export interface FieldPlace {
  id: string;
  name: string;
  note: string;
  /** Schematic map position in a 960 × 260 viewBox; not geographic. */
  x: number;
  y: number;
  labelAbove?: boolean;
  filmIds: string[];
  photos: FieldPhoto[];
}

const photo = (name: string, alt: string, portrait = false): FieldPhoto => ({ src: `/life/photos/${name}.webp`, alt, portrait });

export const fieldFilms: FieldFilm[] = [
  { id: "fuji-kawaguchiko", src: "/life/films/fuji-kawaguchiko.mp4", poster: "/life/films/fuji-kawaguchiko.webp", title: "Lake Kawaguchiko and Mount Fuji", credit: "Flown and filmed by me" },
  { id: "tokyo-night-drive", src: "/life/films/tokyo-night-drive.mp4", poster: "/life/films/tokyo-night-drive.webp", title: "Tokyo night drive", credit: "Edited by me", portrait: true },
  { id: "seoul-han-river", src: "/life/films/seoul-han-river.mp4", poster: "/life/films/seoul-han-river.webp", title: "Han River, Seoul", credit: "Flown and filmed by me" },
  { id: "ubc-campus", src: "/life/films/ubc-campus.mp4", poster: "/life/films/ubc-campus.webp", title: "UBC campus at golden hour", credit: "Flown and filmed by me" },
  { id: "toronto-cn-tower", src: "/life/films/toronto-cn-tower.mp4", poster: "/life/films/toronto-cn-tower.webp", title: "Toronto and the CN Tower", credit: "Flown and filmed by me" },
  { id: "vancouver-fireworks", src: "/life/films/vancouver-fireworks.mp4", poster: "/life/films/vancouver-fireworks.webp", title: "Fireworks over Vancouver", credit: "Flown and filmed by me", portrait: true },
];

export const fieldPlaces: FieldPlace[] = [
  {
    id: "toronto", name: "Toronto", x: 930, y: 150,
    note: "The CN Tower at golden hour, from the drone.",
    filmIds: ["toronto-cn-tower"], photos: [],
  },
  {
    id: "vancouver", name: "Vancouver", x: 800, y: 112, labelAbove: true,
    note: "Home. UBC from the air, fireworks over the water, and hikes above Howe Sound.",
    filmIds: ["ubc-campus", "vancouver-fireworks"],
    photos: [photo("vancouver-howe-sound", "Arjun standing on a cliff above Howe Sound under a blue sky", true), photo("vancouver-howe-sound-seated", "Arjun sitting at the edge of a summit, looking out over the islands of Howe Sound", true)],
  },
  {
    id: "seoul", name: "Seoul", x: 130, y: 96,
    note: "Gyeongbokgung with N Seoul Tower behind it, and the Han River from above.",
    filmIds: ["seoul-han-river"],
    photos: [photo("seoul-gyeongbokgung", "Hyangwonjeong pavilion at Gyeongbokgung Palace, with N Seoul Tower on the skyline", true)],
  },
  {
    id: "osaka", name: "Osaka", x: 236, y: 182,
    note: "Osaka Castle, and Katsuo-ji: the temple of winning, where every daruma carries 勝, “victory”.",
    filmIds: [],
    photos: [photo("osaka-castle", "Osaka Castle's main keep above green trees", true), photo("osaka-katsuoji-daruma", "Arjun in front of a wall of red daruma dolls at Katsuo-ji", true), photo("osaka-katsuoji-card", "A Katsuo-ji goshuin card held up against the trees", true), photo("osaka-katsuoji-steps", "Arjun on the stone steps up to Katsuo-ji under maple trees", true)],
  },
  {
    id: "kyoto", name: "Kyoto", x: 296, y: 124, labelAbove: true,
    note: "Fushimi Inari's torii tunnels, and Shijo-dori at sunset.",
    filmIds: [],
    photos: [photo("kyoto-inari-torii", "Arjun standing in the tunnel of orange torii gates at Fushimi Inari", true), photo("kyoto-inari-gate", "The great torii gate in front of Fushimi Inari's tower gate", true), photo("kyoto-shijo-sunset", "Shijo-dori at sunset with lanterns along both sides of the street")],
  },
  {
    id: "fuji", name: "Fuji", x: 370, y: 190,
    note: "A road that ends at a mountain in Fujiyoshida, Oshino Hakkai at sunset, and the drone over Lake Kawaguchiko.",
    filmIds: ["fuji-kawaguchiko"],
    photos: [photo("fuji-fujiyoshida", "Snow-capped Mount Fuji framed at the end of a lantern-lined street in Fujiyoshida", true), photo("fuji-oshino-hakkai", "Arjun on a bridge at Oshino Hakkai, with Mount Fuji and thatched roofs behind him")],
  },
  {
    id: "tokyo", name: "Tokyo", x: 444, y: 140, labelAbove: true,
    note: "A guided night drive with Tokyo's GT-R scene, Shibuya Crossing, Ginza, and the Shinkansen.",
    filmIds: ["tokyo-night-drive"],
    photos: [photo("tokyo-r34-tower", "Arjun beside a blue Nissan Skyline R34 GT-R under the lit Tokyo Tower at night", true), photo("tokyo-gtr-convoy", "Two Nissan GT-Rs' round tail lights glowing on a Tokyo expressway ramp at night"), photo("tokyo-shibuya", "Arjun with arms wide at Shibuya Crossing at dusk", true), photo("japan-shinkansen", "Arjun beside a Shinkansen bullet train on the platform", true), photo("tokyo-ginza", "A quiet Ginza street lined with trees and Japanese flags"), photo("tokyo-disneysea", "Arjun in front of the SS Columbia at Tokyo DisneySea", true)],
  },
];

export const fieldBuilds = {
  intro: "LEGO Technic supercars. The red one started life as the Daytona SP3 set: I took it apart and rebuilt its parts into a LaFerrari using fan-designed instructions (MOC-194680 by ConstructionsByDonat).",
  photos: [
    photo("lego-laferrari-p1", "The red LaFerrari beside a yellow LEGO Technic McLaren P1, doors open"),
    photo("lego-laferrari-engine", "The LaFerrari with its rear bodywork lifted to show the engine bay", true),
    photo("lego-laferrari-rear", "The LaFerrari from the rear, showing the diffuser and exhausts"),
    photo("lego-p1", "The yellow LEGO Technic McLaren P1 (42172)"),
    photo("lego-sf24", "The LEGO Technic Ferrari SF-24 F1 car (42207) from above", true),
    photo("lego-laferrari", "A red LEGO Technic LaFerrari, front three-quarter view"),
  ],
};

export const fieldWins = [
  {
    id: "hack-the-north",
    title: "Hack the North 2024",
    award: "Codegen sponsor prize · LLM Pro Max",
    body: "The announcement, and my team's reaction in the crowd.",
    film: { src: "/life/films/win-hack-the-north.mp4", poster: "/life/films/win-hack-the-north.webp" },
    href: "https://devpost.com/software/llm-pro-max",
  },
  {
    id: "youcode",
    title: "youCode 2025",
    award: "1st place, SAP Stream · Re-Plate",
    body: "Team Code Red with the certificate. I built Re-Plate's backend.",
    photo: photo("win-youcode-2025", "Arjun and his three teammates holding the youCode 2025 SAP Stream first-place certificate", true),
    href: "https://devpost.com/software/replate-z3b5mg",
  },
];
