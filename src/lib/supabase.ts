import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  chips: number
  wins: number
  losses: number
  pushes: number
  created_at?: string
}

export type Game = {
  id?: string
  user_id: string
  bet_amount: number
  player_total: number
  dealer_total: number
  result: 'win' | 'loss' | 'push'
  created_at?: string
}

