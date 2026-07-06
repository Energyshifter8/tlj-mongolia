'use client'

import { Trail } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { Group } from 'three'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

const GOLD = '#c9a24b'
const BODY_DARK = '#1e1a16'
const BODY_MID = '#2a2420'

/* ─── Scroll-driven path ────────────────────────────────
   6 control points tracing a ground-level route across the viewport.
   Wolf y stays near 0 (ground level) with only the subtle bob from gait. */
function useRunPath() {
  return useMemo(() => {
    const points = [
      new THREE.Vector3(-10, 0, 2),   // enter far-left
      new THREE.Vector3(-5, 0, -1),   // curve inward
      new THREE.Vector3(-1, 0, 1),    // center-low
      new THREE.Vector3(3, 0, -1.5),  // weave right
      new THREE.Vector3(7, 0, 0.5),   // far right
      new THREE.Vector3(12, 0, -1),   // exit off-screen
    ]
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.4)
  }, [])
}

/* ─── Low-poly running wolf (чоно) ─────────────────────
   All primitives, dark body tones with gold accents.
   Leg animation uses diagonal gait: front-left + back-right in phase,
   front-right + back-left in opposite phase. */
function Wolf() {
  const groupRef = useRef<Group>(null)

  // refs for each leg — we'll rotate them in useFrame
  const legFL = useRef<Group>(null)
  const legFR = useRef<Group>(null)
  const legBL = useRef<Group>(null)
  const legBR = useRef<Group>(null)

  // body ref for the subtle vertical bob
  const bodyRef = useRef<Group>(null)

  useFrame(() => {
    const t = Date.now() * 0.001

    // ── Leg gait: diagonal trot pattern ──
    // Front-left & back-right swing together (phase 0)
    // Front-right & back-left swing opposite (phase PI)
    const stride = Math.sin(t * 8) * 0.4   // leg swing angle
    const lift  = Math.abs(Math.sin(t * 8)) * 0.08 // leg lifts slightly at peak

    if (legFL.current) {
      legFL.current.rotation.x = stride
      legFL.current.position.y = -0.35 + lift
    }
    if (legBR.current) {
      legBR.current.rotation.x = stride
      legBR.current.position.y = -0.35 + lift
    }
    // Opposite phase (PI offset)
    if (legFR.current) {
      legFR.current.rotation.x = -stride
      legFR.current.position.y = -0.35 + lift
    }
    if (legBL.current) {
      legBL.current.rotation.x = -stride
      legBL.current.position.y = -0.35 + lift
    }

    // ── Subtle body bob ──
    // Bounces slightly in sync with the stride
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.abs(Math.sin(t * 8)) * 0.04
    }
  })

  return (
    <group ref={groupRef} scale={0.45}>
      <group ref={bodyRef}>
        {/* ── Body: elongated capsule ── */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.18, 0.9, 4, 8]} />
          <meshStandardMaterial color={BODY_MID} metalness={0.25} roughness={0.55} />
        </mesh>

        {/* Gold ridge along the spine */}
        <mesh position={[0, 0.17, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.01, 0.85, 2, 4]} />
          <meshStandardMaterial
            color={GOLD}
            metalness={0.5}
            roughness={0.3}
            emissive={GOLD}
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* ── Head: tapered cone pointing forward ── */}
        <group position={[0, 0.1, -0.65]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.1, 0.3, 6]} />
            <meshStandardMaterial color={BODY_DARK} metalness={0.2} roughness={0.6} />
          </mesh>

          {/* Snout — smaller cone */}
          <mesh position={[0, -0.02, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.05, 0.15, 5]} />
            <meshStandardMaterial color={BODY_DARK} metalness={0.15} roughness={0.65} />
          </mesh>

          {/* Left ear — small upright cone */}
          <mesh position={[0.07, 0.12, 0.02]}>
            <coneGeometry args={[0.03, 0.1, 4]} />
            <meshStandardMaterial color={BODY_MID} metalness={0.2} roughness={0.5} />
          </mesh>

          {/* Right ear */}
          <mesh position={[-0.07, 0.12, 0.02]}>
            <coneGeometry args={[0.03, 0.1, 4]} />
            <meshStandardMaterial color={BODY_MID} metalness={0.2} roughness={0.5} />
          </mesh>

          {/* Eyes — emissive gold for striking accent */}
          <mesh position={[0.06, 0.04, -0.08]}>
            <sphereGeometry args={[0.018, 4, 4]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[-0.06, 0.04, -0.08]}>
            <sphereGeometry args={[0.018, 4, 4]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>

        {/* ── Tail: thin tapered cone angled back ── */}
        <mesh position={[0, 0.05, 0.7]} rotation={[-0.6, 0, 0]}>
          <coneGeometry args={[0.025, 0.35, 5]} />
          <meshStandardMaterial color={BODY_DARK} metalness={0.15} roughness={0.7} />
        </mesh>

        {/* ── Four legs ── */}
        {/* Front-left */}
        <group ref={legFL} position={[0.12, -0.35, -0.28]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.025, 0.45, 5]} />
            <meshStandardMaterial color={BODY_DARK} metalness={0.2} roughness={0.6} />
          </mesh>
          {/* gold ankle ring */}
          <mesh position={[0, -0.2, 0]}>
            <torusGeometry args={[0.032, 0.005, 4, 8]} />
            <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.3} />
          </mesh>
        </group>

        {/* Front-right */}
        <group ref={legFR} position={[-0.12, -0.35, -0.28]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.025, 0.45, 5]} />
            <meshStandardMaterial color={BODY_DARK} metalness={0.2} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <torusGeometry args={[0.032, 0.005, 4, 8]} />
            <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.3} />
          </mesh>
        </group>

        {/* Back-left */}
        <group ref={legBL} position={[0.12, -0.35, 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.025, 0.45, 5]} />
            <meshStandardMaterial color={BODY_DARK} metalness={0.2} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <torusGeometry args={[0.032, 0.005, 4, 8]} />
            <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.3} />
          </mesh>
        </group>

        {/* Back-right */}
        <group ref={legBR} position={[-0.12, -0.35, 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.025, 0.45, 5]} />
            <meshStandardMaterial color={BODY_DARK} metalness={0.2} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <torusGeometry args={[0.032, 0.005, 4, 8]} />
            <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/* ─── Scroll-driven movement ───────────────────────────── */
