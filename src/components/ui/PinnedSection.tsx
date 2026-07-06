'use client'

import { useEffect, useRef, type ReactNode } from 'react'

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
 * Pins a section with CSS sticky and animates content via IntersectionObserver.
 * No GSAP DOM manipulation — avoids React removeChild conflicts.
 */
export default function PinnedSection({
  children,
  className = '',
  scrollDistance: _scrollDistance = '+=100%',
  pin = true,
}: PinnedSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pin) return
    const el = contentRef.current
    if (!el) return

    const mm = window.matchMedia('(min-width: 768px)')
    if (!mm.matches) return

    // Set initial hidden state via class (no GSAP DOM manipulation)
    el.classList.add('opacity-0', 'translate-y-12', 'scale-[0.97]')
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-12', 'scale-[0.97]')
          el.classList.add('opacity-100', 'translate-y-0', 'scale-100')
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [pin])

  return (
    <div className={`${pin ? 'sticky top-0' : ''} ${className}`}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
