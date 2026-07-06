"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { Group, Mesh } from "three";
import * as THREE from "three";

const GOLD = "#c9a24b";
const GOLD_DIM = "#8a6d30";

/* ─── Inner solid icosahedron ─────────────────────────── */
function BadgeCore() {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.85, 0]} />
      <meshStandardMaterial
        color={GOLD}
        metalness={0.6}
        roughness={0.25}
        emissive={GOLD_DIM}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

/* ─── Outer wireframe icosahedron ─────────────────────── */
function BadgeWireframe() {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.12;
      ref.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.15, 0]} />
      <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.15} />
    </mesh>
  );
}

/* ─── Orbiting ring ───────────────────────────────────── */
function OrbitRing({ radius, speed, opacity }: { radius: number; speed: number; opacity: number }) {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 3, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 64]} />
      <meshBasicMaterial color={GOLD} transparent opacity={opacity} />
    </mesh>
  );
}

/* ─── Particle field ──────────────────────────────────── */
function Particles({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef(new Float32Array(count * 3));

  useEffect(() => {
    const arr = positions.current;
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={GOLD} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ─── Postprocessing ──────────────────────────────────── */
function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0015, 0.0015)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={true}
        modulationOffset={0.5}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

/* ─── Scene with mouse parallax + pause ───────────────── */
function Scene({ visible }: { visible: boolean }) {
  const groupRef = useRef<Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    [],
  );

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  useFrame(() => {
    if (!groupRef.current || !visible) return;
    const targetX = mouse.current.y * 0.15;
    const targetY = mouse.current.x * 0.15;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#f5f5f5" />
      <pointLight position={[-4, 2, -3]} intensity={0.8} color={GOLD} distance={15} />
      <pointLight position={[3, -2, 4]} intensity={0.3} color="#3b82f6" distance={12} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={groupRef}>
          <BadgeCore />
          <BadgeWireframe />
          <OrbitRing radius={1.5} speed={0.3} opacity={0.25} />
          <OrbitRing radius={1.9} speed={-0.2} opacity={0.12} />
          <OrbitRing radius={2.3} speed={0.15} opacity={0.08} />
        </group>
      </Float>

      <Particles count={80} />

      <Effects />

      <Environment preset="night" />
    </>
  );
}

/* ─── Exported component ──────────────────────────────── */
interface HeroSceneProps {
  className?: string;
}

export default function HeroScene({ className = "" }: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene visible={visible} />
      </Canvas>
    </div>
  );
}
