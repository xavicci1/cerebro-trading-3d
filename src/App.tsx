import { Canvas } from "@react-three/fiber";
import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { requestZoom } from "./bridge";
import { BEATS, FILTERS, NAV, STAGES } from "./copy";
import { fmt, fmt1, fmt2, pct, pctSmart, policyName, prettyParams, reasonEs, strategyName, symbolName, usd, verdictRawEs } from "./format";
import { useBeat, useMedia, useScene } from "./hooks";
import { VERDICT_COLOR, VERDICT_LABEL } from "./palette";
import { gateRows, nodeMatches, nodes, research, type FilterId } from "./research";
import { fijo, motion, publishScroll, sceneAtMarker, storyProgress } from "./scroll";
import { Experience } from "./scene/Experience";

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="webgl-note">
          El dibujo 3D no arrancó en este navegador. El relato y las cifras siguen en la página.
        </p>
      );
    }
    return this.props.children;
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function scrollToBeat(index: number) {
  const el = document.getElementById("relato");
  if (!el) return;
  const total = el.offsetHeight - window.innerHeight;
  const targets = [0.04, 0.33, 0.58, 0.86];
  window.scrollTo({
    top: el.offsetTop + total * targets[index],
    behavior: motion.reduced ? "auto" : "smooth",
  });
}

