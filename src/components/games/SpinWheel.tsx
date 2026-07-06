'use client'

import { useCallback, useRef, useState } from 'react'
import { SPIN_SECTORS, type SpinSector } from '@/lib/mock-data'

interface SpinWheelProps {
  size?: number
  onSpin?: (sector: SpinSector) => void
}

function weightedRandomSector(sectors: SpinSector[]): SpinSector {
  const total = sectors.reduce((s, sec) => s + sec.probability, 0)
  let r = Math.random() * total
  for (const sec of sectors) {
    r -= sec.probability
    if (r <= 0) return sec
  }
  return sectors[sectors.length - 1]
}

export default function SpinWheel({ size = 300, onSpin }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<SpinSector | null>(null)
  const animationRef = useRef<number | null>(null)

  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 4
  const n = SPIN_SECTORS.length
  const anglePerSector = (2 * Math.PI) / n

  const handleSpin = useCallback(() => {
    if (spinning) return
    setResult(null)
    setSpinning(true)

    const target = weightedRandomSector(SPIN_SECTORS)
    const targetIdx = SPIN_SECTORS.findIndex((s) => s.id === target.id)

    // target angle: center of the target sector, from top (12 o'clock = -90deg)
    const sectorCenter = targetIdx * anglePerSector + anglePerSector / 2
    // we want this sector to land at the top (angle 0 = 12 o'clock)
    // wheel rotates clockwise, so final rotation = -(sectorCenter) + random full spins
    const fullSpins = 5 + Math.floor(Math.random() * 3) // 5-7 full rotations
    const finalAngle = fullSpins * 360 - (sectorCenter * 180) / Math.PI + (Math.random() - 0.5) * 10

    const startRotation = rotation % 360
    const totalDelta = finalAngle - startRotation
    const duration = 4000 + Math.random() * 1000
    const startTime = performance.now()

    function easeOutCubic(t: number) {
      return 1 - (1 - t) ** 4
    }

    function animate(now: number) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(t)
      setRotation(startRotation + totalDelta * eased)

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setSpinning(false)
        setResult(target)
        onSpin?.(target)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [spinning, rotation, onSpin, anglePerSector])

  return (
    <div className="flex flex-col items-center gap-6">
      {/* wheel */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* pointer */}
        <div
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1"
          style={{
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '18px solid #c9a24b',
          }}
        />

        {/* wheel SVG */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-lg"
          style={{ transform: `rotate(${rotation}deg)`, willChange: 'transform' }}
        >
          {SPIN_SECTORS.map((sector, i) => {
            const startAngle = i * anglePerSector - Math.PI / 2
            const endAngle = startAngle + anglePerSector
            const x1 = cx + radius * Math.cos(startAngle)
            const y1 = cy + radius * Math.sin(startAngle)
            const x2 = cx + radius * Math.cos(endAngle)
            const y2 = cy + radius * Math.sin(endAngle)
            const largeArc = anglePerSector > Math.PI ? 1 : 0

            const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

            // label position
            const labelAngle = startAngle + anglePerSector / 2
            const labelR = radius * 0.65
            const lx = cx + labelR * Math.cos(labelAngle)
            const ly = cy + labelR * Math.sin(labelAngle)
            const textAngle = (labelAngle * 180) / Math.PI

            return (
              <g key={sector.id}>
                <path d={path} fill={sector.color} stroke="#0a0908" strokeWidth="2" />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#f2ead9"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  transform={`rotate(${textAngle}, ${lx}, ${ly})`}
                >
                  {sector.label}
                </text>
              </g>
            )
          })}

          {/* center circle */}
          <circle cx={cx} cy={cy} r={20} fill="#0a0908" stroke="#c9a24b" strokeWidth="2" />
          <text
            x={cx}
            y={cy + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#c9a24b"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            TLJ
          </text>
        </svg>
      </div>

      {/* spin button */}
      <button
        type="button"
        onClick={handleSpin}
        disabled={spinning}
        className={`rounded-xl border px-8 py-3 font-mono text-xs font-semibold uppercase tracking-widest transition-all ${
          spinning
            ? 'border-border-subtle bg-bg-elevated/40 text-text-tertiary cursor-not-allowed'
            : 'border-accent-gold/50 bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/20'
        }`}
      >
        {spinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>

      {/* result */}
      {result && !spinning && (
        <div className="rounded-xl border border-accent-gold/30 bg-bg-elevated/60 px-6 py-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            You won
          </p>
          <p className="mt-1 font-display text-xl font-bold" style={{ color: result.color }}>
            {result.label}
          </p>
        </div>
      )}
    </div>
  )
}
