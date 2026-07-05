'use client'

import type { Piece, PieceShape, Position } from '@/lib/block-blast-engine'

interface PiecePreviewProps {
  piece: PieceShape
  color: string
  scale?: number
}

function PiecePreview({ piece, color, scale = 1 }: PiecePreviewProps) {
  // compute bounding box
  const maxRow = Math.max(...piece.cells.map((c) => c.row)) + 1
  const maxCol = Math.max(...piece.cells.map((c) => c.col)) + 1
  const cellSet = new Set(piece.cells.map((c) => `${c.row},${c.col}`))
  const cellSize = Math.floor(18 * scale)

  return (
    <div
      className="grid gap-[2px]"
      style={{
        gridTemplateColumns: `repeat(${maxCol}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${maxRow}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: maxRow * maxCol }, (_, i) => {
        const r = Math.floor(i / maxCol)
        const c = i % maxCol
        const filled = cellSet.has(`${r},${c}`)
        return (
          <div
            key={i}
            className="rounded-[2px]"
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: filled ? color : 'transparent',
              opacity: filled ? 0.9 : 0,
            }}
          />
        )
      })}
    </div>
  )
}

interface BlockBlastPiecesProps {
  pieces: (Piece | null)[]
  selectedIndex: number | null
  onSelect: (index: number) => void
}

export default function BlockBlastPieces({
  pieces,
  selectedIndex,
  onSelect,
}: BlockBlastPiecesProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {pieces.map((piece, i) => {
        if (!piece) {
          return (
            <div
              key={i}
              className="flex h-20 w-20 items-center justify-center rounded-xl border border-muted/30 bg-surface/40"
            >
              <span className="font-mono text-[10px] text-foreground/20">used</span>
            </div>
          )
        }

        const isSelected = selectedIndex === i

        return (
          <button
            key={piece.id}
            type="button"
            onClick={() => onSelect(i)}
            className={`flex h-20 w-20 items-center justify-center rounded-xl border transition-all ${
              isSelected
                ? 'border-accent bg-accent/10 shadow-[0_0_12px_rgba(201,162,75,0.2)] scale-105'
                : 'border-muted/50 bg-surface/60 hover:border-muted hover:bg-surface-light/60'
            }`}
          >
            <PiecePreview piece={piece} color={piece.color} scale={isSelected ? 1.1 : 1} />
          </button>
        )
      })}
    </div>
  )
}

export { PiecePreview }
