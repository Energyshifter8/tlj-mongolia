'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, RoundedBox } from '@react-three/drei'
import type { Group } from 'three'

/* ─── low-poly croissant ─── */
function Croissant() {
  const ref = useRef<Group>(null)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15
  })

  return (
    <group ref={ref} position={[0, 0.3, 0]}>
      {/* body — torus arc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.18, 8, 16, Math.PI * 1.2]} />
        <meshStandardMaterial color="#c9a24b" metalness={0.35} roughness={0.45} />
      </mesh>
      {/* tip left */}
      <mesh position={[-0.52, 0, -0.15]} rotation={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.12, 0.3, 6]} />
        <meshStandardMaterial color="#d4b06a" metalness={0.2} roughness={0.5} />
      </mesh>
      {/* tip right */}
      <mesh position={[0.52, 0, -0.15]} rotation={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.12, 0.3, 6]} />
        <meshStandardMaterial color="#d4b06a" metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  )
}

/* ─── low-poly cake ─── */
function Cake() {
  const ref = useRef<Group>(null)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15
  })

  return (
    <group ref={ref} position={[0, -0.35, 0]}>
      {/* base tier */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.65, 0.35, 8]} />
        <meshStandardMaterial color="#f2ead9" metalness={0.1} roughness={0.6} />
      </mesh>
      {/* top tier */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.42, 0.45, 0.3, 8]} />
        <meshStandardMaterial color="#f2ead9" metalness={0.1} roughness={0.6} />
      </mesh>
      {/* gold drip ring */}
      <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.03, 6, 12]} />
        <meshStandardMaterial color="#c9a24b" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* top ornament */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshStandardMaterial color="#c9a24b" metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  )
}

/* ─── display pedestal ─── */
function Pedestal() {
  return (
    <RoundedBox args={[3.2, 0.12, 3.2]} radius={0.04} smoothness={2} position={[0, -0.82, 0]}>
      <meshStandardMaterial color="#3a2e26" metalness={0.15} roughness={0.7} />
    </RoundedBox>
  )
}

/* ─── scene ─── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f2ead9" />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#c9a24b" />

      <Croissant />
      <Cake />
      <Pedestal />

      <Environment preset="studio" />

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={2.5}
        maxDistance={6}
      />
    </>
  )
}

/* ─── exported wrapper ─── */
interface PastryShowcaseProps {
  className?: string
}

export default function PastryShowcase({ className = '' }: PastryShowcaseProps) {
  return (
    <div className={`aspect-square w-full max-w-2xl ${className}`}>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-accent" />
            <span className="ml-3 font-mono text-xs uppercase tracking-widest text-foreground/50">
              Loading 3D...
            </span>
          </div>
        }
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [3, 2.5, 3], fov: 40 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: '#0a0908' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  )
}
