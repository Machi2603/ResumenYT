'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { Video } from '@/lib/supabase'

interface SidebarProps {
  videos: Video[]
  activeVideoId: string | null
  onSelectVideo: (video: Video) => void
  onNewSession: () => void
  userEmail: string
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({
  videos,
  activeVideoId,
  onSelectVideo,
  onNewSession,
  userEmail,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = userEmail?.slice(0, 2).toUpperCase() ?? 'YT'

  const sidebarContent = (
    <div className="w-60 bg-[#111116] flex flex-col h-full border-r border-white/[0.06]">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.04]">
        <div className="text-sm text-zinc-100 font-semibold font-sans flex items-center gap-1.5">
          <span className="text-red-500">●</span>
          YT Digest
        </div>
      </div>

      {/* New session button */}
      <div className="px-3 pt-3">
        <button
          onClick={onNewSession}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 border border-zinc-800 rounded-lg hover:bg-zinc-900 hover:text-zinc-200 transition-colors duration-150 font-sans"
        >
          <span className="text-zinc-600">+</span>
          Nueva sesión
        </button>
      </div>

      {/* Video history */}
      <div className="flex-1 overflow-y-auto px-3 pt-4 pb-2">
        {videos.length > 0 && (
          <>
            <p className="text-[10px] tracking-[0.15em] uppercase text-zinc-700 mb-2 px-1 font-sans">
              Recientes
            </p>
            <div className="space-y-0.5">
              {videos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => { onSelectVideo(v); onMobileClose() }}
                  className={`w-full text-left px-2.5 py-2 rounded-md text-sm truncate transition-colors duration-150 font-sans ${
                    v.id === activeVideoId
                      ? 'text-zinc-100 bg-zinc-800'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User footer */}
      <div className="border-t border-white/[0.06] px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-400 font-semibold flex-shrink-0 font-sans">
            {initials}
          </div>
          <span className="text-xs text-zinc-500 truncate flex-1 font-sans">{userEmail}</span>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-[10px] text-zinc-700 hover:text-zinc-400 transition-colors font-sans"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full">{sidebarContent}</div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 flex"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
