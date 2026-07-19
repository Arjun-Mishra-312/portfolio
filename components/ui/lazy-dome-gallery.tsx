"use client";
import { useState, useRef, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/utils/cn';

const DomeGallery = dynamic(() => import('./dome-gallery'), {
  loading: () => {
    const LoadingComponent = () => {
      const { theme } = useTheme();
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="animate-pulse space-y-3 text-center">
            <div className={`mx-auto h-24 w-24 rounded-full ${
              theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
            }`} />
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              Loading 3D Gallery…
            </p>
          </div>
        </div>
      );
    };
    return <LoadingComponent />;
  },
  ssr: false
});

interface LazyDomeGalleryProps {
  images: { src: string; alt: string; fullSrc?: string }[];
  fit?: number;
  segments?: number;
  grayscale?: boolean;
  overlayBlurColor?: string;
  /** Fill parent (Life app / OS) instead of full-page marketing layout */
  embedded?: boolean;
  className?: string;
}

export default function LazyDomeGallery({
  images,
  fit = 0.55,
  segments = 35,
  grayscale = false,
  overlayBlurColor = "transparent",
  embedded = false,
  className,
}: LazyDomeGalleryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const isIntersecting = useIntersectionObserver(containerRef, {
    threshold: 0.05,
    rootMargin: embedded ? '80px' : '400px',
  });

  useEffect(() => {
    if (isIntersecting && !isVisible) {
      setIsVisible(true);
    }
  }, [isIntersecting, isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const timer = window.setTimeout(() => setEntered(true), 40);
    return () => window.clearTimeout(timer);
  }, [isVisible]);

  const resolvedBlur =
    overlayBlurColor === "transparent" && embedded
      ? theme === "light"
        ? "#f4f6f8"
        : "#0b1218"
      : overlayBlurColor;

  return (
    <div
      ref={containerRef}
      className={cn(
        embedded
          ? "h-full w-full max-w-none"
          : "mx-auto my-16 h-[70vh] w-full max-w-[1400px] sm:h-[65vh] lg:h-auto lg:aspect-[2/1]",
        className,
      )}
    >
      {isVisible ? (
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <div
                className={`h-12 w-12 animate-spin rounded-full border-4 border-t-transparent ${
                  theme === "light" ? "border-blue-500" : "border-ai-blue"
                }`}
              />
            </div>
          }
        >
          <div
            className={cn(
              "h-full w-full",
              entered
                ? "translate-y-0 scale-100 opacity-100 blur-0"
                : "translate-y-2 scale-[0.96] opacity-0 blur-md",
            )}
            style={{
              transitionProperty: "opacity, filter, transform",
              transitionDuration: "700ms",
              transitionTimingFunction: "ease-out",
            }}
          >
            <DomeGallery
              images={images}
              fit={fit}
              segments={segments}
              grayscale={grayscale}
              overlayBlurColor={resolvedBlur}
            />
          </div>
        </Suspense>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className={`h-20 w-20 animate-pulse rounded-full ${
            theme === "light" ? "bg-gray-200" : "bg-gray-700"
          }`} />
        </div>
      )}
    </div>
  );
}
