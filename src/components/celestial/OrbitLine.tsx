import { Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

const ORBIT_SEGMENTS = 128;
const ORBIT_COLOR = "#7d8da6";
const ORBIT_OPACITY = 0.24;

interface OrbitLineProps {
  radius: number;
}

export function OrbitLine({ radius }: OrbitLineProps) {
  const points = useMemo(() => {
    return Array.from({ length: ORBIT_SEGMENTS + 1 }, (_, index) => {
      const angle = (index / ORBIT_SEGMENTS) * Math.PI * 2;

      return new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius,
      );
    });
  }, [radius]);

  return (
    <Line
      points={points}
      color={ORBIT_COLOR}
      lineWidth={1}
      transparent
      opacity={ORBIT_OPACITY}
      raycast={() => null}
    />
  );
}
