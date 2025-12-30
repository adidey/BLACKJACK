import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, type Profile } from '../lib/supabase'

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'chips' | 'wins'>('chips')

  useEffect(() => {
    loadLeaderboard()
  }, [sortBy])

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order(sortBy, { ascending: false })
        .limit(20)

      if (error) throw error
      setLeaderboard(data || [])
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}.`
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🏆 Leaderboard</h2>
        
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setSortBy('chips')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              sortBy === 'chips'
                ? 'bg-casino-gold text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            By Chips
          </button>
          <button
            onClick={() => setSortBy('wins')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              sortBy === 'wins'
                ? 'bg-casino-gold text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            By Wins
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white/60 py-8">Loading...</div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-lg p-4 flex items-center justify-between hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-casino-gold w-12">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">{player.username}</div>
                    <div className="text-white/60 text-sm">
                      {player.wins}W / {player.losses}L / {player.pushes}P
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-casino-gold font-bold text-xl">
                    ${player.chips.toLocaleString()}
                  </div>
                  {sortBy === 'wins' && (
                    <div className="text-white/60 text-sm">{player.wins} wins</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

