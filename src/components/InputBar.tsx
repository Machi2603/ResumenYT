'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InputBarProps {
  onSubmit: (value: string, readingTime: number) => void
  disabled: boolean
  hasVideo: boolean
  onExportDocs: () => void
  exportingDocs: boolean
  googleDocUrl: string | null
}

const READING_TIMES = [
  { label: '5m', value: 5 },
  { label: '10m', value: 10 },
  { label: '15m', value: 15 },
  { label: '∞', value: 0 },
]

export function InputBar({
  onSubmit,
  disabled,
  hasVideo,
  onExportDocs,
  exportingDocs,
  googleDocUrl,
}: InputBarProps) {
  const [value, setValue] = useState('')
  const [readingTime, setReadingTime] = useState(5)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 144)}px`
    }
  }, [value])

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed, readingTime)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-zinc-900 bg-[#16161a]/95 backdrop-blur-xl px-4 py-3">
      {/* Top row: reading time pills + export */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-700 mr-1 font-sans hidden sm:block">Resumen:</span>
          {READING_TIMES.map((t) => (
            <button
              key={t.value}
              onClick={() => setReadingTime(t.value)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors duration-150 font-sans ${
                readingTime === t.value
                  ? 'border-zinc-500 bg-zinc-800 text-zinc-100'
                  : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {hasVideo && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2"
              >
                {googleDocUrl && (
                  <a
                    href={googleDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-500 border border-zinc-800 rounded-lg px-3 py-1.5 hover:border-zinc-600 hover:text-zinc-300 transition-colors font-sans"
                  >
                    Abrir Doc ↗
                  </a>
                )}
                <button
                  onClick={onExportDocs}
                  disabled={exportingDocs}
                  className="text-xs text-zinc-500 border border-zinc-800 rounded-lg px-3 py-1.5 hover:border-zinc-600 hover:text-zinc-300 disabled:opacity-40 transition-colors font-sans"
                >
                  {exportingDocs ? 'Exportando…' : 'Exportar ↗'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Textarea + send button */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder="Pega un enlace de YouTube o escribe una pregunta…"
          className="flex-1 bg-[#1c1c22] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 resize-none transition-colors duration-200 font-sans leading-relaxed disabled:opacity-50"
          style={{ maxHeight: '144px' }}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 bg-zinc-100 text-zinc-900 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors duration-150 font-sans"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
