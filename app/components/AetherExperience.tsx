"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import gsap from "gsap";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useAetherStore } from "../store/useAetherStore";

function createSurfaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createLinearGradient(0, 0, 1024, 512);
  gradient.addColorStop(0, "#304c49");
  gradient.addColorStop(0.35, "#a9b681");
  gradient.addColorStop(0.62, "#704b36");
  gradient.addColorStop(1, "#101a1c");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1024, 512);

  let seed = 726;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let index = 0; index < 360; index += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const radiusX = 6 + random() * 92;
    const radiusY = 2 + random() * 24;
    const hue = random() > 0.5 ? "214, 236, 197" : "73, 45, 34";
    context.fillStyle = `rgba(${hue}, ${0.025 + random() * 0.12})`;
    context.beginPath();
    context.ellipse(
      x,
      y,
      radiusX,
      radiusY,
      random() * Math.PI,
      0,
      Math.PI * 2,
    );
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function World() {
  const mesh = useRef<THREE.Mesh>(null);
  const isRotating = useAetherStore((state) => state.isRotating);
  const rotationSpeed = useAetherStore((state) => state.rotationSpeed);
  const texture = useMemo(createSurfaceTexture, []);

  useEffect(() => {
    if (!mesh.current) return;
    const entrance = gsap.fromTo(
      mesh.current.scale,
      { x: 0.001, y: 0.001, z: 0.001 },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.8,
        ease: "expo.out",
      },
    );

    return () => {
      entrance.kill();
      texture?.dispose();
    };
  }, [texture]);

  useFrame((_, delta) => {
    if (mesh.current && isRotating) {
      mesh.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <mesh ref={mesh} rotation={[0.14, -0.45, -0.08]}>
      <sphereGeometry args={[1.72, 128, 128]} />
      <meshStandardMaterial
        map={texture}
        color="#bed0a3"
        roughness={0.76}
        metalness={0.04}
        bumpMap={texture}
        bumpScale={0.045}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#020408"]} />
      <fog attach="fog" args={["#020408", 6, 14]} />
      <ambientLight intensity={0.13} />
      <directionalLight
        position={[-3.5, 4, 5]}
        color="#e8ffe0"
        intensity={4.2}
      />
      <pointLight
        position={[4, -1.5, -2]}
        color="#6888a8"
        intensity={8}
        distance={8}
      />
      <World />
      <Preload all />
    </>
  );
}

export default function AetherExperience() {
  const isRotating = useAetherStore((state) => state.isRotating);
  const toggleRotation = useAetherStore((state) => state.toggleRotation);
  const interfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interfaceRef.current) return;
    const intro = gsap.fromTo(
      interfaceRef.current.children,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        delay: 0.45,
        ease: "power3.out",
      },
    );

    return () => intro.kill();
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#020408]">
      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.05, 5.2], fov: 42 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 23%, rgba(216, 255, 114, 0.08), transparent 1px), radial-gradient(circle at 79% 66%, rgba(255, 255, 255, 0.09), transparent 1px)",
          backgroundSize: "127px 127px, 191px 191px",
        }}
        aria-hidden="true"
      />

      <div
        ref={interfaceRef}
        className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col justify-between p-6 sm:p-10 lg:p-14"
      >
        <header className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-[#d8ff72]">
              Aether
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/35">
              Deep space observatory
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d8ff72] shadow-[0_0_14px_#d8ff72]" />
            Signal acquired
          </div>
        </header>

        <section className="max-w-lg">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
            Week 01 · Day 01
          </p>
          <h1 className="text-5xl font-light uppercase leading-[0.88] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
            First
            <br />
            <span className="font-medium text-[#d8ff72]">Light</span>
          </h1>
          <div className="mt-7 flex items-end justify-between gap-8 border-t border-white/15 pt-4">
            <p className="max-w-[18rem] text-xs leading-5 text-white/48">
              One sphere. One signal. The first stable object in the AETHER
              universe.
            </p>
            <button
              type="button"
              onClick={toggleRotation}
              className="pointer-events-auto shrink-0 border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/65 transition-colors hover:border-[#d8ff72]/60 hover:text-[#d8ff72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8ff72]"
              aria-pressed={!isRotating}
              aria-label={isRotating ? "Pause sphere rotation" : "Resume sphere rotation"}
            >
              {isRotating ? "Pause rotation" : "Resume rotation"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
