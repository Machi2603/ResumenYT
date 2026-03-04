'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function CtaFinal() {
  return (
    <section className="py-40 text-center bg-[#0a0a0e] relative overflow-hidden">
      {/* Dramatic red orb */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          bottom: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'rgba(255,45,45,0.07)',
          filter: 'blur(150px)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10"
      >
        <h2 className="font-display font-extrabold text-6xl md:text-8xl tracking-tighter text-white leading-none mb-6">
          Deja de
          <br />
          <em className="font-serif italic font-normal text-zinc-500">pausar.</em>
          <br />
          <span className="text-red-400">Lee más.</span>
        </h2>
        <p className="text-zinc-700 text-sm mb-12 font-sans">
          Sin tarjeta de crédito. Sin límites en el MVP.
        </p>
        <Link
          href="/login"
          className="relative group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-xl text-sm overflow-hidden hover:shadow-[0_0_40px_rgba(255,45,45,0.3)] transition-all duration-300 font-sans"
        >
          <span className="relative z-10">Crear cuenta gratis</span>
          <motion.span
            className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </Link>
      </motion.div>
    </section>
  )
}
