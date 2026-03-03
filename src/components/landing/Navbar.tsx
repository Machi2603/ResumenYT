'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

export function Navbar() {
  const { scrollY } = useScroll()
  const navBg = useTransform(
    scrollY,
    [0, 80],
    ['rgba(0,0,0,0)', 'rgba(10,10,14,0.88)']
  )
  const navBorder = useTransform(
    scrollY,
    [0, 80],
    ['rgba(255,255,255,0)', 'rgba(255,255,255,0.07)']
  )

  return (
    <motion.nav
      style={{ backgroundColor: navBg, borderBottomColor: navBorder }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-8 py-4 flex justify-between items-center"
    >
      <span className="text-white font-semibold tracking-tight text-sm font-sans">
        <span className="text-red-500 mr-1.5">●</span>YT Digest
      </span>
      <Link
        href="/login"
        className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 px-4 py-1.5 border border-zinc-800 hover:border-zinc-600 rounded-lg font-sans"
      >
        Iniciar sesión
      </Link>
    </motion.nav>
  )
}
