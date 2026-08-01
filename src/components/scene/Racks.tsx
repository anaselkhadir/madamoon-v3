"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import DressMesh from "@/components/scene/Dress";
import { DRESSES } from "@/data/dresses";
import { useBoutique } from "@/store/useBoutique";

/* Rails dorés + robes + hotspots cliquables. */

function GoldRail({
  from,
  to,
  height = 1.95,
}: {
  from: [number, number];
  to: [number, number];
  height?: number;
}) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  const cx = (from[0] + to[0]) / 2;
  const cz = (from[1] + to[1]) / 2;
  return (
    <group>
      <mesh position={[cx, height, cz]} rotation={[0, -angle, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, len, 10]} />
        <meshStandardMaterial color="#c9a45c" roughness={0.25} metalness={0.85} />
      </mesh>
      {/* Potences */}
      {[from, to].map((p, i) => (
        <mesh key={i} position={[p[0], height + 0.1, p[1]]}>
          <cylinderGeometry args={[0.012, 0.012, 0.2, 8]} />
          <meshStandardMaterial color="#c9a45c" roughness={0.25} metalness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function DressWithHotspot({ id }: { id: string }) {
  const dress = DRESSES.find((d) => d.id === id)!;
  const select = useBoutique((s) => s.select);
  const selectedId = useBoutique((s) => s.selectedId);
  const [hover, setHover] = useState(false);

  return (
    <group position={dress.position} rotation={[0, dress.facing, 0]}>
      <group
        position={[0, 0.38, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          select(dress.id);
        }}
      >
        <DressMesh silhouette={dress.silhouette} hover={hover || selectedId === dress.id} />
      </group>

      {/* Hotspot pulsant */}
      <Html position={[0.22, 1.25, 0.12]} center distanceFactor={5} zIndexRange={[40, 0]}>
        <button
          type="button"
          aria-label={`Découvrir ${dress.name}`}
          className="hotspot-dot"
          onClick={(e) => {
            e.stopPropagation();
            select(dress.id);
          }}
        />
      </Html>
    </group>
  );
}

export default function Racks() {
  return (
    <group>
      {/* Rail principal — devant les boiseries du fond droit */}
      <GoldRail from={[0.5, -2.6]} to={[3.7, -2.6]} />
      {/* Rail latéral — mur droit */}
      <GoldRail from={[4.45, -1.7]} to={[4.45, 0.7]} />
      {DRESSES.map((d) => (
        <DressWithHotspot key={d.id} id={d.id} />
      ))}
    </group>
  );
}
