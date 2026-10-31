import type { FilterId } from "./research";

export const BEATS: { kicker: string; title: string; body: string; byline?: string }[] = [
  {
    kicker: "",
    title: "Proyecto Cerebro",
    byline: "por Xavier Cabré Lugo",
    body: "Investigación de trading cuantitativo · Modelado financiero · Red neuronal de estrategias",
  },
  {
    kicker: "01 — Entrada",
    title: "15.575 variantes",
    body: "Veinticinco tandas. Datos de un minuto y de tick, de 2020 a octubre de 2026. En el registro quedan 2.192 fichas y 286 familias de estrategias.",
  },
  {
    kicker: "02 — El filtro",
    title: "El filtro es seco",
    body: "Se descarta si el t fuera de muestra no llega a 1,5, el profit factor no llega a 1,1, hay menos de 100 trades o el drawdown pasa del 20 %. Encima van el DSR sobre esas pruebas, Holm, un mercado aleatorio de control y un block bootstrap.",
  },
  {
    kicker: "03 — Lo que queda",
    title: "Seis en la cartera",
    body: "Williams en el Nasdaq y en bitcoin, Crabel en el Nasdaq, Fabio en el DAX, Unger en el oro y el turno de mes en el oro. El Sharpe diario de la cartera P2 ronda 2,05. Lo demás se vigila o se entierra.",
  },
];

export const STAGES = [
  { id: "datos", title: "Datos", text: "Velas de un minuto y tick, de 2020 a octubre de 2026." },
  { id: "forecast", title: "Pronóstico", text: "Una previsión de hacia dónde puede ir el precio." },
  { id: "alpha", title: "Alfa", text: "La señal en bruto, antes de creerla." },
  { id: "decisiones", title: "Decisiones", text: "Cuándo entrar, cuándo salir y cuándo no hacer nada." },
  { id: "riesgo", title: "Riesgo", text: "El tamaño, el stop y un techo de drawdown." },
  { id: "cartera", title: "Cartera", text: "Cómo conviven las que han sobrevivido." },
  {
    id: "test",
    title: "Prueba",
    text: "Dentro de muestra 2020–2023. Fuera, 2024–octubre 2026. DSR, Holm, un nulo aleatorio y block bootstrap.",
  },
  { id: "ejecucion", title: "Ejecución", text: "La orden, el tamaño y el momento de mandarla." },
];

export const MODES = [
  { id: "cerebro", label: "Cerebro", hint: "Girar, acercar, arrastrar" },
  { id: "neuronas", label: "Neuronas", hint: "La red enciende sus sinapsis" },
  { id: "graficos", label: "Gráficos", hint: "Senderos de capital en 3D" },
  { id: "sismo", label: "Sismo", hint: "Relieve de resultados" },
];

export const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "p2", label: "Cartera P2" },
  { id: "keep", label: "Conservar" },
  { id: "watch", label: "Vigilar" },
  { id: "discard", label: "Descartar" },
  { id: "control", label: "Control" },
  { id: "note", label: "Notas" },
];

export const NAV: { id: string; label: string }[] = [
  { id: "relato", label: "Relato" },
  { id: "cerebro", label: "Cerebro" },
  { id: "neuronas", label: "Neuronas" },
  { id: "graficos", label: "Gráficos" },
  { id: "sismo", label: "Sismo" },
  { id: "tuberia", label: "Tubería" },
  { id: "embudo", label: "Embudo" },
  { id: "escalera", label: "Escalera" },
  { id: "tesis", label: "Tesis" },
];
