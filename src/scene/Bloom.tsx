import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

export function Bloom() {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const effect = new EffectComposer(gl);
    effect.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.62, 0.38, 0.74);
    effect.addPass(bloom);
    return { effect, bloom };
  }, [gl, scene, camera, size.width, size.height]);

  useEffect(() => {
    composer.effect.setSize(size.width, size.height);
    composer.effect.setPixelRatio(Math.min(gl.getPixelRatio(), 1.25));
    composer.bloom.resolution.set(Math.max(1, size.width / 2), Math.max(1, size.height / 2));
  }, [composer, gl, size]);

  useEffect(() => () => composer.effect.dispose(), [composer]);

  useFrame(() => {
    composer.effect.render();
  }, 1);

  return null;
}
