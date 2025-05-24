"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Logo } from "./models/logo";

function LoadingSpinner() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // meshRef.current.rotation.x += 0.01;
      // meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <Logo scale={[2, 2, 2]} position={[1, -3, 1]} />
    </mesh>
  );
}

export function Hero() {
  const { theme } = useTheme();

  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        {/* {theme && (
          <Image
            src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
            alt="Logo"
            width={100}
            height={100}
          />
        )} */}
        <Canvas
          className="flex items-center justify-center"
          camera={{ position: [2, 0, 5] }}
          style={{ height: "100px", width: "100%" }}
          // gl={{ antialias: true }}
        >
          {/* <ambientLight intensity={0.5} /> */}
          {/* <pointLight position={[10, 10, 10]} /> */}

          <LoadingSpinner />
          <OrbitControls enableZoom={false} autoRotate={true} rotateSpeed={2}/>
        </Canvas>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold">Lingo Translate</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        AI-powered translations with dialect support, customizable formality,
        and natural speech patterns
      </p>
    </div>
  );
}
