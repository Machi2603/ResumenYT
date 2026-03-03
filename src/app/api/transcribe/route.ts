import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { getTranscript, extractVideoId, getVideoTitle } from '@/lib/transcription'
import { generateSummary } from '@/lib/openai'

export const maxDuration = 90

export async function POST(req: NextRequest) {
  try {
    const { url, readingTime, userId } = await req.json()

    if (!url || !userId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json({ error: 'URL de YouTube inválida' }, { status: 400 })
    }

    // Get title and transcript concurrently
    const [title, transcript] = await Promise.all([
      getVideoTitle(videoId),
      getTranscript(videoId),
    ])

    // Generate summary
    const summary = await generateSummary(transcript, title, readingTime ?? 5)

    // Save to Supabase
    const supabase = createSupabaseServerClient()
    const { data: video, error } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        youtube_url: url,
        title,
        transcript,
        summary,
        reading_time: readingTime ?? 5,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Error guardando en base de datos' }, { status: 500 })
    }

    return NextResponse.json({ video })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[/api/transcribe]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
