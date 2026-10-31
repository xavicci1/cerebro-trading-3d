import * as THREE from "three";

let glow: THREE.CanvasTexture | null = null;

export function getGlowTexture() {
  if (glow) return glow;
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No hay lienzo 2D");
  const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.4)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  glow = new THREE.CanvasTexture(canvas);
  glow.colorSpace = THREE.SRGBColorSpace;
  return glow;
}

export function labelTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No hay lienzo 2D");
  context.clearRect(0, 0, 640, 160);
  context.fillStyle = "#f6f1e7";
  context.textAlign = "center";
  context.textBaseline = "middle";
  let size = 64;
  context.font = `600 ${size}px Outfit, sans-serif`;
  while (context.measureText(text).width > 600 && size > 28) {
    size -= 2;
    context.font = `600 ${size}px Outfit, sans-serif`;
  }
  context.fillText(text, 320, 84);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createSoftMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    vertexShader: `
      attribute float aSize;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = aSize * (42.0 / max(2.0, -mv.z));
        gl_PointSize = clamp(size, 1.5, 11.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        vec2 p = gl_PointCoord - vec2(0.5);
        float d = length(p);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.08, d);
        gl_FragColor = vec4(vColor, a * 0.92);
      }
    `,
  });
}
