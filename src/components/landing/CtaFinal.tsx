'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function CtaFinal() {
  return (
    <section className="py-40 text-center bg-[#0a0a0e] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 110%, rgba(239,68,68,0.05) 0%, transparent 70%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none mb-6">
          <span className="font-sans">Deja de pausar.</span>
          <br />
          <span className="font-serif italic text-zinc-400">Empieza a leer.</span>
        </h2>
        <p className="text-zinc-700 text-sm mb-12 font-sans">
          Sin tarjeta de crédito. Sin límites en el MVP.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 transition-colors duration-200 font-sans"
        >
          Crear cuenta gratis
        </Link>
      </motion.div>
    </section>
  )
}
