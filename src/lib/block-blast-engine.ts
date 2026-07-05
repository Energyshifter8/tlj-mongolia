// ─── Types ──────────────────────────────────────────────────────

export type Cell = 0 | 1 // 0 = empty, 1 = filled

export type Board = Cell[][]

export interface Position {
  row: number
  col: number
}

export interface PieceShape {
  cells: Position[] // relative offsets from top-left
  color: string
  label: string
}

export interface Piece extends PieceShape {
  id: string
}

export type PieceTier = 'easy' | 'medium' | 'hard'

export interface WeightedTier {
  tier: PieceTier
  weight: number
}

export interface GameState {
  board: Board
  pieces: (Piece | null)[]
  score: number
  combo: number
  highScore: number
  gameOver: boolean
}

// ─── Constants ──────────────────────────────────────────────────

export const BOARD_SIZE = 8

const PIECE_COLORS: Record<PieceTier, string[]> = {
  easy: ['#c9a24b', '#d4b06a', '#b8913a'],
  medium: ['#2d6a4f', '#40916c', '#52b788'],
  hard: ['#9b2226', '#ae2012', '#bb3e03'],
}

// ─── Piece definitions ──────────────────────────────────────────

const EASY_PIECES: PieceShape[] = [
  // single block
  { cells: [{ row: 0, col: 0 }], color: '#c9a24b', label: '1×1' },
  // 2 horizontal
  { cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }], color: '#d4b06a', label: '1×2' },
  // 2 vertical
  { cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }], color: '#b8913a', label: '2×1' },
  // 3 horizontal
  { cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }], color: '#c9a24b', label: '1×3' },
  // 3 vertical
  { cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }], color: '#d4b06a', label: '3×1' },
  // 2x2 square
  { cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }], color: '#b8913a', label: '2×2' },
]

const MEDIUM_PIECES: PieceShape[] = [
  // L-shape
  { cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }], color: '#2d6a4f', label: 'L' },
  // J-shape
  { cells: [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 0 }, { row: 2, col: 1 }], color: '#40916c', label: 'J' },
  // T-shape
  { cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 1 }], color: '#52b788', label: 'T' },
  // S-shape
  { cells: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 1 }], color: '#2d6a4f', label: 'S' },
  // Z-shape
  { cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }, { row: 1, col: 2 }], color: '#40916c', label: 'Z' },
  // 4 horizontal
  { cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }], color: '#52b788', label: '1×4' },
  // 4 vertical
  { cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }], color: '#2d6a4f', label: '4×1' },
]

const HARD_PIECES: PieceShape[] = [
  // 3x3 square
  { cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }], color: '#9b2226', label: '3×3' },
  // cross / plus
  { cells: [{ row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }], color: '#ae2012', label: '+' },
  // long L
  { cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }, { row: 3, col: 1 }], color: '#bb3e03', label: 'L+' },
  // 5 horizontal
  { cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }], color: '#9b2226', label: '1×5' },
  // 5 vertical
  { cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }, { row: 4, col: 0 }], color: '#ae2012', label: '5×1' },
]

// ─── Board operations ───────────────────────────────────────────

export function createBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 0 as Cell),
  )
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row])
}

// ─── Collision detection ────────────────────────────────────────

export function canPlace(board: Board, piece: PieceShape, row: number, col: number): boolean {
  for (const cell of piece.cells) {
    const r = row + cell.row
    const c = col + cell.col
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false
    if (board[r][c] === 1) return false
  }
  return true
}

export function placePiece(board: Board, piece: PieceShape, row: number, col: number): Board {
  const newBoard = cloneBoard(board)
  for (const cell of piece.cells) {
    newBoard[row + cell.row][col + cell.col] = 1
  }
  return newBoard
}

// ─── Line clearing ──────────────────────────────────────────────

export function clearLines(board: Board): { board: Board; cleared: number } {
  const newBoard = cloneBoard(board)
  let cleared = 0

  // clear full rows
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (newBoard[r].every((c) => c === 1)) {
      newBoard[r] = Array.from({ length: BOARD_SIZE }, () => 0 as Cell)
      cleared++
    }
  }

  // clear full columns
  for (let c = 0; c < BOARD_SIZE; c++) {
    let full = true
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (newBoard[r][c] === 0) { full = false; break }
    }
    if (full) {
      for (let r = 0; r < BOARD_SIZE; r++) {
        newBoard[r][c] = 0
      }
      cleared++
    }
  }

  return { board: newBoard, cleared }
}

