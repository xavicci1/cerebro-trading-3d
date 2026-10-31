export type SceneId = "relato" | "cerebro" | "tuberia" | "embudo" | "escalera";

export const scrollState = {
  story: 0,
  scene: "relato" as SceneId,
};

export const motion = {
  reduced: false,
};

export const fijo =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("fijo");

const listeners = new Set<() => void>();

export function beatOf(story: number) {
  if (story < 0.22) return 0;
  if (story < 0.48) return 1;
  if (story < 0.74) return 2;
  return 3;
}

export function publishScroll(story: number, scene: SceneId) {
  const beatChanged = beatOf(scrollState.story) !== beatOf(story);
  const sceneChanged = scrollState.scene !== scene;
  scrollState.story = story;
  scrollState.scene = scene;
  if (beatChanged || sceneChanged) listeners.forEach((fn) => fn());
}

export function subscribeScroll(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function sceneAtMarker(markerRatio = 0.38): SceneId {
  const marker = window.innerHeight * markerRatio;
  const ids: SceneId[] = ["relato", "cerebro", "tuberia", "embudo", "escalera"];
  let current: SceneId = "relato";
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= marker && rect.bottom > marker) current = id;
  }
  return current;
}

export function storyProgress() {
  const el = document.getElementById("relato");
  if (!el) return 0;
  const total = el.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
  return scrolled / total;
}
