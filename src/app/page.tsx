import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { ScrollSequence } from '@/components/landing/ScrollSequence'
import { Features } from '@/components/landing/Features'
import { CtaFinal } from '@/components/landing/CtaFinal'
import { LenisProvider } from '@/components/LenisProvider'

export default function LandingPage() {
  return (
    <LenisProvider>
      <main className="bg-[#0a0a0e] text-white">
        <Navbar />
        <Hero />
        <ScrollSequence />
        <Features />
        <CtaFinal />
      </main>
    </LenisProvider>
  )
}
