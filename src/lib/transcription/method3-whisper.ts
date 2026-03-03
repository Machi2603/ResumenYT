import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { getOpenAIClient } from '../openai'

const execAsync = promisify(exec)

function writeCookiesFile(tmpDir: string): string | null {
  const cookies = process.env.YTDLP_COOKIES
  if (!cookies) return null
  const cookiesPath = path.join(tmpDir, 'cookies.txt')
  fs.writeFileSync(cookiesPath, cookies, 'utf-8')
  return cookiesPath
}

export async function getTranscriptMethod3(videoId: string): Promise<string> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ytdigest-whisper-'))
  const audioPath = path.join(tmpDir, 'audio.mp3')

  try {
    const cookiesPath = writeCookiesFile(tmpDir)
    const cookiesFlag = cookiesPath ? `--cookies "${cookiesPath}"` : ''

    // Download audio only
    await execAsync(
      `yt-dlp --js-runtimes node ${cookiesFlag} -x --audio-format mp3 --audio-quality 3 -o "${audioPath}" "https://www.youtube.com/watch?v=${videoId}"`,
      { timeout: 120000 }
    )

    if (!fs.existsSync(audioPath)) {
      throw new Error('Audio download failed')
    }

    const stats = fs.statSync(audioPath)
    // Whisper API limit: 25MB
    if (stats.size > 25 * 1024 * 1024) {
      throw new Error('Audio file too large for Whisper API (>25MB)')
    }

    const result = await getOpenAIClient().audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
      response_format: 'text',
    })

    return typeof result === 'string' ? result : (result as { text: string }).text
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    } catch {}
  }
}