// ─── Scoring ────────────────────────────────────────────────────

export function calculateScore(clearedLines: number, combo: number, piecesPlaced: number): number {
  if (clearedLines === 0) return 0
  const base = clearedLines * 10
  const comboMultiplier = 1 + combo * 0.5
  const pieceBonus = piecesPlaced >= 3 ? 30 : 0 // all 3 pieces placed = bonus
  return Math.round(base * comboMultiplier + pieceBonus)
}

// ─── Piece generation ───────────────────────────────────────────

function weightedRandom(tiers: WeightedTier[]): PieceTier {
  const total = tiers.reduce((s, t) => s + t.weight, 0)
  let r = Math.random() * total
  for (const t of tiers) {
    r -= t.weight
    if (r <= 0) return t.tier
  }
  return tiers[tiers.length - 1].tier
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getPieceTiers(score: number): WeightedTier[] {
  const hardBoost = score >= 2000 ? Math.floor((score - 2000) / 500) + 1 : 0
  return [
    { tier: 'easy', weight: 10 },
    { tier: 'medium', weight: 5 },
    { tier: 'hard', weight: 3 + hardBoost },
  ]
}

let pieceCounter = 0

export function generatePiece(score: number): Piece {
  const tiers = getPieceTiers(score)
  const tier = weightedRandom(tiers)
  const pool = tier === 'easy' ? EASY_PIECES : tier === 'medium' ? MEDIUM_PIECES : HARD_PIECES
  const shape = pickRandom(pool)
  const colorPool = PIECE_COLORS[tier]
  return {
    ...shape,
    id: `piece_${++pieceCounter}_${Date.now()}`,
    color: shape.color || pickRandom(colorPool),
  }
}

export function generatePieces(score: number, count = 3): Piece[] {
  return Array.from({ length: count }, () => generatePiece(score))
}

// ─── Game over detection ────────────────────────────────────────

export function hasValidPlacement(board: Board, piece: PieceShape): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (canPlace(board, piece, r, c)) return true
    }
  }
  return false
}

export function isGameOver(board: Board, pieces: (Piece | null)[]): boolean {
  return pieces.every((p) => p === null || !hasValidPlacement(board, p))
}

// ─── Full game step ─────────────────────────────────────────────

export interface PlaceResult {
  board: Board
  score: number
  combo: number
  cleared: number
  piecesLeft: (Piece | null)[]
  gameOver: boolean
}

export function placePieceOnBoard(
  state: GameState,
  pieceIndex: number,
  row: number,
  col: number,
): PlaceResult | null {
  const piece = state.pieces[pieceIndex]
  if (!piece) return null
  if (!canPlace(state.board, piece, row, col)) return null

  const newBoard = placePiece(state.board, piece, row, col)
  const { board: clearedBoard, cleared } = clearLines(newBoard)

  const newPieces = [...state.pieces]
  newPieces[pieceIndex] = null

  const allPlaced = newPieces.every((p) => p === null)
  const newCombo = cleared > 0 ? state.combo + 1 : 0
  const placedCount = state.pieces.filter((p) => p === null).length + 1
  const scoreGain = calculateScore(cleared, state.combo, placedCount)
  const newScore = state.score + scoreGain

  // refill pieces if all placed
  let finalPieces = newPieces
  if (allPlaced) {
    finalPieces = generatePieces(newScore)
  }

  const gameOver = isGameOver(clearedBoard, finalPieces)

  return {
    board: clearedBoard,
    score: newScore,
    combo: newCombo,
    cleared,
    piecesLeft: finalPieces,
    gameOver,
  }
}

// ─── Reset ──────────────────────────────────────────────────────

export function createInitialState(highScore = 0): GameState {
  return {
    board: createBoard(),
    pieces: generatePieces(0),
    score: 0,
    combo: 0,
    highScore,
    gameOver: false,
  }
}
