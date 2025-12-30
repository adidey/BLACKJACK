# 🃏 Blackjack Royale

A premium, modern web-based blackjack experience built with React, TypeScript, TailwindCSS, and Supabase.

![Blackjack Royale](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green)

## ✨ Features

### 🎮 Core Gameplay
- **Full Blackjack Implementation**: Standard rules with hit, stand, dealer logic
- **Animated Card Dealing**: Smooth card animations with 3D flip effects
- **Chip Betting System**: Visual chip selection with preset amounts
- **Real-time Game State**: Instant updates and smooth transitions

### 🔐 Authentication
- **Google OAuth**: One-click sign-in with Google
- **Email/Password**: Traditional authentication option
- **Session Management**: Persistent sessions with automatic profile creation

### 💰 Economy & Stats
- **Chip Management**: Starting balance of 5,000 chips
- **Game History**: Complete record of all games played
- **Win/Loss Tracking**: Detailed statistics (wins, losses, pushes)
- **Automatic Payouts**: Blackjack pays 3:2, regular wins pay 2:1

### 🏆 Social Features
- **Global Leaderboard**: Top 20 players ranked by chips or wins
- **Spectator Mode**: Watch other players' games in real-time (coming soon)

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern frosted glass aesthetic
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works on desktop and mobile
- **Sound Effects**: Immersive audio feedback (with mute toggle)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BLACKJACK
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Enable Google OAuth in Authentication > Providers
   - Get your project URL and anon key from Settings > API

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
BLACKJACK/
├── src/
│   ├── components/       # React components
│   │   ├── Card.tsx     # Card component with animations
│   │   ├── Chip.tsx     # Betting chip component
│   │   ├── Game.tsx     # Main game component
│   │   ├── GameHistory.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── Login.tsx
│   │   └── Navbar.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.ts   # Authentication hook
│   │   └── useSound.ts  # Sound effects hook
│   ├── lib/             # Core logic
│   │   ├── gameLogic.ts # Blackjack game engine
│   │   └── supabase.ts  # Supabase client
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── supabase-schema.sql  # Database schema
└── README.md
```

## 🎯 Game Rules

- **Dealer**: Must hit on 16 or less, stand on 17+
- **Blackjack**: 21 with first two cards pays 3:2
- **Regular Win**: Pays 2:1
- **Push**: Same total, bet returned
- **Bust**: Over 21, automatic loss

## 🗄️ Database Schema

### Tables

**profiles**
- `id` (UUID, Primary Key)
- `username` (TEXT)
- `chips` (INTEGER, default: 5000)
- `wins`, `losses`, `pushes` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

**games**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `bet_amount` (INTEGER)
- `player_total`, `dealer_total` (INTEGER)
- `result` (TEXT: 'win' | 'loss' | 'push')
- `created_at` (TIMESTAMP)

**active_games** (for spectator mode)
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `game_state` (JSONB)
- `bet_amount` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

## 🔒 Security

- **Row Level Security (RLS)**: Enabled on all tables
- **User Isolation**: Users can only modify their own data
- **Secure Authentication**: Supabase handles all auth securely
- **Environment Variables**: Sensitive keys stored in `.env`

## 🚢 Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import project in Netlify
3. Add environment variables in Site settings
4. Deploy!

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Backend**: Supabase
  - Authentication
  - PostgreSQL Database
  - Realtime (for spectator mode)

## 📝 Future Enhancements

- [ ] Insurance bets
- [ ] Split hands
- [ ] Double down
- [ ] Achievements system
- [ ] Daily bonus chips
- [ ] Public profile pages
- [ ] Export stats to CSV
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Card designs inspired by classic casino aesthetics
- Sound effects from royalty-free sources
- Built with modern web technologies

---

**Enjoy the game! 🎰**
