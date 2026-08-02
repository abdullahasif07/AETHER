import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitLine } from "../components/celestial/OrbitLine";
import { Planet } from "../components/celestial/Planet";
import { celestialBodies } from "../data/celestialBodies";
import {
  scaleDistanceKmToSceneUnits,
  scaleRadiusKmToSceneUnits,
} from "../lib/scale";

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
    >
      <color attach="background" args={["#020308"]} />

      <ambientLight intensity={0.2} />
      <directionalLight
        position={[3, 2, 4]}
        color="#f4f1df"
        intensity={2.4}
      />
      <pointLight
        position={[-3, -1, -2]}
        color="#5f82a8"
        intensity={0.55}
      />

      <Suspense fallback={<LoadingFallback />}>
        <group>
          {orbitingBodies.map(({ body, orbitRadius }) => (
            <OrbitLine key={body.id} radius={orbitRadius} />
          ))}

          {sceneBodies.map(({ body, displayRadius, position }) => (
            <Planet
              key={body.id}
              body={body}
              displayRadius={displayRadius}
              position={position}
            />
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
