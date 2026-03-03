'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div
          className="bg-[#2a2a32] text-zinc-200 text-sm px-4 py-3 max-w-[75%] font-sans leading-relaxed"
          style={{ borderRadius: '16px 16px 4px 16px' }}
        >
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 group">
      <div className="text-red-500 text-xs mt-1 flex-shrink-0 select-none">●</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-300 leading-relaxed markdown-content relative">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          <CopyBlockButtons content={content} />
        </div>
      </div>
    </div>
  )
}

function CopyBlockButtons({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="mt-2 text-[10px] text-zinc-700 hover:text-zinc-400 transition-colors font-sans"
    >
      {copied ? 'Copiado ✓' : 'Copiar'}
    </button>
  )
}

export function LoadingBubble({ text }: { text: string }) {
  return (
    <div className="flex gap-3">
      <div className="text-red-500 text-xs mt-1 flex-shrink-0">●</div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <Dot key={i} delay={i * 0.2} />
          ))}
        </div>
        <span className="text-xs text-zinc-600 font-sans">{text}</span>
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: number }) {
  return (
    <div
      className="w-1.5 h-1.5 rounded-full bg-zinc-600"
      style={{
        animation: `dotPulse 1.2s ease-in-out ${delay}s infinite`,
      }}
    />
  )
}
