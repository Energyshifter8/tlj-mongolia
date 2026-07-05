'use client'

interface GameOverModalProps {
  score: number
  highScore: number
  onRestart: () => void
}

export default function GameOverModal({ score, highScore, onRestart }: GameOverModalProps) {
  const isNewHigh = score >= highScore && score > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-muted bg-surface p-8 text-center shadow-2xl">
        <h2 className="font-display text-2xl font-bold text-accent">
          Тоглоом дуусав!
        </h2>

        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
            Оноо
          </span>
          <span className="font-display text-5xl font-bold text-foreground">
            {score.toLocaleString()}
          </span>
        </div>

        {isNewHigh && (
          <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 font-mono text-xs text-accent">
            Шинэ дээд оноо!
          </div>
        )}

        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/30">
            Дээд оноо
          </span>
          <span className="font-mono text-sm text-foreground/60">
            {highScore.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-8 w-full rounded-xl border border-accent/50 bg-accent/10 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-accent transition-all hover:bg-accent/20"
        >
          Дахин тоглох
        </button>
      </div>
    </div>
  )
}
