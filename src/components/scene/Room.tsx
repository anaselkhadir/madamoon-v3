"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three-stdlib";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useCurtainFabric, useParquet, useWalnut } from "@/components/scene/materials";

// Indispensable avant tout rectAreaLight : initialise les textures LTC,
// sans quoi le shader de tous les matériaux standard est corrompu (rendu délavé).
let ltcReady = false;
function ensureLtc() {
  if (!ltcReady) {
    RectAreaLightUniformsLib.init();
    ltcReady = true;
  }
}

/*
 * La pièce, calée sur la photo de référence :
 * — gauche : rideaux crème en cascade derrière l'escalier, vitrail en hauteur
 * — centre : colonne sculptée + arche avec lustre et miroir, comptoir, mannequin
 * — droite : grande armoire-miroirs FACE caméra, cantonnière de rideaux au-dessus,
 *   rail laiton avec robes espacées ; le tout sous corniche sombre profonde.
 */

const MIRROR_TINT = "#b3b8b2";

/* Rideau : plan ondulé (plis sinusoïdaux) avec tissu PBR. */
function Curtain({
  width,
  height = 3.5,
  folds = 7,
  depth = 0.16,
}: {
  width: number;
  height?: number;
  folds?: number;
  depth?: number;
}) {
  const fabric = useCurtainFabric();
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, 96, 1);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, Math.sin((x / width) * Math.PI * 2 * folds) * depth);
    }
    geo.computeVertexNormals();
    return geo;
  }, [width, height, folds, depth]);

  return (
    <group>
      <mesh geometry={geometry} position={[0, height / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...fabric} color="#f3ead6" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      {/* Bandeau de tête : masque le sommet des plis */}
      <mesh position={[0, height - 0.07, 0]}>
        <boxGeometry args={[width, 0.14, depth * 2.4]} />
        <meshStandardMaterial {...fabric} color="#ece1c9" roughness={0.92} />
      </mesh>
    </group>
  );
}

/* Cantonnière froncée (bandeau de rideau au-dessus de l'armoire). */
function Valance({ width, height = 0.9 }: { width: number; height?: number }) {
  const fabric = useCurtainFabric();
  return (
    <group>
      <mesh position={[0, height / 2, -0.06]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial {...fabric} color="#e8dcc2" roughness={0.95} />
      </mesh>
      <Curtain width={width} height={height} folds={Math.round(width * 2.2)} depth={0.09} />
    </group>
  );
}

/* Miroir en arche, cadre noyer mouluré. */
function ArchMirror({
  w = 1.0,
  h = 1.9,
  reflect = false,
}: {
  w?: number;
  h?: number;
  reflect?: boolean;
}) {
  const walnut = useWalnut(1, 2);
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[w + 0.24, h + 0.34, 0.1]} />
        <meshStandardMaterial {...walnut} color="#7d5c3e" />
      </mesh>
      <mesh position={[0, -0.04, 0.06]}>
        {reflect ? (
          <>
            <planeGeometry args={[w, h]} />
            <MeshReflectorMaterial
              blur={[200, 60]}
              resolution={256}
              mixBlur={0.6}
              mixStrength={0.9}
              roughness={0.35}
              depthScale={0.4}
              color={MIRROR_TINT}
              metalness={0.5}
            />
          </>
        ) : (
          <>
            <planeGeometry args={[w, h]} />
            <meshStandardMaterial color={MIRROR_TINT} roughness={0.06} metalness={0.95} envMapIntensity={1.7} />
          </>
        )}
      </mesh>
    </group>
  );
}

/* Applique murale chaude. */
function Sconce({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.07, 14, 12]} />
        <meshStandardMaterial color="#fff1cf" emissive="#ffcf8a" emissiveIntensity={2.2} />
      </mesh>
    </group>
  );
}

/* Lustre à bras laiton et globes chauds (celui de l'arche). */
function Chandelier({ position, arms = 5 }: { position: [number, number, number]; arms?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.9]} />
        <meshStandardMaterial color="#a8853f" metalness={0.9} roughness={0.3} />
      </mesh>
      {Array.from({ length: arms }).map((_, i) => {
        const a = (i / arms) * Math.PI * 2;
        const r = 0.26;
        return (
          <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
            <mesh>
              <sphereGeometry args={[0.055, 14, 12]} />
              <meshStandardMaterial color="#fff2d6" emissive="#ffd894" emissiveIntensity={2.4} />
            </mesh>
          </group>
        );
      })}
      <mesh>
        <sphereGeometry args={[0.05, 12, 10]} />
        <meshStandardMaterial color="#a8853f" metalness={0.9} roughness={0.3} />
      </mesh>
      <pointLight intensity={13} color="#ffdba2" distance={9} decay={2} />
    </group>
  );
}

