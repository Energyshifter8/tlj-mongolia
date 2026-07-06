'use client'

import SpinWheel from '@/components/games/SpinWheel'
import { useGamesScore } from '@/contexts/GamesScoreContext'

export default function SpinWheelPage() {
  const { addScore } = useGamesScore()

  function handleSpin() {
    addScore('spin-wheel', 10)
  }

  return (
    <div className="mx-auto flex w-full max-w-lg min-w-0 flex-col items-center gap-8 px-4 py-12 overflow-x-hidden">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-wide text-accent-gold">
          Spin &amp; Win
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
          Try your luck every day
        </p>
      </div>

      <SpinWheel size={320} onSpin={handleSpin} />
    </div>
  )
}
