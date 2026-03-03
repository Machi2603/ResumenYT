import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { chatWithContext } from '@/lib/openai'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { videoId, message, userId } = await req.json()

    if (!videoId || !message || !userId) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()

    // Load video context
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('transcript, title')
      .eq('id', videoId)
      .eq('user_id', userId)
      .single()

    if (videoError || !video) {
      return NextResponse.json({ error: 'Vídeo no encontrado' }, { status: 404 })
    }

    // Load chat history
    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('video_id', videoId)
      .order('created_at', { ascending: true })
      .limit(20)

    const chatHistory = (history ?? []) as { role: 'user' | 'assistant'; content: string }[]

    // Generate AI response
    const reply = await chatWithContext(video.transcript, video.title, chatHistory, message)

    // Save both messages to DB
    await supabase.from('messages').insert([
      { video_id: videoId, role: 'user', content: message },
      { video_id: videoId, role: 'assistant', content: reply },
    ])

    return NextResponse.json({ reply })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[/api/chat]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
