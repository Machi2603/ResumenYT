import { YoutubeTranscript } from 'youtube-transcript'

export async function getTranscriptMethod1(videoId: string): Promise<string> {
  const languages = ['es', 'en', 'es-ES', 'en-US', 'es-419', 'a.es', 'a.en']

  for (const lang of languages) {
    try {
      const segments = await YoutubeTranscript.fetchTranscript(videoId, {
        lang,
      })
      if (segments && segments.length > 0) {
        return segments.map((s) => s.text).join(' ')
      }
    } catch {
      // try next language
    }
  }

  // Try without language preference as last attempt
  const segments = await YoutubeTranscript.fetchTranscript(videoId)
  if (!segments || segments.length === 0) throw new Error('No transcript found')
  return segments.map((s) => s.text).join(' ')
}
