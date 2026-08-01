"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import Room from "@/components/scene/Room";
import Staircase from "@/components/scene/Staircase";
import Racks from "@/components/scene/Racks";
import Furniture from "@/components/scene/Furniture";
import CameraRig from "@/components/scene/CameraRig";
import { useBoutique } from "@/store/useBoutique";

/* La scène — lumière chaude de fin d'après-midi, façon verrière parisienne. */

export default function Showroom() {
  const select = useBoutique((s) => s.select);

  return (
    <Canvas
      dpr={[1, 1.75]}
      shadows
      camera={{ position: [-0.6, 1.7, 4.6], fov: 52, near: 0.1, far: 40 }}
      onPointerMissed={() => select(null)}
      className="!fixed inset-0"
    >
      <color attach="background" args={["#efe4d4"]} />
      <fog attach="fog" args={["#efe4d4", 9, 20]} />

      {/* Lumière naturelle douce + chaleur des appliques */}
      <ambientLight intensity={0.55} color="#fff1dd" />
      <directionalLight
        position={[-3, 5, 2]}
        intensity={1.1}
        color="#ffe9c8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0.6, 3.3, 0.4]} intensity={12} color="#ffd9a0" distance={7} decay={2} />
      <pointLight position={[-1.4, 2.4, -3.0]} intensity={6} color="#ffe4b8" distance={5} decay={2} />
      <pointLight position={[4.3, 2.2, -0.5]} intensity={5} color="#ffe9c8" distance={5} decay={2} />

      <Suspense fallback={null}>
        <Room />
        <Staircase />
        <Racks />
        <Furniture />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={14} blur={2.4} far={4} />
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}
