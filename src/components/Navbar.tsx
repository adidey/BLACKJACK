import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

interface NavbarProps {
  currentView: 'game' | 'leaderboard' | 'history' | 'spectator'
  onViewChange: (view: 'game' | 'leaderboard' | 'history' | 'spectator') => void
}

export function Navbar({ currentView, onViewChange }: NavbarProps) {
  const { signOut, profile } = useAuth()

  return (
    <nav className="glass rounded-xl p-4 mb-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-white">🃏 Blackjack Royale</div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => onViewChange('game')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              currentView === 'game'
                ? 'bg-casino-gold text-white'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Game
          </button>
          <button
            onClick={() => onViewChange('leaderboard')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              currentView === 'leaderboard'
                ? 'bg-casino-gold text-white'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => onViewChange('history')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              currentView === 'history'
                ? 'bg-casino-gold text-white'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            History
          </button>
          <button
            onClick={() => onViewChange('spectator')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              currentView === 'spectator'
                ? 'bg-casino-gold text-white'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Spectate
          </button>
          
          <div className="h-6 w-px bg-white/20" />
          
          <div className="text-white/80 text-sm">
            {profile?.username || 'Player'}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={signOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </motion.button>
        </div>
      </div>
    </nav>
  )
}

