import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { research } from "../research";
import { motion } from "../scroll";

function heat(t: number, target: THREE.Color) {
  const stops = [
    { at: -2.5, color: new THREE.Color("#2a1a28") },
    { at: -0.4, color: new THREE.Color("#8d3d55") },
    { at: 0.4, color: new THREE.Color("#e4b48a") },
    { at: 1.4, color: new THREE.Color("#ffc15a") },
    { at: 3.2, color: new THREE.Color("#f3ffcf") },
  ];
  const value = Math.min(stops[stops.length - 1].at, Math.max(stops[0].at, t));
  let index = 0;
  while (index < stops.length - 2 && value > stops[index + 1].at) index += 1;
  const span = stops[index + 1].at - stops[index].at || 1;
  const mix = (value - stops[index].at) / span;
  return target.copy(stops[index].color).lerp(stops[index + 1].color, mix);
}

export function Seismo({ compact }: { compact: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const field = research.seismo;
  const rows = field.values.length;
  const cols = field.symbols.length;
  const ready = rows >= 2 && cols >= 2;
  const segX = compact ? Math.max(cols * 2, 8) : cols * 4;
  const segZ = compact ? Math.max(rows * 2, 8) : rows * 3;

  const geometry = useMemo(() => {
    if (!ready) return null;
    const geo = new THREE.PlaneGeometry(9.2, 6.4, segX, segZ);
    geo.rotateX(-Math.PI / 2);
    const position = geo.attributes.position;
    const colors = new Float32Array(position.count * 3);
    const base = new Float32Array(position.count);
    const color = new THREE.Color();
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index);
      const z = position.getZ(index);
      const u = (x / 9.2 + 0.5) * (cols - 1);
      const v = (z / 6.4 + 0.5) * (rows - 1);
      const x0 = Math.max(0, Math.min(cols - 2, Math.floor(u)));
      const z0 = Math.max(0, Math.min(rows - 2, Math.floor(v)));
      const tx = u - x0;
      const tz = v - z0;
      const sample = (iz: number, ix: number) => field.values[iz]?.[ix] ?? 0;
      const height =
        sample(z0, x0) * (1 - tx) * (1 - tz) +
        sample(z0, x0 + 1) * tx * (1 - tz) +
        sample(z0 + 1, x0) * (1 - tx) * tz +
        sample(z0 + 1, x0 + 1) * tx * tz;
      base[index] = height * 0.42;
      position.setY(index, base[index]);
      heat(height, color).toArray(colors, index * 3);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    geo.userData.base = base;
    return geo;
  }, [cols, field.values, ready, rows, segX, segZ]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (!geometry) return;
    const position = geometry.attributes.position;
    const base = geometry.userData.base as Float32Array;
    const time = motion.reduced ? 0 : clock.elapsedTime;
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index);
      const z = position.getZ(index);
      const wave = motion.reduced ? 0 : Math.sin(x * 1.4 + time * 1.35) * Math.cos(z * 1.1 - time * 0.85) * (compact ? 0.035 : 0.055);
      position.setY(index, base[index] + wave);
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();
    if (mesh.current && !motion.reduced) mesh.current.rotation.y = Math.sin(time * 0.15) * 0.12;
  });

  if (!geometry) return null;

  return (
    <group ref={mesh} position={[compact ? 0 : 0.8, compact ? -0.35 : -0.55, 0]} scale={compact ? 0.78 : 1}>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.42} metalness={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#f6f1e7" wireframe transparent opacity={compact ? 0.06 : 0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <circleGeometry args={[5.4, compact ? 32 : 48]} />
        <meshBasicMaterial color="#121318" />
      </mesh>
    </group>
  );
}
