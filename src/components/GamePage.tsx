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

type Action = { type: 'FLIP'; id: number } | { type: 'MATCH'; ids: number[] } | { type: 'RESET' } | { type: 'LOCK'; lock: boolean }

function initializeTiles(size: BoardSize): TileType[] {
  const totalPairs = size.totalTiles / 2
  const images = Array.from({ length: totalPairs }, (_, i) => `/images/plant${String(i + 1).padStart(2, '0')}.jpg`)
  const allTiles = shuffle([...images, ...images])
  return allTiles.map((img, i) => ({
    id: i,
    content: img,
    isFlipped: false,
    isMatched: false
  }))
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'FLIP':
      if (state.isBoardLocked || state.tiles[action.id].isFlipped || state.tiles[action.id].isMatched) return state
      return {
        ...state,
        tiles: state.tiles.map((t) => (t.id === action.id ? { ...t, isFlipped: true } : t)),
        flippedTiles: [...state.flippedTiles, action.id],
        moves: state.flippedTiles.length === 1 ? state.moves + 1 : state.moves
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

export const GamePage: React.FC<GamePageProps> = ({ playerName, boardSize, onEnd }) => {
  const [state, dispatch] = useReducer(reducer, {
    tiles: initializeTiles(boardSize),
    flippedTiles: [],
    moves: 0,
    matchesFound: 0,
    isBoardLocked: false
  })

  const [time, setTime] = useState(0)
  const totalPairs = boardSize.totalTiles / 2

  useEffect(() => {
    bgMusic.play()
    return () => {
      bgMusic.stop()
    }
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
        timeElapsed: time
      })
    }
  }, [state.matchesFound, totalPairs, playerName, state.moves, boardSize, time, onEnd])

  const handleQuit = () => {
    bgMusic.stop()
    onEnd({
      playerName,
      moves: state.moves,
      boardSize,
      timeElapsed: time
    })
  }

  return (
    <div className='page-container relative flex min-h-screen w-full flex-col items-center justify-start bg-[#0b1717] p-4 px-[32px] py-[40px] text-white'>
      {/* Header */}
      <div className='flex w-full max-w-[500px] items-center justify-between rounded-2xl border border-[#5e5e5e] bg-gray-800/40 px-[32px] py-[16px] shadow-lg backdrop-blur-xl'>
        <button
          onClick={handleQuit}
          className='px-[10px] py-[6px] text-lg font-semibold text-[#ff0000] transition-all hover:scale-105 hover:text-red-300'>
          ⏪ Quit
        </button>
        <div className='space-x-6 text-lg font-medium text-[#fff]'>
          <span>
            Moves: <span className='font-semibold text-teal-400'>{state.moves}</span>
          </span>
          <span>
            Time:{' '}
            <span className='font-semibold text-yellow-400'>
              {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
            </span>
          </span>
        </div>
        <p className='text-[20px] font-semibold text-[#00b1a2]'>{playerName}</p>
      </div>

      {/* Game Board */}
      <div
        className='page-container grid w-full max-w-[500px] justify-center gap-4 gap-5 rounded-3xl border border-[#5e5e5e] bg-slate-800/30 p-[32px] shadow-[0_0_40px_rgba(56,189,248,0.3)] backdrop-blur-md'
        style={{
          gridTemplateColumns: `repeat(${boardSize.cols}, minmax(40px, 1fr))`
        }}>
        {state.tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} onClick={handleTileClick} isLocked={state.isBoardLocked} />
        ))}
      </div>
    </div>
  )
}
