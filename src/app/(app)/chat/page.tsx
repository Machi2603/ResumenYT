import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createSupabaseServerClient } from '@/lib/supabase'
import { ChatInterface } from '@/components/ChatInterface'
import type { Video } from '@/lib/supabase'

export default async function ChatPage() {
  const cookieStore = await cookies()

  const supabaseBrowser = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const { data: { session } } = await supabaseBrowser.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Load user's video history
  const supabase = createSupabaseServerClient()
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(30)

  return (
    <ChatInterface
      userId={session.user.id}
      userEmail={session.user.email ?? ''}
      initialVideos={(videos ?? []) as Video[]}
    />
  )
}
