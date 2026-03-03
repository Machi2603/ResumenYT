'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

function StepText({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div>
      <span className="text-xs text-zinc-700 font-mono tracking-widest">{number}</span>
      <h3 className="text-xl md:text-2xl font-semibold text-white mt-2 mb-3 leading-tight font-sans">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed font-sans">{description}</p>
    </div>
  )
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-950/50">
      <div className="text-3xl md:text-4xl font-bold text-white tracking-tight font-sans">
        {value}
      </div>
      <div className="text-xs text-zinc-600 mt-2 font-sans">{label}</div>
    </div>
  )
}

function MockUIStep({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const step1 = useTransform(scrollProgress, [0, 0.25, 0.33], [1, 1, 0])
  const step2 = useTransform(scrollProgress, [0.33, 0.45, 0.60, 0.66], [0, 1, 1, 0])
  const step3 = useTransform(scrollProgress, [0.66, 0.78, 1], [0, 1, 1])

  return (
    <div className="relative w-full h-full">
      {/* Step 1: URL input */}
      <motion.div style={{ opacity: step1 }} className="absolute inset-0 p-4 flex flex-col gap-3">
        <div className="text-xs text-zinc-700 font-sans mb-2">Pegando enlace…</div>
        <div className="bg-[#1c1c22] rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-400 font-mono">
          https://youtube.com/watch?v=dQw4w9WgXcQ
        </div>
        <div className="flex gap-1.5 mt-1">
          {['5 min', '10 min', '15 min', '∞'].map((t) => (
            <span
              key={t}
              className={`text-[10px] px-2 py-1 rounded border font-sans ${t === '5 min' ? 'border-zinc-500 bg-zinc-800 text-zinc-100' : 'border-zinc-800 text-zinc-700'}`}
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Step 2: Processing */}
      <motion.div style={{ opacity: step2 }} className="absolute inset-0 p-4 flex flex-col justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-zinc-600"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-600 font-sans">Extrayendo subtítulos con yt-dlp…</span>
        </div>
        <div className="space-y-1.5">
          {['youtube-transcript ✓', 'yt-dlp ✓', 'Generando resumen…'].map((s, i) => (
            <div key={s} className={`text-xs font-mono ${i < 2 ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {s}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step 3: Chat */}
      <motion.div style={{ opacity: step3 }} className="absolute inset-0 p-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="text-red-500 text-xs mt-0.5">●</span>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            <span className="text-zinc-200 font-medium">Resumen listo.</span> El vídeo cubre los conceptos clave de productividad y gestión del tiempo…
          </p>
        </div>
        <div className="flex justify-end mt-1">
          <div className="bg-[#2a2a32] text-xs text-zinc-300 px-3 py-2 rounded-xl rounded-br-sm font-sans max-w-[80%]">
            Dame los 3 puntos principales
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-red-500 text-xs mt-0.5">●</span>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            1. Sistemas sobre metas<br />
            2. Deep work en bloques<br />
            3. Revisión semanal obligatoria
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const step1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.28, 0.33], [0, 1, 1, 0])
  const step1Y = useTransform(scrollYProgress, [0, 0.15], [40, 0])

  const step2Opacity = useTransform(scrollYProgress, [0.33, 0.45, 0.60, 0.66], [0, 1, 1, 0])
  const step2Y = useTransform(scrollYProgress, [0.33, 0.45], [40, 0])

  const step3Opacity = useTransform(scrollYProgress, [0.66, 0.78, 1], [0, 1, 1])
  const step3Y = useTransform(scrollYProgress, [0.66, 0.78], [40, 0])

  const uiScale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1])
  const uiOpacity = useTransform(scrollYProgress, [0, 0.2], [0.4, 1])
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="how" ref={containerRef} style={{ height: '300vh' }} className="relative">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0e]">
        <p className="absolute top-12 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] uppercase text-zinc-700 font-sans">
          Así funciona
        </p>

        {/* Progress bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-px bg-zinc-900">
          <motion.div style={{ width: progressWidth }} className="h-full bg-zinc-600" />
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-center w-full max-w-6xl px-8">
          {/* Left: step texts */}
          <div className="relative h-40 hidden md:block">
            <motion.div style={{ opacity: step1Opacity, y: step1Y }} className="absolute inset-0">
              <StepText
                number="01"
                title="Pega cualquier enlace"
                description="YouTube, Shorts, vídeos largos. Con o sin subtítulos manuales."
              />
            </motion.div>
            <motion.div style={{ opacity: step2Opacity, y: step2Y }} className="absolute inset-0">
              <StepText
                number="02"
                title="La IA lo transcribe"
                description="Sistema de 3 capas: subtítulos nativos, yt-dlp, o Whisper como último recurso."
              />
            </motion.div>
            <motion.div style={{ opacity: step3Opacity, y: step3Y }} className="absolute inset-0">
              <StepText
                number="03"
                title="Chatea con el contenido"
                description="Pregunta lo que quieras. Exporta el guion a Google Docs con un clic."
              />
            </motion.div>
          </div>

          {/* Center: mock UI */}
          <motion.div
            style={{ scale: uiScale, opacity: uiOpacity }}
            className="rounded-2xl border border-zinc-800 overflow-hidden bg-[#16161a] aspect-[9/14] max-h-[480px] relative"
          >
            <MockUIStep scrollProgress={scrollYProgress} />
          </motion.div>

          {/* Right: metrics */}
          <div className="relative h-40 hidden md:block">
            <motion.div style={{ opacity: step1Opacity }} className="absolute inset-0">
              <MetricCard value="< 5s" label="para detectar el vídeo" />
            </motion.div>
            <motion.div style={{ opacity: step2Opacity }} className="absolute inset-0">
              <MetricCard value="3 métodos" label="de transcripción en cascada" />
            </motion.div>
            <motion.div style={{ opacity: step3Opacity }} className="absolute inset-0">
              <MetricCard value="GPT-4o" label="como motor de chat y resumen" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
