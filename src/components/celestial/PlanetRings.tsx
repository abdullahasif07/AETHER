import { useMemo } from "react";
import * as THREE from "three";
import type { CelestialBodyRings } from "../../data/celestialBodies";
import { useTextureAsset } from "./useTextureAsset";

const RING_SEGMENTS = 192;
const ALPHA_CUTOFF = 0.02;

interface PlanetRingsProps {
  bodyRadius: number;
  rings: CelestialBodyRings;
}

export function PlanetRings({ bodyRadius, rings }: PlanetRingsProps) {
  const texture = useTextureAsset(rings.textureUrl);
  const innerRadius = bodyRadius * rings.innerRadiusMultiplier;
  const outerRadius = bodyRadius * rings.outerRadiusMultiplier;
  const tiltRadians = THREE.MathUtils.degToRad(rings.tiltDegrees);

  const geometry = useMemo(() => {
    const ringGeometry = new THREE.RingGeometry(
      innerRadius,
      outerRadius,
      RING_SEGMENTS,
    );
    const positions = ringGeometry.attributes.position;
    const uvs = ringGeometry.attributes.uv;

    for (let index = 0; index < positions.count; index += 1) {
      const vertexRadius = Math.hypot(
        positions.getX(index),
        positions.getY(index),
      );
      const radialProgress =
        (vertexRadius - innerRadius) / (outerRadius - innerRadius);

      uvs.setXY(index, radialProgress, 0.5);
    }

    uvs.needsUpdate = true;
    ringGeometry.rotateX(Math.PI / 2);

    return ringGeometry;
  }, [innerRadius, outerRadius]);

  return (
    <mesh
      geometry={geometry}
      rotation={[0, 0, tiltRadians]}
      raycast={() => null}
    >
      <meshStandardMaterial
        map={texture}
        alphaTest={ALPHA_CUTOFF}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
}
