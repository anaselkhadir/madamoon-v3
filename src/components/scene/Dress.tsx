"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { Silhouette } from "@/data/dresses";

/*
 * Robe stylisée (placeholder géométrique, remplaçable par un GLTF).
 * Le profil de révolution (LatheGeometry) varie selon la silhouette réelle.
 * Origine du groupe : ourlet de la robe (y=0), cintre vers le rail au-dessus.
 */

const PROFILES: Record<Silhouette, [number, number][]> = {
  // [rayon, hauteur depuis l'ourlet]
  princesse: [
    [0.44, 0], [0.42, 0.06], [0.34, 0.3], [0.24, 0.55], [0.14, 0.78],
    [0.125, 0.85], [0.15, 1.0], [0.16, 1.08], [0.1, 1.16], [0.045, 1.2],
  ],
  sirene: [
    [0.34, 0], [0.3, 0.05], [0.16, 0.2], [0.115, 0.32], [0.13, 0.5],
    [0.15, 0.62], [0.125, 0.82], [0.15, 1.0], [0.155, 1.08], [0.1, 1.16], [0.045, 1.2],
  ],
  fluide: [
    [0.3, 0], [0.28, 0.08], [0.2, 0.4], [0.15, 0.7], [0.13, 0.85],
    [0.145, 1.0], [0.15, 1.08], [0.095, 1.16], [0.045, 1.2],
  ],
  trapeze: [
    [0.37, 0], [0.35, 0.06], [0.26, 0.35], [0.17, 0.65], [0.13, 0.82],
    [0.15, 1.0], [0.155, 1.08], [0.1, 1.16], [0.045, 1.2],
  ],
  minimaliste: [
    [0.26, 0], [0.24, 0.1], [0.17, 0.45], [0.125, 0.8], [0.14, 1.0],
    [0.15, 1.08], [0.095, 1.16], [0.045, 1.2],
  ],
};

const TINTS: Record<Silhouette, string> = {
  princesse: "#fbf8f2",
  sirene: "#f6f0e6",
  fluide: "#f8f4ec",
  trapeze: "#f4efe4",
  minimaliste: "#faf7f0",
};

export default function DressMesh({
  silhouette,
  hover = false,
}: {
  silhouette: Silhouette;
  hover?: boolean;
}) {
  const geometry = useMemo(() => {
    const pts = PROFILES[silhouette].map(([r, y]) => new THREE.Vector2(r, y));
    const geo = new THREE.LatheGeometry(pts, 28);
    geo.computeVertexNormals();
    return geo;
  }, [silhouette]);

  return (
    <group>
      {/* Corps de la robe */}
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color={TINTS[silhouette]}
          roughness={0.55}
          metalness={0.02}
          emissive={hover ? "#c9a45c" : "#000000"}
          emissiveIntensity={hover ? 0.12 : 0}
        />
      </mesh>
      {/* Cintre bois + crochet doré vers le rail */}
      <mesh position={[0, 1.24, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.012, 0.3, 4, 8]} />
        <meshStandardMaterial color="#8a6a48" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <torusGeometry args={[0.05, 0.007, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#c9a45c" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}
