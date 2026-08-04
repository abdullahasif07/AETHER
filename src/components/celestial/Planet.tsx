import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { CelestialBody } from "../../data/celestialBodies";
import {
  getAxialRotationDeltaRadians,
  normalizeAngleRadians,
} from "../../lib/simulation";
import { useSimulationStore } from "../../store/simulationStore";
import { PlanetRings } from "./PlanetRings";
import { useTextureAsset } from "./useTextureAsset";

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

  if (isStar) {
    return (
      <meshBasicMaterial
        map={texture}
        color={texture ? "#ffffff" : body.color}
        toneMapped={false}
      />
    );
  }

  return (
    <meshLambertMaterial
      map={texture}
      color={texture ? "#ffffff" : body.color}
      emissive="#080808"
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
    if (!planetRef.current) {
      return;
    }

    const rotationDelta = getAxialRotationDeltaRadians(
      body.rotationPeriodHours,
      delta,
      useSimulationStore.getState().timeScale,
    );

    if (rotationDelta === 0) {
      return;
    }

    planetRef.current.rotation.y = normalizeAngleRadians(
      planetRef.current.rotation.y + rotationDelta,
    );
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
