'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function Hero() {
  const { scrollY } = useScroll()
  const mockRotateX = useTransform(scrollY, [0, 400], [8, 0])
  const mockScale = useTransform(scrollY, [0, 400], [0.95, 1])
  const mockOpacity = useTransform(scrollY, [0, 200], [0.7, 1])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Background halo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(239,68,68,0.07) 0%, transparent 70%)',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="text-xs tracking-[0.2em] uppercase text-zinc-600 mb-10 font-sans"
        >
          Productividad · YouTube · IA
        </motion.p>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl leading-none tracking-tight text-white mb-6"
        >
          <span className="font-serif italic text-zinc-200">Cualquier vídeo.</span>
          <br />
          <span className="font-sans font-bold">En minutos.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-lg mb-12 font-sans"
        >
          Pega un enlace. Obtén la transcripción, el resumen y un chat con el contenido.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-7 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 transition-colors duration-200 font-sans"
          >
            Empezar gratis
          </Link>
          <a
            href="#how"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200 font-sans flex items-center gap-1.5"
          >
            Ver demo <span className="text-xs">↓</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Mock UI */}
      <motion.div
        style={{
          rotateX: mockRotateX,
          scale: mockScale,
          opacity: mockOpacity,
          transformPerspective: 1200,
        }}
        className="relative z-10 mt-20 mx-auto w-full max-w-4xl rounded-2xl overflow-hidden border border-zinc-800/60 shadow-2xl"
      >
        <MockChatUI />
      </motion.div>
    </section>
  )
}

function MockChatUI() {
  return (
    <div className="bg-[#16161a] flex h-[400px] md:h-[480px]">
      {/* Sidebar */}
      <div className="w-52 bg-[#111116] border-r border-zinc-800/60 p-4 hidden md:flex flex-col gap-3">
        <div className="text-xs text-zinc-100 font-semibold font-sans mb-2">
          <span className="text-red-500 mr-1.5">●</span>YT Digest
        </div>
        <div className="h-7 bg-zinc-900 rounded-md border border-zinc-800 w-full" />
        <div className="text-xs text-zinc-700 uppercase tracking-widest mt-2 mb-1 font-sans">Recientes</div>
        {['Cómo aprender IA en 2024', 'Productividad con Notion', 'Design Systems'].map((t) => (
          <div key={t} className="text-xs text-zinc-500 truncate py-1.5 px-2 rounded-md hover:bg-zinc-900 font-sans">
            {t}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-4 overflow-hidden">
          {/* AI message */}
          <div className="flex gap-3">
            <span className="text-red-500 text-xs mt-0.5 flex-shrink-0">●</span>
            <div className="text-xs text-zinc-400 leading-relaxed font-sans max-w-lg">
              <p className="font-medium text-zinc-200 mb-1">Resumen · 5 min lectura</p>
              <p>El vídeo explora cómo los modelos de lenguaje están transformando la productividad personal. Los puntos clave incluyen automatización de tareas repetitivas, síntesis de información compleja y nuevos flujos de trabajo...</p>
            </div>
          </div>
          {/* User message */}
          <div className="flex justify-end">
            <div className="bg-[#2a2a32] text-xs text-zinc-300 px-3.5 py-2.5 rounded-2xl rounded-br-md max-w-xs font-sans">
              ¿Cuál es el punto más importante?
            </div>
          </div>
          {/* AI response */}
          <div className="flex gap-3">
            <span className="text-red-500 text-xs mt-0.5 flex-shrink-0">●</span>
            <div className="text-xs text-zinc-400 leading-relaxed font-sans">
              El autor argumenta que la clave está en aprender a <span className="text-zinc-200 font-medium">delegar tareas cognitivas</span> a la IA manteniendo el juicio crítico propio...
            </div>
          </div>
        </div>
        {/* Input */}
        <div className="border-t border-zinc-800/60 p-4">
          <div className="bg-[#1c1c22] rounded-xl border border-zinc-800 px-4 py-2.5 text-xs text-zinc-700 font-sans">
            Pega un enlace de YouTube o escribe…
          </div>
        </div>
      </div>
    </div>
  )
}
