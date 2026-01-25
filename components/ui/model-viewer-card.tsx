"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function VancouverModel() {
  const { scene } = useGLTF("/3D_modals/Vancouver_3D.glb");
  const modelRef = useRef<THREE.Group>(null);

  // Slow auto-rotation
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Center>
      <group ref={modelRef} position={[0, 0.5, 0]}>
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
}

export function ModelViewerCard({
  title = "Vancouver",
  subtitle = "My City",
}: ModelViewerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="model-viewer-card">
        {/* 3D Canvas */}
        <div className="model-canvas-container">
          <Canvas
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
              <VancouverModel />
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
