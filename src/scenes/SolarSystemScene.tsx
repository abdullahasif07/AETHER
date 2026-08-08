import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { OrbitLine } from "../components/celestial/OrbitLine";
import { Planet } from "../components/celestial/Planet";
import { preloadTextureAsset } from "../components/celestial/useTextureAsset";
import { celestialBodies } from "../data/celestialBodies";
import {
  scaleDistanceKmToSceneUnits,
  scaleRadiusKmToSceneUnits,
} from "../lib/scale";
import {
  getOrbitalRevolutionDeltaRadians,
  normalizeAngleRadians,
} from "../lib/simulation";
import { useSelectionStore } from "../store/selectionStore";
import { useSimulationStore } from "../store/simulationStore";

const ORBIT_START_ANGLE_RADIANS = 0.35;
const ORBIT_ANGLE_STEP_RADIANS = Math.PI * (3 - Math.sqrt(5));

let nextOrbitIndex = 0;

const sceneBodies = celestialBodies.map((body) => {
  const orbitRadius = scaleDistanceKmToSceneUnits(body.distanceFromSunKm);
  const orbitAngle = orbitRadius
    ? ORBIT_START_ANGLE_RADIANS +
      nextOrbitIndex++ * ORBIT_ANGLE_STEP_RADIANS
    : 0;

  return {
    body,
    displayRadius: scaleRadiusKmToSceneUnits(body.radiusKm),
    orbitRadius,
    position: [
      Math.cos(orbitAngle) * orbitRadius,
      0,
      Math.sin(orbitAngle) * orbitRadius,
    ] as [number, number, number],
  };
});

const orbitingBodies = sceneBodies.filter(({ orbitRadius }) => orbitRadius > 0);

for (const { body } of sceneBodies) {
  if (body.textureUrl) {
    preloadTextureAsset(body.textureUrl);
  }

  if (body.rings) {
    preloadTextureAsset(body.rings.textureUrl);
  }
}

interface AnimatedBodyProps {
  sceneBody: (typeof sceneBodies)[number];
}

function AnimatedBody({ sceneBody }: AnimatedBodyProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const { body, displayRadius, orbitRadius } = sceneBody;

  useFrame((_, delta) => {
    if (!orbitRef.current || orbitRadius === 0) {
      return;
    }

    const revolutionDelta = getOrbitalRevolutionDeltaRadians(
      body.orbitalPeriodDays,
      delta,
      useSimulationStore.getState().timeScale,
    );

    if (revolutionDelta === 0) {
      return;
    }

    orbitRef.current.rotation.y = normalizeAngleRadians(
      orbitRef.current.rotation.y + revolutionDelta,
    );
  });

  const initialOrbitRotation = Math.atan2(
    -sceneBody.position[2],
    sceneBody.position[0],
  );

  return (
    <group ref={orbitRef} rotation={[0, initialOrbitRotation, 0]}>
      <Planet
        body={body}
        displayRadius={displayRadius}
        position={[orbitRadius, 0, 0]}
      />
    </group>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <span className="whitespace-nowrap text-xs uppercase tracking-[0.3em] text-white/55">
        Loading world
      </span>
    </Html>
  );
}

export function SolarSystemScene() {
  return (
    <Canvas
      camera={{
        position: [0, 20, 30],
        fov: 50,
        near: 0.1,
        far: 150,
      }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onPointerMissed={() =>
        useSelectionStore.getState().clearSelection()
      }
    >
      <color attach="background" args={["#020308"]} />

      <ambientLight intensity={0.3} />
      <directionalLight
        position={[3, 2, 4]}
        color="#fff8e8"
        intensity={1.15}
      />
      <pointLight
        position={[-3, -1, -2]}
        color="#5f82a8"
        intensity={0.2}
      />

      <Suspense fallback={<LoadingFallback />}>
        <group>
          {orbitingBodies.map(({ body, orbitRadius }) => (
            <OrbitLine key={body.id} radius={orbitRadius} />
          ))}

          {sceneBodies.map((sceneBody) => (
            <AnimatedBody key={sceneBody.body.id} sceneBody={sceneBody} />
          ))}
        </group>
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        minDistance={8}
        maxDistance={50}
      />
    </Canvas>
  );
}
