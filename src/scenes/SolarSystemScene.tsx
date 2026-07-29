import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SpinningSphere } from "../components/celestial/SpinningSphere";

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
        position: [0, 0, 4.5],
        fov: 45,
        near: 0.1,
        far: 100,
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
        <SpinningSphere />
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        minDistance={3}
        maxDistance={7}
      />
    </Canvas>
  );
}
