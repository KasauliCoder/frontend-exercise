import type { BoardSize, TileType } from './constants'

export const shuffle = <T>(arr: T[]): T[] =>
  arr
    .map((a) => [Math.random(), a] as const)
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1])

export const initializeTiles = (size: BoardSize): TileType[] => {
  const totalPairs = size.totalTiles / 2
  const images = Array.from({ length: totalPairs }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    return `/plant${num}.jpg`
  })
  const all = shuffle([...images, ...images])
  return all.map((img, i) => ({
    id: i,
    content: img,
    isFlipped: false,
    isMatched: false
  }))
}

export const formatTime = (t: number): string => `${Math.floor(t / 60)}m ${String(t % 60).padStart(2, '0')}s`
