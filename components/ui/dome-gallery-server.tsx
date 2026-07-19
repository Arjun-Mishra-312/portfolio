import LazyDomeGallery from './lazy-dome-gallery';

const EXPERIENCE_IMAGES = [
  'IMG-20250915-WA0004.jpg',
  'IMG-20250915-WA0005.jpg',
  'IMG-20250915-WA0006.jpg',
  'IMG-20250915-WA0008.jpg',
  'IMG-20250915-WA0009.jpg',
  'IMG-20250915-WA0010.jpg',
  'IMG-20250915-WA0011.jpg',
  'IMG-20250915-WA0012.jpg',
  'IMG-20250915-WA0013.jpg',
  'IMG-20250915-WA0016.jpg',
  'IMG-20250915-WA0017.jpg',
  'IMG-20250915-WA0018.jpg',
  'IMG-20250915-WA0019.jpg',
  'IMG-20250915-WA0020.jpg',
  'IMG-20250915-WA0021.jpg',
  'IMG-20250915-WA0022.jpg',
  'IMG-20250915-WA0023.jpg',
  'IMG-20250915-WA0024.jpg',
  'IMG-20250915-WA0025.jpg',
  'IMG-20250915-WA0026.jpg',
  'IMG-20250915-WA0027.jpg',
  'IMG-20250915-WA0028.jpg',
  'IMG-20250915-WA0029.jpg',
  'IMG-20250915-WA0030.jpg',
  'IMG-20250915-WA0031.jpg',
  'IMG-20250915-WA0032.jpg',
  'IMG-20250915-WA0033.jpg',
  'IMG-20250915-WA0034.jpg',
  'IMG-20250915-WA0035.jpg',
  'IMG-20250915-WA0036.jpg',
  'IMG-20250915-WA0037.jpg',
  'IMG-20250915-WA0038.jpg',
  'IMG-20250915-WA0039.jpg',
  'IMG-20250915-WA0040.jpg',
  'IMG-20250915-WA0041.jpg',
  'IMG-20250915-WA0042.jpg',
  'IMG-20250915-WA0043.jpg',
  'IMG-20250915-WA0044.jpg',
  'IMG-20250915-WA0045.jpg',
  'IMG-20250915-WA0046.jpg',
  'IMG-20250915-WA0047.jpg',
  'IMG-20250915-WA0048.jpg',
  'IMG-20250915-WA0049.jpg',
  'IMG-20250915-WA0050.jpg',
  'IMG-20250915-WA0051.jpg',
  'IMG-20250915-WA0053.jpg',
  'IMG-20250915-WA0054.jpg',
  'IMG-20250915-WA0055.jpg',
  'IMG-20250915-WA0056.jpg',
  'IMG-20250915-WA0057.jpg',
  'IMG-20250915-WA0058.jpg'
];

function mapToPublicPaths() {
  return EXPERIENCE_IMAGES.map((name) => {
    const fullSrc = `/experiences_photos/${name}`;
    const thumb = `/experiences_photos/thumbs/${name.replace(/\.jpe?g$/i, '.webp')}`;
    return {
      src: thumb,
      fullSrc,
      alt: name.replace(/\.jpe?g$/i, '').replace(/IMG-\d+-WA0*/, 'Photo '),
    };
  });
}

function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

type DomeGalleryServerProps = {
  embedded?: boolean;
  overlayBlurColor?: string;
};

export default function DomeGalleryServer({
  embedded = false,
  overlayBlurColor = "transparent",
}: DomeGalleryServerProps) {
  const images = shuffle(mapToPublicPaths());
  return (
    <LazyDomeGallery
      images={images}
      fit={embedded ? 0.62 : 0.55}
      segments={35}
      grayscale={false}
      overlayBlurColor={overlayBlurColor}
      embedded={embedded}
    />
  );
}