/* Colonne-pilastre sculptée (façon boiseries Claverie). */
function CarvedColumn({ position }: { position: [number, number, number] }) {
  const walnut = useWalnut(1, 3);
  return (
    <group position={position}>
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[0.5, 4.2, 0.45]} />
        <meshStandardMaterial {...walnut} color="#7a583a" />
      </mesh>
      {/* Chapiteaux */}
      {[3.5, 0.9].map((y, i) => (
        <mesh key={i} position={[0, y, 0.06]} castShadow>
          <boxGeometry args={[0.62, 0.22, 0.5]} />
          <meshStandardMaterial {...walnut} color="#63452b" />
        </mesh>
      ))}
    </group>
  );
}

export default function Room() {
  ensureLtc();
  const parquet = useParquet();
  const walnut = useWalnut(3, 2);
  const walnutWall = useWalnut(4, 2.2);

  return (
    <group>
      {/* ——— Parquet chevrons ——— */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10.4, 7.4]} />
        <meshStandardMaterial {...parquet} color="#c9a276" />
      </mesh>

      {/* ——— Plafond crème + gorge sombre profonde (comme la photo) ——— */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.2, 0]}>
        <planeGeometry args={[10.4, 7.4]} />
        <meshStandardMaterial color="#e8e0d1" roughness={0.95} />
      </mesh>
      {[
        { pos: [0, 3.8, -3.55], size: [10.4, 0.8, 0.34] },
        { pos: [0, 3.8, 3.55], size: [10.4, 0.8, 0.34] },
        { pos: [-5.05, 3.8, 0], size: [0.34, 0.8, 7.4] },
        { pos: [5.05, 3.8, 0], size: [0.34, 0.8, 7.4] },
      ].map((c, i) => (
        <mesh key={i} position={c.pos as [number, number, number]} castShadow>
          <boxGeometry args={c.size as [number, number, number]} />
          <meshStandardMaterial {...walnut} color="#4a3626" />
        </mesh>
      ))}

      {/* ——— Murs noyer ——— */}
      <mesh position={[0, 2.1, -3.68]}>
        <planeGeometry args={[10.4, 4.2]} />
        <meshStandardMaterial {...walnutWall} color="#8a6848" />
      </mesh>
      <mesh position={[-5.2, 2.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[7.4, 4.2]} />
        <meshStandardMaterial {...walnutWall} color="#82603f" />
      </mesh>
      <mesh position={[5.2, 2.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[7.4, 4.2]} />
        <meshStandardMaterial {...walnutWall} color="#82603f" />
      </mesh>
      <mesh position={[0, 2.1, 3.72]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10.4, 4.2]} />
        <meshStandardMaterial {...walnutWall} color="#7d5e40" />
      </mesh>

      {/* ——— Gauche : cascade de rideaux crème derrière l'escalier ——— */}
      <group position={[-5.0, 0, 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <Curtain width={6.4} height={3.9} folds={10} depth={0.2} />
      </group>
      <group position={[-3.1, 0, -3.45]}>
        <Curtain width={3.4} height={3.9} folds={6} depth={0.2} />
      </group>
      {/* Halo chaud filtrant derrière les rideaux du fond gauche */}
      <mesh position={[-3.1, 2.0, -3.62]}>
        <planeGeometry args={[3.2, 3.4]} />
        <meshBasicMaterial color="#ffe9c2" />
      </mesh>
      <rectAreaLight position={[-3.1, 2.2, -3.3]} width={3.0} height={3.0} intensity={2.2} color="#ffe7bd" />

      {/* Vitrail en hauteur, coin avant-gauche (comme la photo) */}
      <group position={[-5.1, 3.3, 2.4]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[1.6, 1.1, 0.06]} />
          <meshStandardMaterial color="#3a2b20" roughness={0.6} />
        </mesh>
        {[
          { x: -0.5, c: "#a34e63" },
          { x: -0.17, c: "#5f7d5a" },
          { x: 0.17, c: "#c9a45c" },
          { x: 0.5, c: "#6b5a8c" },
        ].map((p, i) => (
          <mesh key={i} position={[p.x, 0, 0.04]}>
            <planeGeometry args={[0.26, 0.9]} />
            <meshStandardMaterial color={p.c} emissive={p.c} emissiveIntensity={0.85} roughness={0.4} />
          </mesh>
        ))}
      </group>
      <Sconce position={[-4.9, 2.85, 2.0]} />

      {/* ——— Centre : colonne sculptée + arche (lustre + miroir) + comptoir ——— */}
      <CarvedColumn position={[-0.95, 0, -3.35]} />

      {/* Arche : encadrement noyer + fond miroir + lustre suspendu */}
      <group position={[0.45, 0, -3.5]}>
        {/* Montants */}
        {[-0.85, 0.85].map((x, i) => (
          <mesh key={i} position={[x, 1.9, 0]} castShadow>
            <boxGeometry args={[0.24, 3.8, 0.18]} />
            <meshStandardMaterial {...walnut} color="#6d4e32" />
          </mesh>
        ))}
        {/* Linteau cintré suggéré */}
        <mesh position={[0, 3.62, 0]} castShadow>
          <boxGeometry args={[1.94, 0.5, 0.2]} />
          <meshStandardMaterial {...walnut} color="#63452b" />
        </mesh>
        {/* Fond : grand miroir réfléchissant (donne la profondeur de la photo) */}
        <mesh position={[0, 1.75, -0.05]}>
          <planeGeometry args={[1.5, 3.3]} />
          <MeshReflectorMaterial
            blur={[220, 70]}
            resolution={256}
            mixBlur={0.65}
            mixStrength={0.85}
            roughness={0.35}
            depthScale={0.45}
            color={MIRROR_TINT}
            metalness={0.5}
          />
        </mesh>
        {/* Lustre dans l'arche */}
        <Chandelier position={[0, 2.55, 0.35]} />
      </group>

      {/* Comptoir noyer sous l'arche */}
      <group position={[0.75, 0, -2.65]} rotation={[0, 0.06, 0]}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.1, 0.62]} />
          <meshStandardMaterial {...walnut} color="#8f6a48" />
        </mesh>
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[1.62, 0.05, 0.72]} />
          <meshStandardMaterial {...walnut} color="#6d5238" />
        </mesh>
      </group>

      {/* Mannequin — petite robe blanche près de la colonne (comme la photo) */}
      <group position={[-0.5, 0, -2.5]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.18, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#d8d3c8" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.16]} />
          <meshStandardMaterial color="#d8d3c8" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <latheGeometry
            args={[
              [
                new THREE.Vector2(0.26, 0),
                new THREE.Vector2(0.22, 0.12),
                new THREE.Vector2(0.13, 0.4),
                new THREE.Vector2(0.145, 0.58),
                new THREE.Vector2(0.09, 0.68),
              ],
              24,
            ]}
          />
          <meshPhysicalMaterial color="#faf6ee" roughness={0.6} sheen={1} sheenColor="#ffffff" />
        </mesh>
      </group>

      {/* ——— Droite : grande armoire-miroirs FACE caméra + cantonnière ——— */}
      <group position={[0, 0, -3.42]}>
        {/* Corps de l'armoire */}
        <mesh position={[2.95, 1.62, -0.12]} castShadow receiveShadow>
          <boxGeometry args={[4.3, 3.24, 0.16]} />
          <meshStandardMaterial {...walnutWall} color="#7a583a" />
        </mesh>
        {/* Soubassement mouluré */}
        <mesh position={[2.95, 0.42, -0.02]} castShadow>
          <boxGeometry args={[4.3, 0.84, 0.2]} />
          <meshStandardMaterial {...walnut} color="#63452b" />
        </mesh>
        {/* Miroirs en arche derrière le rail */}
        {[1.5, 2.95, 4.4].map((x, i) => (
          <group key={i} position={[x, 1.98, 0]}>
            <ArchMirror w={1.02} h={1.75} />
          </group>
        ))}
        {/* Corniche + fronton sculpté */}
        <mesh position={[2.95, 3.34, 0]} castShadow>
          <boxGeometry args={[4.5, 0.34, 0.24]} />
          <meshStandardMaterial {...walnut} color="#5d4229" />
        </mesh>
        <mesh position={[2.95, 3.6, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 0.3, 14]} />
          <meshStandardMaterial {...walnut} color="#5d4229" />
        </mesh>
      </group>
      {/* Cantonnière de rideau froncé au-dessus de l'armoire */}
      <group position={[2.95, 2.95, -3.3]}>
        <Valance width={4.5} />
      </group>

      {/* Mur droit : suite d'armoire + cantonnière */}
      <group position={[5.08, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0.05, 1.62, -0.1]} receiveShadow>
          <boxGeometry args={[3.4, 3.24, 0.14]} />
          <meshStandardMaterial {...walnutWall} color="#7a583a" />
        </mesh>
        {[-0.75, 0.85].map((z, i) => (
          <group key={i} position={[z, 1.98, 0]}>
            <ArchMirror w={1.0} h={1.7} />
          </group>
        ))}
        <group position={[0, 2.95, 0.1]}>
          <Valance width={3.4} />
        </group>
      </group>
      <Sconce position={[4.65, 2.6, -1.6]} />
      <Sconce position={[2.0, 2.75, -3.1]} />

      {/* ——— Lustre globe du plafond (haut de la photo) ——— */}
      <group position={[1.4, 4.2, 0.9]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.44]} />
          <meshStandardMaterial color="#a8853f" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.52, 0]}>
          <sphereGeometry args={[0.16, 24, 18]} />
          <meshPhysicalMaterial
            color="#fff4da"
            emissive="#ffd894"
            emissiveIntensity={2.6}
            transmission={0.4}
            roughness={0.15}
          />
        </mesh>
        <pointLight position={[0, -0.52, 0]} intensity={14} color="#ffdba2" distance={9} decay={2} castShadow />
      </group>
    </group>
  );
}
