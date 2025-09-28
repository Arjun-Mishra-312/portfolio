"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function ProgressiveImage({
  src,
  alt,
  className = "",
  fill = false,
  sizes,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+JNqUADh3+YiahpnbWNrNOv1E2/Aw/ry8/+eZDkRK4jM8m/p5mwPVV3BgxXJGJUU6MFh6kM/WCdJcLLRfB/1tNwgkEWRlh96gFhXSNQHz6OXWZfrgHk=="
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // If priority, load immediately
  const ref = useRef<HTMLDivElement>(null);

  // Use intersection observer for lazy loading (unless priority is set)
  const isVisible = useIntersectionObserver(ref, {
    threshold: 0.1,
    rootMargin: '50px',
    freezeOnceVisible: true,
  });

  // Trigger loading when in view
  useState(() => {
    if ((isVisible || priority) && !isInView) {
      setIsInView(true);
    }
  });

  if (!fill) {
    return (
      <div ref={ref} className={`relative overflow-hidden ${className}`}>
        {isInView ? (
          <Image
            src={src}
            alt={alt}
            width={500}
            height={500}
            sizes={sizes}
            quality={quality}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          // Placeholder while waiting for intersection
          <div className="w-full h-full bg-gray-800/20 animate-pulse" />
        )}

        {/* Loading state overlay */}
        {isInView && !isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/10">
            <div className="w-6 h-6 border-2 border-ai-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  // For fill=true, the component itself becomes the positioned container
  if (fill) {
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        style={{ position: 'relative' }}
      >
        {isInView ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={quality}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            style={{
              objectFit: 'cover',
            }}
          />
        ) : (
          // Placeholder while waiting for intersection
          <div className="absolute inset-0 bg-gray-800/20 animate-pulse" />
        )}

        {/* Loading state overlay */}
        {isInView && !isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/10">
            <div className="w-6 h-6 border-2 border-ai-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  // For non-fill images, use normal approach
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {isInView ? (
        <Image
          src={src}
          alt={alt}
          width={500}
          height={500}
          sizes={sizes}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        // Placeholder while waiting for intersection
        <div className="w-full h-full bg-gray-800/20 animate-pulse" />
      )}

      {/* Loading state overlay */}
      {isInView && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/10">
          <div className="w-6 h-6 border-2 border-ai-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

