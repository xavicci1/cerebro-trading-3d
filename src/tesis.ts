import raw from "./generated/tesis.json";

export interface ThesisStrategy {
  id: string;
  index: number;
  verdict: string;
}

export interface ThesisItem {
  id: string;
  title: string;
  authors: string;
  year: string | null;
  institution: string | null;
  family: string;
  idea: string;
  verdict: "KEEP" | "watchlist" | "discarded" | "sin ficha";
  mixed: boolean;
  p2: boolean;
  neurons: number[];
  strategies: ThesisStrategy[];
}

export interface ThesisFamily {
  id: string;
  title: string;
  lede: string;
}

export interface ThesisFile {
  families: ThesisFamily[];
  items: ThesisItem[];
}

export const tesis = raw as ThesisFile;
