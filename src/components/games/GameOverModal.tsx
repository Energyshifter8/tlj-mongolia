'use client'

interface GameOverModalProps {
  score: number
  highScore: number
  onRestart: () => void
}

export default function GameOverModal({ score, highScore, onRestart }: GameOverModalProps) {
  const isNewHigh = score >= highScore && score > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm min-w-0 rounded-2xl border border-border-subtle bg-bg-surface p-8 text-center shadow-2xl">
        <h2 className="font-display text-2xl font-bold text-accent-gold">Тоглоом дуусав!</h2>

        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Оноо
          </span>
          <span className="font-display text-5xl font-bold text-text-primary">
            {score.toLocaleString()}
          </span>
        </div>

        {isNewHigh && (
          <div className="mt-4 rounded-lg border border-accent-gold/30 bg-accent-gold/10 px-4 py-2 font-mono text-xs text-accent-gold">
            Шинэ дээд оноо!
          </div>
        )}

        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Дээд оноо
          </span>
          <span className="font-mono text-sm text-text-secondary">{highScore.toLocaleString()}</span>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-8 w-full rounded-xl border border-accent-gold/50 bg-accent-gold/10 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-accent-gold transition-all hover:bg-accent-gold/20"
        >
          Дахин тоглох
        </button>
      </div>
    </div>
  )
}
