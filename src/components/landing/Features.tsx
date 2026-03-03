'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: '⌘',
    title: 'Fallback inteligente',
    description:
      'Si los subtítulos nativos fallan, yt-dlp lo intenta. Si yt-dlp falla, Whisper transcribe el audio directamente.',
  },
  {
    icon: '◎',
    title: 'Chat contextual',
    description:
      'Toda la transcripción está en el contexto. Pregunta por timestamps, conceptos específicos o pide un resumen ejecutivo.',
  },
  {
    icon: '↗',
    title: 'Google Docs en un clic',
    description:
      'El guion completo llega a tu Drive con el nombre del vídeo automáticamente, vía n8n.',
  },
]

export function Features() {
  return (
    <section className="py-32 px-8 bg-[#0d0d11]">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center text-xs tracking-[0.2em] uppercase text-zinc-700 mb-16 font-sans"
      >
        Características
      </motion.p>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-colors duration-300 group"
          >
            <div className="text-2xl mb-4 text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300">
              {f.icon}
            </div>
            <h3 className="text-base font-semibold text-white mb-2 font-sans">{f.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-sans">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
