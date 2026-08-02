"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import DressMesh from "@/components/scene/Dress";
import { DECO_DRESSES, DRESSES } from "@/data/dresses";
import { useBoutique } from "@/store/useBoutique";

/* Rails laiton + robes espacées (cliquables) + robes de décor. */

function GoldRail({
  from,
  to,
  height = 2.02,
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
        <cylinderGeometry args={[0.016, 0.016, len, 12]} />
        <meshStandardMaterial color="#c9a45c" roughness={0.22} metalness={0.9} />
      </mesh>
      {[from, to].map((p, i) => (
        <mesh key={i} position={[p[0], height + 0.11, p[1]]}>
          <cylinderGeometry args={[0.011, 0.011, 0.22, 8]} />
          <meshStandardMaterial color="#c9a45c" roughness={0.22} metalness={0.9} />
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
        position={[0, 0.45, 0]}
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

      <Html position={[0.2, 1.3, 0.14]} center distanceFactor={5} zIndexRange={[40, 0]}>
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
      {/* Rail principal — devant l'armoire du fond, robes espacées */}
      <GoldRail from={[0.85, -2.98]} to={[4.72, -2.98]} />
      {DRESSES.map((d) => (
        <DressWithHotspot key={d.id} id={d.id} />
      ))}

      {/* Rail latéral du mur droit — robes de décor (profondeur) */}
      <GoldRail from={[4.95, -1.45]} to={[4.95, 1.55]} />
      {DECO_DRESSES.map((d, i) => (
        <group key={i} position={d.position} rotation={[0, d.facing, 0]}>
          <group position={[0, 0.45, 0]}>
            <DressMesh silhouette={d.silhouette} />
          </group>
        </group>
      ))}
    </group>
  );
}
