import type { Metadata } from 'next'
import { Instrument_Serif, Syne, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
})

const syne = Syne({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-sans',
})

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'YT Digest — Resume cualquier vídeo de YouTube',
  description:
    'Pega un enlace de YouTube. Obtén transcripción, resumen y chat con el contenido.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${instrumentSerif.variable} ${syne.variable} ${bricolageGrotesque.variable}`}>
      <body className="grain antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
