"use client";
import { useState, useRef, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

// Dynamically import the heavy DomeGallery component
const DomeGallery = dynamic(() => import('./dome-gallery'), {
  loading: () => (
    <div className="w-full h-[70vh] sm:h-[65vh] lg:h-auto lg:aspect-[2/1] max-w-[1400px] mx-auto my-16 flex items-center justify-center">
      <div className="glass-card p-8 rounded-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto"></div>
        </div>
        <p className="text-center text-gray-400 mt-4">Loading 3D Gallery...</p>
      </div>
    </div>
  ),
  ssr: false // Disable SSR for heavy 3D component
});

interface LazyDomeGalleryProps {
  images: { src: string; alt: string }[];
  fit?: number;
  segments?: number;
  grayscale?: boolean;
  overlayBlurColor?: string;
}

export default function LazyDomeGallery({
  images,
  fit = 0.55,
  segments = 35,
  grayscale = false,
  overlayBlurColor = "transparent"
}: LazyDomeGalleryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use intersection observer to detect when gallery comes into view
  const isIntersecting = useIntersectionObserver(containerRef, {
    threshold: 0.1,
    rootMargin: '400px', // Start loading 200px before it comes into view for faster loading
  });

  useEffect(() => {
    if (isIntersecting && !isVisible) {
      setIsVisible(true);
    }
  }, [isIntersecting, isVisible]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[70vh] sm:h-[65vh] lg:h-auto lg:aspect-[2/1] max-w-[1400px] mx-auto my-16"
    >
      {isVisible ? (
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-ai-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading gallery...</p>
            </div>
          </div>
        }>
          <DomeGallery
            images={images}
            fit={fit}
            segments={segments}
            grayscale={grayscale}
            overlayBlurColor={overlayBlurColor}
          />
        </Suspense>
      ) : (
        // Placeholder that shows before gallery is visible
        <div className="w-full h-full flex items-center justify-center">
          <div className="glass-card p-8 rounded-xl">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full mx-auto opacity-50"></div>
              <h3 className="text-xl font-semibold text-white text-center">3D Photo Gallery</h3>
              <p className="text-gray-400 text-center">Scroll down to explore interactive gallery</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

