"use client";

import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { ASSET_PREFIX } from "@/lib/site";

/* Textures PBR (CC0 ambientCG) préparées par usage. */

function tune(t: THREE.Texture, rx: number, ry: number, color = false) {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function useParquet() {
  const maps = useTexture({
    map: `${ASSET_PREFIX}/textures/parquet_color.jpg`,
    normalMap: `${ASSET_PREFIX}/textures/parquet_normal.jpg`,
    roughnessMap: `${ASSET_PREFIX}/textures/parquet_rough.jpg`,
  });
  tune(maps.map, 3.4, 2.4, true);
  tune(maps.normalMap, 3.4, 2.4);
  tune(maps.roughnessMap, 3.4, 2.4);
  return maps;
}

export function useWalnut(rx = 2, ry = 1.4) {
  const maps = useTexture({
    map: `${ASSET_PREFIX}/textures/wood_color.jpg`,
    normalMap: `${ASSET_PREFIX}/textures/wood_normal.jpg`,
    roughnessMap: `${ASSET_PREFIX}/textures/wood_rough.jpg`,
  });
  tune(maps.map, rx, ry, true);
  tune(maps.normalMap, rx, ry);
  tune(maps.roughnessMap, rx, ry);
  return maps;
}

export function useCurtainFabric() {
  const maps = useTexture({
    map: `${ASSET_PREFIX}/textures/curtain_color.jpg`,
    normalMap: `${ASSET_PREFIX}/textures/curtain_normal.jpg`,
  });
  tune(maps.map, 2.5, 1.6, true);
  tune(maps.normalMap, 2.5, 1.6);
  return maps;
}

export function useRug() {
  const maps = useTexture({
    map: `${ASSET_PREFIX}/textures/rug_color.jpg`,
    normalMap: `${ASSET_PREFIX}/textures/rug_normal.jpg`,
  });
  tune(maps.map, 1, 1, true);
  tune(maps.normalMap, 1, 1);
  return maps;
}

export function useVelvet(rx = 1.5, ry = 1.5) {
  const maps = useTexture({
    map: `${ASSET_PREFIX}/textures/velvet_color.jpg`,
    normalMap: `${ASSET_PREFIX}/textures/velvet_normal.jpg`,
  });
  tune(maps.map, rx, ry, true);
  tune(maps.normalMap, rx, ry);
  return maps;
}
