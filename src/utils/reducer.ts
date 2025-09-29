import type { TileType } from './constants'

export interface GameState {
  tiles: TileType[]
  flippedTiles: number[]
  moves: number
  matchesFound: number
  isBoardLocked: boolean
}

export type Action = { type: 'FLIP'; id: number } | { type: 'MATCH'; ids: number[] } | { type: 'RESET' } | { type: 'LOCK'; lock: boolean }

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'FLIP': {
      if (state.isBoardLocked) return state
      if (state.tiles[action.id].isFlipped || state.tiles[action.id].isMatched) return state

      const newTiles = state.tiles.map((t) => (t.id === action.id ? { ...t, isFlipped: true } : t))
      return {
        ...state,
        tiles: newTiles,
        flippedTiles: [...state.flippedTiles, action.id],
        moves: state.flippedTiles.length === 1 ? state.moves + 1 : state.moves
      }
    }

    case 'MATCH':
      return {
        ...state,
        tiles: state.tiles.map((t) => (action.ids.includes(t.id) ? { ...t, isMatched: true } : t)),
        flippedTiles: [],
        matchesFound: state.matchesFound + 1
      }

    case 'RESET':
      return {
        ...state,
        tiles: state.tiles.map((t) => (state.flippedTiles.includes(t.id) ? { ...t, isFlipped: false } : t)),
        flippedTiles: []
      }

    case 'LOCK':
      return { ...state, isBoardLocked: action.lock }

    default:
      return state
  }
}
