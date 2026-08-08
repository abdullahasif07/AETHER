import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { CelestialBody } from "../../data/celestialBodies";
import {
  getAxialRotationDeltaRadians,
  normalizeAngleRadians,
} from "../../lib/simulation";
import { useSelectionStore } from "../../store/selectionStore";
import { useSimulationStore } from "../../store/simulationStore";
import { PlanetRings } from "./PlanetRings";
import { TextureErrorBoundary } from "./TextureErrorBoundary";
import { useTextureAsset } from "./useTextureAsset";

interface PlanetProps {
  body: CelestialBody;
  displayRadius: number;
  position?: ThreeElements["mesh"]["position"];
}

const MAX_SELECTION_MOVEMENT_PIXELS = 2;

interface BodyMaterialProps {
  body: CelestialBody;
}

function FallbackBodyMaterial({ body }: BodyMaterialProps) {
  const isStar = body.kind === "star";

  if (isStar) {
    return <meshBasicMaterial color={body.color} toneMapped={false} />;
  }

  return (
    <meshLambertMaterial
      color={body.color}
      emissive="#080808"
    />
  );
}

interface TexturedBodyMaterialProps extends BodyMaterialProps {
  textureUrl: string;
}

function TexturedBodyMaterial({ body, textureUrl }: TexturedBodyMaterialProps) {
  const texture = useTextureAsset(textureUrl);

  if (body.kind === "star") {
    return <meshBasicMaterial map={texture} toneMapped={false} />;
  }

  return <meshLambertMaterial map={texture} emissive="#080808" />;
}

function PlanetMaterial({ body }: BodyMaterialProps) {
  if (!body.textureUrl) {
    return <FallbackBodyMaterial body={body} />;
  }

  return (
    <TextureErrorBoundary fallback={<FallbackBodyMaterial body={body} />}>
      <TexturedBodyMaterial body={body} textureUrl={body.textureUrl} />
    </TextureErrorBoundary>
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
    <group
      position={position}
      onClick={(event) => {
        if (event.delta > MAX_SELECTION_MOVEMENT_PIXELS) {
          return;
        }

        event.stopPropagation();
        useSelectionStore.getState().selectBody(body.id);
      }}
    >
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
        <TextureErrorBoundary fallback={null}>
          <PlanetRings bodyRadius={displayRadius} rings={body.rings} />
        </TextureErrorBoundary>
      ) : null}
    </group>
  );
}
