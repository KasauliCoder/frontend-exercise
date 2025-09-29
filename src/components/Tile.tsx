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
      className={`flex aspect-square cursor-pointer items-center justify-center rounded-xl ${isMatched ? 'pointer-events-none opacity-30' : ''}`}
      style={{
        perspective: '200px'
      }}>
      {/* Flip Container */}
      <motion.div
        className='relative h-full w-full rounded-xl'
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          transformStyle: 'preserve-3d',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        {/* Back Face */}
        <div
          className='absolute inset-0 flex items-center justify-center rounded-xl border-2 border-[#00ffe1] bg-gray-800 shadow-md'
          style={{
            backfaceVisibility: 'hidden',
            boxShadow: '0 0 15px #00ffe1, 0 0 25px #00b3ff inset'
          }}>
          <img src='/images/growy_logo.svg' alt='Back' className='h-[24px] w-[24px] object-contain' />
        </div>

        {/* Front Face */}
        <div
          className='absolute inset-0 flex items-center justify-center rounded-xl bg-white shadow-lg'
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            overflow: 'hidden'
          }}>
          <img src={content} alt='Plant' className='h-full w-full rounded-lg object-cover shadow-inner' />
        </div>
      </motion.div>
    </motion.div>
  )
}
