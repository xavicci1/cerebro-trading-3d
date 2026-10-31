import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { placeNodes } from "../layoutBrain";
import { PALETTE } from "../palette";
import { nodes, nodeMatches, research, type FilterId } from "../research";
import { motion, scrollState } from "../scroll";
import { Synapses } from "./Synapses";
import { getGlowTexture } from "./textures";

function smooth(value: number) {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped * clamped * (3 - 2 * clamped);
}

const COLORS = [
  new THREE.Color(PALETTE.discard),
  new THREE.Color(PALETTE.watch),
  new THREE.Color(PALETTE.keep),
  new THREE.Color(PALETTE.control),
  new THREE.Color(PALETTE.note),
];

export function Brain({
  filter,
  query,
  market,
  selected,
  onSelect,
  thinking = false,
  emphasis = null,
  compact = false,
}: {
  filter: FilterId;
  query: string;
  market: string;
  selected: number | null;
  onSelect: (index: number | null) => void;
  thinking?: boolean;
  emphasis?: ReadonlySet<number> | null;
  compact?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const nucleus = useRef<THREE.Sprite>(null);
  const assemble = useRef(scrollState.scene === "relato" ? smooth(scrollState.story) : 1);
  const spin = useRef(scrollState.scene === "relato" ? scrollState.story * 0.5 : 0.5);
  const dirty = useRef(true);
  const bounded = useRef(false);
  const pressed = useRef({ x: 0, y: 0, hit: false });
  const lastSelected = useRef<number | null>(null);
  const emphasisRef = useRef(emphasis);
  emphasisRef.current = emphasis;
  const thinkingRef = useRef(thinking);
  thinkingRef.current = thinking;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const placed = useMemo(() => placeNodes(nodes), []);
  const mask = useMemo(() => {
    const next = new Uint8Array(nodes.length);
    nodes.forEach((node, index) => {
      next[index] = nodeMatches(node, filter, query, market) ? 1 : 0;
    });
    return next;
  }, [filter, query, market]);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.42,
        metalness: 0.08,
      }),
    [],
  );

  const p2 = research.p2.map((item) => item.index);
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(p2.length * 2 * 3), 3));
    return geo;
  }, [p2.length]);
  const lineMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: PALETTE.keep, transparent: true, opacity: 0.0 }),
    [],
  );

  useLayoutEffect(() => {
    dirty.current = true;
  }, [mask, emphasis, thinking]);

  useLayoutEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, [geometry, material, lineGeometry, lineMaterial]);

  useFrame((_, delta) => {
    const target = scrollState.scene === "relato" ? smooth(scrollState.story) : 1;
    const gain = motion.reduced ? 1 : 1 - Math.exp(-delta * 2.4);
    assemble.current += (target - assemble.current) * gain;
    const spinTarget = scrollState.scene === "relato" ? scrollState.story * 0.5 : 0.5;
    spin.current += (spinTarget - spin.current) * gain;
    if (group.current) group.current.rotation.y = spin.current;

    const ease = assemble.current;
    const forming = ease < 0.995 || scrollState.scene === "relato";
    const instanced = mesh.current;
    if (!instanced) return;
    const emph = emphasisRef.current;
    const pulseEmph = Boolean(emph && emph.size > 0 && emph.size <= 80);

    if (forming || dirty.current || pulseEmph) {
      for (let index = 0; index < nodes.length; index += 1) {
        const lit = !emph || emph.has(index);
        const pulse = lit && pulseEmph ? 1.22 + Math.sin(performance.now() * 0.005 + index) * 0.08 : 1;
        writeInstance(index, ease, pulse, lit);
        const dim = lit ? (mask[index] ? (thinkingRef.current ? 1.35 : 1) : 0.16) : 0.08;
        const fade = 0.2 + 0.8 * ease;
        color.copy(COLORS[nodes[index].verdict]).multiplyScalar(dim * fade);
        instanced.setColorAt(index, color);
      }
      instanced.instanceMatrix.needsUpdate = true;
      if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
      if (!bounded.current) {
        instanced.computeBoundingSphere();
        bounded.current = true;
      }
      dirty.current = forming;
      writeLines(ease);
      lastSelected.current = selected;
    } else if (selected !== lastSelected.current || selected != null) {
      if (lastSelected.current != null && lastSelected.current !== selected) writeInstance(lastSelected.current, 1, 1);
      if (selected != null) {
        const pulse = 1 + Math.sin(performance.now() * 0.006) * 0.14;
        writeInstance(selected, 1, pulse);
      }
      lastSelected.current = selected;
      instanced.instanceMatrix.needsUpdate = true;
    }

    if (nucleus.current) {
      const visible = ease > 0.45 ? Math.min(1, (ease - 0.45) / 0.4) : 0;
      const beat = motion.reduced ? 1 : 1 + Math.sin(performance.now() * 0.0016) * 0.06;
      nucleus.current.scale.setScalar(1.35 * beat);
      const sprite = nucleus.current.material as THREE.SpriteMaterial;
      sprite.opacity = 0.8 * visible;
    }
    lineMaterial.opacity = ease > 0.84 ? ((ease - 0.84) / 0.16) * 0.75 : 0;
  });

  function writeInstance(index: number, ease: number, pulse: number, lit = true) {
    const spot = placed[index];
    const shown = lit ? (mask[index] ? 1 : 0.28) : 0.2;
    dummy.position.set(
      spot.sx + (spot.x - spot.sx) * ease,
      spot.sy + (spot.y - spot.sy) * ease,
      spot.sz + (spot.z - spot.sz) * ease,
    );
    dummy.scale.setScalar(spot.scale * (0.2 + 0.8 * ease) * shown * pulse);
    dummy.updateMatrix();
    mesh.current?.setMatrixAt(index, dummy.matrix);
  }

  function writeLines(ease: number) {
    const array = lineGeometry.attributes.position.array as Float32Array;
    for (let edge = 0; edge < p2.length; edge += 1) {
      const a = placed[p2[edge]];
      const b = placed[p2[(edge + 1) % p2.length]];
      const offset = edge * 6;
      array[offset] = a.sx + (a.x - a.sx) * ease;
      array[offset + 1] = a.sy + (a.y - a.sy) * ease;
      array[offset + 2] = a.sz + (a.z - a.sz) * ease;
      array[offset + 3] = b.sx + (b.x - b.sx) * ease;
      array[offset + 4] = b.sy + (b.y - b.sy) * ease;
      array[offset + 5] = b.sz + (b.z - b.sz) * ease;
    }
    lineGeometry.attributes.position.needsUpdate = true;
  }

  return (
    <group ref={group}>
      <instancedMesh
        ref={mesh}
        args={[geometry, material, nodes.length]}
        onPointerDown={(event) => {
          pressed.current.x = event.clientX;
          pressed.current.y = event.clientY;
          pressed.current.hit = true;
        }}
        onClick={(event) => {
          event.stopPropagation();
          const id = event.instanceId;
          if (!pressed.current.hit || id == null || !mask[id]) return;
          const dx = event.clientX - pressed.current.x;
          const dy = event.clientY - pressed.current.y;
          pressed.current.hit = false;
          if (dx * dx + dy * dy > 64) return;
          onSelect(id === selected ? null : id);
        }}
      />
      <lineSegments geometry={lineGeometry} material={lineMaterial} />
      {thinking && <Synapses placed={placed} compact={compact} />}
      <sprite ref={nucleus} scale={[1.35, 1.35, 1]}>
        <spriteMaterial
          map={getGlowTexture()}
          color={PALETTE.keep}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0}
        />
      </sprite>
    </group>
  );
}
