'use client'

import type { LetterStatus, Tile } from '@/hooks/useWordleGame'

interface WordleGridProps {
  attempts: Tile[][]
  shakeRow: boolean
  revealedRows: number[]
}

const STATUS_STYLES: Record<LetterStatus, string> = {
  correct: 'border-correct bg-correct text-bg-deep',
  present: 'border-present bg-present text-bg-deep',
  absent: 'border-absent bg-absent text-text-primary',
  tbd: 'border-border-default bg-transparent text-text-primary',
  empty: 'border-border-subtle bg-transparent text-text-primary',
}

function TileCell({ tile, colIdx, revealed }: { tile: Tile; colIdx: number; revealed: boolean }) {
  const delay = revealed ? colIdx * 300 : 0

  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-md border-2 font-display text-2xl font-bold transition-all duration-300 sm:h-16 sm:w-16 ${
        revealed
          ? STATUS_STYLES[tile.status]
          : STATUS_STYLES[tile.status === 'tbd' ? 'tbd' : 'empty']
      } ${revealed ? 'wordle-reveal' : ''}`}
      style={revealed ? { animationDelay: `${delay}ms` } : undefined}
    >
      {tile.letter}
    </div>
  )
}

export default function WordleGrid({ attempts, shakeRow, revealedRows }: WordleGridProps) {
  return (
    <div className={`grid gap-1.5 ${shakeRow ? 'wordle-shake' : ''}`}>
      {attempts.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-1.5">
          {row.map((tile, colIdx) => (
            <TileCell
              key={colIdx}
              tile={tile}
              colIdx={colIdx}
              revealed={revealedRows.includes(rowIdx)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
