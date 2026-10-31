export interface CuratedRow {
  index: number;
  strategy: string;
  symbol: string;
  title: string;
  blurb: string;
}

export interface Grave {
  id: string;
  title: string;
  detail: string;
  strategy: string;
  count: number;
  medianT: number | null;
  verdicts: Record<string, number>;
}

export interface Policy {
  id: string;
  source: string;
  p12: number | null;
  p18: number | null;
  p24: number | null;
  medianMonth: number | null;
  monthly: number | null;
  p25: number | null;
  fundedEnd: number | null;
  fees: number | null;
  breaches: number | null;
}

export interface FunnelStep {
  id: string;
  label: string;
  n: number;
  from: string;
}

export interface ResearchFile {
  asOf: string;
  counts: {
    rows: number;
    strategies: number;
    variants: number;
    batches: number;
    keep: number;
    watch: number;
    discard: number;
    control: number;
    note: number;
    p2: number;
  };
  gates: { t: number; pf: number; trades: number; dd: number };
  windows: { is: string; oos: string };
  sharpeP2: number;
  funnel: FunnelStep[];
  p2: CuratedRow[];
  watchlist: CuratedRow[];
  graveyard: Grave[];
  markets: { symbol: string; count: number }[];
  ladder: {
    targetMonthly: number;
    payoutStory: number;
    rounded: { p12: number; p18: number; p24: number };
    firms: string[];
    ftmo: { steps: number; risk: number; pass: number; days: number };
    noHedge: boolean;
    headline: Policy;
    policies: Policy[];
  };
  strategies: string[];
  symbols: string[];
  reasons: string[];
  params: string[];
  nodes: NodeTuple[];
}

export type NodeTuple = [
  number,
  number,
  number,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number,
  number,
  number,
  number,
];
