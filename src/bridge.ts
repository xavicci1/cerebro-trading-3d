type ZoomFn = (factor: number) => void;

let zoomFn: ZoomFn | null = null;

export function bindZoom(fn: ZoomFn | null) {
  zoomFn = fn;
}

export function requestZoom(factor: number) {
  zoomFn?.(factor);
}
