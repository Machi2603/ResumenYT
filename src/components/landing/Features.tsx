'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4" cy="4" r="2" fill="currentColor" opacity="0.7"/>
        <circle cx="18" cy="4" r="2" fill="currentColor" opacity="0.7"/>
        <circle cx="11" cy="11" r="2.5" fill="currentColor"/>
        <circle cx="4" cy="18" r="2" fill="currentColor" opacity="0.7"/>
        <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.7"/>
        <line x1="4" y1="4" x2="11" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <line x1="18" y1="4" x2="11" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <line x1="4" y1="18" x2="11" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <line x1="18" y1="18" x2="11" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      </svg>
    ),
    title: 'Fallback inteligente',
    description:
      'Si los subtítulos nativos fallan, yt-dlp lo intenta. Si yt-dlp falla, Whisper transcribe el audio directamente.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 4C3 2.9 3.9 2 5 2H17C18.1 2 19 2.9 19 4V14C19 15.1 18.1 16 17 16H13L11 20L9 16H5C3.9 16 3 15.1 3 14V4Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.9"/>
        <line x1="7" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
        <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
      </svg>
    ),
    title: 'Chat contextual',
    description:
      'Toda la transcripción está en el contexto. Pregunta por timestamps, conceptos específicos o pide un resumen ejecutivo.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="12" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.9"/>
        <line x1="7" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
        <line x1="7" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
        <line x1="7" y1="14" x2="9" y2="14" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
        <path d="M15 13L20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M17 8H20V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Google Docs en un clic',
    description:
      'El guion completo llega a tu Drive con el nombre del vídeo automáticamente, vía n8n.',
  },
]

export function Features() {
  return (
    <section className="py-32 px-8 bg-[#0d0d11]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-xs tracking-[0.2em] uppercase text-zinc-700 mb-4 font-sans">
          Características
        </p>
        <h2 className="font-display text-4xl font-bold text-white">
          Todo lo que necesitas,
          <em className="font-serif italic font-normal text-zinc-500"> nada más.</em>
        </h2>
      </motion.div>

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
            className="p-px rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-red-900/20 transition-all duration-500 group"
          >
            <div className="bg-zinc-950 rounded-2xl p-6 h-full">
              <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300 mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2 font-sans">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-sans">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
