import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STAGES } from "../copy";
import { PALETTE } from "../palette";
import { motion } from "../scroll";
import { createSoftMaterial } from "./textures";

const X0 = -5.6;
const SPAN = 11.2;

function pointAt(t: number, target: THREE.Vector3) {
  const wrapped = ((t % 1) + 1) % 1;
  target.set(
    X0 + wrapped * SPAN,
    Math.sin(wrapped * Math.PI * 2) * 0.42,
    Math.sin(wrapped * Math.PI * 4) * 0.28,
  );
  return wrapped;
}

export function Pipeline({
  compact,
  onStage,
}: {
  compact: boolean;
  onStage: (stage: number) => void;
}) {
  const count = compact ? 90 : 180;
  const material = useMemo(() => createSoftMaterial(), []);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const ink = new THREE.Color(PALETTE.ink);
    const keep = new THREE.Color(PALETTE.keep);
    const copper = new THREE.Color(PALETTE.copper);
    for (let index = 0; index < count; index += 1) {
      const mix = index / count;
      const color = mix > 0.86 ? keep : mix > 0.5 ? copper : ink;
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
      sizes[index] = 3.2 + (index % 4) * 0.7;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count]);

  const monuments = useMemo(
    () =>
      STAGES.map(() =>
        new THREE.MeshStandardMaterial({
          color: "#d9cbb8",
          emissive: PALETTE.keep,
          emissiveIntensity: 0.05,
          roughness: 0.45,
          metalness: 0.18,
        }),
      ),
    [],
  );

  const cursor = useRef(new THREE.Vector3());
  const stageRef = useRef(-1);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      monuments.forEach((item) => item.dispose());
    };
  }, [geometry, material, monuments]);

  useFrame(({ clock }) => {
    const cycle = motion.reduced ? 0.62 : (clock.elapsedTime % 18) / 18;
    const stage = Math.min(STAGES.length - 1, Math.floor(cycle * STAGES.length));
    if (stage !== stageRef.current) {
      stageRef.current = stage;
      onStage(stage);
    }
    monuments.forEach((item, index) => {
      const target = index === stage ? 1.35 : 0.04;
      item.emissiveIntensity += (target - item.emissiveIntensity) * (motion.reduced ? 1 : 0.08);
    });
    const positions = geometry.attributes.position.array as Float32Array;
    for (let index = 0; index < count; index += 1) {
      const phase = index / count;
      const travel = motion.reduced ? phase * 0.92 : phase * 0.92 + cycle;
      pointAt(travel, cursor.current);
      positions[index * 3] = cursor.current.x;
      positions[index * 3 + 1] = cursor.current.y;
      positions[index * 3 + 2] = cursor.current.z;
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group scale={compact ? 0.92 : 1}>
      <points geometry={geometry} material={material} />
      {STAGES.map((stage, index) => {
        const x = X0 + ((index + 0.5) / STAGES.length) * SPAN;
        return (
          <mesh key={stage.id} position={[x, -0.85, 0]} material={monuments[index]}>
            <boxGeometry args={[0.18, 1.15, 0.18]} />
          </mesh>
        );
      })}
    </group>
  );
}
