"use client";

/* L'escalier d'époque — marches au tapis rouge, balustrade sculptée. */

const WOOD_DARK = "#2b1f16";
const RED = "#8e1f2a";

export default function Staircase() {
  const steps = 10;
  return (
    <group position={[-3.4, 0, -1.2]} rotation={[0, 0.32, 0]}>
      {Array.from({ length: steps }).map((_, i) => {
        const w = 2.2 - i * 0.06;
        return (
          <group key={i} position={[-i * 0.34, i * 0.21, 0]}>
            {/* Contremarche bois */}
            <mesh position={[0, 0.105, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.36, 0.21, w]} />
              <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
            </mesh>
            {/* Tapis rouge */}
            <mesh position={[0, 0.215, 0]}>
              <boxGeometry args={[0.37, 0.015, w * 0.7]} />
              <meshStandardMaterial color={RED} roughness={0.95} />
            </mesh>
          </group>
        );
      })}

      {/* Poteaux de départ sculptés */}
      {[1.05, -1.05].map((z, i) => (
        <group key={i} position={[0.35, 0, z]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.26, 1.1, 0.26]} />
            <meshStandardMaterial color={WOOD_DARK} roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.18, 0]}>
            <sphereGeometry args={[0.17, 16, 12]} />
            <meshStandardMaterial color={WOOD_DARK} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Main courante montante */}
      <mesh position={[-1.45, 1.6, 1.0]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[3.6, 0.09, 0.09]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.55} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-0.3 - i * 0.55, 0.75 + i * 0.34, 1.0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.85]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
