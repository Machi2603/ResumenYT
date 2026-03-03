'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [securityWord, setSecurityWord] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, securityWord }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Error al registrar')
        setMode('login')
        setError('')
        return
      }

      // Login flow — verify security word first
      const verifyRes = await fetch('/api/auth/verify-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, securityWord }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || !verifyData.valid) {
        throw new Error('Credenciales incorrectas')
      }

      // Sign in with Supabase
      const supabase = createSupabaseBrowserClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw new Error('Credenciales incorrectas')

      router.push('/chat')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0e] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(239,68,68,0.06) 0%, transparent 70%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="text-white font-semibold tracking-tight text-sm font-sans inline-flex items-center gap-1.5">
            <span className="text-red-500">●</span> YT Digest
          </Link>
          <p className="text-zinc-600 text-xs mt-3 font-sans">
            {mode === 'login' ? 'Accede a tu cuenta' : 'Crea una cuenta nueva'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-sans">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1c1c22] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors font-sans"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-sans">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1c1c22] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors font-sans"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-sans">
              Palabra de seguridad
            </label>
            <input
              type="password"
              value={securityWord}
              onChange={(e) => setSecurityWord(e.target.value)}
              required
              className="w-full bg-[#1c1c22] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors font-sans"
              placeholder="Palabra clave adicional"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-sans pt-1"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors duration-200 font-sans"
          >
            {loading ? 'Procesando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-700 mt-6 font-sans">
          {mode === 'login' ? '¿Nuevo aquí?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
