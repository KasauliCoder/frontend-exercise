export interface TileType {
  id: number
  content: string
  isFlipped: boolean
  isMatched: boolean
}

export interface BoardSize {
  rows: number
  cols: number
  totalTiles: number
}

export interface GameResult {
  playerName: string
  moves: number
  timeElapsed: number
  boardSize: BoardSize
}

export const BOARD_SIZES: Record<string, BoardSize> = {
  'Easy (4x4)': { rows: 4, cols: 4, totalTiles: 16 },
  'Medium (4x5)': { rows: 4, cols: 5, totalTiles: 20 },
  'Hard (6x6)': { rows: 6, cols: 6, totalTiles: 36 },
}

export function shuffle<T>(arr: T[]): T[] {
  return arr
    .map(a => [Math.random(), a] as const)
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1])
}

export const formatTime = (t: number) =>
  `${Math.floor(t / 60)}m ${String(t % 60).padStart(2, '0')}s`

export type GameView = 'start' | 'game' | 'end' | 'leaderboard'
