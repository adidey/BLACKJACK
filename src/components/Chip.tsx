import { motion } from 'framer-motion'

interface ChipProps {
  value: number
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
}

const chipColors: Record<number, string> = {
  10: 'bg-blue-500',
  25: 'bg-green-500',
  50: 'bg-red-500',
  100: 'bg-purple-500',
  500: 'bg-yellow-500',
  1000: 'bg-pink-500',
}

export function Chip({ value, onClick, selected = false, disabled = false }: ChipProps) {
  const colorClass = chipColors[value] || 'bg-gray-500'
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-16 h-16 rounded-full ${colorClass} 
        border-4 border-white/30 shadow-lg
        flex items-center justify-center
        text-white font-bold text-sm
        cursor-pointer
        relative
        ${selected ? 'ring-4 ring-casino-gold ring-offset-2' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
      <span className="relative z-10">${value}</span>
    </motion.button>
  )
}

