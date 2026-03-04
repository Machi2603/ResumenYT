import { getTranscriptMethod3 } from './method3-whisper'

export async function getTranscript(
  videoId: string,
  onProgress?: (step: string) => void
): Promise<string> {
  onProgress?.('Descargando audio y transcribiendo con Whisper… (puede tardar en vídeos largos)')
  console.log('[Transcript] Usando Método 3 (Whisper local)')
  const text = await getTranscriptMethod3(videoId)
  if (!text || text.length < 50) throw new Error('No se pudo obtener transcripción')
  return text
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export async function getVideoTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
    if (res.ok) {
      const data = await res.json()
      return data.title || 'Video sin título'
    }
  } catch {}
  return 'Video sin título'
}
