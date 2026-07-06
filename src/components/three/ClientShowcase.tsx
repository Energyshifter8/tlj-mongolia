'use client'

import dynamic from 'next/dynamic'

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

export default function ClientShowcase() {
  return (
    <section className="mt-20 w-full max-w-2xl">
      <PastryShowcase />
    </section>
  )
}
