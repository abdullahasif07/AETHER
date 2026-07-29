import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import surfaceTextureUrl from "../../assets/earth-blue-marble.jpg";

const ROTATION_SPEED = 0.12;

export function SpinningSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const surfaceTexture = useTexture(surfaceTextureUrl, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  });

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += ROTATION_SPEED * delta;
    }
  });

  return (
    <mesh ref={sphereRef} rotation={[0.08, -0.35, -0.05]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        map={surfaceTexture}
        roughness={0.82}
        metalness={0.02}
      />
    </mesh>
  );
}
