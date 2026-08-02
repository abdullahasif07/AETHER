import { useEffect, useState } from "react";
import * as THREE from "three";

export function useTextureAsset(textureUrl: string | null) {
  const [loadedAsset, setLoadedAsset] = useState<{
    texture: THREE.Texture;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (!textureUrl) {
      return;
    }

    let isCurrent = true;
    const loadedTexture = new THREE.TextureLoader().load(
      textureUrl,
      (nextTexture) => {
        nextTexture.colorSpace = THREE.SRGBColorSpace;
        nextTexture.wrapS = THREE.RepeatWrapping;
        nextTexture.wrapT = THREE.ClampToEdgeWrapping;
        nextTexture.anisotropy = 4;
        nextTexture.needsUpdate = true;

        if (isCurrent) {
          setLoadedAsset({ texture: nextTexture, url: textureUrl });
        }
      },
      undefined,
      () => {
        if (isCurrent) {
          setLoadedAsset(null);
        }
      },
    );

    return () => {
      isCurrent = false;
      loadedTexture.dispose();
    };
  }, [textureUrl]);

  return loadedAsset?.url === textureUrl ? loadedAsset.texture : null;
}
