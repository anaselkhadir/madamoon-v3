"use client";

/* Mobilier de la photo : canapé bleu roi, pouf blanc, tapis, table aux
 * fleurs séchées, miroir oval LED, plantes. */

export default function Furniture() {
  return (
    <group>
      {/* Tapis oriental */}
      <mesh rotation={[-Math.PI / 2, 0, 0.12]} position={[0.2, 0.012, 1.5]} receiveShadow>
        <planeGeometry args={[2.8, 1.9]} />
        <meshStandardMaterial color="#b9c0c9" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0.12]} position={[0.2, 0.02, 1.5]}>
        <planeGeometry args={[2.3, 1.4]} />
        <meshStandardMaterial color="#8e9fb0" roughness={0.95} />
      </mesh>

      {/* Canapé velours bleu roi */}
      <group position={[-1.9, 0, 2.7]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[1.7, 0.5, 0.75]} />
          <meshStandardMaterial color="#1f36c7" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.62, -0.3]} castShadow>
          <boxGeometry args={[1.7, 0.55, 0.2]} />
          <meshStandardMaterial color="#1f36c7" roughness={0.85} />
        </mesh>
      </group>

      {/* Pouf cylindrique blanc */}
      <mesh position={[0.3, 0.24, 1.15]} castShadow>
        <cylinderGeometry args={[0.34, 0.36, 0.48, 28]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.7} />
      </mesh>

      {/* Table basse bois + vases de fleurs séchées */}
      <group position={[2.5, 0, 2.5]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.95, 0.64, 0.6]} />
          <meshStandardMaterial color="#6d4a2f" roughness={0.6} />
        </mesh>
        {/* Vase blanc sculptural */}
        <mesh position={[-0.15, 0.78, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.13, 0.28, 12]} />
          <meshStandardMaterial color="#f2ede2" roughness={0.6} />
        </mesh>
        {/* Bouquet séché — tiges terracotta / sauge / paille */}
        {[
          { p: [-0.22, 1.06, 0.03], c: "#c96f3a", h: 0.4 },
          { p: [-0.12, 1.12, -0.04], c: "#a8b49a", h: 0.5 },
          { p: [-0.16, 1.1, 0.06], c: "#d9b97e", h: 0.45 },
          { p: [-0.08, 1.04, 0.02], c: "#b0512f", h: 0.35 },
        ].map((f, i) => (
          <group key={i} position={f.p as [number, number, number]}>
            <mesh>
              <cylinderGeometry args={[0.006, 0.006, f.h]} />
              <meshStandardMaterial color="#8a7a52" />
            </mesh>
            <mesh position={[0, f.h / 2, 0]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color={f.c} roughness={0.9} />
            </mesh>
          </group>
        ))}
        {/* Vase terracotta */}
        <mesh position={[0.22, 0.75, 0.05]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.22, 12]} />
          <meshStandardMaterial color="#b9673f" roughness={0.8} />
        </mesh>
      </group>

      {/* Miroir oval LED sur pied */}
      <group position={[4.35, 0, 1.7]} rotation={[0, -0.9, 0.06]}>
        <mesh position={[0, 0.9, 0]}>
          <torusGeometry args={[0.52, 0.025, 12, 40]} />
          <meshStandardMaterial color="#fff6e0" emissive="#ffedbe" emissiveIntensity={1.1} />
        </mesh>
        <mesh position={[0, 0.9, 0]} scale={[1, 1.55, 1]}>
          <circleGeometry args={[0.49, 32]} />
          <meshStandardMaterial color="#d3d9d6" roughness={0.1} metalness={0.7} />
        </mesh>
      </group>

      {/* Plante verte d'angle */}
      <group position={[-4.4, 0, 2.9]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.36, 12]} />
          <meshStandardMaterial color="#8a6a48" roughness={0.8} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[Math.sin(i * 1.4) * 0.12, 0.65 + (i % 3) * 0.16, Math.cos(i * 1.4) * 0.12]}
            rotation={[Math.sin(i) * 0.5, i, 0]}
            castShadow
          >
            <coneGeometry args={[0.09, 0.5, 6]} />
            <meshStandardMaterial color="#5d7a56" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
