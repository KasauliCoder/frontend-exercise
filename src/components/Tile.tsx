import React from 'react'
import { motion } from 'framer-motion'
import type { TileType } from '../utils/constants'
import { flipSound } from '../utils/sounds'

interface TileProps {
  tile: TileType
  onClick: (id: number) => void
  isLocked: boolean
}

export const Tile: React.FC<TileProps> = ({ tile, onClick, isLocked }) => {
  const { id, content, isFlipped, isMatched } = tile

  const handleClick = () => {
    if (!isLocked && !isFlipped && !isMatched) {
      flipSound.play()
      onClick(id)
    }
  }

  return (
    <motion.div
      layout
      whileHover={!isFlipped && !isLocked && !isMatched ? { scale: 1.05, boxShadow: '0 0 15px #00ffe1' } : {}}
      onClick={handleClick}
      className={`flex items-center justify-center aspect-square cursor-pointer rounded-xl ${
        isMatched ? 'opacity-30 pointer-events-none' : ''
      }`}
      style={{
        perspective: '200px',
      }}
    >
      {/* Flip Container */}
      <motion.div
        className="relative w-full h-full rounded-xl"
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          transformStyle: 'preserve-3d',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Back Face */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-gray-800 border-2 border-[#00ffe1] shadow-md"
          style={{
            backfaceVisibility: 'hidden',
            boxShadow: '0 0 15px #00ffe1, 0 0 25px #00b3ff inset',
          }}
        >
          <img
            src="/images/growy_logo.svg"
            alt="Back"
            className="w-[24px] h-[24px] object-contain"
          />
        </div>

        {/* Front Face */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-white shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            overflow: 'hidden',
          }}
        >
          <img
            src={content}
            alt="Plant"
            className="w-full h-full object-cover rounded-lg shadow-inner h-full"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
