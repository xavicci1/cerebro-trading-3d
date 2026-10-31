import type { NodeRec } from "./research";

export interface Placed {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
  scale: number;
}

function hash(i: number) {
  let x = Math.imul(i + 1, 374761393);
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967295;
}

const SCALE = [0.048, 0.066, 0.098, 0.054, 0.046];

export function placeNodes(nodes: NodeRec[]): Placed[] {
  const count = nodes.length;
  const rank = new Array<number>(count);
  const order = nodes.map((_, index) => index).sort((a, b) => hash(a) - hash(b));
  order.forEach((index, position) => {
    rank[index] = position;
  });

  return nodes.map((node, index) => {
    const k = rank[index] + 0.5;
    const y0 = 1 - (2 * k) / count;
    const ring = Math.sqrt(Math.max(0, 1 - y0 * y0));
    const theta = k * 2.399963229728653;
    let x = Math.cos(theta) * ring;
    let z = Math.sin(theta) * ring;
    const lobe = x >= 0 ? 1 : -1;
    x = x * 0.58 + lobe * 0.46;
    let y = y0 * 0.96;
    z *= 0.62;
    if (y < -0.32) {
      const t = Math.min(1, (-0.32 - y) / 0.7);
      z -= 0.34 * t;
      x *= 1 - 0.18 * t;
    }
    const fold = 1 + 0.055 * Math.sin(theta * 5.5) * Math.cos(y0 * 7.5);
    const shell = node.verdict === 2 ? 0.58 : node.verdict === 1 ? 0.82 : node.verdict === 3 ? 1.12 : node.verdict === 4 ? 1.04 : 1;
    const radius = 1.65 * fold * shell;
    return {
      x: x * radius,
      y: y * radius * 0.78,
      z: z * radius,
      sx: (hash(index + 99) - 0.5) * 9,
      sy: (hash(index + 149) - 0.5) * 6,
      sz: (hash(index + 211) - 0.5) * 7,
      scale: SCALE[node.verdict] ?? 0.04,
    };
  });
}
