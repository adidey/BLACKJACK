import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, type Game as GameRecord } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function GameHistory() {
  const { user } = useAuth()
  const [games, setGames] = useState<GameRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadGameHistory()
    }
  }, [user])

  const loadGameHistory = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setGames(data || [])
    } catch (error) {
      console.error('Error loading game history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getResultColor = (result: string) => {
    if (result === 'win') return 'text-casino-gold'
    if (result === 'loss') return 'text-red-400'
    return 'text-white/60'
  }

  const getResultIcon = (result: string) => {
    if (result === 'win') return '🎉'
    if (result === 'loss') return '💸'
    return '🤝'
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">📊 Game History</h2>

        {loading ? (
          <div className="text-center text-white/60 py-8">Loading...</div>
        ) : games.length === 0 ? (
          <div className="text-center text-white/60 py-8">No games played yet</div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="glass rounded-lg p-4 flex items-center justify-between hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`text-2xl ${getResultColor(game.result)}`}>
                    {getResultIcon(game.result)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {game.result.toUpperCase()}
                    </div>
                    <div className="text-white/60 text-sm">
                      Player: {game.player_total} | Dealer: {game.dealer_total}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getResultColor(game.result)}`}>
                    {game.result === 'win' ? '+' : game.result === 'loss' ? '-' : ''}
                    ${game.bet_amount.toLocaleString()}
                  </div>
                  <div className="text-white/60 text-xs">
                    {game.created_at ? new Date(game.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

