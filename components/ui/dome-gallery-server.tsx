import DomeGallery from './dome-gallery';

// Helper to list all images in public/experiences_photos. In Next.js, files under public
// are served from the root, so we reference them by "/experiences_photos/<name>".
// We hardcode the filenames since dynamic fs reads aren't available at runtime in the client.

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
//   'IMG-20250915-WA0014.jpg',
//   'IMG-20250915-WA0015.jpg',
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
//   'IMG-20250915-WA0052.jpg',
  'IMG-20250915-WA0053.jpg',
  'IMG-20250915-WA0054.jpg',
  'IMG-20250915-WA0055.jpg',
  'IMG-20250915-WA0056.jpg',
  'IMG-20250915-WA0057.jpg'
];

function mapToPublicPaths() {
  return EXPERIENCE_IMAGES.map(name => ({ src: `/experiences_photos/${name}`, alt: name }));
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

export default function DomeGalleryServer() {
  const images = shuffle(mapToPublicPaths());
  return (
    <div className="w-full h-[70vh] sm:h-[65vh] lg:h-auto lg:aspect-[2/1] max-w-[1400px] mx-auto my-16">
      <DomeGallery
        images={images}
        fit={0.55}
        segments={35}
        grayscale={false}
        overlayBlurColor="transparent"
      />
    </div>
  );
}