function ScrollWolf({ visible }: { visible: boolean }) {
  const groupRef = useRef<Group>(null)
  const curve = useRunPath()

  // Lerp-smoothed progress (no snapping)
  const progress = useRef(0)
  const targetProgress = useRef(0)

  // Previous progress for velocity (to skip trail at low speed)
  const prevProgress = useRef(0)

  useEffect(() => {
    if (!visible) return

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
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

    // Smooth lerp toward target — 0.08 factor gives fluid, non-snapping motion
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress.current, 0.08)

    const t = Math.max(0, Math.min(1, progress.current))
    const point = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)

    // Position: snap to curve point at ground level (y from curve, which is ~0)
    groupRef.current.position.copy(point)

    // Orient wolf to face direction of travel
    // lookAt a point slightly ahead along the tangent
    const lookTarget = point.clone().add(tangent)
    groupRef.current.lookAt(lookTarget)

    // Slight forward lean to sell speed
    groupRef.current.rotation.x = -0.08

    // Store progress delta for trail opacity decisions
    prevProgress.current = progress.current
  })

  return (
    <group ref={groupRef}>
      {/* Gold-tinted dust trail — short, low opacity, visible only when scrolling */}
      <Trail
        width={0.4}
        length={4}
        color={GOLD}
        attenuation={(w) => w * w}
        decay={2}
        local={false}
      >
        <Wolf />
      </Trail>
    </group>
  )
}

/* ─── Scene ────────────────────────────────────────────── */
function Scene({ visible }: { visible: boolean }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={0.45} color="#f5f5f5" />
      <pointLight position={[0, 2, 0]} intensity={0.35} color={GOLD} distance={15} />

      <ScrollWolf visible={visible} />
    </>
  )
}

/* ─── WebGL check (same as FalconOverlay pattern) ──────── */
function checkWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/* ─── Exported overlay wrapper ─────────────────────────── */
export default function WolfScene() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)

  // Lazy mount: wait for WebGL + 1.5s delay so HeroScene initializes first
  useEffect(() => {
    if (!checkWebGL()) return
    const timer = setTimeout(() => setMounted(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Pause when canvas leaves viewport entirely
  useEffect(() => {
    if (!mounted) return
    const canvas = document.querySelector('[data-wolf-canvas] canvas')
    if (!canvas) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(canvas.parentElement!)

    // Context loss/recovery handling — remount to reset scene
    const onContextLost = (e: Event) => {
      e.preventDefault()
      console.warn('[WolfScene] WebGL context lost — preventing default')
    }
    const onContextRestored = () => {
      console.log('[WolfScene] WebGL context restored')
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
      data-wolf-canvas
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ background: 'transparent' }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene visible={visible} />
      </Canvas>
    </div>
  )
}
