'use client'

import { Trail } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

const GOLD = '#c9a24b'
const BODY_DARK = '#1a1512'
const BODY_MID = '#2a2218'

/* ─── Scroll-driven flight path ───────────────────────── */
function useFlightPath() {
  return useMemo(() => {
    const points = [
      new THREE.Vector3(-8, 4, -2),    // enter top-left during hero
      new THREE.Vector3(-4, 2, 0),      // swoop down-left
      new THREE.Vector3(0, 0.5, 1),     // center-low during brand story
      new THREE.Vector3(4, 1.5, 0),     // rise through features
      new THREE.Vector3(7, 3, -1),      // exit top-right near showcase
      new THREE.Vector3(10, 5, -2),     // off-screen exit
    ]
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
  }, [])
}

/* ─── Low-poly falcon geometry ─────────────────────────── */
function Falcon({ flapSpeed = 3 }: { flapSpeed?: number }) {
  const groupRef = useRef<Group>(null)
  const leftWingRef = useRef<Mesh>(null)
  const rightWingRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // wing flap via sine wave
    const t = Date.now() * 0.001
    const flap = Math.sin(t * flapSpeed) * 0.6

    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = flap
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = -flap
    }
  })

  return (
    <group ref={groupRef} scale={0.3}>
      {/* body — tapered capsule */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.8, 4, 8]} />
        <meshStandardMaterial color={BODY_MID} metalness={0.2} roughness={0.6} />
      </mesh>

      {/* head — small sphere */}
      <mesh position={[0, 0.05, -0.55]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshStandardMaterial color={BODY_DARK} metalness={0.15} roughness={0.7} />
      </mesh>

      {/* beak — cone */}
      <mesh position={[0, 0.02, -0.72]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.04, 0.15, 4]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* tail — flat wedge */}
      <mesh position={[0, 0, 0.55]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.03, 0.3]} />
        <meshStandardMaterial color={BODY_DARK} metalness={0.1} roughness={0.8} />
      </mesh>

      {/* left wing */}
      <group ref={leftWingRef} position={[0.12, 0.05, -0.05]}>
        <mesh rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.8, 0.015, 0.25]} />
          <meshStandardMaterial color={BODY_DARK} metalness={0.15} roughness={0.7} />
        </mesh>
        {/* gold wing edge */}
        <mesh position={[0, 0, -0.13]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.8, 0.02, 0.02]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.3} emissive={GOLD} emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* right wing */}
      <group ref={rightWingRef} position={[-0.12, 0.05, -0.05]}>
        <mesh rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.8, 0.015, 0.25]} />
          <meshStandardMaterial color={BODY_DARK} metalness={0.15} roughness={0.7} />
        </mesh>
        {/* gold wing edge */}
        <mesh position={[0, 0, -0.13]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.8, 0.02, 0.02]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.3} emissive={GOLD} emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* eye — tiny gold dot */}
      <mesh position={[0.06, 0.08, -0.52]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.06, 0.08, -0.52]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

/* ─── Scroll-driven falcon movement ───────────────────── */
function ScrollFalcon({ visible }: { visible: boolean }) {
  const { camera } = useThree()
  const groupRef = useRef<Group>(null)
  const curve = useFlightPath()
  const progress = useRef(0)
  const targetProgress = useRef(0)

  useEffect(() => {
    if (!visible) return

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        targetProgress.current = self.progress
      },
    })

    return () => {
      st.kill()
    }
  }, [visible])

  useFrame(() => {
    if (!groupRef.current || !visible) return

    // smooth lerp toward target scroll progress
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress.current, 0.08)

    const t = Math.max(0, Math.min(1, progress.current))
    const point = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)

    groupRef.current.position.copy(point)

    // orient falcon to face direction of travel
    const up = new THREE.Vector3(0, 1, 0)
    const lookTarget = point.clone().add(tangent)
    groupRef.current.lookAt(lookTarget)

    // slight banking on turns
    const bank = Math.sin(progress.current * Math.PI * 4) * 0.15
    groupRef.current.rotation.z = bank
  })

  return (
    <group ref={groupRef}>
      <Trail
        width={0.6}
        length={6}
        color={GOLD}
        attenuation={(w) => w * w}
        decay={1.5}
      >
        <Falcon flapSpeed={3} />
      </Trail>
    </group>
  )
}

/* ─── Scene ────────────────────────────────────────────── */
function Scene({ visible }: { visible: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#f5f5f5" />
      <pointLight position={[0, 2, 0]} intensity={0.4} color={GOLD} distance={15} />

      <ScrollFalcon visible={visible} />
    </>
  )
}

/* ─── Exported wrapper ─────────────────────────────────── */
function checkWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function FalconOverlay() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)

  // lazy-mount: only after WebGL confirmed + small delay to let HeroScene initialize first
  useEffect(() => {
    if (!checkWebGL()) return
    const timer = setTimeout(() => setMounted(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  // pause when canvas leaves viewport entirely
  useEffect(() => {
    if (!mounted) return
    const canvas = document.querySelector('[data-falcon-canvas] canvas')
    if (!canvas) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(canvas.parentElement!)

    const onContextLost = (e: Event) => {
      e.preventDefault()
      console.warn('[FalconOverlay] WebGL context lost — preventing default')
    }
    const onContextRestored = () => {
      console.log('[FalconOverlay] WebGL context restored')
    }

    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)

    return () => {
      observer.disconnect()
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      data-falcon-canvas
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ background: 'transparent' }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene visible={visible} />
      </Canvas>
    </div>
  )
}
