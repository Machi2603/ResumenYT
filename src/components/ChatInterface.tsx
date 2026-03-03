'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { MessageBubble, LoadingBubble } from './MessageBubble'
import { InputBar } from './InputBar'
import type { Video } from '@/lib/supabase'

interface ChatInterfaceProps {
  userId: string
  userEmail: string
  initialVideos: Video[]
}

type UiMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const LOADING_TEXTS = [
  'Obteniendo subtítulos…',
  'Procesando transcripción…',
  'Generando resumen…',
  'Casi listo…',
]

export function ChatInterface({ userId, userEmail, initialVideos }: ChatInterfaceProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [exportingDocs, setExportingDocs] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const loadingTextInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function startLoadingTextCycle() {
    let idx = 0
    setLoadingText(LOADING_TEXTS[0])
    loadingTextInterval.current = setInterval(() => {
      idx = (idx + 1) % LOADING_TEXTS.length
      setLoadingText(LOADING_TEXTS[idx])
    }, 4000)
  }

  function stopLoadingTextCycle() {
    if (loadingTextInterval.current) {
      clearInterval(loadingTextInterval.current)
      loadingTextInterval.current = null
    }
  }

  function handleNewSession() {
    setActiveVideo(null)
    setMessages([])
  }

  function handleSelectVideo(video: Video) {
    setActiveVideo(video)
    // Show summary as first assistant message
    setMessages([
      {
        id: 'summary-' + video.id,
        role: 'assistant',
        content: `**${video.title}**\n\n${video.summary}`,
      },
    ])
  }

  async function handleSubmit(value: string, readingTime: number) {
    const isUrl =
      value.includes('youtube.com') ||
      value.includes('youtu.be')

    if (isUrl) {
      await processVideo(value, readingTime)
    } else {
      await sendChatMessage(value)
    }
  }

  async function processVideo(url: string, readingTime: number) {
    setLoading(true)
    startLoadingTextCycle()

    const userMsg: UiMessage = { id: Date.now().toString(), role: 'user', content: url }
    setMessages((prev) => [...prev, userMsg])

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, readingTime, userId }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Error procesando vídeo')

      const video: Video = data.video
      setVideos((prev) => [video, ...prev.filter((v) => v.id !== video.id)])
      setActiveVideo(video)

      const summaryMsg: UiMessage = {
        id: 'summary-' + video.id,
        role: 'assistant',
        content: `**${video.title}**\n\n${video.summary}`,
      }
      setMessages((prev) => [...prev, summaryMsg])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: `Error: ${message}` },
      ])
    } finally {
      setLoading(false)
      stopLoadingTextCycle()
    }
  }

  async function sendChatMessage(content: string) {
    if (!activeVideo) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Primero pega un enlace de YouTube para cargar un vídeo.',
        },
      ])
      return
    }

    const userMsg: UiMessage = { id: Date.now().toString(), role: 'user', content }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setLoadingText('Pensando…')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: activeVideo.id, message: content, userId }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error en el chat')

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: data.reply },
      ])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: `Error: ${message}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  async function handleExportDocs() {
    if (!activeVideo) return
    setExportingDocs(true)

    try {
      const res = await fetch('/api/send-to-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: activeVideo.id, userId }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Error exportando')

      if (data.googleDocUrl) {
        setActiveVideo((prev) => prev ? { ...prev, google_doc_url: data.googleDocUrl } : prev)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Google Doc creado: [${activeVideo.title} - guion](${data.googleDocUrl})`,
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'El documento fue enviado a n8n correctamente.',
          },
        ])
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: `Error: ${message}` },
      ])
    } finally {
      setExportingDocs(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#16161a] overflow-hidden">
      <Sidebar
        videos={videos}
        activeVideoId={activeVideo?.id ?? null}
        onSelectVideo={handleSelectVideo}
        onNewSession={handleNewSession}
        userEmail={userEmail}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-900">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            ☰
          </button>
          <span className="text-sm text-zinc-400 truncate font-sans">
            {activeVideo?.title ?? 'YT Digest'}
          </span>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col items-center justify-center h-full gap-3"
            >
              <span className="text-zinc-300 text-xl font-semibold tracking-tight font-sans">
                YT Digest
              </span>
              <span className="text-zinc-700 text-sm font-sans text-center">
                Pega un enlace de YouTube para empezar.
              </span>
            </motion.div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <MessageBubble role={msg.role} content={msg.content} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoadingBubble text={loadingText} />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <InputBar
          onSubmit={handleSubmit}
          disabled={loading}
          hasVideo={!!activeVideo}
          onExportDocs={handleExportDocs}
          exportingDocs={exportingDocs}
          googleDocUrl={activeVideo?.google_doc_url ?? null}
        />
      </div>
    </div>
  )
}
