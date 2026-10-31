import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { bindZoom } from "../bridge";
import type { FilterId } from "../research";
import { INTERACTIVE, motion, scrollState, type SceneId } from "../scroll";
import { Bloom } from "./Bloom";
import { Brain } from "./Brain";
import { Funnel } from "./Funnel";
import { Ladder } from "./Ladder";
import { MonteCarlo } from "./MonteCarlo";
import { Pipeline } from "./Pipeline";
import { Seismo } from "./Seismo";

export function Experience({
  scene,
  compact,
  filter,
  query,
  market,
  selected,
  onSelect,
  onStage,
  emphasis,
}: {
  scene: SceneId;
  compact: boolean;
  filter: FilterId;
  query: string;
  market: string;
  selected: number | null;
  onSelect: (index: number | null) => void;
  onStage: (stage: number) => void;
  emphasis: ReadonlySet<number> | null;
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
      {(scene === "relato" || scene === "cerebro" || scene === "neuronas" || scene === "tesis") && (
        <Brain
          filter={scene === "neuronas" || scene === "tesis" ? "all" : filter}
          query={scene === "neuronas" || scene === "tesis" ? "" : query}
          market={scene === "neuronas" || scene === "tesis" ? "" : market}
          selected={selected}
          onSelect={onSelect}
          thinking={scene === "neuronas"}
          emphasis={scene === "tesis" ? emphasis : null}
          compact={compact}
        />
      )}
      {scene === "neuronas" && !compact && !motion.reduced && <Bloom />}
      {scene === "graficos" && <MonteCarlo compact={compact} />}
      {scene === "sismo" && <Seismo compact={compact} />}
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
    } else if (live === "graficos" || live === "sismo") {
      fog.near = 12;
      fog.far = 42;
    } else if (live === "embudo" || live === "escalera") {
      fog.near = 8;
      fog.far = 24;
    } else if (live === "neuronas") {
      fog.near = 2.4;
      fog.far = 12;
    } else {
      fog.near = 5.5;
      fog.far = 16;
    }
    if (INTERACTIVE.includes(live)) return;

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

function frameFor(scene: SceneId, compact: boolean) {
  if (scene === "neuronas") return { position: new THREE.Vector3(0.15, 0.22, compact ? 4.5 : 3.15), target: new THREE.Vector3(0, 0.05, 0) };
  if (scene === "graficos") return { position: new THREE.Vector3(6.4, 3.4, compact ? 7.6 : 6.2), target: new THREE.Vector3(0, 0.15, 0) };
  if (scene === "sismo") return { position: new THREE.Vector3(5.2, 3.8, compact ? 7.2 : 6.4), target: new THREE.Vector3(0.4, 0, 0) };
  return { position: new THREE.Vector3(0.2, 0.4, compact ? 7.6 : 7.2), target: new THREE.Vector3(0, 0.05, 0) };
}

function Controls({ selected }: { selected: number | null }) {
  const { camera, gl } = useThree();
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.7;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotateSpeed = 0.45;
    controls.minDistance = 1.7;
    controls.maxDistance = 16;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = 2.25;
    controls.target.set(0, 0.05, 0);
    controls.enabled = false;
    controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

    bindZoom((factor) => {
      const offset = camera.position.clone().sub(controls.target);
      const distance = THREE.MathUtils.clamp(offset.length() * factor, 1.8, 16);
      offset.setLength(distance);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    });

    let frame = 0;
    let framed = "";
    const tick = () => {
      const live = INTERACTIVE.includes(scrollState.scene);
      controls.enabled = live;
      controls.autoRotate = scrollState.scene === "cerebro" && selectedRef.current == null && !motion.reduced;
      if (live && framed !== scrollState.scene) {
        const next = frameFor(scrollState.scene, window.innerWidth <= 800);
        camera.position.copy(next.position);
        controls.target.copy(next.target);
        framed = scrollState.scene;
      }
      if (live) controls.update();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
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
