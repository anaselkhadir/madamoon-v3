"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { DRESSES } from "@/data/dresses";
import { useBoutique } from "@/store/useBoutique";

/*
 * Caméra contrainte : on reste dans la pièce (orbite + zoom limités).
 * À la sélection d'une robe, la caméra glisse doucement vers elle.
 */

const DEFAULT_TARGET = new THREE.Vector3(-0.25, 1.35, -1.1);
const DEFAULT_POS = new THREE.Vector3(1.3, 1.6, 3.7);

export default function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const selectedId = useBoutique((s) => s.selectedId);
  const focus = useRef({ target: DEFAULT_TARGET.clone(), pos: DEFAULT_POS.clone(), active: false });

  useFrame(() => {
    const c = controls.current;
    if (!c) return;

    const dress = DRESSES.find((d) => d.id === selectedId);
    if (dress) {
      const [x, , z] = dress.position;
      focus.current.target.set(x, 1.15, z);
      // Point de vue en retrait face à la robe
      const dir = new THREE.Vector3(Math.sin(dress.facing), 0, Math.cos(dress.facing));
      focus.current.pos.set(x + dir.x * 2.1 - 0.4, 1.5, z + dir.z * 2.1 + 0.4);
      focus.current.active = true;
    } else if (focus.current.active) {
      focus.current.target.copy(DEFAULT_TARGET);
      focus.current.pos.copy(DEFAULT_POS);
      // On relâche la caméra une fois revenue près de la position d'origine
      if (camera.position.distanceTo(DEFAULT_POS) < 0.15) focus.current.active = false;
    }

    if (focus.current.active) {
      c.target.lerp(focus.current.target, 0.06);
      camera.position.lerp(focus.current.pos, 0.05);
    }
    c.update();
  });

  return (
    <OrbitControls
      ref={controls}
      target={DEFAULT_TARGET.toArray()}
      enablePan={false}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.6}
      maxDistance={5.4}
      minPolarAngle={Math.PI * 0.34}
      maxPolarAngle={Math.PI * 0.52}
      minAzimuthAngle={-Math.PI * 0.22}
      maxAzimuthAngle={Math.PI * 0.38}
      rotateSpeed={0.55}
      zoomSpeed={0.7}
    />
  );
}
