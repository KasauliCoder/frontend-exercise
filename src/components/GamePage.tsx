import React, { useReducer, useEffect, useState, useCallback } from 'react'
import { Tile } from './Tile'
import type { TileType, BoardSize, GameResult } from '../utils/constants'
import { shuffle } from '../utils/constants'
import { matchSound, missSound, winningSound, bgMusic } from '../utils/sounds'

interface GamePageProps {
  playerName: string
  boardSize: BoardSize
  onEnd: (result: GameResult) => void
}

interface GameState {
  tiles: TileType[]
  flippedTiles: number[]
  moves: number
  matchesFound: number
  isBoardLocked: boolean
}

type Action =
  | { type: 'FLIP'; id: number }
  | { type: 'MATCH'; ids: number[] }
  | { type: 'RESET' }
  | { type: 'LOCK'; lock: boolean }

function initializeTiles(size: BoardSize): TileType[] {
  const totalPairs = size.totalTiles / 2
  const images = Array.from(
    { length: totalPairs },
    (_, i) => `/images/plant${String(i + 1).padStart(2, '0')}.jpg`
  )
  const allTiles = shuffle([...images, ...images])
  return allTiles.map((img, i) => ({
    id: i,
    content: img,
    isFlipped: false,
    isMatched: false,
  }))
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'FLIP':
      if (
        state.isBoardLocked ||
        state.tiles[action.id].isFlipped ||
        state.tiles[action.id].isMatched
      )
        return state
      return {
        ...state,
        tiles: state.tiles.map((t) =>
          t.id === action.id ? { ...t, isFlipped: true } : t
        ),
        flippedTiles: [...state.flippedTiles, action.id],
        moves: state.flippedTiles.length === 1 ? state.moves + 1 : state.moves,
      }
    case 'MATCH':
      return {
        ...state,
        tiles: state.tiles.map((t) =>
          action.ids.includes(t.id) ? { ...t, isMatched: true } : t
        ),
        flippedTiles: [],
        matchesFound: state.matchesFound + 1,
      }
    case 'RESET':
      return {
        ...state,
        tiles: state.tiles.map((t) =>
          state.flippedTiles.includes(t.id) ? { ...t, isFlipped: false } : t
        ),
        flippedTiles: [],
      }
    case 'LOCK':
      return { ...state, isBoardLocked: action.lock }
    default:
      return state
  }
}

export const GamePage: React.FC<GamePageProps> = ({ playerName, boardSize, onEnd }) => {
  const [state, dispatch] = useReducer(reducer, {
    tiles: initializeTiles(boardSize),
    flippedTiles: [],
    moves: 0,
    matchesFound: 0,
    isBoardLocked: false,
  })

  const [time, setTime] = useState(0)
  const totalPairs = boardSize.totalTiles / 2

  useEffect(() => {
    bgMusic.play()
    return () => { bgMusic.stop(); };
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (state.matchesFound < totalPairs) setTime((t) => t + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [state.matchesFound, totalPairs])

  const handleTileClick = useCallback((id: number) => dispatch({ type: 'FLIP', id }), [])

  useEffect(() => {
    if (state.flippedTiles.length === 2) {
      dispatch({ type: 'LOCK', lock: true })
      const [a, b] = state.flippedTiles
      const t1 = state.tiles[a],
        t2 = state.tiles[b]

      setTimeout(() => {
        if (t1.content === t2.content) {
          matchSound.play()
          dispatch({ type: 'MATCH', ids: [a, b] })
        } else {
          missSound.play()
          dispatch({ type: 'RESET' })
        }
        dispatch({ type: 'LOCK', lock: false })
      }, 700)
    }
  }, [state.flippedTiles, state.tiles])

  useEffect(() => {
    if (state.matchesFound === totalPairs && totalPairs > 0) {
      winningSound.play()
      onEnd({
        playerName,
        moves: state.moves,
        boardSize,
        timeElapsed: time,
      })
    }
  }, [state.matchesFound, totalPairs, playerName, state.moves, boardSize, time, onEnd])

  const handleQuit = () => {
    bgMusic.stop()
    onEnd({
      playerName,
      moves: state.moves,
      boardSize,
      timeElapsed: time,
    })
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full px-[32px] py-[40px] page-container relative min-h-screen bg-[#0b1717] p-4 text-white">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-[500px] bg-gray-800/40 backdrop-blur-xl border border-[#5e5e5e] px-[32px] py-[16px] rounded-2xl shadow-lg ">
        <button
          onClick={handleQuit}
          className="text-[#ff0000] text-lg font-semibold hover:text-red-300 hover:scale-105 transition-all py-[6px] px-[10px]"
        >
          ⏪ Quit
        </button>
        <div className="text-[#fff] text-lg font-medium space-x-6">
          <span>
            Moves: <span className="text-teal-400 font-semibold">{state.moves}</span>
          </span>
          <span>
            Time:{" "}
            <span className="text-yellow-400 font-semibold">
              {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
            </span>
          </span>
        </div>
        <p className="text-[#00b1a2] text-[20px] font-semibold">{playerName}</p>
      </div>

      {/* Game Board */}
      <div
        className="grid gap-5 max-w-[500px] w-full justify-center bg-slate-800/30 backdrop-blur-md p-[32px] rounded-3xl shadow-[0_0_40px_rgba(56,189,248,0.3)] border border-[#5e5e5e] page-container gap-4"
        style={{
          gridTemplateColumns: `repeat(${boardSize.cols}, minmax(40px, 1fr))`,
        }}
      >
        {state.tiles.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            onClick={handleTileClick}
            isLocked={state.isBoardLocked}
          />
        ))}
      </div>
    </div>
  )
}
