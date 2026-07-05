'use client'

import type { Board, Position } from '@/lib/block-blast-engine'
import { BOARD_SIZE } from '@/lib/block-blast-engine'

interface BlockBlastBoardProps {
  board: Board
  previewCells: Position[]
  previewColor: string
  onCellClick: (row: number, col: number) => void
}

export default function BlockBlastBoard({
  board,
  previewCells,
  previewColor,
  onCellClick,
}: BlockBlastBoardProps) {
  const previewSet = new Set(previewCells.map((p) => `${p.row},${p.col}`))

  return (
    <div className="relative w-full max-w-[360px]">
      {/* grid */}
      <div
        className="grid gap-[3px] rounded-xl border border-muted/60 bg-surface p-[3px]"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r},${c}`
            const isPreview = previewSet.has(key)
            const isFilled = cell === 1

            return (
              <button
                key={key}
                type="button"
                onClick={() => onCellClick(r, c)}
                className={`aspect-square rounded-[3px] transition-all duration-100 ${
                  isFilled
                    ? 'bg-accent/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
                    : isPreview
                      ? 'ring-1 ring-inset'
                      : 'bg-background hover:bg-muted/30'
                }`}
                style={
                  isPreview
                    ? {
                        backgroundColor: `${previewColor}30`,
                        boxShadow: `inset 0 0 0 1px ${previewColor}, inset 0 0 8px ${previewColor}40`,
                      }
                    : isFilled
                      ? undefined
                      : undefined
                }
              />
            )
          }),
        )}
      </div>

      {/* glow behind grid */}
      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-accent/5 blur-xl" />
    </div>
  )
}
