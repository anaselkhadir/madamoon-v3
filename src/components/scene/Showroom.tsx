"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, SoftShadows } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import Room from "@/components/scene/Room";
import Staircase from "@/components/scene/Staircase";
import Racks from "@/components/scene/Racks";
import Furniture from "@/components/scene/Furniture";
import CameraRig from "@/components/scene/CameraRig";
import { useBoutique } from "@/store/useBoutique";
import { ASSET_PREFIX } from "@/lib/site";

/* La scène — lumière chaude de fin d'après-midi, rendu photoréaliste :
 * HDRI, ombres douces, occlusion ambiante, bloom léger, vignettage. */

export default function Showroom() {
  const select = useBoutique((s) => s.select);

  return (
    <Canvas
      dpr={[1, 1.35]}
      shadows
      camera={{ position: [1.3, 1.6, 3.7], fov: 56, near: 0.1, far: 40 }}
      onPointerMissed={() => select(null)}
      className="!fixed inset-0"
      gl={{ antialias: true }}
      onCreated={(state) => {
        (window as unknown as Record<string, unknown>).__r3f_state = state;
      }}
    >
      <color attach="background" args={["#e9dcc7"]} />
      <fog attach="fog" args={["#dccdb2", 11, 24]} />
      {false && <SoftShadows size={22} samples={14} focus={0.6} />}

      {/* Clé chaude (verrière) + ambiance HDRI pour les reflets */}
      <ambientLight intensity={0.32} color="#ffeeda" />
      <directionalLight
        position={[-3.5, 4.6, 1.6]}
        intensity={1.35}
        color="#ffe6c0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.5, 20]} />
      </directionalLight>

      <Suspense fallback={null}>
        <Environment files={`${ASSET_PREFIX}/hdri/room.hdr`} environmentIntensity={0.5} />
        <Room />
        <Staircase />
        <Racks />
        <Furniture />
        <ContactShadows position={[0, 0.012, 0]} opacity={0.4} scale={15} blur={2.2} far={4.5} resolution={512} />
      </Suspense>

      <EffectComposer enableNormalPass>
        <N8AO aoRadius={0.9} intensity={2.6} distanceFalloff={0.6} quality="performance" />
        <Bloom intensity={0.28} luminanceThreshold={0.85} luminanceSmoothing={0.3} mipmapBlur />
        <Vignette eskil={false} offset={0.18} darkness={0.62} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>

      <CameraRig />
    </Canvas>
  );
}
