export const PALETTE = {
  bg: "#08090b",
  discard: "#8d5564",
  watch: "#ffc15a",
  keep: "#d6ff4a",
  control: "#9eb0ff",
  note: "#d5c6ff",
  ink: "#f6f1e7",
  copper: "#e4b48a",
} as const;

export const VERDICT_COLOR = [
  PALETTE.discard,
  PALETTE.watch,
  PALETTE.keep,
  PALETTE.control,
  PALETTE.note,
] as const;

export const VERDICT_LABEL = ["Descartar", "Vigilar", "Conservar", "Control", "Nota"] as const;
