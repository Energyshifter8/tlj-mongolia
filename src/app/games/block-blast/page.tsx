'use client'

import { useReducer, useCallback, useState, useMemo, useEffect } from 'react'
import {
  createInitialState,
  canPlace,
  placePieceOnBoard,
  BOARD_SIZE,
  type GameState,
  type Position,
  type PieceShape,
} from '@/lib/block-blast-engine'
import BlockBlastBoard from '@/components/games/BlockBlastBoard'
import BlockBlastPieces from '@/components/games/BlockBlastPieces'
import GameOverModal from '@/components/games/GameOverModal'
import { useGamesScore } from '@/contexts/GamesScoreContext'

// ─── Helpers ────────────────────────────────────────────────────

function getPlacementOrigin(
  board: GameState['board'],
  piece: PieceShape,
  targetRow: number,
  targetCol: number,
): Position | null {
  // find top-left origin so that piece cells align with target
  const minR = Math.min(...piece.cells.map((c) => c.row))
  const minC = Math.min(...piece.cells.map((c) => c.col))
  const origin = { row: targetRow - minR, col: targetCol - minC }
  return canPlace(board, piece, origin.row, origin.col) ? origin : null
}

function getPreviewCells(
  board: GameState['board'],
  piece: PieceShape | null,
  hoverRow: number | null,
  hoverCol: number | null,
): Position[] {
  if (!piece || hoverRow === null || hoverCol === null) return []
  const origin = getPlacementOrigin(board, piece, hoverRow, hoverCol)
  if (!origin) return []
  return piece.cells.map((c) => ({ row: origin.row + c.row, col: origin.col + c.col }))
}

// ─── State ──────────────────────────────────────────────────────

type Action =
  | { type: 'SELECT_PIECE'; index: number }
  | { type: 'HOVER'; row: number; col: number }
  | { type: 'LEAVE' }
  | { type: 'PLACE'; row: number; col: number }
  | { type: 'RESTART' }

interface LocalState {
  game: GameState
  selectedPiece: number | null
  hoverRow: number | null
  hoverCol: number | null
}

function reducer(state: LocalState, action: Action): LocalState {
  switch (action.type) {
    case 'SELECT_PIECE': {
      const piece = state.game.pieces[action.index]
      if (!piece) return state
      return {
        ...state,
        selectedPiece: state.selectedPiece === action.index ? null : action.index,
        hoverRow: null,
        hoverCol: null,
      }
    }

    case 'HOVER': {
      return { ...state, hoverRow: action.row, hoverCol: action.col }
    }

    case 'LEAVE': {
      return { ...state, hoverRow: null, hoverCol: null }
    }

    case 'PLACE': {
      if (state.selectedPiece === null) return state
      const result = placePieceOnBoard(state.game, state.selectedPiece, action.row, action.col)
      if (!result) return state

      const hs = Math.max(state.game.highScore, result.score)

      return {
        game: {
          board: result.board,
          pieces: result.piecesLeft,
          score: result.score,
          combo: result.combo,
          highScore: hs,
          gameOver: result.gameOver,
        },
        selectedPiece: null,
        hoverRow: null,
        hoverCol: null,
      }
    }

    case 'RESTART': {
      const hs = state.game.highScore
      return {
        game: createInitialState(hs),
        selectedPiece: null,
        hoverRow: null,
        hoverCol: null,
      }
    }

    default:
      return state
  }
}

// ─── Component ──────────────────────────────────────────────────

export default function BlockBlastPage() {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    game: createInitialState(),
    selectedPiece: null,
    hoverRow: null,
    hoverCol: null,
  }))

  const { addScore } = useGamesScore()
  const [scoreReported, setScoreReported] = useState(false)

  // report score on game over
  useEffect(() => {
    if (state.game.gameOver && !scoreReported && state.game.score > 0) {
      addScore('block-blast', state.game.score)
      setScoreReported(true)
    }
  }, [state.game.gameOver, scoreReported, addScore, state.game.score])

  const { game, selectedPiece, hoverRow, hoverCol } = state

  const selectedPieceShape = selectedPiece !== null ? game.pieces[selectedPiece] : null

  const previewCells = useMemo(
    () => getPreviewCells(game.board, selectedPieceShape, hoverRow, hoverCol),
    [game.board, selectedPieceShape, hoverRow, hoverCol],
  )

  const previewColor = selectedPieceShape?.color ?? '#c9a24b'

  const handleSelect = useCallback((index: number) => {
    dispatch({ type: 'SELECT_PIECE', index })
  }, [])

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (selectedPiece !== null) {
        dispatch({ type: 'PLACE', row, col })
      }
    },
    [selectedPiece],
  )

  const handleCellHover = useCallback(
    (row: number, col: number) => {
      if (selectedPiece !== null) {
        dispatch({ type: 'HOVER', row, col })
      }
    },
    [selectedPiece],
  )

  const handleBoardLeave = useCallback(() => {
    dispatch({ type: 'LEAVE' })
  }, [])

  const handleRestart = useCallback(() => {
    dispatch({ type: 'RESTART' })
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 px-4 py-12">
      {/* heading */}
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-wide text-accent">
          Block Blast
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          Place blocks. Clear lines.
        </p>
      </div>

      {/* score */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-foreground/40">Score</span>
          <span className="font-display text-2xl font-bold text-accent">{game.score.toLocaleString()}</span>
        </div>
        <div className="text-center">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-foreground/40">Combo</span>
          <span className="font-display text-2xl font-bold text-foreground/70">×{game.combo}</span>
        </div>
        <div className="text-center">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-foreground/40">Best</span>
          <span className="font-display text-2xl font-bold text-foreground/50">{game.highScore.toLocaleString()}</span>
        </div>
      </div>

      {/* board */}
      <div
        onMouseLeave={handleBoardLeave}
        onMouseMove={(e) => {
          if (selectedPiece === null) return
          const rect = e.currentTarget.getBoundingClientRect()
          const cellSize = rect.width / BOARD_SIZE
          const col = Math.floor((e.clientX - rect.left) / cellSize)
          const row = Math.floor((e.clientY - rect.top) / cellSize)
          if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
            handleCellHover(row, col)
          }
        }}
      >
        <BlockBlastBoard
          board={game.board}
          previewCells={previewCells}
          previewColor={previewColor}
          onCellClick={handleCellClick}
        />
      </div>

      {/* instructions */}
      {selectedPiece !== null && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent/60">
          Tap a cell to place
        </p>
      )}
      {selectedPiece === null && game.pieces.some((p) => p !== null) && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/30">
          Select a piece below
        </p>
      )}

      {/* pieces */}
      <BlockBlastPieces
        pieces={game.pieces}
        selectedIndex={selectedPiece}
        onSelect={handleSelect}
      />

      {/* game over modal */}
      {game.gameOver && (
        <GameOverModal
          score={game.score}
          highScore={game.highScore}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
