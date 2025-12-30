# 🚀 Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Run the Database Schema**
   - In your Supabase dashboard, go to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run" to execute the schema

3. **Enable Google OAuth** (Optional but recommended)
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials:
     - Get Client ID and Secret from [Google Cloud Console](https://console.cloud.google.com/)
     - Add authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`

4. **Get Your API Keys**
   - Go to Settings > API
   - Copy your Project URL and anon/public key

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎮 First Time Setup

1. **Sign Up/Login**
   - Click "Sign Up" or use Google OAuth
   - Your profile will be automatically created with 5,000 starting chips

2. **Start Playing**
   - Place your bet using the chip buttons
   - Click "Deal Cards" to start
   - Use "Hit" or "Stand" to play

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
- Make sure your `.env` file exists and has the correct values
- Restart the dev server after creating/updating `.env`

### Issue: "Error loading profile"
- Check that the database schema was run successfully
- Verify RLS policies are enabled
- Check browser console for specific error messages

### Issue: Google OAuth not working
- Verify redirect URI is correctly configured in Google Cloud Console
- Check that Google provider is enabled in Supabase
- Ensure redirect URI matches exactly (including https/http)

### Issue: Cards not animating
- Check browser console for errors
- Ensure Framer Motion is installed: `npm install framer-motion`

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🚢 Deployment

### Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in project settings
4. Deploy!

### Netlify
1. Push code to GitHub
2. Import project in Netlify
3. Add environment variables in Site settings > Environment variables
4. Deploy!

## 📝 Notes

- The app uses Web Audio API for sound effects (no external sound files needed)
- All game state is stored in Supabase
- Spectator mode requires active games to be playing
- Leaderboard updates in real-time

