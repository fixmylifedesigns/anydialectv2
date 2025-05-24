"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Logo } from "../models/logo";

function LoadingSpinner() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <Logo scale={[3, 3, 3]} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

export function Loading() {
  return (
    <Canvas
      className="flex items-center justify-center min-h-[200px]"
      camera={{ position: [0, 0, 5] }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <LoadingSpinner />
    </Canvas>
  );
}
