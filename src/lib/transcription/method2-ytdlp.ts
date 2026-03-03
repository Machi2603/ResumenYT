import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import os from 'os'

const execAsync = promisify(exec)

function writeCookiesFile(tmpDir: string): string | null {
  const b64 = process.env.YTDLP_COOKIES_B64
  if (!b64) return null
  const cookiesPath = path.join(tmpDir, 'cookies.txt')
  fs.writeFileSync(cookiesPath, Buffer.from(b64, 'base64').toString('utf-8'))
  return cookiesPath
}

export async function getTranscriptMethod2(videoId: string): Promise<string> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ytdigest-'))
  const outputBase = path.join(tmpDir, 'sub')

  try {
    const cookiesPath = writeCookiesFile(tmpDir)
    const cookiesFlag = cookiesPath ? `--cookies "${cookiesPath}"` : ''

    // Download auto-generated subtitles in all available languages
    await execAsync(
      `yt-dlp --extractor-args "youtube:player_client=android" ${cookiesFlag} --write-auto-subs --skip-download --sub-langs "es,en,es-ES,en-US,es-419" --convert-subs vtt -o "${outputBase}" "https://www.youtube.com/watch?v=${videoId}"`,
      { timeout: 60000 }
    )

    // Find downloaded subtitle file
    const files = fs.readdirSync(tmpDir)
    const vttFile = files.find((f) => f.endsWith('.vtt'))
    if (!vttFile) throw new Error('No subtitle file found')

    const vttContent = fs.readFileSync(path.join(tmpDir, vttFile), 'utf-8')
    return parseVttToText(vttContent)
  } finally {
    // Cleanup temp dir
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    } catch {}
  }
}

function parseVttToText(vtt: string): string {
  return vtt
    .split('\n')
    .filter((line) => {
      // Remove VTT headers, timestamps, and empty lines
      if (!line.trim()) return false
      if (line.startsWith('WEBVTT')) return false
      if (line.startsWith('NOTE')) return false
      if (/^\d{2}:\d{2}/.test(line)) return false
      if (/^\d+$/.test(line.trim())) return false
      return true
    })
    .join(' ')
    .replace(/<[^>]*>/g, '') // Remove HTML tags from VTT
    .replace(/\s+/g, ' ')
    .trim()
}
