import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { CelestialBody } from "../../data/celestialBodies";
import { PlanetRings } from "./PlanetRings";
import { useTextureAsset } from "./useTextureAsset";

const DISPLAY_ROTATION_SPEED_RADIANS_PER_SECOND = 0.12;

interface PlanetProps {
  body: CelestialBody;
  displayRadius: number;
  position?: ThreeElements["mesh"]["position"];
}

interface PlanetMaterialProps {
  body: CelestialBody;
}

function PlanetMaterial({ body }: PlanetMaterialProps) {
  const texture = useTextureAsset(body.textureUrl);
  const isStar = body.kind === "star";

  return (
    <meshStandardMaterial
      map={texture}
      color={texture ? "#ffffff" : body.color}
      emissive={isStar ? body.color : "#000000"}
      emissiveMap={isStar ? texture : null}
      emissiveIntensity={isStar ? 1.8 : 0}
      toneMapped={!isStar}
      roughness={0.82}
      metalness={0.02}
    />
  );
}

export function Planet({
  body,
  displayRadius,
  position,
}: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y +=
        DISPLAY_ROTATION_SPEED_RADIANS_PER_SECOND * delta;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={planetRef}
        name={body.name}
        rotation={[0.08, -0.35, -0.05]}
        userData={{
          celestialBodyId: body.id,
          bodyName: body.name,
          kind: body.kind,
        }}
      >
        <sphereGeometry args={[displayRadius, 64, 64]} />
        <PlanetMaterial body={body} />
      </mesh>

      {body.rings ? (
        <PlanetRings bodyRadius={displayRadius} rings={body.rings} />
      ) : null}
    </group>
  );
}
