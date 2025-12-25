// utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

// .env.localから鍵を取り出します
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// アプリ全体で使えるSupabaseクライアント（接続機能）を作って配ります
export const supabase = createClient(supabaseUrl, supabaseKey)