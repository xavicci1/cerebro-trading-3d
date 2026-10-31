/**
 * Compacta data/tesis en src/generated/tesis.json.
 * Autores, año e institución salen del texto de cada ficha. No se inventan.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALIASES, CATALOG, FAMILIES } from "./thesis-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tesisDir = path.join(root, "data", "tesis");
const registryFile = path.join(root, "data", "raw", "strategy_registry.csv");
const outFile = path.join(root, "src", "generated", "tesis.json");

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

function clean(value) {
  return String(value || "")
    .replace(/\*+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function field(text, label) {
  const match = text.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`, "i"));
  return match ? clean(match[1]) : "";
}

function authorsOf(text, indexRow) {
  const authored = field(text, "Author") || field(text, "Authors");
  let name = authored
    ? authored.split(/\s+—\s+|\s+-\s+/)[0].replace(/\.\s*Master.*$/i, "").replace(/\.$/, "")
    : clean((indexRow?.trader || "").split("(")[0]);
  name = name.replace(/\bClaude B\. Erb\b/g, "C. B. Erb");
  return name.slice(0, 180);
}

function institutionOf(text) {
  const explicit = field(text, "Institution");
  if (explicit) return explicit.replace(/\.$/, "");
  const head = text.split("\n").slice(0, 18).join("\n");
  const match = head.match(
    /(University of Copenhagen|LUT University(?: \([^)\n]+\))?|Imperial College Business School|Imperial College London|Queen Mary, University of London|London School of Economics|Federal Reserve Bank of New York|Grand Valley State University|University of Technology Sydney|Duke University Fuqua(?: \([^)\n]+\))?|Goethe University(?: Frankfurt)?|Stanford University|Swiss National Bank|Wharton)/,
  );
  return match ? match[0] : null;
}

function yearsIn(value) {
  const stripped = value
    .replace(/10\.\d{4,}\/[^\s)]+/g, "")
    .replace(/\b20\d{2}-\d{2}-\d{2}\b/g, "")
    .replace(/\b(?:19|20)\d{2}\s*[–-]\s*(?:19|20)\d{2}\b/g, "");
  return [...stripped.matchAll(/\b(?:19|20)\d{2}\b/g)]
    .map((match) => Number(match[0]))
    .filter((year) => year >= 1950 && year <= 2026);
}

function firstYear(value) {
  const years = yearsIn(value);
  return years.length ? String(years[0]) : null;
}

function yearOf(file, text, title) {
  if (file === "academic-thesis-wharton-ga-and-ml-etf-negative-controls.md") return "2008 y 2018";
  const paper = field(text, "Paper") || field(text, "Papers");
  if (paper && !/opened 20|re-checked/i.test(paper)) {
    const fromPaper = firstYear(paper);
    if (fromPaper) return fromPaper;
  }
  for (const line of text.split("\n").slice(0, 16)) {
    if (/opened 20|re-checked|\*\*Sources/i.test(line)) continue;
    if (/Journal|Review of|Financial Studies/i.test(line)) {
      const fromJournal = firstYear(line);
      if (fromJournal) return fromJournal;
    }
  }
  const author = field(text, "Author") || field(text, "Authors");
  if (author) {
    const fromAuthor = firstYear(author);
    if (fromAuthor) return fromAuthor;
  }
  const fromTitle = firstYear(title);
  if (fromTitle) return fromTitle;
  for (const line of text.split("\n").slice(0, 16)) {
    if (/verif|opened 20|re-checked|standings|championship/i.test(line)) continue;
    const wiley = line.match(/Wiley,?[^0-9\n]{0,24}((?:19|20)\d{2})/);
    if (wiley) return wiley[1];
    if (/book|thesis|paper|journal|isbn|ed\./i.test(line)) {
      const wrapped = line.match(/\(((?:19|20)\d{2})\)/);
      if (wrapped) return wrapped[1];
    }
  }
  return null;
}

function isProp(strategy, symbol) {
  const blob = `${strategy} ${symbol}`;
  return /^(Ladder\d|Ladder30|Ladder21|Ladder22|Ladder23|SmallP2|SmallAcct|Sim100)/i.test(strategy) ||
    /ftmo|fundednext|the5ers|topstep|\b5ers\b/i.test(blob);
}

function sourceFragments(source) {
  const found = new Set();
  const text = source || "";
  for (const match of text.matchAll(/([a-z0-9][a-z0-9-]{11,})\.md/gi)) found.add(match[1].toLowerCase());
  for (const match of text.matchAll(/rev_strategies\/([a-z0-9-]{12,})/gi)) found.add(match[1].toLowerCase());
  return [...found];
}

const P2 = new Set([
  "LWilliams_volbreak_open|NAS100",
  "LWilliams_volbreak_open|BTCUSD",
  "Crabel_stretch_ORB|NAS100",
  "Fabio_trend_LVN_London|GER40",
  "Unger_PDH_PDL_breakout|XAUUSD",
  "TOM_intraday_window|XAUUSD",
]);

const registry = parseCSV(fs.readFileSync(registryFile, "utf8"));
const indexRows = parseCSV(fs.readFileSync(path.join(tesisDir, "index.csv"), "utf8"));
const indexByFile = new Map(indexRows.map((row) => [row.file, row]));
const files = fs.readdirSync(tesisDir).filter((name) => name.endsWith(".md")).sort();

const catalogKeys = Object.keys(CATALOG);
for (const file of files) {
  if (!CATALOG[file]) throw new Error(`Falta la ficha pública: ${file}`);
}
for (const key of catalogKeys) {
  if (!files.includes(key)) throw new Error(`La ficha pública no tiene archivo: ${key}`);
}

const fragIndex = new Map();
registry.forEach((row, index) => {
  if (isProp(row.strategy, row.symbol)) return;
  for (const frag of sourceFragments(row.source)) {
    if (!fragIndex.has(frag)) fragIndex.set(frag, []);
    fragIndex.get(frag).push(index);
  }
});

function matchFile(file) {
  const stem = file.slice(0, -3).toLowerCase();
  const hits = new Set();
  for (const [frag, indexes] of fragIndex) {
    const related =
      stem === frag ||
      (stem.startsWith(frag) && frag.length >= 16) ||
      (frag.startsWith(stem) && stem.length >= 12) ||
      (frag.length >= 18 && stem.includes(frag));
    if (!related) continue;
    for (const index of indexes) hits.add(index);
  }
  for (const prefix of ALIASES[file] || []) {
    registry.forEach((row, index) => {
      if (isProp(row.strategy, row.symbol)) return;
      if (row.strategy.startsWith(prefix)) hits.add(index);
    });
  }
  return [...hits].sort((a, b) => a - b);
}

function rank(verdict) {
  if (verdict === "KEEP") return 4;
  if (/WATCH/i.test(verdict)) return 3;
  if (/DISCARD/i.test(verdict)) return 2;
  return 1;
}

function rollup(verdicts) {
  if (!verdicts.length) return { verdict: "sin ficha", mixed: false };
  const hasKeep = verdicts.some((verdict) => verdict === "KEEP");
  const hasWatch = verdicts.some((verdict) => /WATCH/i.test(verdict));
  const hasDiscard = verdicts.some((verdict) => /DISCARD/i.test(verdict));
  const mixed = hasKeep && (hasWatch || hasDiscard);
  if (hasKeep) return { verdict: "KEEP", mixed };
  if (hasWatch) return { verdict: "watchlist", mixed: false };
  if (hasDiscard) return { verdict: "discarded", mixed: false };
  return { verdict: "sin ficha", mixed: false };
}

const banned = /ftmo|fundednext|the5ers|topstep|alpha capital|cuentas?\s+fondeadas?|\bpayouts?\b|\bgrok\b|\bxai\b|chatgpt|openai|anthropic/i;

const items = files.map((file) => {
  const text = fs.readFileSync(path.join(tesisDir, file), "utf8");
  const titleLine = text.split("\n").find((line) => line.startsWith("# ")) || "";
  const card = CATALOG[file];
  const indexes = matchFile(file);
  const grouped = new Map();
  let p2 = false;
  for (const index of indexes) {
    const row = registry[index];
    const verdict = (row.verdict || "").trim();
    const current = grouped.get(row.strategy) || { id: row.strategy, index, verdict, rank: rank(verdict) };
    const nextRank = rank(verdict);
    if (nextRank > current.rank) {
      current.index = index;
      current.verdict = verdict;
      current.rank = nextRank;
    }
    grouped.set(row.strategy, current);
    if (verdict === "KEEP" && P2.has(`${row.strategy}|${row.symbol}`)) p2 = true;
  }
  const strategies = [...grouped.values()]
    .sort((a, b) => b.rank - a.rank || a.id.localeCompare(b.id))
    .slice(0, 6)
    .map(({ id, index, verdict }) => ({ id, index, verdict }));
  const summary = rollup(indexes.map((index) => (registry[index].verdict || "").trim()));
  const item = {
    id: file.slice(0, -3),
    title: card.title,
    authors: authorsOf(text, indexByFile.get(file)),
    year: yearOf(file, text, titleLine),
    institution: institutionOf(text),
    family: card.family,
    idea: card.idea,
    verdict: summary.verdict,
    mixed: summary.mixed,
    p2,
    neurons: indexes.slice(0, 420),
    strategies,
  };
  for (const value of [item.title, item.authors, item.idea, item.institution || ""]) {
    if (banned.test(value)) throw new Error(`Texto público no permitido en ${file}: ${value}`);
  }
  if (!FAMILIES.some((family) => family.id === item.family)) throw new Error(`Familia desconocida: ${file}`);
  return item;
});

const payload = {
  families: FAMILIES,
  items,
};
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(payload));
const linked = items.filter((item) => item.neurons.length).length;
console.log(`tesis.json · ${items.length} fichas · ${linked} con neuronas`);
