'use client'

import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Returns overall page scroll progress as a number 0–100.
 * Uses a single ScrollTrigger instance on document.body.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setProgress(Math.round(self.progress * 100))
      },
    })

    return () => {
      st.kill()
    }
  }, [])

  return progress
}
