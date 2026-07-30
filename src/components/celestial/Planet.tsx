import { useTexture } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { CelestialBody } from "../../data/celestialBodies";

const DISPLAY_ROTATION_SPEED_RADIANS_PER_SECOND = 0.12;

interface PlanetProps {
  body: CelestialBody;
  position?: ThreeElements["mesh"]["position"];
  visualScale?: number;
}

interface PlanetMaterialProps {
  textureUrl: string | null;
  color: CelestialBody["color"];
}

function TexturedPlanetMaterial({ textureUrl }: { textureUrl: string }) {
  const texture = useTexture(textureUrl, (loadedTexture) => {
    loadedTexture.colorSpace = THREE.SRGBColorSpace;
    loadedTexture.needsUpdate = true;
  });

  return (
    <meshStandardMaterial
      map={texture}
      roughness={0.82}
      metalness={0.02}
    />
  );
}

function PlanetMaterial({
  textureUrl,
  color,
}: PlanetMaterialProps) {
  if (textureUrl) {
    return <TexturedPlanetMaterial textureUrl={textureUrl} />;
  }

  return (
    <meshStandardMaterial
      color={color}
      roughness={0.82}
      metalness={0.02}
    />
  );
}

export function Planet({
  body,
  position,
  visualScale = 1,
}: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y +=
        DISPLAY_ROTATION_SPEED_RADIANS_PER_SECOND * delta;
    }
  });

  return (
    <mesh
      ref={planetRef}
      name={body.name}
      position={position}
      rotation={[0.08, -0.35, -0.05]}
      userData={{ celestialBodyId: body.id, bodyName: body.name, kind: body.kind }}
    >
      <sphereGeometry args={[body.radiusKm * visualScale, 64, 64]} />
      <PlanetMaterial textureUrl={body.textureUrl} color={body.color} />
    </mesh>
  );
}