export function App() {
  const scene = useScene();
  const beat = useBeat();
  const compact = useMedia("(max-width: 800px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const [graphics] = useState(hasWebGL);
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [stage, setStage] = useState(0);
  const railRef = useRef<HTMLSpanElement>(null);
  const sheetRef = useRef<HTMLElement>(null);

  motion.reduced = reduced || fijo;

  const onStage = useCallback((next: number) => {
    setStage((prev) => (prev === next ? prev : next));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const escena = params.get("escena");
    if (escena) {
      document.getElementById(escena)?.scrollIntoView({ behavior: fijo ? "auto" : "smooth" });
    }
    if (params.get("nodo") === "p2") setSelected(research.p2[0].index);
    const read = () => {
      const story = storyProgress();
      if (railRef.current) railRef.current.style.transform = `scaleY(${story})`;
      publishScroll(story, sceneAtMarker());
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (selected == null) return;
    const node = nodes[selected];
    if (!node || !nodeMatches(node, filter, query, market)) setSelected(null);
  }, [selected, filter, query, market]);

  useEffect(() => {
    if (selected != null) sheetRef.current?.focus();
  }, [selected]);

  useEffect(() => {
    const titles = {
      relato: "Cerebro — el relato",
      cerebro: "Cerebro — las neuronas",
      tuberia: "Cerebro — la tubería",
      embudo: "Cerebro — el embudo",
      escalera: "Cerebro — la escalera",
    } as const;
    document.title = titles[scene];
  }, [scene]);

  const matchCount = useMemo(() => {
    if (filter === "all" && !query.trim() && !market) return nodes.length;
    return nodes.reduce((sum, node) => sum + (nodeMatches(node, filter, query, market) ? 1 : 0), 0);
  }, [filter, query, market]);

  const listed = useMemo(() => {
    const searching = query.trim().length >= 2;
    const smallFilter = filter !== "all" && filter !== "discard";
    if (!searching && !smallFilter && !market) return [];
    if (!searching && filter === "discard") return [];
    const found: number[] = [];
    for (const node of nodes) {
      if (!nodeMatches(node, filter, query, market)) continue;
      found.push(node.index);
      if (found.length === 24) break;
    }
    return found;
  }, [filter, query, market]);

  function openNode(index: number) {
    setFilter("all");
    setMarket("");
    setQuery("");
    setSelected(index);
    document.getElementById("cerebro")?.scrollIntoView({ behavior: motion.reduced ? "auto" : "smooth" });
  }

  const active = BEATS[beat];
  const headline = research.ladder.headline;
  const selectedNode = selected == null ? null : nodes[selected];

  return (
    <>
      {graphics ? (
        <Boundary>
          <div className={scene === "cerebro" ? "canvas-wrap live" : "canvas-wrap"} aria-hidden="true">
            <Canvas
              dpr={compact ? [1, 1.35] : [1, 1.75]}
              camera={{ position: [0.2, 0.4, 7.2], fov: compact ? 50 : 40, near: 0.1, far: 60 }}
              gl={{ antialias: !compact, alpha: false }}
              performance={{ min: 0.45 }}
            >
              <Experience
                scene={scene}
                compact={compact}
                filter={filter}
                query={query}
                market={market}
                selected={selected}
                onSelect={setSelected}
                onStage={onStage}
              />
            </Canvas>
          </div>
        </Boundary>
      ) : (
        <p className="webgl-note">Este navegador no dibuja WebGL. Las cifras de la investigación siguen debajo.</p>
      )}
      <div className="vignette" />
      <div className={scene === "relato" ? "rail" : "rail hide"} aria-hidden="true">
        <span ref={railRef} />
      </div>
      <div className="ui">
        <header>
          <a className="brand" href="#relato">
            Cerebro
            <small>Investigación de Xavier</small>
          </a>
          <nav className="nav" aria-label="Secciones">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} aria-current={scene === item.id ? "true" : undefined}>
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        {scene === "cerebro" && graphics && (
          <div className="zoom">
            <button type="button" onClick={() => requestZoom(0.86)} aria-label="Acercar">
              +
            </button>
            <button type="button" onClick={() => requestZoom(1.16)} aria-label="Alejar">
              −
            </button>
          </div>
        )}

        <section className="story" id="relato">
          <div className="story-sticky">
            <div className="copy">
              <p className="warn">Backtests y paper. No es asesoramiento financiero ni una promesa de resultados.</p>
              <article className="beat" key={active.title}>
                <p className="kicker">{active.kicker}</p>
                <h2>{active.title}</h2>
                <p className="lede">{active.body}</p>
              </article>
              <div className="dots" role="tablist" aria-label="Tramos del relato">
                {BEATS.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    className={index === beat ? "on" : ""}
                    aria-label={`Tramo ${index + 1}: ${item.title}`}
                    aria-pressed={index === beat}
                    onClick={() => scrollToBeat(index)}
                  />
                ))}
              </div>
              <a className="cta" href="#cerebro">
                {beat === 3 ? "Ver las neuronas" : "Saltar el relato"}
              </a>
            </div>
          </div>
        </section>

        <section className="stage" id="cerebro">
          <div className="copy">
            {selectedNode ? (
              <article className="sheet" ref={sheetRef} tabIndex={-1} role="dialog" aria-label="Detalle de la estrategia">
                <div className="sheet-top">
                  <span
                    className="badge"
                    style={{
                      background: VERDICT_COLOR[selectedNode.verdict],
                      color: selectedNode.verdict === 0 ? "#f6f1e7" : "#1a120c",
                    }}
                  >
                    {VERDICT_LABEL[selectedNode.verdict]}
                  </span>
                  <button type="button" onClick={() => setSelected(null)}>
                    Cerrar
                  </button>
                </div>
                <h2>{strategyName(selectedNode.strategy)}</h2>
                <p className="lede">{symbolName(selectedNode.symbol)}</p>
                {selectedNode.p2 && <p className="flag">Esta ficha está en la cartera P2.</p>}
                {selectedNode.watch && <p className="flag">Está en la lista de vigilancia del resumen.</p>}
                <ul className="gates">
                  {gateRows(selectedNode).map((gate) => (
                    <li key={gate.id} className={gate.ok == null ? "na" : gate.ok ? "pass" : "fail"}>
                      {gate.label}: {gate.text}
                    </li>
                  ))}
                </ul>
                <dl className="stats">
                  <div>
                    <dt>t fuera de muestra</dt>
                    <dd>{show(selectedNode.oosT)}</dd>
                  </div>
                  <div>
                    <dt>Profit factor</dt>
                    <dd>{showRatio(selectedNode.oosPf)}</dd>
                  </div>
                  <div>
                    <dt>Trades</dt>
                    <dd>{selectedNode.oosN == null ? "—" : fmt.format(selectedNode.oosN)}</dd>
                  </div>
                  <div>
                    <dt>Drawdown OOS</dt>
                    <dd>{selectedNode.oosDd == null ? "—" : `${fmt1.format(selectedNode.oosDd)} %`}</dd>
                  </div>
                  <div>
                    <dt>Acierto OOS</dt>
                    <dd>{selectedNode.oosWin == null ? "—" : `${fmt1.format(selectedNode.oosWin)} %`}</dd>
                  </div>
                  <div>
                    <dt>t en muestra</dt>
                    <dd>{show(selectedNode.isT)}</dd>
                  </div>
                </dl>
                <p>{reasonEs(selectedNode.reason)}</p>
                <p className="params">{prettyParams(selectedNode.params)}</p>
                <p className="fine">
                  En muestra {research.windows.is}. Fuera de muestra {research.windows.oos}. El drawdown del filtro usa el
                  tramo completo cuando el registro lo trae.
                </p>
              </article>
            ) : (
              <>
                <p className="kicker">02 — Mapa</p>
                <h2>2.192 neuronas</h2>
                <p className="lede">
                  Cada nodo es una ficha probada del registro. El color es el veredicto. El núcleo verde es lo que se
                  conserva: {fmt.format(research.counts.keep)} fichas, y seis de ellas forman la cartera P2.
                </p>
                <div className="legend">
                  {VERDICT_LABEL.map((label, index) => (
                    <span key={label}>
                      <i style={{ background: VERDICT_COLOR[index] }} />
                      {label}
                    </span>
                  ))}
                </div>
                <div className="chips">
                  {FILTERS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={filter === item.id ? "on" : ""}
                      aria-pressed={filter === item.id}
                      onClick={() => setFilter(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <label className="field">
                  <span>Mercado</span>
                  <select value={market} onChange={(event) => setMarket(event.target.value)}>
                    <option value="">Todos</option>
                    {research.markets
                      .filter((item) => item.symbol)
                      .slice(0, 14)
                      .map((item) => (
                        <option key={item.symbol} value={item.symbol}>
                          {symbolName(item.symbol)} ({fmt.format(item.count)})
                        </option>
                      ))}
                  </select>
                </label>
                <input
                  type="search"
                  value={query}
                  placeholder="Buscar estrategia o mercado"
                  aria-label="Buscar estrategia o mercado"
                  onChange={(event) => setQuery(event.target.value)}
                />
                <p className="fine">
                  {fmt.format(matchCount)} visibles. Arrastra para girar el cerebro. En el teléfono, un toque abre la ficha.
                </p>
                <details>
                  <summary>Lista de vigilancia</summary>
                  <div className="results">
                    {research.watchlist.map((item) => (
                      <button key={item.index} type="button" className="block" onClick={() => openNode(item.index)}>
                        <strong>{item.title}</strong>
                        <span>{item.blurb}</span>
                      </button>
                    ))}
                  </div>
                </details>
                <div className="p2s">
                  {research.p2.map((item) => (
                    <button key={item.index} type="button" onClick={() => openNode(item.index)}>
                      {item.title}
                    </button>
                  ))}
                </div>
                {listed.length > 0 && (
                  <div className="results">
                    {listed.map((index) => {
                      const node = nodes[index];
                      return (
                        <button key={index} type="button" className="block" onClick={() => setSelected(index)}>
                          <strong>{strategyName(node.strategy)}</strong>
                          <span>
                            {symbolName(node.symbol)} · {VERDICT_LABEL[node.verdict]}
                          </span>
                        </button>
                      );
                    })}
                    {matchCount > listed.length && <p className="fine">Hay más. Afina la búsqueda.</p>}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="stage" id="tuberia">
          <div className="copy">
            <p className="kicker">03 — Tubería</p>
            <h2>{STAGES[stage].title}</h2>
            <p className="lede">{STAGES[stage].text}</p>
            <div className="steps">
              {STAGES.map((item, index) => (
                <article key={item.id} id={`etapa-${index}`} className={index === stage ? "step on" : "step"}>
                  <span>0{index + 1}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
            <p className="fine">La partícula recorre las ocho estaciones. La ejecución, al final, espera en paper.</p>
          </div>
        </section>

        <section className="stage" id="embudo">
          <div className="copy">
            <p className="kicker">04 — Embudo de la muerte</p>
            <h2>{fmt.format(research.counts.variants)}</h2>
            <p className="lede">
              Variantes puestas a prueba. El registro guarda {fmt.format(research.counts.rows)} fichas. Tras los cuatro
              números queda un pelotón; la cartera P2 se queda con {fmt.format(research.counts.p2)}. Sharpe diario
              aproximado: {fmt2.format(research.sharpeP2)}.
            </p>
            <ol className="funnel-list">
              {research.funnel.map((step) => (
                <li key={step.id} className={step.id === "p2" ? "survivor" : undefined}>
                  <span>
                    {step.label}
                    <b style={{ width: `${Math.max(8, (Math.log10(step.n) / Math.log10(research.counts.variants)) * 100)}%` }} />
                  </span>
                  <strong>{fmt.format(step.n)}</strong>
                </li>
              ))}
            </ol>
            <div className="results">
              {research.p2.map((item) => {
                const node = nodes[item.index];
                return (
                  <button key={item.index} type="button" className="block" onClick={() => openNode(item.index)}>
                    <strong>{item.title}</strong>
                    <span>{item.blurb}</span>
                    <em>
                      t {show(node.oosT)} · PF {showRatio(node.oosPf)} · {node.oosN == null ? "—" : fmt.format(node.oosN)} trades
                    </em>
                  </button>
                );
              })}
            </div>
            <h3 className="subhead">Lo que se enterró</h3>
            <ul className="graves">
              {research.graveyard.map((grave) => (
                <li key={grave.id}>
                  <strong>{grave.title}</strong>
                  <p>{grave.detail}</p>
                  <p className="fine">
                    {fmt.format(grave.count)} fichas
                    {grave.medianT != null ? ` · t mediano ${fmt2.format(grave.medianT)}` : ""}
                    {" · "}
                    {Object.entries(grave.verdicts)
                      .map(([name, count]) => `${fmt.format(count)} ${verdictRawEs(name)}`)
                      .join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="stage" id="escalera">
          <div className="copy">
            <p className="kicker">05 — Escalera</p>
            <h2>{usd(research.ladder.targetMonthly)} al mes</h2>
            <p className="lede">
              Camino simulado con {research.ladder.firms.join(", ")}. La política base da un {pct(research.ladder.rounded.p12)} a
              los 12 meses, un {pct(research.ladder.rounded.p18)} a los 18 y un {pct(research.ladder.rounded.p24)} a los 24. El mes
              mediano es el {headline.medianMonth}.
            </p>
            <div className="stat-row">
              <article className="stat">
                <b>{pct(research.ladder.rounded.p12)}</b>
                <span>12 meses</span>
              </article>
              <article className="stat">
                <b>{pct(research.ladder.rounded.p18)}</b>
                <span>18 meses</span>
              </article>
              <article className="stat">
                <b>{pct(research.ladder.rounded.p24)}</b>
                <span>24 meses</span>
              </article>
            </div>
            <p>
              Quien llega cobra, de mediana entre los meses 19 y 24, {headline.monthly == null ? "—" : usd(headline.monthly)}. El
              cuartil bajo de esa simulación se queda en {headline.p25 == null ? "—" : usd(headline.p25)}. La mediana no es una
              nómina.
            </p>
            <p>
              FTMO en dos pasos, con riesgo del {pct(research.ladder.ftmo.risk, 2)}: en la simulación pasa el{" "}
              {pct(research.ladder.ftmo.pass)} en {fmt.format(research.ladder.ftmo.days)} días. Las cuentas no se cubren entre sí:
              esa cobertura está prohibida.
            </p>
            <p className="warn">Cifras de una simulación. El pasado de un backtest no es una renta futura.</p>
            <details>
              <summary>Otras políticas de la simulación</summary>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Política</th>
                      <th>12 m</th>
                      <th>18 m</th>
                      <th>24 m</th>
                      <th>Mes</th>
                      <th>Cobro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {research.ladder.policies.map((policy) => (
                      <tr key={`${policy.source}-${policy.id}`}>
                        <td>{policyName(policy.id)}</td>
                        <td>{policy.p12 == null ? "—" : pctSmart(policy.p12)}</td>
                        <td>{policy.p18 == null ? "—" : pctSmart(policy.p18)}</td>
                        <td>{policy.p24 == null ? "—" : pctSmart(policy.p24)}</td>
                        <td>{policy.medianMonth ?? "—"}</td>
                        <td>{policy.monthly == null ? "—" : usd(policy.monthly)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="fine">
                En la política base, el capital financiado al final de la simulación es{" "}
                {headline.fundedEnd == null ? "—" : usd(headline.fundedEnd)}, las comisiones suman{" "}
                {headline.fees == null ? "—" : usd(headline.fees)} y las roturas medias son{" "}
                {headline.breaches == null ? "—" : fmt1.format(headline.breaches)}.
              </p>
            </details>
          </div>
        </section>

        <section className="closing" id="nota">
          <p className="kicker">Nota</p>
          <h2>Esto no es un consejo</h2>
          <p>
            Investigación con backtests y operativa en paper. No es asesoramiento financiero, ni una oferta, ni una invitación
            a operar. Los resultados pasados, también los de fuera de muestra, no anticipan resultados futuros. Las
            probabilidades de la escalera describen una simulación de cuentas financiadas. Operar implica riesgo de perder el
            capital.
          </p>
          <p className="fine dark">
            Fuentes: registro de {fmt.format(research.counts.rows)} fichas, {fmt.format(research.counts.batches)} tandas, las
            simulaciones de escalera y el resumen del {research.asOf.split("-").reverse().join("/")}. Familias de estrategia:{" "}
            {fmt.format(research.counts.strategies)}.
          </p>
        </section>
      </div>
    </>
  );
}

function show(value: number | null) {
  if (value == null) return "—";
  return value.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showRatio(value: number | null) {
  if (value == null) return "—";
  if (Math.abs(value) >= 1e8) return "∞";
  return show(value);
}
