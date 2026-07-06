'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PinnedSectionProps {
  children: ReactNode
  /** Extra class on the outer wrapper */
  className?: string
  /** How far to scroll while pinned. Default "+=100%" = one viewport height. */
  scrollDistance?: string
  /** Enable pinning. Pass false to fall back to normal flow. */
  pin?: boolean
}

/**
 * Pins a section and scrubs an entrance animation on its direct children.
 * On mobile (< 768px) pinning is automatically disabled.
 */
export default function PinnedSection({
  children,
  className = '',
  scrollDistance = '+=100%',
  pin = true,
}: PinnedSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pin) return

    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return

    const mm = window.matchMedia('(min-width: 768px)')
    if (!mm.matches) return

    // set initial state — hidden, slightly below, scaled down
    gsap.set(content, { opacity: 0, y: 50, scale: 0.97 })

    const st = ScrollTrigger.create({
      trigger: wrapper,
      pin: true,
      scrub: 0.6,
      start: 'top top',
      end: scrollDistance,
      markers: true,
      onUpdate: (self) => {
        const p = self.progress
        gsap.set(content, {
          opacity: Math.min(p * 2, 1),          // fade in over first half
          y: 50 * (1 - Math.min(p * 2, 1)),     // slide up
          scale: 0.97 + 0.03 * Math.min(p * 2, 1), // subtle scale-up
        })
      },
    })

    return () => {
      st.kill()
      gsap.set(content, { clearProps: 'all' })
    }
  }, [pin, scrollDistance])

  return (
    <div ref={wrapperRef} className={className}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
