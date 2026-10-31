import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { bindZoom } from "../bridge";
import type { FilterId } from "../research";
import { motion, scrollState, type SceneId } from "../scroll";
import { Brain } from "./Brain";
import { Funnel } from "./Funnel";
import { Ladder } from "./Ladder";
import { Pipeline } from "./Pipeline";

export function Experience({
  scene,
  compact,
  filter,
  query,
  market,
  selected,
  onSelect,
  onStage,
}: {
  scene: SceneId;
  compact: boolean;
  filter: FilterId;
  query: string;
  market: string;
  selected: number | null;
  onSelect: (index: number | null) => void;
  onStage: (stage: number) => void;
}) {
  return (
    <>
      <color attach="background" args={["#08090b"]} />
      <fog attach="fog" args={["#08090b", 6, 20]} />
      <hemisphereLight args={["#f7f1e6", "#241820", 0.95]} />
      <directionalLight position={[4.5, 6, 3.5]} intensity={2.4} color={"#fff4e6"} />
      <pointLight position={[-2.2, 0.4, 1.4]} intensity={10} distance={9} color={"#ffd7a8"} />
      <pointLight position={[1.6, -0.4, 1.2]} intensity={8} distance={8} color={"#d6ff4a"} />
      <CameraRig compact={compact} />
      <Controls selected={selected} />
      <Dust compact={compact} />
      {(scene === "relato" || scene === "cerebro") && (
        <Brain filter={filter} query={query} market={market} selected={selected} onSelect={onSelect} />
      )}
      {scene === "tuberia" && <Pipeline compact={compact} onStage={onStage} />}
      {scene === "embudo" && <Funnel compact={compact} />}
      {scene === "escalera" && <Ladder compact={compact} />}
    </>
  );
}

function CameraRig({ compact }: { compact: boolean }) {
  const { camera, scene } = useThree();
  const look = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const fog = scene.fog as THREE.Fog;
    const live = scrollState.scene;
    if (live === "tuberia") {
      fog.near = 11;
      fog.far = 32;
    } else if (live === "embudo" || live === "escalera") {
      fog.near = 8;
      fog.far = 24;
    } else {
      fog.near = 5.5;
      fog.far = 16;
    }
    if (live === "cerebro") return;

    const story = scrollState.story;
    if (live === "relato") {
      desired.current.set(Math.sin(story * 0.7) * 0.7, compact ? 0.9 : 0.28, (compact ? 7.6 : 7.2) - story * 2.1);
      lookTarget.current.set(0, compact ? 0.5 : 0.05, 0);
    } else if (live === "tuberia") {
      desired.current.set(0, compact ? 0.85 : 0.5, compact ? 15 : 13.4);
      lookTarget.current.set(0, -0.15, 0);
    } else if (live === "embudo") {
      desired.current.set(compact ? 0.3 : 1.5, compact ? 0.35 : 0.15, compact ? 9.6 : 8.8);
      lookTarget.current.set(compact ? 0.2 : 1.35, -0.25, 0);
    } else {
      desired.current.set(compact ? 0.1 : 0.15, compact ? 1.05 : 1.15, compact ? 10.6 : 8.6);
      lookTarget.current.set(compact ? 0.15 : 0.45, 0.25, 0);
    }
    const gain = 1 - Math.exp(-delta * (motion.reduced ? 8 : 2.3));
    camera.position.lerp(desired.current, gain);
    look.current.lerp(lookTarget.current, gain);
    camera.lookAt(look.current);
  });

  return null;
}

function Controls({ selected }: { selected: number | null }) {
  const { camera, gl } = useThree();
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotateSpeed = 0.45;
    controls.minPolarAngle = 0.55;
    controls.maxPolarAngle = 2.15;
    controls.target.set(0, 0.05, 0);
    controls.enabled = false;

    const onWheel = (event: WheelEvent) => {
      if (scrollState.scene !== "cerebro") return;
      window.scrollBy({ top: event.deltaY, left: 0 });
    };
    gl.domElement.addEventListener("wheel", onWheel, { passive: true });

    bindZoom((factor) => {
      const offset = camera.position.clone().sub(controls.target);
      const distance = THREE.MathUtils.clamp(offset.length() * factor, 2.8, 9.2);
      offset.setLength(distance);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    });

    let frame = 0;
    const tick = () => {
      const live = scrollState.scene === "cerebro";
      controls.enabled = live;
      controls.autoRotate = live && selectedRef.current == null && !motion.reduced;
      if (live) controls.update();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      gl.domElement.removeEventListener("wheel", onWheel);
      controls.dispose();
      bindZoom(null);
    };
  }, [camera, gl]);

  return null;
}

function Dust({ compact }: { compact: boolean }) {
  const count = compact ? 50 : 110;
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 12;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, delta) => {
    if (points.current && !motion.reduced) points.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color="#f3ead8" size={0.018} transparent opacity={0.38} depthWrite={false} sizeAttenuation />
    </points>
  );
}
