const STRATEGY_NAMES: Record<string, string> = {
  LWilliams_volbreak_open: "Williams — ruptura de volatilidad",
  Crabel_stretch_ORB: "Crabel — stretch / ORB",
  Fabio_trend_LVN_London: "Fabio — tendencia LVN Londres",
  Unger_PDH_PDL_breakout: "Unger — ruptura del día anterior",
  TOM_intraday_window: "Turno de mes — ventana intradía",
  Raschke_Anti: "Raschke Anti",
  Raschke_HolyGrail_v2: "Raschke Holy Grail",
  VolCompression_breakout: "Compresión de volatilidad",
  Connors_RSI2_dip: "RSI(2) de Connors",
  IBS_meanrev_long: "IBS, reversión larga",
  Turnaround_Tuesday_long: "Turnaround Tuesday",
  SMC_ICT_BOS_FVG: "SMC / ICT, BOS y FVG",
  ICT_SilverBullet: "ICT Silver Bullet",
  Zarattini_Aziz_VWAP_trend: "VWAP de tendencia",
  PreFOMC_drift_LuccaMoench: "Deriva pre-FOMC",
  OPEX_calendar: "Calendario OPEX",
  MonthEnd_rebalance: "Rebalanceo de fin de mes",
  Lunar_newmoon_long_fullmoon_short: "Ciclo lunar",
};

const SYMBOLS: Record<string, string> = {
  NAS100: "Nasdaq 100",
  SPX500: "S&P 500",
  US500: "S&P 500",
  GER40: "DAX",
  UK100: "FTSE 100",
  XAUUSD: "Oro",
  XAGUSD: "Plata",
  BTCUSD: "Bitcoin",
  EURUSD: "Euro / dólar",
  GBPUSD: "Libra / dólar",
  USDJPY: "Dólar / yen",
  AUDUSD: "Dólar australiano",
  NZDUSD: "Dólar neozelandés",
  USDCAD: "Dólar / canadiense",
  EURGBP: "Euro / libra",
  BCOUSD: "Brent",
};

const POLICIES: Record<string, string> = {
  "F21_rerun_corrected(alpha300k,Pro10%)": "F21 base · alpha 300k",
  F_alpha400k: "Alpha 400k",
  "F_+alphaScaling": "Alpha con escala",
  F_noAlpha: "Sin alpha",
  "F22_baseline(Alpha holds weekends)": "F22 · el alpha aguanta el finde",
  F23_Alpha_flatFriday: "Alpha plano el viernes",
  "F23_flat+alpha400k": "Plano el viernes + alpha 400k",
};

export const fmt = new Intl.NumberFormat("es-ES");
export const fmt1 = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
export const fmt2 = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function pct(value: number, digits = 0) {
  return new Intl.NumberFormat("es-ES", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function pctSmart(value: number) {
  const hundred = value * 100;
  const digits = Math.abs(hundred - Math.round(hundred)) < 0.05 ? 0 : 1;
  return pct(value, digits);
}

export function usd(value: number) {
  return `${fmt.format(Math.round(value))} USD`;
}

export function strategyName(id: string) {
  return STRATEGY_NAMES[id] ?? id.replaceAll("_", " ");
}

export function symbolName(id: string) {
  if (!id) return "Sin mercado";
  const friendly = SYMBOLS[id];
  return friendly ? `${friendly} · ${id}` : id;
}

export function policyName(id: string) {
  return POLICIES[id] ?? id;
}

export function numEs(value: number) {
  return fmt2.format(value);
}

function clauseEs(raw: string) {
  let text = raw.trim();
  const n = (value: string) => numEs(Number(value));
  text = text.replace(/OOS t\s*([-\d.]+)<1\.5/g, (_, value: string) => `t fuera de muestra ${n(value)} < 1,5`);
  text = text.replace(/OOS t<1\.5/g, "t fuera de muestra < 1,5");
  text = text.replace(/IS t\s*([-\d.]+)/g, (_, value: string) => `t en muestra ${n(value)}`);
  text = text.replace(/PF\s*([-\d.]+)<1\.1/g, (_, value: string) => `profit factor ${n(value)} < 1,1`);
  text = text.replace(/OOS PF<1\.1/g, "profit factor fuera de muestra < 1,1");
  text = text.replace(/PF<1\.1/g, "profit factor < 1,1");
  text = text.replace(/<100 OOS trades/g, "menos de 100 trades fuera de muestra");
  text = text.replace(/max DD>20% @0\.5% risk/g, "drawdown máximo > 20 % con riesgo del 0,5 %");
  text = text.replace(
    /IS edge<=0 or collapses OOS/g,
    "el edge en muestra se apaga o se hunde fuera de muestra",
  );
  text = text.replace(/no IS edge/g, "sin edge en muestra");
  text = text.replace(/sin edge/g, "sin edge");
  text = text.replace(/holdout t\s*([-\d.]+)/g, (_, value: string) => `t de reserva ${n(value)}`);
  text = text.replace(/dev t\s*([-\d.]+)/g, (_, value: string) => `t de desarrollo ${n(value)}`);
  text = text.replace(/best-by-dev config/g, "configuración elegida por el tramo de desarrollo");
  text = text.replace(/KEEP-fragile/gi, "se conserva, frágil");
  text = text.replace(/KEEP mechanically/gi, "pasa el filtro mecánico");
  text = text.replace(/KEEP weak/gi, "se conserva, débil");
  text = text.replace(/not pro/gi, "no entra en la cartera");
  text = text.replace(/beats random-time p95/gi, "supera el percentil 95 de un reloj aleatorio");
  text = text.replace(/beats random p95/gi, "supera el percentil 95 aleatorio");
  text = text.replace(/gold-bull regime OOS/gi, "el fuera de muestra cae en un régimen alcista del oro");
  text = text.replace(/watchlist/gi, "lista de vigilancia");
  text = text.replace(/2021 negative/gi, "2021 en negativo");
  text = text.replace(/marketing/gi, "argumento comercial");
  text = text.replace(/Krueger SMC neto negativo/gi, "el SMC de Krueger queda en neto negativo");
  return text;
}

export function reasonEs(reason: string) {
  if (!reason.trim()) return "El registro no anota un motivo.";
  return reason
    .split(/\s*;\s*/)
    .map(clauseEs)
    .join(" · ");
}

export function prettyParams(raw: string) {
  if (!raw.trim()) return "Sin parámetros anotados.";
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.entries(parsed)
      .map(([key, value]) => `${key} ${String(value)}`)
      .join(" · ");
  } catch {
    return raw;
  }
}

export function verdictRawEs(raw: string) {
  if (raw === "KEEP") return "conservadas";
  if (raw === "DISCARD") return "descartadas";
  if (raw.startsWith("DISCARD (WATCH")) return "en vigilancia";
  if (raw === "NEG-CONTROL") return "control negativo";
  if (raw === "CONTROL") return "control";
  if (raw === "NOTE") return "nota";
  if (raw === "WATCH" || raw === "WATCHLIST") return "vigilancia";
  return raw.toLowerCase();
}
