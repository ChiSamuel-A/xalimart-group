import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xxwxellhlwtxjlznafqz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_c2fAbIGO3RpBWIsFAHTMTQ_8AyPH-Jt'

export const supabase = createClient(supabaseUrl, supabaseKey)
