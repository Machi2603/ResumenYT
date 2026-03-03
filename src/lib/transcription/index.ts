import { getTranscriptMethod1 } from './method1-youtube-transcript'
import { getTranscriptMethod2 } from './method2-ytdlp'
import { getTranscriptMethod3 } from './method3-whisper'

export async function getTranscript(
  videoId: string,
  onProgress?: (step: string) => void
): Promise<string> {
  // Method 1: youtube-transcript npm package
  try {
    onProgress?.('Buscando subtítulos nativos…')
    const text = await getTranscriptMethod1(videoId)
    if (text && text.length > 100) {
      console.log('[Transcript] Método 1 exitoso (youtube-transcript)')
      return text
    }
  } catch (e) {
    console.log('[Transcript] Método 1 falló:', e)
  }

  // Method 2: yt-dlp subprocess
  try {
    onProgress?.('Extrayendo subtítulos con yt-dlp…')
    const text = await getTranscriptMethod2(videoId)
    if (text && text.length > 100) {
      console.log('[Transcript] Método 2 exitoso (yt-dlp)')
      return text
    }
  } catch (e) {
    console.log('[Transcript] Método 2 falló:', e)
  }

  // Method 3: Whisper — download audio + OpenAI transcription
  onProgress?.('Transcribiendo audio con Whisper IA… (puede tardar)')
  console.log('[Transcript] Intentando Método 3 (Whisper)')
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
