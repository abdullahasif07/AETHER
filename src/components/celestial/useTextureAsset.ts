import { useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export function preloadTextureAsset(textureUrl: string) {
  useTexture.preload(textureUrl);
}

export function useTextureAsset(textureUrl: string) {
  const cachedTexture = useTexture(textureUrl);
  const texture = useMemo(() => {
    const configuredTexture = cachedTexture.clone();

    configuredTexture.colorSpace = THREE.SRGBColorSpace;
    configuredTexture.wrapS = THREE.RepeatWrapping;
    configuredTexture.wrapT = THREE.ClampToEdgeWrapping;
    configuredTexture.anisotropy = 4;
    configuredTexture.needsUpdate = true;

    return configuredTexture;
  }, [cachedTexture]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}
