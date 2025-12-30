import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { Login } from './components/Login'
import { Game } from './components/Game'
import { Leaderboard } from './components/Leaderboard'
import { GameHistory } from './components/GameHistory'
import { SpectatorView } from './components/SpectatorView'
import { Navbar } from './components/Navbar'
import './App.css'

type View = 'game' | 'leaderboard' | 'history' | 'spectator'

function App() {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState<View>('game')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        <Navbar currentView={currentView} onViewChange={setCurrentView} />
        
        {currentView === 'game' && <Game />}
        {currentView === 'leaderboard' && <Leaderboard />}
        {currentView === 'history' && <GameHistory />}
        {currentView === 'spectator' && <SpectatorView />}
      </div>
    </div>
  )
}

export default App
