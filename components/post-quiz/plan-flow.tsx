'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BetaiLogo } from '@/components/betai-logo'
import { BottomSheet } from '@/components/post-quiz/bottom-sheet'
import { PlanLoading } from '@/components/post-quiz/plan-loading'
import { FeaturesIntro } from '@/components/post-quiz/features-intro'
import { FeatureDetail } from '@/components/post-quiz/feature-detail'
import { InlineLoader } from '@/components/post-quiz/inline-loader'
import { DiagnosisScreen } from '@/components/post-quiz/diagnosis-screen'
import { ProblemScreen } from '@/components/post-quiz/problem-screen'
import { OfferScratchScreen } from '@/components/post-quiz/offer-scratch-screen'
import { computeProfile, type QuizAnswers } from '@/lib/betai/profile'
import {
  TIP_PRONTA_VIMEO_ID,
  CONTROL_BANCA_VIMEO_ID,
} from '@/lib/betai/config'

// Fase principal de la pantalla completa (detrás del pullup).
type Phase = 'loading' | 'diagnosis' | 'problem' | 'offer'

// Sub-estado del contenido del pullup (bottom sheet).
type SheetStep =
  | null
  | 'intro'
  | 'connecting'
  | 'feature1'
  | 'calculating'
  | 'feature2'

export function PlanFlow() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [sheetStep, setSheetStep] = useState<SheetStep>(null)
  const [secondBarActive, setSecondBarActive] = useState(false)

  // Lee las respuestas persistidas del quiz (sessionStorage) una sola vez.
  const [answers, setAnswers] = useState<QuizAnswers>({})
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('betai:answers')
      if (raw) setAnswers(JSON.parse(raw))
    } catch {
      // Sin respuestas: el perfil usará valores por defecto coherentes.
    }
  }, [])

  // Perfil determinista calculado a partir de las respuestas.
  const profile = useMemo(() => computeProfile(answers), [answers])

  // ── Transiciones del flujo ──────────────────────────────────────────

  // 1) La primera barra terminó → abre el pullup con la intro.
  const handleFirstComplete = useCallback(() => {
    setSheetStep('intro')
  }, [])

  // 2) "Puedes mostrarme" → carga "Conectando fuentes" → funcionalidad 01.
  const handleShowFeatures = useCallback(() => setSheetStep('connecting'), [])

  // 3) La segunda barra terminó → pasa al diagnóstico.
  const handleSecondComplete = useCallback(() => setPhase('diagnosis'), [])

  // 4) "Volver al análisis" (fin de la func. 02): cierra el pullup y
  //    activa la segunda barra de la pantalla de carga.
  const handleBackToAnalysis = useCallback(() => {
    setSheetStep(null)
    setSecondBarActive(true)
  }, [])

  // 5) CTA final: navega a la oferta con el descuento revelado.
  const handleSeeOffer = useCallback(
    (discount: number) => {
      router.push(`/oferta?d=${discount}`)
    },
    [router],
  )

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Fondo premium coherente con el quiz */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 70% at 50% -10%, oklch(0.24 0.03 158 / 0.6) 0%, transparent 55%), linear-gradient(180deg, oklch(0.17 0.016 162) 0%, oklch(0.14 0.013 162) 100%)',
          }}
        />
        <div className="animate-betai-ambient absolute -top-44 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute -bottom-24 right-[-60px] h-[300px] w-[300px] rounded-full bg-[var(--color-gold)]/[0.045] blur-[130px]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(100% 55% at 50% 120%, oklch(0 0 0 / 0.35) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Encabezado con logo */}
      <header className="relative z-10 mx-auto flex w-full max-w-xl px-6 pt-8">
        <Link href="/" aria-label="Volver al inicio de BetAI">
          <BetaiLogo />
        </Link>
      </header>

      {/* Contenido de pantalla completa según la fase */}
      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col">
        {phase === 'loading' && (
          <PlanLoading
            onFirstComplete={handleFirstComplete}
            secondActive={secondBarActive}
            onSecondComplete={handleSecondComplete}
          />
        )}

        {phase === 'diagnosis' && (
          <DiagnosisScreen
            profile={profile}
            onContinue={() => setPhase('problem')}
          />
        )}

        {phase === 'problem' && (
          <ProblemScreen onContinue={() => setPhase('offer')} />
        )}

        {phase === 'offer' && <OfferScratchScreen onSeeOffer={handleSeeOffer} />}
      </main>

      {/* Pullup / bottom sheet con el recorrido de funcionalidades */}
      <BottomSheet
        open={sheetStep !== null}
        onClose={() => setSheetStep(null)}
        // Durante las cargas intermedias no se puede cerrar (parece un proceso real).
        dismissible={sheetStep === 'intro' || sheetStep === 'feature1' || sheetStep === 'feature2'}
        label="Funcionalidades de BetAI"
      >
        {sheetStep === 'intro' && <FeaturesIntro onShow={handleShowFeatures} />}

        {sheetStep === 'connecting' && (
          <InlineLoader
            text="Conectando +12 fuentes deportivas..."
            duration={1800}
            onDone={() => setSheetStep('feature1')}
          />
        )}

        {sheetStep === 'feature1' && (
          <FeatureDetail
            eyebrow="Funcionalidad 01 / 02"
            title="Tip Pronta"
            paragraphs={[
              'La IA analiza toda la jornada, cruza más de 100 fuentes de estadísticas y encuentra las mejores oportunidades disponibles.',
              'Tú solo revisas la entrada y decides si quieres confirmarla.',
            ]}
            vimeoId={TIP_PRONTA_VIMEO_ID}
            ctaLabel="Ver segunda funcionalidad"
            onCta={() => setSheetStep('calculating')}
          />
        )}

        {sheetStep === 'calculating' && (
          <InlineLoader
            text="Calculando tu precisión personalizada..."
            duration={1800}
            onDone={() => setSheetStep('feature2')}
          />
        )}

        {sheetStep === 'feature2' && (
          <FeatureDetail
            eyebrow="Funcionalidad 02 / 02"
            title="Control de banca profesional"
            paragraphs={[
              'Una buena estrategia no depende solo de encontrar oportunidades. También necesitas saber cuánto arriesgar en cada entrada.',
              'BetAI te ayuda a organizar tu banca, definir límites y mantener una gestión más disciplinada, evitando que una mala racha se convierta en una pérdida descontrolada.',
              'Tu objetivo no es apostar más. Es tomar decisiones con más control.',
            ]}
            vimeoId={CONTROL_BANCA_VIMEO_ID}
            ctaLabel="Volver al análisis"
            onCta={handleBackToAnalysis}
          />
        )}
      </BottomSheet>
    </div>
  )
}
