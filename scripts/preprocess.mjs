/**
 * Compacta el registro, las escaleras y el resumen en src/generated/research.json.
 * Los conteos del embudo salen del CSV. Las cifras de relato (15.575 pruebas,
 * Sharpe, FTMO, 30.000 USD) salen del resumen y se contrastan con las escaleras.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rawDir = path.join(root, "data", "raw");
const outFile = path.join(root, "src", "generated", "research.json");

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else quoted = false;
      } else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cur);
      cur = "";
    } else if (c === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (c !== "\r") cur += c;
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  const useful = rows.filter((r) => r.some((cell) => cell.length));
  const [header, ...body] = useful;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

function rawNum(value) {
  if (value == null || value === "") return null;
  const token = String(value).trim().toLowerCase();
  if (token === "inf" || token === "infinity") return Infinity;
  if (token === "-inf" || token === "-infinity") return -Infinity;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function num(value) {
  const n = rawNum(value);
  if (n == null) return null;
  if (n === Infinity) return 1e9;
  if (n === -Infinity) return -1e9;
  return Math.round(n * 10000) / 10000;
}

function intish(value) {
  const n = num(value);
  return n == null ? null : Math.round(n);
}

function verdictCode(verdict) {
  const s = verdict.trim();
  if (s === "KEEP") return 2;
  if (s === "WATCH" || s === "WATCHLIST" || s.startsWith("DISCARD (WATCH")) return 1;
  if (s === "CONTROL" || s === "NEG-CONTROL") return 3;
  if (s === "NOTE" || s === "NOTE/CONFLICT" || s === "UNTESTABLE") return 4;
  return 0;
}

function median(values) {
  const xs = values.filter((v) => v != null).sort((a, b) => a - b);
  if (!xs.length) return null;
  const mid = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[mid] : Math.round(((xs[mid - 1] + xs[mid]) / 2) * 100) / 100;
}

const resumen = fs.readFileSync(path.join(rawDir, "RESUMEN.md"), "utf8");
const variantsMatch = resumen.match(/~([\d.]+)\s+variantes/);
const batchesMatch = resumen.match(/(\d+)\s+batches/);
const sharpeMatch = resumen.match(/Sharpe diario ~(\d+(?:\.\d+)?)/);
const ftmoMatch = resumen.match(/FTMO 2-step ([\d.]+)% riesgo pasa ([\d.]+)% en ([\d.]+) días/);
const ladderMatch = resumen.match(/(\d+)% a 12 meses, (\d+)% a 18, (\d+)% a 24/);
const monthMatch = resumen.match(/mes mediano (\d+)/);
const payoutMatch = resumen.match(/~\$([\d.]+)k\/mes/);
const targetMatch = resumen.match(/\$(\d+)k\/mes/);
if (!variantsMatch || !sharpeMatch || !ftmoMatch || !ladderMatch || !monthMatch || !payoutMatch || !targetMatch || !batchesMatch) {
  throw new Error("El resumen no trae las cifras que la web necesita. Revisa data/raw/RESUMEN.md");
}

const thousandDots = (token) => Number(token.replace(/\./g, ""));
const variants = thousandDots(variantsMatch[1]);
const batchesClaim = Number(batchesMatch[1]);
const sharpeP2 = Number(sharpeMatch[1]);
const rounded = {
  p12: Number(ladderMatch[1]) / 100,
  p18: Number(ladderMatch[2]) / 100,
  p24: Number(ladderMatch[3]) / 100,
};
const medianMonthClaim = Number(monthMatch[1]);
const payoutThousands = Number(payoutMatch[1]);
const targetMonthly = Number(targetMatch[1]) * 1000;

const registry = parseCSV(fs.readFileSync(path.join(rawDir, "strategy_registry.csv"), "utf8"));
const ladder22 = parseCSV(fs.readFileSync(path.join(rawDir, "ladder22.csv"), "utf8"));
const ladder23 = parseCSV(fs.readFileSync(path.join(rawDir, "ladder23.csv"), "utf8"));

const strategies = [];
const symbols = [];
const reasons = [];
const params = [];
const strategyIndex = new Map();
const symbolIndex = new Map();
const reasonIndex = new Map();
const paramIndex = new Map();

function intern(list, map, value) {
  const key = value ?? "";
  if (map.has(key)) return map.get(key);
  const id = list.length;
  list.push(key);
  map.set(key, id);
  return id;
}

const P2_KEYS = [
  ["LWilliams_volbreak_open", "NAS100", "Williams · NAS100", "Ruptura de volatilidad en la apertura."],
  ["LWilliams_volbreak_open", "BTCUSD", "Williams · BTC", "La misma ruptura, en bitcoin."],
  ["Crabel_stretch_ORB", "NAS100", "Crabel · NAS100", "Stretch y ruptura de la apertura."],
  ["Fabio_trend_LVN_London", "GER40", "Fabio · GER40", "Tendencia en el nodo de bajo volumen de Londres."],
  ["Unger_PDH_PDL_breakout", "XAUUSD", "Unger · oro", "Ruptura del máximo y el mínimo del día anterior."],
  ["TOM_intraday_window", "XAUUSD", "Turno de mes · oro", "Ventana intradía del cambio de mes."],
];

const WATCH_KEYS = [
  ["Raschke_Anti", "SPX500", "Raschke Anti · S&P", "En vigilancia: anti del S&P."],
  ["Raschke_HolyGrail_v2", "XAUUSD", "Holy Grail · oro", "El santo grial de Raschke, en oro."],
  ["VolCompression_breakout", "XAUUSD", "VCB · oro", "Ruptura tras compresión de volatilidad."],
  ["Connors_RSI2_dip", "SPX500", "RSI(2) · S&P", "Dip de Connors. Muchas fichas no llegan a 100 trades."],
  ["Connors_RSI2_dip", "NAS100", "RSI(2) · NAS100", "El mismo dip, en el Nasdaq."],
  ["IBS_meanrev_long", "NAS100", "IBS · NAS100", "Reversión por IBS. Sigue en observación."],
  ["Turnaround_Tuesday_long", "NAS100", "Turnaround Tuesday · NAS100", "El martes de giro. Muestra corta."],
];

const rows = registry.map((row, index) => {
  const oosT = rawNum(row.OOS_t);
  const oosPf = rawNum(row.OOS_pf);
  const oosN = rawNum(row.OOS_n);
  const oosDdRaw = rawNum(row.OOS_dd);
  const fullDdRaw = rawNum(row.FULL_dd);
  const gateDd = fullDdRaw ?? oosDdRaw;
  return {
    index,
    strategy: row.strategy,
    symbol: row.symbol,
    verdict: verdictCode(row.verdict),
    verdictRaw: row.verdict.trim(),
    oosT: num(row.OOS_t),
    oosPf: num(row.OOS_pf),
    oosN: intish(row.OOS_n),
    oosDd: num(row.OOS_dd),
    oosWin: num(row.OOS_win),
    isT: num(row.IS_t),
    isPf: num(row.IS_pf),
    fullDd: num(row.FULL_dd),
    gateDd,
    reason: (row.reason || "").trim(),
    params: (row.params || "").trim(),
    batch: row.batch || "",
    testedAt: row.tested_at || "",
    passT: oosT != null && oosT >= 1.5,
    passPf: oosPf != null && oosPf >= 1.1,
    passN: oosN != null && oosN >= 100,
    passDd: gateDd != null && gateDd <= 20,
  };
});

let passT = 0;
let passPf = 0;
let passN = 0;
let passDd = 0;
for (const row of rows) {
  if (!row.passT) continue;
  passT++;
  if (!row.passPf) continue;
  passPf++;
  if (!row.passN) continue;
  passN++;
  if (!row.passDd) continue;
  passDd++;
}

function pickRepresentative(strategy, symbol) {
  const hits = rows.filter((row) => row.strategy === strategy && row.symbol === symbol);
  if (!hits.length) {
    throw new Error(`No está en el registro: ${strategy} ${symbol}`);
  }
  return hits.slice().sort((a, b) => (b.oosN ?? -1) - (a.oosN ?? -1) || (b.oosT ?? -99) - (a.oosT ?? -99))[0];
}

const p2 = P2_KEYS.map(([strategy, symbol, title, blurb]) => {
  const row = rows.find((item) => item.strategy === strategy && item.symbol === symbol && item.verdictRaw === "KEEP");
  if (!row) throw new Error(`Falta el KEEP de cartera P2: ${strategy} ${symbol}`);
  return { index: row.index, strategy, symbol, title, blurb };
});

const watchlist = WATCH_KEYS.map(([strategy, symbol, title, blurb]) => {
  const row = pickRepresentative(strategy, symbol);
  return { index: row.index, strategy, symbol, title, blurb };
});

const p2Set = new Set(p2.map((item) => item.index));
const watchSet = new Set(watchlist.map((item) => item.index));

function grave(id, title, detail, strategy) {
  const hits = rows.filter((row) => row.strategy === strategy);
  if (!hits.length) throw new Error(`Cementerio sin filas: ${strategy}`);
  return {
    id,
    title,
    detail,
    strategy,
    count: hits.length,
    medianT: median(hits.map((row) => row.oosT)),
    verdicts: hits.reduce((acc, row) => {
      acc[row.verdictRaw] = (acc[row.verdictRaw] || 0) + 1;
      return acc;
    }, {}),
  };
}

const graveyard = [
  grave(
    "smc",
    "SMC / ICT 1:20",
    "El resumen lo deja fuera: acierta cerca del 4 % y un 1:20 necesita alrededor del 8 % solo para empatar. En el registro, el SMC sale en neto negativo.",
    "SMC_ICT_BOS_FVG",
  ),
  grave(
    "bullet",
    "ICT Silver Bullet",
    "Las ocho fichas del Silver Bullet se descartan. El filtro de muestra y de drawdown no perdona.",
    "ICT_SilverBullet",
  ),
  grave(
    "vwap",
    "VWAP de tendencia",
    "La tendencia anclada al VWAP no aguanta el fuera de muestra.",
    "Zarattini_Aziz_VWAP_trend",
  ),
  grave(
    "fomc",
    "Pre-FOMC",
    "La deriva previa a la Fed se queda corta de trades y de t.",
    "PreFOMC_drift_LuccaMoench",
  ),
  grave(
    "opex",
    "OPEX",
    "El calendario de vencimientos no muestra edge fuera de muestra.",
    "OPEX_calendar",
  ),
  grave(
    "month",
    "Fin de mes",
    "El rebalanceo de fin de mes, como sistema, no pasa el filtro. El turno de mes del oro es otra ficha, y esa sí está en P2.",
    "MonthEnd_rebalance",
  ),
  grave(
    "lunar",
    "Ciclo lunar",
    "Control negativo a propósito. La luna no paga el spread: el t fuera de muestra sale del lado equivocado.",
    "Lunar_newmoon_long_fullmoon_short",
  ),
];

const batches = new Set(rows.map((row) => row.batch).filter(Boolean));
if (batches.size !== batchesClaim) {
  throw new Error(`El resumen dice ${batchesClaim} tandas y el registro tiene ${batches.size} lotes con nombre.`);
}

const headline = ladder22[0];
const p12 = num(headline.P_m12);
const p18 = num(headline.P_m18);
const p24 = num(headline.P_m24);
if (p12 == null || Math.abs(p12 - rounded.p12) > 0.02) {
  throw new Error("La probabilidad a 12 meses del CSV no cuadra con el resumen.");
}
if (Number(headline.median_month) !== medianMonthClaim) {
  throw new Error("El mes mediano del CSV no cuadra con el resumen.");
}

function policy(row, source) {
  return {
    id: row.policy,
    source,
    p12: num(row.P_m12),
    p18: num(row.P_m18),
    p24: num(row.P_m24),
    medianMonth: intish(row.median_month),
    monthly: num(row.median_monthly_m19_24),
    p25: num(row.p25),
    fundedEnd: num(row.funded_end),
    fees: num(row.fees),
    breaches: num(row.breaches),
  };
}

const symbolCounts = new Map();
for (const row of rows) {
  const key = row.symbol || "—";
  symbolCounts.set(key, (symbolCounts.get(key) || 0) + 1);
}
const markets = [...symbolCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([symbol, count]) => ({ symbol, count }));

const nodes = rows.map((row) => [
  intern(strategies, strategyIndex, row.strategy),
  intern(symbols, symbolIndex, row.symbol),
  row.verdict,
  row.oosT,
  row.oosPf,
  row.oosN,
  row.oosDd,
  row.oosWin,
  row.isT,
  row.isPf,
  row.fullDd,
  row.reason ? intern(reasons, reasonIndex, row.reason) : -1,
  row.params ? intern(params, paramIndex, row.params) : -1,
  p2Set.has(row.index) ? 1 : 0,
  watchSet.has(row.index) ? 1 : 0,
]);

const verdictCounts = [0, 0, 0, 0, 0];
for (const row of rows) verdictCounts[row.verdict] += 1;

const payload = {
  asOf: "2026-10-31",
  counts: {
    rows: rows.length,
    strategies: strategies.length,
    variants,
    batches: batches.size,
    keep: verdictCounts[2],
    watch: verdictCounts[1],
    discard: verdictCounts[0],
    control: verdictCounts[3],
    note: verdictCounts[4],
    p2: p2.length,
  },
  gates: { t: 1.5, pf: 1.1, trades: 100, dd: 20 },
  windows: { is: "2020–2023", oos: "2024–octubre 2026" },
  sharpeP2,
  funnel: [
    { id: "variants", label: "Variantes probadas", n: variants, from: "resumen" },
    { id: "registry", label: "Fichas en el registro", n: rows.length, from: "registro" },
    { id: "t", label: "t fuera de muestra ≥ 1,5", n: passT, from: "registro" },
    { id: "pf", label: "Profit factor ≥ 1,1", n: passPf, from: "registro" },
    { id: "trades", label: "Al menos 100 trades", n: passN, from: "registro" },
    { id: "dd", label: "Drawdown ≤ 20 %", n: passDd, from: "registro" },
    { id: "p2", label: "Cartera P2", n: p2.length, from: "resumen" },
  ],
  p2,
  watchlist,
  graveyard,
  markets,
  ladder: {
    targetMonthly,
    payoutStory: payoutThousands * 1000,
    rounded,
    firms: ["FTMO", "The5ers", "FundedNext", "Alpha Capital"],
    ftmo: {
      steps: 2,
      risk: Number(ftmoMatch[1]) / 100,
      pass: Number(ftmoMatch[2]) / 100,
      days: Number(ftmoMatch[3]),
    },
    noHedge: true,
    headline: policy(headline, "ladder22"),
    policies: [...ladder22.map((row) => policy(row, "ladder22")), ...ladder23.map((row) => policy(row, "ladder23"))],
  },
  strategies,
  symbols,
  reasons,
  params,
  nodes,
  fan: buildFan(registry),
  seismo: buildSeismo(rows),
};

function buildFan(registry) {
  const windowMonths = 22;
  const sample = [];
  for (const row of registry) {
    if ((row.verdict || "").trim() !== "KEEP") continue;
    const ret = rawNum(row.OOS_ret);
    const dd = rawNum(row.OOS_dd);
    const n = rawNum(row.OOS_n);
    if (ret == null || dd == null || n == null || n < 30) continue;
    sample.push({ ret, dd });
  }
  const monthly = sample.map((item) => item.ret / 100 / windowMonths);
  const drawdowns = sample.map((item) => item.dd / 100);
  const drift = median(monthly);
  const ddMed = median(drawdowns);
  const vol = ddMed == null ? null : Math.max(0.004, ddMed / Math.sqrt(windowMonths));
  if (drift == null || vol == null) {
    return {
      illustrative: true,
      months: 24,
      monthlyDrift: 0,
      monthlyVol: 0.02,
      sample: 0,
      note: "Simulación ilustrativa. El registro no trae suficientes retornos conservados para calibrarla.",
    };
  }
  return {
    illustrative: true,
    months: 24,
    monthlyDrift: Math.round(drift * 1e6) / 1e6,
    monthlyVol: Math.round(vol * 1e6) / 1e6,
    sample: sample.length,
    note: "Simulación ilustrativa. El paso mensual usa el retorno fuera de muestra de las fichas conservadas, repartido en la ventana 2024–octubre 2026, y el drawdown mediano como escala de ruido. No es la curva real de la cartera.",
  };
}

function buildSeismo(rows) {
  const prop = /ftmo|funded|5ers|topstep/i;
  const batchTime = new Map();
  const symbolCount = new Map();
  for (const row of rows) {
    if (row.batch) {
      const prev = batchTime.get(row.batch);
      const stamp = row.testedAt || "";
      if (!prev || (stamp && stamp < prev)) batchTime.set(row.batch, stamp || prev || "");
    }
    if (!row.symbol || prop.test(row.symbol)) continue;
    symbolCount.set(row.symbol, (symbolCount.get(row.symbol) || 0) + 1);
  }
  const symbols = [...symbolCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([symbol]) => symbol);
  const batches = [...batchTime.keys()].sort((a, b) => (batchTime.get(a) || "").localeCompare(batchTime.get(b) || ""));
  const buckets = new Map();
  const symbolValues = new Map(symbols.map((symbol) => [symbol, []]));
  for (const row of rows) {
    if (row.oosT == null || !symbols.includes(row.symbol) || !batches.includes(row.batch)) continue;
    const key = `${row.symbol}|${row.batch}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(row.oosT);
    symbolValues.get(row.symbol).push(row.oosT);
  }
  const symbolFallback = new Map(
    symbols.map((symbol) => [symbol, median(symbolValues.get(symbol)) ?? 0]),
  );
  const values = batches.map((batch) =>
    symbols.map((symbol) => {
      const cell = median(buckets.get(`${symbol}|${batch}`) || []);
      const value = cell ?? symbolFallback.get(symbol) ?? 0;
      return Math.round(value * 1000) / 1000;
    }),
  );
  return {
    symbols,
    batches: batches.map((_, index) => String(index + 1).padStart(2, "0")),
    values,
    note: "Relieve con el t mediano fuera de muestra, por mercado y por tanda de la investigación. La onda es solo el movimiento del gráfico.",
  };
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(payload));
const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
console.log(
  `research.json · ${rows.length} nodos · ${strategies.length} familias · embudo ${variants}→${passT}→${passPf}→${passN}→${passDd}→${p2.length} · ${kb} KB`,
);
