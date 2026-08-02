"use client";

import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { useRug, useVelvet, useWalnut } from "@/components/scene/materials";

/* Mobilier réaliste : canapé velours bleu roi, pouf bouclé, tapis persan,
 * table noyer aux fleurs séchées, miroir oval LED, plante. */

export default function Furniture() {
  const rug = useRug();
  const velvet = useVelvet(1.2, 0.8);
  const walnut = useWalnut(1, 1);

  return (
    <group>
      {/* Tapis persan à franges */}
      <group position={[0.85, 0.015, 2.15]} rotation={[0, 0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.9, 2.0]} />
          <meshStandardMaterial normalMap={rug.normalMap} color="#a9b4bd" roughness={0.98} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <planeGeometry args={[2.3, 1.5]} />
          <meshStandardMaterial normalMap={rug.normalMap} color="#c3b9a6" roughness={0.98} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <ringGeometry args={[0, 0.001, 4]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>

      {/* Canapé velours bleu roi */}
      <group position={[-2.5, 0, 3.6]} rotation={[0, 1.35, 0]}>
        <RoundedBox args={[1.75, 0.42, 0.8]} radius={0.09} smoothness={3} position={[0, 0.32, 0]} castShadow>
          <meshPhysicalMaterial {...velvet} color="#1d33b8" roughness={0.9} sheen={1} sheenColor="#5a6fe0" sheenRoughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[1.75, 0.62, 0.24]} radius={0.09} smoothness={3} position={[0, 0.68, -0.3]} castShadow>
          <meshPhysicalMaterial {...velvet} color="#1d33b8" roughness={0.9} sheen={1} sheenColor="#5a6fe0" sheenRoughness={0.6} />
        </RoundedBox>
        {/* Coussin */}
        <RoundedBox args={[0.5, 0.16, 0.5]} radius={0.07} smoothness={3} position={[0.45, 0.58, -0.1]} rotation={[0.2, 0.3, 0]} castShadow>
          <meshPhysicalMaterial {...velvet} color="#2a44d4" roughness={0.9} sheen={1} sheenColor="#7387ea" />
        </RoundedBox>
        {/* Pieds bois */}
        {[[-0.78, 0.32], [0.78, 0.32], [-0.78, -0.32], [0.78, -0.32]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.06, z]}>
            <cylinderGeometry args={[0.03, 0.02, 0.12]} />
            <meshStandardMaterial {...walnut} color="#6d5238" />
          </mesh>
        ))}
      </group>

      {/* Pouf cylindrique bouclé blanc */}
      <group position={[0.8, 0, 1.75]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.37, 0.5, 36]} />
          <meshPhysicalMaterial color="#efe9dd" roughness={0.95} sheen={0.6} sheenColor="#ffffff" />
        </mesh>
        <mesh position={[0, 0.505, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.02, 36]} />
          <meshPhysicalMaterial color="#f4efe4" roughness={0.95} sheen={0.6} sheenColor="#ffffff" />
        </mesh>
      </group>

      {/* Table basse noyer + bouquets séchés */}
      <group position={[2.75, 0, 2.35]} rotation={[0, -0.28, 0]} scale={1.2}>
        <RoundedBox args={[1.0, 0.66, 0.62]} radius={0.02} smoothness={2} position={[0, 0.33, 0]} castShadow>
          <meshStandardMaterial {...walnut} color="#96703f" />
        </RoundedBox>
        {/* Vase sculptural blanc */}
        <mesh position={[-0.18, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.13, 0.3, 18]} />
          <meshStandardMaterial color="#ece6d8" roughness={0.5} />
        </mesh>
        {/* Bouquet — tiges fines + têtes séchées */}
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const r = 0.02 + (i % 4) * 0.02;
          const h = 0.34 + (i % 5) * 0.09;
          const colors = ["#c96f3a", "#a8b49a", "#d9b97e", "#b0512f", "#e0cba0"];
          return (
            <group key={i} position={[-0.18 + Math.cos(a) * r, 0.95, Math.sin(a) * r]} rotation={[Math.cos(a) * 0.25, 0, Math.sin(a) * 0.3]}>
              <mesh position={[0, h / 2, 0]}>
                <cylinderGeometry args={[0.004, 0.005, h]} />
                <meshStandardMaterial color="#7a6a4a" roughness={1} />
              </mesh>
              <mesh position={[0, h, 0]}>
                <sphereGeometry args={[0.028 + (i % 3) * 0.012, 8, 8]} />
                <meshStandardMaterial color={colors[i % colors.length]} roughness={1} />
              </mesh>
            </group>
          );
        })}
        {/* Vase terracotta */}
        <mesh position={[0.24, 0.77, 0.06]} castShadow>
          <cylinderGeometry args={[0.07, 0.095, 0.24, 16]} />
          <meshStandardMaterial color="#b9673f" roughness={0.85} />
        </mesh>
        <mesh position={[0.1, 0.69, -0.16]}>
          <cylinderGeometry args={[0.055, 0.05, 0.08, 14]} />
          <meshStandardMaterial {...walnut} color="#4a3423" />
        </mesh>
      </group>

      {/* Miroir oval LED sur pied — réflexion réelle */}
      <group position={[4.65, 0, 1.15]} rotation={[0, -2.1, 0]}>
        <group rotation={[0, 0, 0.05]}>
          <mesh position={[0, 0.95, 0]} scale={[1, 1.5, 1]}>
            <torusGeometry args={[0.5, 0.028, 14, 48]} />
            <meshStandardMaterial color="#fff6e0" emissive="#ffedbe" emissiveIntensity={1.6} />
          </mesh>
          <mesh position={[0, 0.95, 0.005]} scale={[1, 1.5, 1]}>
            <circleGeometry args={[0.47, 40]} />
            <meshStandardMaterial color="#c4cac6" roughness={0.08} metalness={0.92} envMapIntensity={1.8} />
          </mesh>
        </group>
        <mesh position={[0, 0.06, -0.06]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5]} />
          <meshStandardMaterial color="#d8d3c8" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Plante d'angle */}
      <group position={[-4.45, 0, 3.0]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.21, 0.4, 16]} />
          <meshStandardMaterial color="#8a6a48" roughness={0.85} />
        </mesh>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = i * 0.75;
          return (
            <mesh
              key={i}
              position={[Math.sin(a) * 0.14, 0.72 + (i % 4) * 0.14, Math.cos(a) * 0.14]}
              rotation={[Math.sin(a) * 0.6, a, Math.cos(a) * 0.25]}
              castShadow
            >
              <coneGeometry args={[0.075, 0.55, 7]} />
              <meshStandardMaterial color="#4f6b49" roughness={0.85} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
