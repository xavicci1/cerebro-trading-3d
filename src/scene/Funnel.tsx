import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "../palette";
import { research } from "../research";
import { motion } from "../scroll";
import { createSoftMaterial } from "./textures";

const TOP = 2.45;
const BOTTOM = -2.05;

function radiusAt(y: number) {
  const u = (TOP - y) / (TOP - BOTTOM);
  return 2.05 * (1 - u) + 0.08;
}

function lifeOf(seed: number) {
  if (seed < 0.7) return 0.05 + seed * 0.28;
  if (seed < 0.9) return 0.32 + (seed - 0.7) * 1.6;
  return 0.78 + (seed - 0.9) * 2.1;
}

export function Funnel({ compact }: { compact: boolean }) {
  const count = compact ? 340 : 860;
  const material = useMemo(() => createSoftMaterial(), []);
  const spec = useMemo(() => {
    const items = [];
    for (let index = 0; index < count; index += 1) {
      const seed = ((index * 47) % 1000) / 1000;
      items.push({
        angle: index * 2.399963229728653,
        life: Math.min(0.98, lifeOf(seed)),
        speed: 0.28 + (index % 7) * 0.035,
        y: TOP - seed * 3.2,
      });
    }
    return items;
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const rose = new THREE.Color("#ff7d8d");
    const keep = new THREE.Color(PALETTE.keep);
    const ink = new THREE.Color("#f3eadc");
    spec.forEach((item, index) => {
      const color = item.life > 0.8 ? keep : item.life > 0.4 ? ink : rose;
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
      sizes[index] = item.life > 0.8 ? 6.5 : 3.4;
    });
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count, spec]);

  const rings = useMemo(() => {
    const steps = research.funnel.length;
    return research.funnel.map((_, index) => {
      const u = index / (steps - 1);
      const y = TOP - u * (TOP - BOTTOM);
      return { y, radius: radiusAt(y), last: index === steps - 1 };
    });
  }, []);

  const orbMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f4ffd2",
        emissive: PALETTE.keep,
        emissiveIntensity: 0.85,
        roughness: 0.28,
        metalness: 0.05,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      orbMaterial.dispose();
    };
  }, [geometry, material, orbMaterial]);

  const clock = useRef(0);
  useFrame((_, delta) => {
    const step = motion.reduced ? 0 : delta;
    clock.current += step;
    const positions = geometry.attributes.position.array as Float32Array;
    spec.forEach((item, index) => {
      if (!motion.reduced) item.y -= delta * item.speed;
      const death = TOP - item.life * (TOP - BOTTOM);
      if (item.y < death) item.y = TOP;
      const radius = radiusAt(item.y);
      const wobble = motion.reduced ? 0 : Math.sin(clock.current * 0.7 + item.angle) * 0.03;
      positions[index * 3] = Math.cos(item.angle) * (radius + wobble);
      positions[index * 3 + 1] = item.y;
      positions[index * 3 + 2] = Math.sin(item.angle) * (radius + wobble);
    });
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group scale={compact ? 0.78 : 0.92} position={[compact ? 0.2 : 1.35, 0, 0]}>
      <points geometry={geometry} material={material} />
      {rings.map((ring) => (
        <mesh key={ring.y} position={[0, ring.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.radius, ring.last ? 0.02 : 0.008, 8, 72]} />
          <meshBasicMaterial color={ring.last ? PALETTE.keep : "#f0e2c8"} transparent opacity={ring.last ? 0.95 : 0.38} />
        </mesh>
      ))}
      {research.p2.map((item, index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        const x = (column - 1) * 1.25;
        const y = -2.55 - row * 0.48;
        return (
          <mesh key={item.index} position={[x, y, 0]} material={orbMaterial}>
            <sphereGeometry args={[0.11, 18, 14]} />
          </mesh>
        );
      })}
    </group>
  );
}
