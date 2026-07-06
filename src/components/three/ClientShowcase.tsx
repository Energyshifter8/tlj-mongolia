'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const PastryShowcase = dynamic(() => import('@/components/three/PastryShowcase'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square w-full max-w-2xl items-center justify-center">
      <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
        Initializing 3D...
      </span>
    </div>
  ),
})

const MARQUEE_ITEMS = [
  { label: 'Sysco Tech Members', stat: '200+' },
  { label: 'Partner Bakeries', stat: '45' },
  { label: 'Loyalty Members', stat: '12,000+' },
  { label: 'Rewards Redeemed', stat: '8,500+' },
  { label: 'Daily Visitors', stat: '1,200+' },
  { label: 'Menu Items', stat: '350+' },
]

function MarqueeTrack() {
  return (
    <>
      {MARQUEE_ITEMS.map((item, i) => (
        <div
          key={i}
          className="flex shrink-0 items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated px-6 py-4 transition-all duration-300 hover:border-accent-gold/40 hover:bg-bg-surface hover:scale-105 grayscale hover:grayscale-0 cursor-default"
        >
          <span className="font-display text-2xl font-bold text-accent-gold">{item.stat}</span>
          <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            {item.label}
          </span>
        </div>
      ))}
    </>
  )
}

export default function ClientShowcase() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = marqueeRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="mt-20 w-full max-w-5xl mx-auto">
      {/* 3D showcase */}
      <div className="flex justify-center">
        <PastryShowcase />
      </div>

      {/* marquee section */}
      <div
        ref={marqueeRef}
        className="relative mt-16 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-bg-deep to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-bg-deep to-transparent" />

        {/* marquee container */}
        <div
          className={`flex gap-4 ${paused ? '[animation-play-state:paused]' : ''}`}
          style={{
            animation: 'marquee-scroll 30s linear infinite',
            width: 'max-content',
          }}
        >
          <MarqueeTrack />
          <MarqueeTrack />
        </div>
      </div>

      {/* tagline */}
      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
        Trusted by Mongolia&apos;s finest establishments
      </p>
    </section>
  )
}
