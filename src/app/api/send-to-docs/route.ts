import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { videoId, userId } = await req.json()

    if (!videoId || !userId) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()

    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .eq('user_id', userId)
      .single()

    if (error || !video) {
      return NextResponse.json({ error: 'Vídeo no encontrado' }, { status: 404 })
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nWebhookUrl) {
      return NextResponse.json({ error: 'Webhook n8n no configurado' }, { status: 503 })
    }

    const payload = {
      videoTitle: video.title,
      videoUrl: video.youtube_url,
      transcript: video.transcript,
      summary: video.summary,
      readingTime: video.reading_time,
      processedAt: video.created_at,
    }

    const n8nRes = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!n8nRes.ok) {
      throw new Error(`n8n respondió con ${n8nRes.status}`)
    }

    const n8nData = await n8nRes.json().catch(() => ({}))
    const googleDocUrl = n8nData?.docUrl ?? n8nData?.url ?? null

    // Save Google Doc URL if returned
    if (googleDocUrl) {
      await supabase
        .from('videos')
        .update({ google_doc_url: googleDocUrl })
        .eq('id', videoId)
    }

    return NextResponse.json({ success: true, googleDocUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[/api/send-to-docs]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
