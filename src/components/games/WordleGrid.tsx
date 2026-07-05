'use client'

import type { Tile, LetterStatus } from '@/hooks/useWordleGame'

interface WordleGridProps {
  attempts: Tile[][]
  currentRow: number
  shakeRow: boolean
  revealedRows: number[]
}

const STATUS_STYLES: Record<LetterStatus, string> = {
  correct: 'border-correct bg-correct text-background',
  present: 'border-present bg-present text-background',
  absent: 'border-absent bg-absent text-foreground/80',
  tbd: 'border-foreground/40 bg-transparent text-foreground',
  empty: 'border-muted bg-transparent text-foreground',
}

function TileCell({ tile, rowIdx, colIdx, revealed }: {
  tile: Tile
  rowIdx: number
  colIdx: number
  revealed: boolean
}) {
  const delay = revealed ? colIdx * 300 : 0

  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-md border-2 font-display text-2xl font-bold transition-all duration-300 sm:h-16 sm:w-16 ${
        revealed ? STATUS_STYLES[tile.status] : STATUS_STYLES[tile.status === 'tbd' ? 'tbd' : 'empty']
      } ${revealed ? 'wordle-reveal' : ''}`}
      style={revealed ? { animationDelay: `${delay}ms` } : undefined}
    >
      {tile.letter}
    </div>
  )
}

export default function WordleGrid({ attempts, currentRow, shakeRow, revealedRows }: WordleGridProps) {
  return (
    <div className={`grid gap-1.5 ${shakeRow ? 'wordle-shake' : ''}`}>
      {attempts.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-1.5">
          {row.map((tile, colIdx) => (
            <TileCell
              key={colIdx}
              tile={tile}
              rowIdx={rowIdx}
              colIdx={colIdx}
              revealed={revealedRows.includes(rowIdx)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
