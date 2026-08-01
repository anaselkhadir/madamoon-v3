"use client";

/*
 * La pièce — transcription stylisée de la photo de référence :
 * parquet chaud, boiseries sombres, rideaux crème, miroirs en arche,
 * vitrail, corniche sombre, lustre globe.
 */

const WOOD = "#3a2b20";
const WOOD_DARK = "#2b1f16";
const CREAM = "#e9e2d6";
const FLOOR = "#a8845c";
const MIRROR = "#cfd6d4";

function CurtainRun({
  width,
  height = 3.4,
  folds = 9,
}: {
  width: number;
  height?: number;
  folds?: number;
}) {
  const step = width / folds;
  return (
    <group>
      {Array.from({ length: folds }).map((_, i) => (
        <mesh key={i} position={[-width / 2 + step * (i + 0.5), height / 2, i % 2 ? 0.03 : 0]}>
          <cylinderGeometry args={[step * 0.62, step * 0.72, height, 10, 1, true]} />
          <meshStandardMaterial color={i % 2 ? CREAM : "#ddd3c2"} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function ArchMirror({ w = 1.1, h = 2.2 }: { w?: number; h?: number }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[w + 0.24, h + 0.35, 0.08]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.06, 0.05]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color={MIRROR} roughness={0.12} metalness={0.65} />
      </mesh>
      <mesh position={[0, h / 2 - 0.02, 0.05]}>
        <circleGeometry args={[w / 2, 24, 0, Math.PI]} />
        <meshStandardMaterial color={MIRROR} roughness={0.12} metalness={0.65} />
      </mesh>
    </group>
  );
}

export default function Room() {
  return (
    <group>
      {/* Parquet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10.4, 7.4]} />
        <meshStandardMaterial color={FLOOR} roughness={0.75} />
      </mesh>
      {/* Lames de parquet suggérées */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-4.4 + i * 1.75, 0.002, 0]}>
          <planeGeometry args={[0.025, 7.4]} />
          <meshStandardMaterial color="#8f6c48" roughness={0.85} />
        </mesh>
      ))}

      {/* Plafond crème + corniche sombre */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.2, 0]}>
        <planeGeometry args={[10.4, 7.4]} />
        <meshStandardMaterial color="#efe9dd" roughness={0.95} />
      </mesh>
      {[
        { pos: [0, 3.95, -3.65], size: [10.4, 0.5, 0.14] },
        { pos: [0, 3.95, 3.65], size: [10.4, 0.5, 0.14] },
        { pos: [-5.15, 3.95, 0], size: [0.14, 0.5, 7.4] },
        { pos: [5.15, 3.95, 0], size: [0.14, 0.5, 7.4] },
      ].map((c, i) => (
        <mesh key={i} position={c.pos as [number, number, number]}>
          <boxGeometry args={c.size as [number, number, number]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
        </mesh>
      ))}

      {/* ——— Mur du fond (z = -3.6) : boiseries + rideaux + comptoir ——— */}
      <mesh position={[0, 2.1, -3.65]}>
        <planeGeometry args={[10.4, 4.2]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} />
      </mesh>
      {/* Rideaux crème lumineux (lumière de la verrière) */}
      <group position={[-1.4, 0, -3.5]}>
        <CurtainRun width={4.6} />
      </group>
      {/* Halo lumineux derrière les rideaux */}
      <mesh position={[-1.4, 1.9, -3.58]}>
        <planeGeometry args={[4.4, 3.2]} />
        <meshStandardMaterial color="#fff4dd" emissive="#ffe9c4" emissiveIntensity={0.55} />
      </mesh>
      {/* Arche miroir centrale + comptoir bois */}
      <group position={[1.6, 1.35, -3.45]}>
        <ArchMirror />
      </group>
      <mesh position={[1.6, 0.55, -3.0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.1, 0.65]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>

      {/* ——— Mur gauche (x = -5.2) : rideaux hauts + vitrail ——— */}
      <mesh position={[-5.2, 2.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[7.4, 4.2]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} />
      </mesh>
      <group position={[-5.05, 0.6, 0.8]} rotation={[0, Math.PI / 2, 0]}>
        <CurtainRun width={4.2} height={3.2} folds={8} />
      </group>
      {/* Vitrail coloré en hauteur */}
      <group position={[-5.12, 3.4, -2.2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[1.5, 1.0]} />
          <meshStandardMaterial color="#7d5a8c" emissive="#9a6aa8" emissiveIntensity={0.5} />
        </mesh>
        {[-0.45, 0, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.01]}>
            <planeGeometry args={[0.32, 0.7]} />
            <meshStandardMaterial
              color={["#b46a5a", "#6a8c6e", "#c9a45c"][i]}
              emissive={["#b46a5a", "#6a8c6e", "#c9a45c"][i]}
              emissiveIntensity={0.45}
            />
          </mesh>
        ))}
      </group>

      {/* ——— Mur droit (x = 5.2) : grande armoire boiseries + miroirs ——— */}
      <mesh position={[5.2, 2.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[7.4, 4.2]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} />
      </mesh>
      <group rotation={[0, -Math.PI / 2, 0]}>
        {[-2.1, -0.7, 0.7, 2.1].map((z, i) => (
          <group key={i} position={[-z, 1.5, -4.98]}>
            <ArchMirror w={0.95} h={2.0} />
          </group>
        ))}
      </group>
      {/* Fronton sculpté suggéré */}
      <mesh position={[4.95, 3.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[6.2, 0.7, 0.18]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.65} />
      </mesh>

      {/* ——— Mur avant (z = 3.7, derrière la caméra) ——— */}
      <mesh position={[0, 2.1, 3.7]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10.4, 4.2]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} />
      </mesh>

      {/* Lustre globe */}
      <group position={[0.6, 3.7, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.012, 0.012, 0.5]} />
          <meshStandardMaterial color={WOOD_DARK} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.16, 20, 16]} />
          <meshStandardMaterial color="#fff2d8" emissive="#ffdf9e" emissiveIntensity={1.4} />
        </mesh>
      </group>
    </group>
  );
}
