"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { Silhouette } from "@/data/dresses";

/*
 * Robe stylisée réaliste (placeholder remplaçable par un GLTF) :
 * profil de révolution par silhouette + plis d'étoffe (ondulation radiale
 * amplifiée vers l'ourlet) + matière satin (sheen).
 */

const PROFILES: Record<Silhouette, [number, number][]> = {
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
  princesse: "#f7f2ea",
  sirene: "#f2ebdf",
  fluide: "#f5f0e6",
  trapeze: "#f0eadc",
  minimaliste: "#f8f4ec",
};

/* Nombre de plis par silhouette (plus dense = étoffe plus travaillée). */
const FOLDS: Record<Silhouette, number> = {
  princesse: 14,
  sirene: 10,
  fluide: 8,
  trapeze: 12,
  minimaliste: 6,
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
    const geo = new THREE.LatheGeometry(pts, 72);
    // Plis de tissu : ondulation radiale qui s'amplifie vers l'ourlet
    const pos = geo.attributes.position;
    const folds = FOLDS[silhouette];
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const angle = Math.atan2(v.z, v.x);
      const radius = Math.hypot(v.x, v.z);
      if (radius < 1e-4) continue;
      // Amplitude nulle au buste (y>0.9), maximale à l'ourlet (y=0)
      const drape = Math.max(0, 1 - v.y / 0.9);
      const ripple = 1 + Math.sin(angle * folds + v.y * 2.2) * 0.045 * drape;
      pos.setX(i, Math.cos(angle) * radius * ripple);
      pos.setZ(i, Math.sin(angle) * radius * ripple);
    }
    geo.computeVertexNormals();
    return geo;
  }, [silhouette]);

  return (
    <group>
      {/* Corps de la robe — satin */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={TINTS[silhouette]}
          roughness={0.62}
          sheen={1}
          sheenColor="#fffdf6"
          sheenRoughness={0.4}
          emissive={hover ? "#c9a45c" : "#000000"}
          emissiveIntensity={hover ? 0.1 : 0}
        />
      </mesh>
      {/* Ceinture fine */}
      <mesh position={[0, 0.86, 0]}>
        <torusGeometry args={[0.128, 0.008, 8, 40]} />
        <meshStandardMaterial color="#e8ddc8" roughness={0.5} />
      </mesh>
      {/* Cintre bois + crochet laiton */}
      <mesh position={[0, 1.24, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.012, 0.3, 4, 10]} />
        <meshStandardMaterial color="#8a6a48" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <torusGeometry args={[0.05, 0.007, 8, 22, Math.PI]} />
        <meshStandardMaterial color="#c9a45c" roughness={0.25} metalness={0.9} />
      </mesh>
    </group>
  );
}
