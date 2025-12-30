import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BlackjackGame, type GameResult } from '../lib/gameLogic'
import { Card } from './Card'
import { Chip } from './Chip'
import { useAuth } from '../hooks/useAuth'
import { useSound } from '../hooks/useSound'
import { supabase, type Game as GameRecord } from '../lib/supabase'

const CHIP_VALUES = [10, 25, 50, 100, 500, 1000]

export function Game() {
  const { profile, updateProfile } = useAuth()
  const { playSound, muted, toggleMute } = useSound()
  const [game] = useState(() => new BlackjackGame())
  const [gameKey, setGameKey] = useState(0) // Force re-render key
  const [currentBet, setCurrentBet] = useState(0)
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [payout, setPayout] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const playerHand = game.getPlayerHand()
  const dealerHand = game.getDealerHand()
  const gameState = game.getGameState()
  const bet = game.getBet()
  
  // Force component update when game state changes
  const forceUpdate = () => setGameKey(prev => prev + 1)

  // Save active game state for spectator mode
  useEffect(() => {
    if (!profile || gameState === 'betting' || gameState === 'finished') {
      // Clean up active game when finished or betting
      if (profile && gameState === 'finished') {
        supabase
          .from('active_games')
          .delete()
          .eq('user_id', profile.id)
          .match(console.error)
      }
      return
    }

    // Save active game state
    const gameStateData = {
      gameState,
      playerHand,
      dealerHand,
      bet,
    }

    supabase
      .from('active_games')
      .upsert({
        user_id: profile.id,
        game_state: gameStateData,
        bet_amount: bet,
      })
      .match(console.error)
  }, [gameState, playerHand, dealerHand, bet, profile])

  useEffect(() => {
    if (gameState === 'finished' && !showResult) {
      const result = game.getResult()
      if (result) {
        const payoutAmount = game.calculatePayout(result)
        setGameResult(result)
        setPayout(payoutAmount)
        setShowResult(true)

        // Play sound
        if (result === 'win') {
          playSound('win')
        } else if (result === 'loss') {
          playSound('lose')
        } else {
          playSound('push')
        }

        // Update profile and save game
        if (profile) {
          const newChips = profile.chips - bet + payoutAmount
          const updates: any = { chips: newChips }
          
          if (result === 'win') {
            updates.wins = profile.wins + 1
          } else if (result === 'loss') {
            updates.losses = profile.losses + 1
          } else {
            updates.pushes = profile.pushes + 1
          }

          updateProfile(updates)

          // Save game record
          const gameRecord: Omit<GameRecord, 'id' | 'created_at'> = {
            user_id: profile.id,
            bet_amount: bet,
            player_total: playerHand.total,
            dealer_total: dealerHand.total,
            result,
          }

          supabase.from('games').insert(gameRecord).match(console.error)
        }
      }
    }
  }, [gameState, showResult, game, profile, bet, playerHand.total, dealerHand.total, updateProfile, playSound])

  const handleChipClick = (value: number) => {
    if (gameState !== 'betting' || !profile) return
    
    const newBet = currentBet + value
    if (newBet <= profile.chips) {
      setCurrentBet(newBet)
      playSound('bet')
    }
  }

  const handleDeal = () => {
    if (currentBet === 0 || !profile || currentBet > profile.chips) return
    
    if (game.placeBet(currentBet, profile.chips)) {
      game.startGame()
      forceUpdate()
      playSound('deal')
    }
  }

  const handleHit = () => {
    if (game.hit()) {
      playSound('deal')
      forceUpdate()
    }
  }

  const handleStand = () => {
    if (game.stand()) {
      forceUpdate()
    }
  }

  const handleNewGame = () => {
    game.reset()
    setCurrentBet(0)
    setGameResult(null)
    setPayout(0)
    setShowResult(false)
    forceUpdate()
  }

  const clearBet = () => {
    setCurrentBet(0)
  }

  return (
    <div key={gameKey} className="min-h-screen p-4 pb-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="glass rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-white/60 text-sm">Chips</div>
              <div className="text-2xl font-bold text-white">
                ${profile?.chips.toLocaleString() || 0}
              </div>
            </div>
            <div>
              <div className="text-white/60 text-sm">Current Bet</div>
              <div className="text-2xl font-bold text-casino-gold">
                ${currentBet.toLocaleString()}
              </div>
            </div>
          </div>
          <button
            onClick={toggleMute}
            className="text-white/80 hover:text-white transition"
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Game Table */}
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-2xl p-8 min-h-[500px]">
          {/* Dealer Section */}
          <div className="mb-12">
            <div className="text-white/80 mb-4 text-lg font-semibold">Dealer</div>
            <div className="flex gap-2 flex-wrap">
              {dealerHand.cards.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  faceDown={index === 1 && gameState !== 'dealer-turn' && gameState !== 'finished'}
                  index={index}
                />
              ))}
            </div>
            {gameState !== 'betting' && (
              <div className="mt-4 text-white/80">
                Total: {dealerHand.total}
                {dealerHand.isBust && <span className="text-red-400 ml-2">BUST!</span>}
                {dealerHand.isBlackjack && <span className="text-casino-gold ml-2">BLACKJACK!</span>}
              </div>
            )}
          </div>

          {/* Result Display */}
          <AnimatePresence>
            {showResult && gameResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center mb-8"
              >
                <div className={`text-4xl font-bold mb-2 ${
                  gameResult === 'win' ? 'text-casino-gold' :
                  gameResult === 'loss' ? 'text-red-400' :
                  'text-white'
                }`}>
                  {gameResult === 'win' ? '🎉 YOU WIN!' :
                   gameResult === 'loss' ? '💸 YOU LOSE' :
                   '🤝 PUSH'}
                </div>
                {payout > 0 && (
                  <div className="text-2xl text-casino-gold">
                    +${payout.toLocaleString()}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Player Section */}
          <div>
            <div className="text-white/80 mb-4 text-lg font-semibold">Your Hand</div>
            <div className="flex gap-2 flex-wrap mb-4">
              {playerHand.cards.map((card, index) => (
                <Card key={card.id} card={card} index={index} />
              ))}
            </div>
            {gameState !== 'betting' && (
              <div className="mb-6 text-white/80">
                Total: {playerHand.total}
                {playerHand.isSoft && <span className="text-white/60 ml-2">(soft)</span>}
                {playerHand.isBust && <span className="text-red-400 ml-2">BUST!</span>}
                {playerHand.isBlackjack && <span className="text-casino-gold ml-2">BLACKJACK!</span>}
              </div>
            )}
          </div>

          {/* Betting Controls */}
          {gameState === 'betting' && (
            <div className="mt-8">
              <div className="text-white/80 mb-4 text-lg font-semibold">Place Your Bet</div>
              <div className="flex gap-4 flex-wrap justify-center mb-4">
                {CHIP_VALUES.map(value => (
                  <Chip
                    key={value}
                    value={value}
                    onClick={() => handleChipClick(value)}
                    disabled={!profile || currentBet + value > (profile.chips || 0)}
                  />
                ))}
              </div>
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeal}
                  disabled={currentBet === 0}
                  className="bg-casino-gold text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-500 transition"
                >
                  Deal Cards
                </motion.button>
                {currentBet > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearBet}
                    className="bg-white/20 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/30 transition"
                  >
                    Clear Bet
                  </motion.button>
                )}
              </div>
            </div>
          )}

          {/* Game Controls */}
          {gameState === 'playing' && (
            <div className="flex gap-4 justify-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHit}
                disabled={playerHand.isBust}
                className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
              >
                Hit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStand}
                className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition"
              >
                Stand
              </motion.button>
            </div>
          )}

          {/* New Game Button */}
          {gameState === 'finished' && (
            <div className="flex justify-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewGame}
                className="bg-casino-gold text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 transition"
              >
                New Game
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

