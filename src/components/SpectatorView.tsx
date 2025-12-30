import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Card } from './Card'

interface SpectatorGame {
  id: string
  user_id: string
  game_state: any
  bet_amount: number
  username?: string
}

export function SpectatorView() {
  const [activeGames, setActiveGames] = useState<SpectatorGame[]>([])
  const [selectedGame, setSelectedGame] = useState<SpectatorGame | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActiveGames()

    // Subscribe to realtime updates
    const channel = supabase
      .channel('active_games')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_games',
        },
        () => {
          loadActiveGames()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadActiveGames = async () => {
    try {
      const { data, error } = await supabase
        .from('active_games')
        .select(`
          *,
          profiles:user_id (
            username
          )
        `)
        .order('updated_at', { ascending: false })
        .limit(10)

      if (error) throw error

      const gamesWithUsernames = (data || []).map((game: any) => ({
        ...game,
        username: game.profiles?.username || 'Anonymous',
      }))

      setActiveGames(gamesWithUsernames)
      
      // Auto-select first game if none selected
      if (!selectedGame && gamesWithUsernames.length > 0) {
        setSelectedGame(gamesWithUsernames[0])
      }
    } catch (error) {
      console.error('Error loading active games:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="glass rounded-2xl p-8 text-center text-white/60">
          Loading active games...
        </div>
      </div>
    )
  }

  if (activeGames.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="glass rounded-2xl p-8 text-center text-white/60">
          No active games to spectate. Start playing to see games here!
        </div>
      </div>
    )
  }

  const gameState = selectedGame?.game_state || {}

  return (
    <div className="max-w-6xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">👀 Spectator Mode</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {activeGames.map((game) => (
            <motion.button
              key={game.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedGame(game)}
              className={`glass rounded-lg p-4 text-left transition ${
                selectedGame?.id === game.id
                  ? 'ring-2 ring-casino-gold bg-white/10'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="text-white font-semibold">{game.username}</div>
              <div className="text-white/60 text-sm">Bet: ${game.bet_amount}</div>
            </motion.button>
          ))}
        </div>

        {selectedGame && (
          <div className="mt-8">
            <div className="text-center mb-6">
              <div className="text-white/80 text-lg mb-2">
                Watching: <span className="font-bold text-white">{selectedGame.username}</span>
              </div>
              <div className="text-white/60">
                Bet: <span className="text-casino-gold">${selectedGame.bet_amount}</span>
              </div>
            </div>

            {/* Dealer Section */}
            {gameState.dealerHand && (
              <div className="mb-8">
                <div className="text-white/80 mb-4 text-lg font-semibold">Dealer</div>
                <div className="flex gap-2 flex-wrap">
                  {gameState.dealerHand.cards?.map((card: any, index: number) => (
                    <Card
                      key={card.id || index}
                      card={card}
                      faceDown={index === 1 && gameState.gameState !== 'dealer-turn' && gameState.gameState !== 'finished'}
                      index={index}
                    />
                  ))}
                </div>
                {gameState.dealerHand.total && (
                  <div className="mt-4 text-white/80">
                    Total: {gameState.dealerHand.total}
                  </div>
                )}
              </div>
            )}

            {/* Player Section */}
            {gameState.playerHand && (
              <div>
                <div className="text-white/80 mb-4 text-lg font-semibold">Player Hand</div>
                <div className="flex gap-2 flex-wrap mb-4">
                  {gameState.playerHand.cards?.map((card: any, index: number) => (
                    <Card key={card.id || index} card={card} index={index} />
                  ))}
                </div>
                {gameState.playerHand.total && (
                  <div className="text-white/80">
                    Total: {gameState.playerHand.total}
                    {gameState.playerHand.isBlackjack && (
                      <span className="text-casino-gold ml-2">BLACKJACK!</span>
                    )}
                    {gameState.playerHand.isBust && (
                      <span className="text-red-400 ml-2">BUST!</span>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 text-center text-white/60 text-sm">
              Game State: <span className="text-white">{gameState.gameState || 'betting'}</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

