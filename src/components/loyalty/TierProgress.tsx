import { getNextTier, getPointsToNextTier, getTierProgress, TIERS, type TierLevel } from '@/lib/mock-data'

interface TierProgressProps {
  points: number
  tier: TierLevel
}

export default function TierProgress({ points, tier }: TierProgressProps) {
  const nextTier = getNextTier(tier)
  const current = TIERS.find((t) => t.level === tier)!
  const progress = getTierProgress(points, tier)
  const remaining = getPointsToNextTier(points, tier)

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">
          Tier Progress
        </span>
        {nextTier && (
          <span className="font-mono text-[10px] text-foreground/40">
            {remaining} pts to {nextTier.nameMn}
          </span>
        )}
      </div>

      {/* progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/50">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${current.color}, ${nextTier?.color ?? current.color})`,
          }}
        />
        {/* glow */}
        <div
          className="absolute inset-y-0 left-0 rounded-full opacity-40 blur-sm transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${current.color}, ${nextTier?.color ?? current.color})`,
          }}
        />
      </div>

      {/* tier markers */}
      <div className="relative mt-2 flex justify-between">
        {TIERS.map((t) => {
          const idx = TIERS.indexOf(t)
          const pos = idx === 0 ? '0%' : idx === 1 ? '33%' : '100%'
          const isActive = TIERS.findIndex((tt) => tt.level === tier) >= idx
          return (
            <div key={t.level} className="flex flex-col items-center" style={{ position: 'absolute', left: pos, transform: 'translateX(-50%)' }}>
              <div
                className="h-2 w-2 rounded-full border transition-colors"
                style={{
                  borderColor: isActive ? t.color : 'var(--muted)',
                  backgroundColor: isActive ? t.color : 'transparent',
                }}
              />
              <span className="mt-1 font-mono text-[9px] uppercase tracking-wider" style={{ color: isActive ? t.color : 'var(--foreground)', opacity: isActive ? 1 : 0.3 }}>
                {t.nameMn}
              </span>
            </div>
          )
        })}
      </div>

      {/* points in current tier range */}
      {nextTier && (
        <p className="mt-6 text-center font-mono text-xs text-foreground/40">
          {points - current.threshold} / {nextTier.threshold - current.threshold} pts in {current.nameMn} tier
        </p>
      )}
      {!nextTier && (
        <p className="mt-6 text-center font-mono text-xs text-accent">
          Maximum tier reached!
        </p>
      )}
    </div>
  )
}
