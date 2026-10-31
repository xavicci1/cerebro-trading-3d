import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "../palette";
import { motion } from "../scroll";
import { labelTexture } from "./textures";

const STEPS = [
  { x: -2.35, y: -1.15, label: "Salida" },
  { x: -0.75, y: -0.2, label: "36 %" },
  { x: 0.85, y: 0.75, label: "65 %" },
  { x: 2.45, y: 1.7, label: "77 %" },
];

export function Ladder({ compact }: { compact: boolean }) {
  const climber = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.PointLight>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => {
      if (live) setReady(true);
    });
    return () => {
      live = false;
    };
  }, []);

  const labels = useMemo(() => (ready ? STEPS.map((step) => labelTexture(step.label)) : []), [ready]);
  useEffect(() => () => labels.forEach((texture) => texture.dispose()), [labels]);

  const edges = useMemo(
    () => STEPS.map(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.45, 0.16, 0.95))),
    [],
  );
  useEffect(() => () => edges.forEach((geometry) => geometry.dispose()), [edges]);

  useFrame(({ clock }) => {
    if (!climber.current) return;
    const loop = motion.reduced ? 1 : (clock.elapsedTime % 11) / 11;
    const held = loop < 0.8 ? loop / 0.8 : 1;
    const eased = held * held * (3 - 2 * held);
    const cursor = eased * (STEPS.length - 1);
    const index = Math.min(STEPS.length - 2, Math.floor(cursor));
    const local = cursor - index;
    const from = STEPS[index];
    const to = STEPS[index + 1];
    const x = from.x + (to.x - from.x) * local;
    const y = from.y + (to.y - from.y) * local + 0.28;
    climber.current.position.set(x, y, 0);
    glow.current?.position.set(x, y, 0.2);
  });

  return (
    <group scale={compact ? 0.66 : 0.56} position={[compact ? 0.15 : 2.15, compact ? 0.2 : 0.35, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, -1.45, 0]}>
        <circleGeometry args={[2.5, 48]} />
        <meshBasicMaterial color="#12110f" />
      </mesh>
      {STEPS.map((step, index) => (
        <group key={step.label} position={[step.x, step.y, 0]}>
          <mesh>
            <boxGeometry args={[1.45, 0.16, 0.95]} />
            <meshStandardMaterial
              color={index === STEPS.length - 1 ? "#f3ffcf" : "#d9cbb8"}
              transparent
              opacity={0.28}
              roughness={0.25}
              metalness={0.35}
            />
          </mesh>
          <lineSegments geometry={edges[index]}>
            <lineBasicMaterial color={index === STEPS.length - 1 ? PALETTE.keep : "#f6efe4"} transparent opacity={0.8} />
          </lineSegments>
          {labels[index] && (
            <sprite position={[0, 0.48, 0]} scale={[1.15, 0.29, 1]}>
              <spriteMaterial map={labels[index]} transparent depthWrite={false} />
            </sprite>
          )}
        </group>
      ))}
      <mesh ref={climber} position={[STEPS[0].x, STEPS[0].y + 0.28, 0]}>
        <sphereGeometry args={[0.12, 20, 16]} />
        <meshStandardMaterial color="#f7ffd8" emissive={PALETTE.keep} emissiveIntensity={1.2} />
      </mesh>
      <pointLight ref={glow} color={PALETTE.keep} intensity={6} distance={4.5} />
    </group>
  );
}
