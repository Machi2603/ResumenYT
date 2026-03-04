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
  const mockRotateX = useTransform(scrollY, [0, 400], [12, 0])
  const mockScale = useTransform(scrollY, [0, 400], [0.95, 1])
  const mockOpacity = useTransform(scrollY, [0, 300], [1, 1])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden bg-[#080810]">
      {/* Grid lines background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Aurora orb 1 — red top-left */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          top: '-20%',
          left: '-10%',
          width: '700px',
          height: '700px',
          background: 'rgba(255,45,45,0.07)',
          filter: 'blur(120px)',
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Aurora orb 2 — indigo bottom-right */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          bottom: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'rgba(99,102,241,0.05)',
          filter: 'blur(120px)',
        }}
        animate={{ x: [0, -25, 20, 0], y: [0, 25, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
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

        {/* Title — editorial mix */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-extrabold text-7xl md:text-9xl leading-none tracking-tighter mb-6"
        >
          <span className="text-white">Cualquier</span>
          <br />
          <em className="font-serif italic text-zinc-500 font-normal">vídeo.</em>
          <br />
          <span className="text-white">En minutos.</span>
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
            className="relative group inline-flex items-center px-7 py-3 bg-white text-black text-sm font-semibold rounded-xl overflow-hidden hover:shadow-[0_0_40px_rgba(255,45,45,0.25)] transition-all duration-300 font-sans"
          >
            <span className="relative z-10">Empezar gratis</span>
            <span className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        className="relative z-10 mt-20 mx-auto w-full max-w-4xl rounded-2xl overflow-hidden border border-zinc-800/60 shadow-2xl shadow-black/50"
      >
        <MockChatUI />
      </motion.div>
    </section>
  )
}

function MockChatUI() {
  return (
    <div
      className="flex h-[400px] md:h-[480px]"
      style={{ background: 'linear-gradient(135deg, #111116, #13131a)' }}
    >
      {/* Sidebar */}
      <div
        className="w-52 border-r border-zinc-800 p-4 hidden md:flex flex-col gap-3"
        style={{
          background: '#0e0e14',
          boxShadow: '1px 0 0 0 rgba(255,255,255,0.03)',
        }}
      >
        <div className="text-xs text-zinc-100 font-semibold font-sans mb-2">
          <span className="text-red-500 mr-1.5">●</span>YT Digest
        </div>
        <div className="h-7 bg-zinc-900 rounded-md border border-zinc-800/60 w-full" />
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
            <div className="bg-[#2a2a32] border border-red-500/10 text-xs text-zinc-300 px-3.5 py-2.5 rounded-2xl rounded-br-md max-w-xs font-sans">
              ¿Cuál es el punto más importante?
            </div>
          </div>
          {/* AI response */}
          <div className="flex gap-3">
            <span className="text-red-500 text-xs mt-0.5 flex-shrink-0">●</span>
            <div className="text-xs text-zinc-300 leading-relaxed font-sans">
              El autor argumenta que la clave está en aprender a <span className="text-zinc-100 font-medium">delegar tareas cognitivas</span> a la IA manteniendo el juicio crítico propio...
            </div>
          </div>
        </div>
        {/* Input */}
        <div className="border-t border-zinc-800/60 p-4">
          <div className="bg-[#1c1c22] rounded-xl border border-zinc-800 ring-1 ring-white/5 px-4 py-2.5 text-xs text-zinc-600 font-sans">
            Pega un enlace de YouTube o escribe…
          </div>
        </div>
      </div>
    </div>
  )
}
