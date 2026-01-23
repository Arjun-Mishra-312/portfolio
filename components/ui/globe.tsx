"use client";

import { useEffect, useRef } from "react";
import createGlobe, { COBEOptions } from "cobe";
import { cn } from "@/utils/cn";

interface GlobeProps {
  className?: string;
  config?: Partial<COBEOptions>;
}

export const Globe = ({ className, config = {} }: GlobeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: [0.2, 0.2, 0.2],
      markers: [
        // Vancouver, Canada (UBC)
        { location: [49.2827, -123.1207], size: 0.1 },
        // San Francisco, USA
        { location: [37.7749, -122.4194], size: 0.05 },
        // New York, USA
        { location: [40.7128, -74.006], size: 0.05 },
        // London, UK
        { location: [51.5074, -0.1278], size: 0.05 },
        // Tokyo, Japan
        { location: [35.6762, 139.6503], size: 0.05 },
      ],
      onRender: (state) => {
        // Auto-rotation
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        state.phi = phi + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
      ...config,
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 0);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [config]);

  return (
    <div className={cn("relative aspect-square w-full", className)}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grabbing";
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
          }
        }}
        onTouchMove={(e) => {
          if (
            pointerInteracting.current !== null &&
            e.touches[0]
          ) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
          }
        }}
      />
    </div>
  );
};
