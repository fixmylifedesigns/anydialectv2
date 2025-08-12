"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Logo } from "../models/logo";

function LoadingSpinner() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.015; // slightly faster to feel alive
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Smaller logo for subtler footprint */}
      <Logo scale={[1.5, 1.5, 1.5]} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

/**
 * Full‑width flex wrapper keeps the canvas centred horizontally and vertically.
 * Height is fixed (6rem ≈ 96 px) so the page doesn’t jump when the loader disappears.
 */
export function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-24 md:h-32">
      <Canvas
        camera={{ position: [0, 0, 4] }}
        gl={{ antialias: true, alpha: true }}
        className="w-24 h-24 md:w-32 md:h-32"
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />

        <LoadingSpinner />
      </Canvas>
    </div>
  );
}
