import { motion } from 'framer-motion'
import type { Card as CardType } from '../lib/gameLogic'

interface CardProps {
  card: CardType
  faceDown?: boolean
  index?: number
}

const suitSymbols: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const suitColors: Record<string, string> = {
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-black',
  spades: 'text-black',
}

export function Card({ card, faceDown = false, index = 0 }: CardProps) {
  if (faceDown) {
    return (
      <motion.div
        initial={{ rotateY: 0, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        className="w-20 h-28 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg border-2 border-white/20 flex items-center justify-center relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-900/20 rounded-lg" />
        <div className="text-white text-2xl font-bold">🂠</div>
      </motion.div>
    )
  }

  const suitSymbol = suitSymbols[card.suit]
  const suitColor = suitColors[card.suit]

  return (
    <motion.div
      initial={{ rotateY: -180, opacity: 0, y: -50 }}
      animate={{ rotateY: 0, opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="w-20 h-28 bg-white rounded-lg shadow-xl border-2 border-gray-200 flex flex-col items-center justify-between p-2 relative"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className={`text-lg font-bold ${suitColor} self-start`}>
        {card.rank}
      </div>
      <div className={`text-3xl ${suitColor}`}>{suitSymbol}</div>
      <div className={`text-lg font-bold ${suitColor} self-end rotate-180`}>
        {card.rank}
      </div>
    </motion.div>
  )
}

