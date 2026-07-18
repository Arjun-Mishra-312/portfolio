"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";
import { motion } from "motion/react";
import * as THREE from "three";

function VancouverModel({ animate }: { animate: boolean }) {
  const { scene } = useGLTF("/3D_modals/Vancouver_3D.glb");
  const modelRef = useRef<THREE.Group>(null);

  // Slow auto-rotation
  useFrame((state, delta) => {
    if (animate && modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Center>
      <group ref={modelRef} position={[0, 1.6, 0]}>
        <primitive object={scene} scale={5.5} />
      </group>
    </Center>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

interface ModelViewerCardProps {
  title?: string;
  subtitle?: string;
  reducedMotion?: boolean;
}

export function ModelViewerCard({
  title = "Vancouver",
  subtitle = "My City",
  reducedMotion = false,
}: ModelViewerCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageVisible, setPageVisible] = useState(true);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const animateModel = !reducedMotion && pageVisible && inView;

  return (
    <motion.div
      ref={containerRef}
      data-model-animated={animateModel}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.5, delay: reducedMotion ? 0 : 0.3 }}
    >
      <div className="model-viewer-card">
        {/* 3D Canvas */}
        <div className="model-canvas-container">
          <Canvas
            frameloop={animateModel ? "always" : "demand"}
            camera={{
              position: [3, 3, 10],
              fov: 40,
              near: 0.1,
              far: 1000,
            }}
            style={{ background: "transparent" }}
          >
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.3} />
            <pointLight position={[0, 10, 0]} intensity={0.5} />

            {/* Model */}
            <Suspense fallback={<LoadingFallback />}>
              <VancouverModel animate={animateModel} />
              <Environment preset="city" />
            </Suspense>

            {/* Controls */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
              autoRotate={false}
            />
          </Canvas>
        </div>

        {/* Bottom Section - Similar to profile card */}
        <div className="model-bottom">
          <div className="model-content">
            <span className="model-title">{title}</span>
            <span className="model-subtitle">{subtitle}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Preload the model
useGLTF.preload("/3D_modals/Vancouver_3D.glb");
