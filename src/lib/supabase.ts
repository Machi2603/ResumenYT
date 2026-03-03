import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export type Video = {
  id: string
  user_id: string
  youtube_url: string
  title: string
  transcript: string
  summary: string
  reading_time: number
  google_doc_url: string | null
  created_at: string
}

export type Message = {
  id: string
  video_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
