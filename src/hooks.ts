import { useEffect, useState, useSyncExternalStore } from "react";
import { beatOf, scrollState, subscribeScroll, type SceneId } from "./scroll";

export function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function useScene(): SceneId {
  return useSyncExternalStore(
    subscribeScroll,
    () => scrollState.scene,
    () => "relato",
  );
}

export function useBeat() {
  return useSyncExternalStore(
    subscribeScroll,
    () => beatOf(scrollState.story),
    () => 0,
  );
}
