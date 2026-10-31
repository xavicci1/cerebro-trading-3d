import { useState } from "react";
import { strategyName, symbolName } from "./format";
import { nodes } from "./research";
import { tesis, type ThesisItem } from "./tesis";

const VERDICT_TEXT: Record<ThesisItem["verdict"], string> = {
  KEEP: "KEEP",
  watchlist: "watchlist",
  discarded: "discarded",
  "sin ficha": "sin ficha",
};

export function TesisSection({
  onLit,
  onOpen,
}: {
  onLit: (indexes: number[] | null) => void;
  onOpen: (index: number) => void;
}) {
  const [pinned, setPinned] = useState<string | null>(null);

  function light(item: ThesisItem | null) {
    onLit(item && item.neurons.length ? item.neurons : null);
  }

  return (
    <section className="stage" id="tesis">
      <div className="copy wide">
        <p className="kicker">Tesis</p>
        <h2>Tesis</h2>
        <p className="lede">
          {tesis.items.length} papers, tesis y teorías de oficio absorbidas por el cerebro. Pasa el cursor o toca una ficha:
          sus neuronas se encienden.
        </p>
        <div className="chips">
          {tesis.families.map((family) => (
            <a key={family.id} href={`#familia-${family.id}`}>
              {family.title}
            </a>
          ))}
        </div>
        {tesis.families.map((family) => {
          const items = tesis.items.filter((item) => item.family === family.id);
          if (!items.length) return null;
          return (
            <div key={family.id} className="family-block" id={`familia-${family.id}`}>
              <h3>{family.title}</h3>
              <p className="fine">{family.lede}</p>
              {items.map((item) => {
                const active = pinned === item.id;
                const where = [item.year, item.institution].filter(Boolean).join(" · ");
                return (
                  <article
                    key={item.id}
                    className={active ? "thesis on" : "thesis"}
                    tabIndex={0}
                    onMouseEnter={() => light(item)}
                    onMouseLeave={() => light(tesis.items.find((entry) => entry.id === pinned) ?? null)}
                    onFocus={() => light(item)}
                    onClick={() => {
                      const next = active ? null : item.id;
                      setPinned(next);
                      light(next ? item : null);
                    }}
                  >
                    <div className="sheet-top">
                      <span className={`badge verdict-${item.verdict.replace(" ", "-")}`}>{VERDICT_TEXT[item.verdict]}</span>
                      {item.p2 && <span className="flag">Cartera P2</span>}
                    </div>
                    <h3>{item.title}</h3>
                    <p className="meta-line">{item.authors}</p>
                    {where && <p className="meta-line">{where}</p>}
                    <p className="idea">{item.idea}</p>
                    <p className="fine">
                      {item.neurons.length
                        ? `${item.neurons.length} neuronas${item.mixed ? " · hay KEEP y también fichas descartadas" : ""}`
                        : "Sin neurona citada en el registro."}
                    </p>
                    {item.strategies.length > 0 && (
                      <div className="neuron-row">
                        {item.strategies.map((strategy) => {
                          const node = nodes[strategy.index];
                          return (
                            <button
                              key={strategy.id}
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                onOpen(strategy.index);
                              }}
                            >
                              {strategyName(strategy.id)}
                              {node ? ` · ${symbolName(node.symbol)}` : ""}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}
