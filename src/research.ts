import rawJson from "./generated/research.json";
import { strategyName, symbolName } from "./format";
import type { ResearchFile } from "./types";

export const research = rawJson as unknown as ResearchFile;

export interface NodeRec {
  index: number;
  strategy: string;
  symbol: string;
  verdict: 0 | 1 | 2 | 3 | 4;
  oosT: number | null;
  oosPf: number | null;
  oosN: number | null;
  oosDd: number | null;
  oosWin: number | null;
  isT: number | null;
  isPf: number | null;
  fullDd: number | null;
  reason: string;
  params: string;
  p2: boolean;
  watch: boolean;
}

function nullable(value: number | null) {
  return value == null || Number.isNaN(value) ? null : value;
}

export const nodes: NodeRec[] = research.nodes.map((row, index) => ({
  index,
  strategy: research.strategies[row[0]] ?? "",
  symbol: research.symbols[row[1]] ?? "",
  verdict: row[2] as NodeRec["verdict"],
  oosT: nullable(row[3]),
  oosPf: nullable(row[4]),
  oosN: nullable(row[5]),
  oosDd: nullable(row[6]),
  oosWin: nullable(row[7]),
  isT: nullable(row[8]),
  isPf: nullable(row[9]),
  fullDd: nullable(row[10]),
  reason: row[11] >= 0 ? (research.reasons[row[11]] ?? "") : "",
  params: row[12] >= 0 ? (research.params[row[12]] ?? "") : "",
  p2: row[13] === 1,
  watch: row[14] === 1,
}));

export type FilterId = "all" | "keep" | "watch" | "discard" | "control" | "note" | "p2";

export function nodeMatches(node: NodeRec, filter: FilterId, query: string, market: string) {
  if (market && node.symbol !== market) return false;
  if (filter === "keep" && node.verdict !== 2) return false;
  if (filter === "watch" && node.verdict !== 1) return false;
  if (filter === "discard" && node.verdict !== 0) return false;
  if (filter === "control" && node.verdict !== 3) return false;
  if (filter === "note" && node.verdict !== 4) return false;
  if (filter === "p2" && !node.p2) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const blob = `${node.strategy} ${strategyName(node.strategy)} ${node.symbol} ${symbolName(node.symbol)}`.toLowerCase();
  return blob.includes(q);
}

export function gateRows(node: NodeRec) {
  const dd = node.fullDd ?? node.oosDd;
  return [
    {
      id: "t",
      label: "t fuera de muestra ≥ 1,5",
      ok: node.oosT == null ? null : node.oosT >= research.gates.t,
      text: node.oosT == null ? "sin dato" : node.oosT.toLocaleString("es-ES", { maximumFractionDigits: 2 }),
    },
    {
      id: "pf",
      label: "Profit factor ≥ 1,1",
      ok: node.oosPf == null ? null : node.oosPf >= research.gates.pf,
      text: node.oosPf == null ? "sin dato" : node.oosPf >= 1e8 ? "∞" : node.oosPf.toLocaleString("es-ES", { maximumFractionDigits: 2 }),
    },
    {
      id: "n",
      label: "Al menos 100 trades",
      ok: node.oosN == null ? null : node.oosN >= research.gates.trades,
      text: node.oosN == null ? "sin dato" : node.oosN.toLocaleString("es-ES"),
    },
    {
      id: "dd",
      label: "Drawdown ≤ 20 %",
      ok: dd == null ? null : dd <= research.gates.dd,
      text: dd == null ? "sin dato" : `${dd.toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`,
    },
  ];
}
