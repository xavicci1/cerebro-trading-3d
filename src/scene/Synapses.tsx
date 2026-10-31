import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Placed } from "../layoutBrain";
import { nodes } from "../research";
import { PALETTE } from "../palette";
import { motion } from "../scroll";

function edgeKey(a: number, b: number) {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

export function Synapses({ placed, compact }: { placed: Placed[]; compact: boolean }) {
  const pulses = useRef<THREE.InstancedMesh>(null);
  const flash = useRef<THREE.LineSegments>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const sample = compact ? 70 : 180;
  const pulseCount = compact ? 24 : 72;

  const edges = useMemo(() => {
    const preferred: number[] = [];
    const rest: number[] = [];
    nodes.forEach((node, index) => {
      if (node.p2 || node.verdict === 2 || node.verdict === 1) preferred.push(index);
      else if (index % (compact ? 16 : 8) === 0) rest.push(index);
    });
    const picks = [...preferred.slice(0, compact ? 36 : 80), ...rest].slice(0, sample);
    const found: [number, number][] = [];
    const seen = new Set<string>();
    for (const origin of picks) {
      let first = -1;
      let second = -1;
      let best = Infinity;
      let next = Infinity;
      const a = placed[origin];
      for (const other of picks) {
        if (other === origin) continue;
        const b = placed[other];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const dist = dx * dx + dy * dy + dz * dz;
        if (dist < best) {
          next = best;
          second = first;
          best = dist;
          first = other;
        } else if (dist < next) {
          next = dist;
          second = other;
        }
      }
      for (const other of [first, second]) {
        if (other < 0) continue;
        const key = edgeKey(origin, other);
        if (seen.has(key)) continue;
        seen.add(key);
        found.push([origin, other]);
      }
    }
    return found;
  }, [compact, placed, sample]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 2 * 3);
    edges.forEach(([from, to], index) => {
      const a = placed[from];
      const b = placed[to];
      const offset = index * 6;
      positions[offset] = a.x;
      positions[offset + 1] = a.y;
      positions[offset + 2] = a.z;
      positions[offset + 3] = b.x;
      positions[offset + 4] = b.y;
      positions[offset + 5] = b.z;
    });
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [edges, placed]);

  const pulseGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);
  const pulseMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#f3ffcf",
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  const flashGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(8 * 2 * 3), 3));
    geometry.setDrawRange(0, 0);
    return geometry;
  }, []);

  useEffect(
    () => () => {
      lineGeometry.dispose();
      flashGeometry.dispose();
      pulseGeometry.dispose();
      pulseMaterial.dispose();
    },
    [lineGeometry, flashGeometry, pulseGeometry, pulseMaterial],
  );

  useFrame(({ clock }) => {
    const mesh = pulses.current;
    if (!mesh || !edges.length) return;
    const travel = motion.reduced ? 0.35 : (clock.elapsedTime * 0.37) % 1;
    for (let index = 0; index < pulseCount; index += 1) {
      const edge = edges[(index * 7) % edges.length];
      const a = placed[edge[0]];
      const b = placed[edge[1]];
      const t = (travel + index / pulseCount) % 1;
      dummy.position.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
      const scale = 0.045 + (index % 5) * 0.008;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    const flashMesh = flash.current;
    if (!flashMesh || motion.reduced) return;
    const phase = clock.elapsedTime % 0.55;
    const visible = phase < 0.16;
    const material = flashMesh.material as THREE.LineBasicMaterial;
    material.opacity = visible ? 0.95 * (1 - phase / 0.16) : 0;
    if (!visible) return;
    const bolt = Math.floor(clock.elapsedTime / 0.55);
    const array = flashGeometry.attributes.position.array as Float32Array;
    const bolts = compact ? 2 : 4;
    for (let index = 0; index < bolts; index += 1) {
      const edge = edges[(bolt * 3 + index * 11) % edges.length];
      const a = placed[edge[0]];
      const b = placed[edge[1]];
      const offset = index * 6;
      array[offset] = a.x;
      array[offset + 1] = a.y;
      array[offset + 2] = a.z;
      array[offset + 3] = b.x;
      array[offset + 4] = b.y;
      array[offset + 5] = b.z;
    }
    flashGeometry.setDrawRange(0, bolts * 2);
    flashGeometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={PALETTE.keep} transparent opacity={compact ? 0.18 : 0.28} />
      </lineSegments>
      <lineSegments ref={flash} geometry={flashGeometry}>
        <lineBasicMaterial color="#f7ffd8" transparent opacity={0} />
      </lineSegments>
      <instancedMesh ref={pulses} args={[pulseGeometry, pulseMaterial, pulseCount]} />
    </>
  );
}
