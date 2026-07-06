'use client'

import { Environment, RoundedBox, Sparkles } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Suspense, useEffect, useRef, useState, useCallback } from 'react'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

/* ─── low-poly croissant ─── */
function Croissant({ breathe }: { breathe: boolean }) {
  const ref = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.15
    if (breathe) {
      const s = 1 + Math.sin(Date.now() * 0.001) * 0.02
      ref.current.scale.setScalar(s)
    }
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
function Cake({ breathe }: { breathe: boolean }) {
  const groupRef = useRef<Group>(null)
  const ringRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.15
    if (ringRef.current) {
      const s = 1 + Math.sin(Date.now() * 0.0012 + 1) * 0.03
      ringRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.35, 0]}>
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
      {/* gold drip ring — breathing pulse */}
      <mesh ref={ringRef} position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
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

/* ─── postprocessing ─── */
function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  )
}

/* ─── scroll-driven camera ─── */
function CameraRig({ visible }: { visible: boolean }) {
  const { camera } = useThree()
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!visible) return

    const target = { x: 3, y: 2.5, z: 3 }
    const mid = { x: 0, y: 1.5, z: 5 }
    const end = { x: -3, y: 2.5, z: 3 }

    camera.position.set(target.x, target.y, target.z)
    camera.lookAt(0, 0, 0)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '[data-showcase-section]',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    })

    tl.to(camera.position, { x: mid.x, y: mid.y, z: mid.z, duration: 1, ease: 'none' }, 0)
    tl.to(camera.position, { x: end.x, y: end.y, z: end.z, duration: 1, ease: 'none' }, 1)

    tweenRef.current = tl as unknown as gsap.core.Tween

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [visible, camera])

  return null
}

/* ─── flour dust particles ─── */
function FlourDust() {
  return (
    <Sparkles
      count={100}
      speed={0.3}
      opacity={0.4}
      color="#c9a24b"
      size={1.5}
      scale={[6, 4, 6]}
      position={[0, 0, 0]}
    />
  )
}

/* ─── scene ─── */
function Scene({ visible, breathe }: { visible: boolean; breathe: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f2ead9" />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#c9a24b" />

      <Croissant breathe={breathe} />
      <Cake breathe={breathe} />
      <Pedestal />

      <FlourDust />

      <CameraRig visible={visible} />
      <Effects />

      <Environment near={0.1} far={100} resolution={256}>
        <mesh scale={50}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#1a1512" side={2} />
        </mesh>
      </Environment>
    </>
  )
}

/* ─── exported wrapper ─── */
interface PastryShowcaseProps {
  className?: string
}

export default function PastryShowcase({ className = '' }: PastryShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [breathe, setBreathe] = useState(false)

  useEffect(() => {
    setBreathe(true)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    const canvas = gl.domElement

    const onContextLost = (e: Event) => {
      e.preventDefault()
      console.warn('[PastryShowcase] WebGL context lost — preventing default')
    }

    const onContextRestored = () => {
      console.log('[PastryShowcase] WebGL context restored')
    }

    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)

    return () => {
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
    }
  }, [])

  return (
    <div ref={containerRef} className={`aspect-square w-full max-w-2xl ${className}`} data-showcase-section>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-subtle border-t-accent-gold" />
            <span className="ml-3 font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Loading 3D...
            </span>
          </div>
        }
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [3, 2.5, 3], fov: 40 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: '#0a0908' }}
          onCreated={handleCreated}
        >
          <Scene visible={visible} breathe={breathe} />
        </Canvas>
      </Suspense>
    </div>
  )
}
