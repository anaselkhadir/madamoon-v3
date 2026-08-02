"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useVelvet, useWalnut } from "@/components/scene/materials";

/* L'escalier d'époque : marches noyer, tapis velours rouge, balustres
 * tournés et poteaux sculptés surmontés d'une boule. */

function Baluster({ maps }: { maps: ReturnType<typeof useWalnut> }) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const profile: [number, number][] = [
      [0.045, 0], [0.05, 0.04], [0.028, 0.09], [0.05, 0.16], [0.026, 0.28],
      [0.045, 0.42], [0.024, 0.56], [0.045, 0.68], [0.03, 0.78], [0.045, 0.84], [0.02, 0.9],
    ];
    profile.forEach(([r, y]) => pts.push(new THREE.Vector2(r, y)));
    return new THREE.LatheGeometry(pts, 14);
  }, []);
  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial {...maps} color="#96744e" />
    </mesh>
  );
}

function Newel({ maps }: { maps: ReturnType<typeof useWalnut> }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.3, 1.0, 0.3]} />
        <meshStandardMaterial {...maps} color="#8a6a45" />
      </mesh>
      {/* Chapiteau mouluré */}
      <mesh position={[0, 1.04, 0]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.4]} />
        <meshStandardMaterial {...maps} color="#7d5c3a" />
      </mesh>
      <mesh position={[0, 1.24, 0]} castShadow>
        <sphereGeometry args={[0.18, 20, 16]} />
        <meshStandardMaterial color="#8a6743" roughness={0.65} envMapIntensity={0.4} />
      </mesh>
      {/* Motif sculpté suggéré */}
      <mesh position={[0, 0.62, 0.16]}>
        <boxGeometry args={[0.2, 0.5, 0.03]} />
        <meshStandardMaterial {...maps} color="#7d5c3a" />
      </mesh>
    </group>
  );
}

export default function Staircase() {
  const walnut = useWalnut(1.4, 1);
  const velvet = useVelvet(0.8, 0.5);
  const steps = 12;

  return (
    <group position={[-2.55, 0, 0.35]} rotation={[0, 0.5, 0]} scale={1.05}>
      {Array.from({ length: steps }).map((_, i) => {
        const w = 2.25 - i * 0.05;
        return (
          <group key={i} position={[-i * 0.33, i * 0.2, 0]}>
            <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.36, 0.2, w]} />
              <meshStandardMaterial {...walnut} color="#96744e" />
            </mesh>
            {/* Nez de marche */}
            <mesh position={[-0.19, 0.19, 0]}>
              <boxGeometry args={[0.04, 0.035, w]} />
              <meshStandardMaterial {...walnut} color="#7d5c3a" />
            </mesh>
            {/* Tapis velours rouge */}
            <mesh position={[0, 0.208, 0]} receiveShadow>
              <boxGeometry args={[0.37, 0.018, w * 0.66]} />
              <meshStandardMaterial {...velvet} color="#7e1420" roughness={0.98} />
            </mesh>
            {/* Retombée du tapis sur la contremarche */}
            <mesh position={[-0.187, 0.09, 0]}>
              <boxGeometry args={[0.012, 0.2, w * 0.66]} />
              <meshStandardMaterial {...velvet} color="#6d101b" roughness={0.98} />
            </mesh>
          </group>
        );
      })}

      {/* Poteaux de départ */}
      {[1.08, -1.08].map((z, i) => (
        <group key={i} position={[0.4, 0, z]}>
          <Newel maps={walnut} />
        </group>
      ))}

      {/* Balustres + main courante côté salle */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i} position={[-0.15 - i * 0.42, 0.28 + i * 0.255, 1.05]}>
          <Baluster maps={walnut} />
        </group>
      ))}
      <mesh position={[-1.6, 1.45, 1.05]} rotation={[0, 0, 0.545]} castShadow>
        <boxGeometry args={[3.9, 0.1, 0.12]} />
        <meshStandardMaterial {...walnut} color="#7d5c3a" roughness={0.35} />
      </mesh>

      {/* Limon (côté) */}
      <mesh position={[-1.55, 0.85, 1.12]} rotation={[0, 0, 0.545]}>
        <boxGeometry args={[4.1, 0.5, 0.06]} />
        <meshStandardMaterial {...walnut} color="#84623e" />
      </mesh>
    </group>
  );
}
