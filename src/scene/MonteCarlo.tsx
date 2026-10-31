import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { research } from "../research";
import { motion } from "../scroll";

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * v);
}

export function MonteCarlo({ compact }: { compact: boolean }) {
  const lines = useRef<THREE.Group>(null);
  const band = useRef<THREE.Mesh>(null);
  const median = useRef<THREE.LineSegments>(null);
  const fan = research.fan;
  const paths = compact ? 760 : 2200;
  const steps = fan.months;

  const built = useMemo(() => {
    const rand = mulberry32(20261031);
    const series = new Float32Array(paths * (steps + 1));
    for (let path = 0; path < paths; path += 1) {
      let equity = 1;
      series[path * (steps + 1)] = 1;
      for (let step = 1; step <= steps; step += 1) {
        const shock = fan.monthlyDrift + fan.monthlyVol * gaussian(rand);
        equity = Math.min(6.5, Math.max(0.15, equity * (1 + shock)));
        series[path * (steps + 1) + step] = equity;
      }
    }

    const xOf = (step: number) => -5.4 + (step / steps) * 10.8;
    const yOf = (equity: number) => Math.log(equity) * 1.65;
    const zOf = (path: number, equity: number) => ((path / (paths - 1)) - 0.5) * 7.2 + (equity >= 1 ? 0.35 : -0.35);

    const positions = new Float32Array(paths * steps * 2 * 3);
    const colors = new Float32Array(paths * steps * 2 * 3);
    const progress = new Float32Array(paths * steps * 2);
    const up = new THREE.Color("#d6ff4a");
    const down = new THREE.Color("#c98498");
    const hot = new THREE.Color("#f7ffd8");
    const color = new THREE.Color();

    for (let path = 0; path < paths; path += 1) {
      const base = path * (steps + 1);
      const finalEquity = series[base + steps];
      color.copy(finalEquity >= 1 ? up : down);
      if (finalEquity > 1.8) color.lerp(hot, Math.min(1, (finalEquity - 1.8) / 2));
      for (let step = 0; step < steps; step += 1) {
        const vertex = (path * steps + step) * 2;
        const left = series[base + step];
        const right = series[base + step + 1];
        positions[vertex * 3] = xOf(step);
        positions[vertex * 3 + 1] = yOf(left);
        positions[vertex * 3 + 2] = zOf(path, finalEquity);
        positions[(vertex + 1) * 3] = xOf(step + 1);
        positions[(vertex + 1) * 3 + 1] = yOf(right);
        positions[(vertex + 1) * 3 + 2] = zOf(path, finalEquity);
        color.toArray(colors, vertex * 3);
        color.toArray(colors, (vertex + 1) * 3);
        progress[vertex] = step / steps;
        progress[vertex + 1] = (step + 1) / steps;
      }
    }

    const low: number[] = [];
    const mid: number[] = [];
    const high: number[] = [];
    const scratch = new Float32Array(paths);
    for (let step = 0; step <= steps; step += 1) {
      for (let path = 0; path < paths; path += 1) scratch[path] = series[path * (steps + 1) + step];
      scratch.sort();
      low.push(scratch[Math.floor(paths * 0.1)]);
      mid.push(scratch[Math.floor(paths * 0.5)]);
      high.push(scratch[Math.floor(paths * 0.9)]);
    }

    const bandPositions = new Float32Array((steps + 1) * 2 * 3);
    const bandProgress = new Float32Array((steps + 1) * 2);
    for (let step = 0; step <= steps; step += 1) {
      const vertex = step * 2;
      bandPositions[vertex * 3] = xOf(step);
      bandPositions[vertex * 3 + 1] = yOf(low[step]);
      bandPositions[vertex * 3 + 2] = 0.02;
      bandPositions[(vertex + 1) * 3] = xOf(step);
      bandPositions[(vertex + 1) * 3 + 1] = yOf(high[step]);
      bandPositions[(vertex + 1) * 3 + 2] = 0.02;
      bandProgress[vertex] = step / steps;
      bandProgress[vertex + 1] = step / steps;
    }

    const medianPositions = new Float32Array(steps * 2 * 3);
    const medianProgress = new Float32Array(steps * 2);
    for (let step = 0; step < steps; step += 1) {
      const vertex = step * 2;
      medianPositions[vertex * 3] = xOf(step);
      medianPositions[vertex * 3 + 1] = yOf(mid[step]);
      medianPositions[vertex * 3 + 2] = 0.08;
      medianPositions[(vertex + 1) * 3] = xOf(step + 1);
      medianPositions[(vertex + 1) * 3 + 1] = yOf(mid[step + 1]);
      medianPositions[(vertex + 1) * 3 + 2] = 0.08;
      medianProgress[vertex] = step / steps;
      medianProgress[vertex + 1] = (step + 1) / steps;
    }

    return { positions, colors, progress, bandPositions, bandProgress, medianPositions, medianProgress };
  }, [fan.monthlyDrift, fan.monthlyVol, paths, steps]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(built.positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(built.colors, 3));
    geometry.setAttribute("aT", new THREE.BufferAttribute(built.progress, 1));
    return geometry;
  }, [built]);

  const bandGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(built.bandPositions, 3));
    geometry.setAttribute("aT", new THREE.BufferAttribute(built.bandProgress, 1));
    geometry.setIndex(
      Array.from({ length: steps }, (_, step) => [step * 2, step * 2 + 1, step * 2 + 2, step * 2 + 1, step * 2 + 3, step * 2 + 2]).flat(),
    );
    return geometry;
  }, [built, steps]);

  const medianGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(built.medianPositions, 3));
    geometry.setAttribute("aT", new THREE.BufferAttribute(built.medianProgress, 1));
    return geometry;
  }, [built]);

  const lineMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uReveal: { value: motion.reduced ? 1 : 0 } },
        vertexShader: `
          attribute float aT;
          attribute vec3 aColor;
          varying float vT;
          varying vec3 vColor;
          void main() {
            vT = aT;
            vColor = aColor;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uReveal;
          varying float vT;
          varying vec3 vColor;
          void main() {
            if (vT > uReveal) discard;
            gl_FragColor = vec4(vColor, 0.07);
          }
        `,
      }),
    [],
  );

  const bandMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        uniforms: { uReveal: { value: motion.reduced ? 1 : 0 } },
        vertexShader: `
          attribute float aT;
          varying float vT;
          void main() {
            vT = aT;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uReveal;
          varying float vT;
          void main() {
            if (vT > uReveal) discard;
            gl_FragColor = vec4(0.89, 0.71, 0.54, 0.16);
          }
        `,
      }),
    [],
  );

  const medianMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uReveal: { value: motion.reduced ? 1 : 0 } },
        vertexShader: `
          attribute float aT;
          varying float vT;
          void main() {
            vT = aT;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uReveal;
          varying float vT;
          void main() {
            if (vT > uReveal) discard;
            gl_FragColor = vec4(0.84, 1.0, 0.29, 1.0);
          }
        `,
      }),
    [],
  );

  useEffect(
    () => () => {
      lineGeometry.dispose();
      bandGeometry.dispose();
      medianGeometry.dispose();
      lineMaterial.dispose();
      bandMaterial.dispose();
      medianMaterial.dispose();
    },
    [lineGeometry, bandGeometry, medianGeometry, lineMaterial, bandMaterial, medianMaterial],
  );

  useFrame(({ clock }) => {
    const reveal = motion.reduced ? 1 : Math.min(1, (clock.elapsedTime % 16) / 11);
    lineMaterial.uniforms.uReveal.value = reveal;
    bandMaterial.uniforms.uReveal.value = reveal;
    medianMaterial.uniforms.uReveal.value = reveal;
    if (lines.current && !motion.reduced) lines.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.08;
  });

  return (
    <group ref={lines} position={[compact ? 0 : 1.1, compact ? -0.2 : -0.35, 0]} scale={compact ? 0.72 : 1}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]}>
        <planeGeometry args={[12, 5]} />
        <meshBasicMaterial color="#101114" />
      </mesh>
      <mesh ref={band} geometry={bandGeometry} material={bandMaterial} />
      <lineSegments geometry={lineGeometry} material={lineMaterial} />
      <lineSegments ref={median} geometry={medianGeometry} material={medianMaterial} />
    </group>
  );
}
