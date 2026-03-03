import { execSync } from 'child_process'

export function checkDependencies() {
  const deps = ['yt-dlp', 'ffmpeg']
  deps.forEach((dep) => {
    try {
      execSync(`which ${dep}`, { stdio: 'ignore' })
      console.log(`[OK] ${dep} disponible`)
    } catch {
      console.warn(`[WARN] ${dep} no encontrado. Algunas funciones no estarán disponibles.`)
    }
  })
}
