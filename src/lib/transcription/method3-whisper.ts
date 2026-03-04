import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import os from 'os'

const execAsync = promisify(exec)


async function getAudioDuration(audioPath: string): Promise<number> {
  const { stdout } = await execAsync(
    `ffprobe -v quiet -print_format json -show_format "${audioPath}"`,
    { timeout: 30000 }
  )
  const data = JSON.parse(stdout)
  return parseFloat(data.format.duration)
}

async function transcribeDirect(audioPath: string, model: string): Promise<string> {
  const scriptPath = path.join(process.cwd(), 'scripts', 'whisper_transcribe.py')
  const { stdout } = await execAsync(
    `python3 "${scriptPath}" --model ${model} "${audioPath}"`,
    { timeout: 300000 }
  )
  const results: string[] = JSON.parse(stdout.trim())
  return results.join(' ')
}

async function transcribeWithWorkers(
  chunkFiles: string[],
  model: string,
  concurrency: number
): Promise<string> {
  const scriptPath = path.join(process.cwd(), 'scripts', 'whisper_transcribe.py')

  // Distribute chunks across workers (interleaved so each worker gets varied chunks)
  const groups: string[][] = Array.from({ length: concurrency }, () => [])
  chunkFiles.forEach((f, i) => groups[i % concurrency].push(f))

  // Launch workers in parallel, each with its group of chunks
  const workerPromises = groups
    .filter(g => g.length > 0)
    .map(group => {
      const timeout = group.length * 300000
      const filesArg = group.map(f => `"${f}"`).join(' ')
      return execAsync(
        `python3 "${scriptPath}" --model ${model} ${filesArg}`,
        { timeout }
      )
    })

  const workerResults = await Promise.all(workerPromises)

  // Each worker returns an array of transcriptions (one per chunk in its group)
  // We need to reconstruct the original order
  // groups[i][j] = chunkFiles[j * concurrency + i]
  // So result from worker i, index j corresponds to chunk index: j * concurrency + i
  const orderedTexts: string[] = new Array(chunkFiles.length)
  workerResults.forEach((res, workerIdx) => {
    const texts: string[] = JSON.parse(res.stdout.trim())
    texts.forEach((text, localIdx) => {
      const originalIdx = localIdx * concurrency + workerIdx
      orderedTexts[originalIdx] = text
    })
  })

  return orderedTexts.filter(Boolean).join(' ')
}

export async function getTranscriptMethod3(videoId: string): Promise<string> {
  const whisperModel = process.env.WHISPER_MODEL || 'medium'
  const concurrency = parseInt(process.env.WHISPER_CONCURRENCY || '2', 10)

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ytdigest-whisper-'))
  const rawAudioPattern = path.join(tmpDir, 'audio_raw.%(ext)s')
  const audioPath = path.join(tmpDir, 'audio.mp3')

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`

    // Step 1: Download audio
    // Attempt 1: simple download
    let downloadOk = false
    try {
      await execAsync(
        `yt-dlp -x --audio-format mp3 -o "${rawAudioPattern}" "${url}"`,
        { timeout: 180000 }
      )
      downloadOk = fs.readdirSync(tmpDir).some(f => f.startsWith('audio_raw.'))
    } catch {}

    // Attempt 2: with browser user-agent (bot detection fallback)
    if (!downloadOk) {
      await execAsync(
        `yt-dlp --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" -x --audio-format mp3 -o "${rawAudioPattern}" "${url}"`,
        { timeout: 180000 }
      )
    }

    // Find the downloaded raw file
    const rawFile = fs.readdirSync(tmpDir).find(f => f.startsWith('audio_raw.'))
    if (!rawFile) throw new Error('Audio download failed — no raw file found')
    const rawAudioPath = path.join(tmpDir, rawFile)

    // Step 2: Convert to 16kHz mono 32kbps MP3 (Whisper's native sample rate)
    await execAsync(
      `ffmpeg -i "${rawAudioPath}" -ar 16000 -ac 1 -b:a 32k "${audioPath}" -y`,
      { timeout: 120000 }
    )

    if (!fs.existsSync(audioPath)) throw new Error('ffmpeg conversion failed')

    // Step 3: Get duration
    const duration = await getAudioDuration(audioPath)

    // Step 4: Short video — transcribe directly without chunking
    if (duration < 60) {
      return await transcribeDirect(audioPath, whisperModel)
    }

    // Step 5: Long video — split into 10-min chunks
    const chunksDir = path.join(tmpDir, 'chunks')
    fs.mkdirSync(chunksDir)
    const chunkPattern = path.join(chunksDir, 'chunk_%03d.mp3')

    await execAsync(
      `ffmpeg -i "${audioPath}" -f segment -segment_time 600 -c copy "${chunkPattern}" -y`,
      { timeout: 60000 }
    )

    const chunkFiles = fs
      .readdirSync(chunksDir)
      .filter(f => f.startsWith('chunk_') && f.endsWith('.mp3'))
      .sort()
      .map(f => path.join(chunksDir, f))

    if (chunkFiles.length === 0) throw new Error('No chunks produced by ffmpeg')

    console.log(`[Whisper] ${chunkFiles.length} chunks, ${concurrency} workers, model=${whisperModel}`)

    return await transcribeWithWorkers(chunkFiles, whisperModel, concurrency)
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    } catch {}
  }
}
