'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { BetaiLogo } from '@/components/betai-logo'
import { PrimaryButton } from '@/components/primary-button'
import { QuizProgress } from '@/components/quiz/quiz-progress'
import { TimelineSlider, type TimelineOption } from '@/components/quiz/timeline-slider'
import { AgeKeypad } from '@/components/quiz/age-keypad'
import { ChoiceOptions, type ChoiceOption } from '@/components/quiz/choice-options'
import { MultiChoiceOptions } from '@/components/quiz/multi-choice-options'
import { LatamSocialProof } from '@/components/quiz/latam-social-proof'
import { MechanismImpact } from '@/components/quiz/mechanism-impact'
import { CycleBreakDemo } from '@/components/quiz/cycle-break-demo'
import { RiskArc, type RiskLevel } from '@/components/quiz/risk-arc'
import {
  MethodRadialMap,
  type MethodOption,
} from '@/components/quiz/method-radial-map'
import {
  PaperPlaneIcon,
  StatsIcon,
  FriendsIcon,
  CompassIcon,
  QuestionIcon,
} from '@/components/quiz/method-icons'
import {
  MarketMultiSelect,
  type MarketOption,
} from '@/components/quiz/market-multiselect'
import {
  TrophyIcon,
  OverUnderIcon,
  BothScoreIcon,
  CornerIcon,
  CardsIcon,
  HandicapIcon,
  ScoreboardIcon,
  StopwatchIcon,
  PlayerIcon,
} from '@/components/quiz/market-icons'
import {
  LeagueMultiSelect,
  type LeagueOption,
} from '@/components/quiz/league-multiselect'
import {
  ShieldIcon,
  CupIcon,
  ContinentIcon,
  PennantIcon,
  RegionIcon,
  InfinityIcon,
} from '@/components/quiz/league-icons'

const TOTAL_STEPS = 15
const MIN_AGE = 18
const MAX_AGE = 99

// Opciones de la etapa 2: motivo por el que empezó a apostar.
const REASON_OPTIONS: ChoiceOption[] = [
  {
    value: 'sigo-futbol',
    label: 'Ya sigo el fútbol, tiene sentido ganar dinero con ello',
  },
  {
    value: 'amigos',
    label: 'Mis amigos ya apostaban y empecé con ellos',
  },
  {
    value: 'ingreso-extra',
    label: 'Quiero generar un ingreso extra cada mes',
  },
  {
    value: 'lectura-juego',
    label: 'Tengo buena lectura de juego y quiero aprovecharla',
  },
]

// Opciones de la etapa 4: cuándo suele apostar.
const TIMING_OPTIONS: ChoiceOption[] = [
  {
    value: 'antes-partido',
    label: 'Antes del partido, después de analizarlo',
  },
  {
    value: 'durante-partido',
    label: 'Durante el partido, según cómo se desarrolla',
  },
  {
    value: 'depende',
    label: 'Depende, varía según el partido',
  },
]

// Opciones de la etapa 10: frecuencia de uso de BetAI (selección única).
const FREQUENCY_OPTIONS: ChoiceOption[] = [
  {
    value: 'diario',
    label: 'Todos los días, soy un apostador frecuente',
  },
  {
    value: 'fines-semana',
    label: 'Solo los fines de semana',
  },
  {
    value: 'ocasional',
    label: 'De vez en cuando',
  },
]

// Opciones de la etapa 12: tiempo para volver a apostar tras un RED (única).
const RECOVERY_OPTIONS: ChoiceOption[] = [
  { value: 'dia-siguiente', label: 'Espero al día siguiente' },
  { value: 'unas-horas', label: 'Unas horas después' },
  { value: 'justo-despues', label: 'Justo después' },
]

// Opciones de la etapa 13: cómo evolucionó la banca (selección única).
const BANKROLL_OPTIONS: ChoiceOption[] = [
  { value: 'redujo', label: 'Se redujo, perdí dinero' },
  { value: 'igual', label: 'Quedó casi igual' },
  { value: 'subio-poco', label: 'Subió un poco' },
  { value: 'multiplico', label: 'Se multiplicó' },
]

// Opciones de la etapa 14: qué le falta para apostar mejor (múltiple).
const GAP_OPTIONS: ChoiceOption[] = [
  { value: 'tiempo', label: 'Tiempo para estudiar los partidos' },
  { value: 'conocimiento', label: 'Conocimiento técnico' },
  { value: 'fuente', label: 'Una fuente confiable' },
  { value: 'que-partidos', label: 'Saber en qué partidos apostar' },
  { value: 'estrategia', label: 'Una estrategia clara' },
]

// Opciones de la etapa 5: mercados (selección múltiple, sin límite).
const MARKET_OPTIONS: MarketOption[] = [
  { value: 'ganador', label: 'Ganador del partido', Icon: TrophyIcon },
  { value: 'over-under', label: 'Más/Menos goles', Icon: OverUnderIcon },
  { value: 'ambos-marcan', label: 'Ambos equipos marcan', Icon: BothScoreIcon },
  { value: 'corners', label: 'Córners', Icon: CornerIcon },
  { value: 'tarjetas', label: 'Tarjetas', Icon: CardsIcon },
  { value: 'handicap', label: 'Hándicap', Icon: HandicapIcon },
  { value: 'resultado-exacto', label: 'Resultado exacto', Icon: ScoreboardIcon },
  { value: 'tiempos', label: '1.º o 2.º tiempo', Icon: StopwatchIcon },
  { value: 'jugador', label: 'Jugador específico', Icon: PlayerIcon },
]

// Opciones de la etapa 6: ligas y competiciones (selección múltiple, sin límite).
// Se usa el logo oficial cuando está disponible; si no, un ícono deportivo
// minimalista de respaldo (nunca un logo imitado).
const LEAGUE_OPTIONS: LeagueOption[] = [
  { value: 'laliga', label: 'LaLiga', Icon: ShieldIcon },
  {
    value: 'premier-league',
    label: 'Premier League',
    logo: '/leagues/premier-league.svg',
  },
  {
    value: 'champions-league',
    label: 'Champions League',
    logo: '/leagues/champions-league.svg',
  },
  { value: 'copa-libertadores', label: 'Copa Libertadores', Icon: CupIcon },
  {
    value: 'copa-del-mundo',
    label: 'Copa del Mundo',
    logo: '/leagues/fifa-world-cup.svg',
  },
  { value: 'europa-league', label: 'Europa League', Icon: ContinentIcon },
  { value: 'liga-mx', label: 'Liga MX', Icon: PennantIcon },
  {
    value: 'nacionales-latam',
    label: 'Campeonatos nacionales de Latinoamérica',
    Icon: RegionIcon,
  },
  { value: 'otras-ligas', label: 'Otras ligas', Icon: InfinityIcon },
]

// Niveles de riesgo de la etapa 8 (arco + barra horizontal sincronizados).
const RISK_LEVELS: RiskLevel[] = [
  { value: '2', label: '2%' },
  { value: '10', label: '10%' },
  { value: '20', label: '20%' },
  { value: '20+', label: '20%+' },
]

// Opciones de la etapa 9: métodos actuales (mapa radial, selección múltiple).
// x/y son el centro de cada nodo en % del lienzo cuadrado alrededor de "VOS".
const METHOD_OPTIONS: MethodOption[] = [
  { value: 'telegram', label: 'Tips de Telegram', Icon: PaperPlaneIcon, x: 50, y: 12 },
  {
    value: 'estadisticas',
    label: 'Analizo las estadísticas en el momento',
    Icon: StatsIcon,
    x: 86,
    y: 42,
  },
  {
    value: 'amigo',
    label: 'Sigo el consejo de un amigo',
    Icon: FriendsIcon,
    x: 72,
    y: 86,
  },
  {
    value: 'intuicion',
    label: 'Sigo mi intuición',
    Icon: CompassIcon,
    x: 28,
    y: 86,
  },
  {
    value: 'sin-metodo',
    label: 'No tengo un método',
    Icon: QuestionIcon,
    x: 14,
    y: 42,
  },
]

// Opciones de la línea de tiempo de la etapa 1.
const TIMELINE_OPTIONS: TimelineOption[] = [
  { value: 'lt-3m', label: 'Menos de 3 meses', short: '< 3 meses' },
  { value: '3-12m', label: '3 a 12 meses', short: '3-12 meses' },
  { value: '1-2y', label: '1 a 2 años', short: '1-2 años' },
  { value: '3-5y', label: '3 a 5 años', short: '3-5 años' },
  { value: 'gt-5y', label: 'Más de 5 años', short: '+5 años' },
]

export function QuizFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timelineIndex, setTimelineIndex] = useState<number | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  const [timing, setTiming] = useState<string | null>(null)
  const [markets, setMarkets] = useState<string[]>([])
  const [leagues, setLeagues] = useState<string[]>([])
  // Etapa 8: índice del nivel de riesgo y opción "sin patrón fijo".
  const [riskIndex, setRiskIndex] = useState(0)
  const [riskTouched, setRiskTouched] = useState(false)
  const [noRiskPattern, setNoRiskPattern] = useState(false)
  // Etapa 9: métodos actuales (mapa radial, selección múltiple).
  const [methods, setMethods] = useState<string[]>([])
  // Etapa 10: frecuencia de uso de BetAI (selección única).
  const [frequency, setFrequency] = useState<string | null>(null)
  // Etapa 12: tiempo para volver a apostar tras un RED (selección única).
  const [recovery, setRecovery] = useState<string | null>(null)
  // Etapa 13: evolución de la banca (selección única).
  const [bankroll, setBankroll] = useState<string | null>(null)
  // Etapa 14: qué le falta para apostar mejor (selección múltiple).
  const [gaps, setGaps] = useState<string[]>([])
  const [age, setAge] = useState('')
  const [ageError, setAgeError] = useState<string | null>(null)
  // Sub-vista de la ETAPA 3: prueba social regional (sigue siendo la etapa 3).
  const [showSocialProof, setShowSocialProof] = useState(false)

  const advance = () => setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1))

  const goNext = () => {
    if (currentStep === 1 && timelineIndex !== null) {
      setAnswers((prev) => ({
        ...prev,
        1: TIMELINE_OPTIONS[timelineIndex].value,
      }))
    }
    advance()
  }

  // Etapa 2: guarda el motivo y avanza a la etapa 3 (edad).
  const submitReason = () => {
    if (!reason) return
    setAnswers((prev) => ({ ...prev, 2: reason }))
    advance()
  }

  // Cambios en el campo de edad: limpiar el error mientras el usuario edita.
  const handleAgeChange = (next: string) => {
    setAge(next)
    if (ageError) setAgeError(null)
  }

  // Validación de la etapa 3 al intentar continuar.
  const submitAge = () => {
    const value = Number(age)
    if (!age || Number.isNaN(value)) return
    if (value < MIN_AGE) {
      setAgeError('Debes tener al menos 18 años para continuar.')
      return
    }
    if (value > MAX_AGE) {
      setAgeError('Ingresa una edad válida para continuar.')
      return
    }
    setAnswers((prev) => ({ ...prev, 3: age }))
    setAgeError(null)
    // No avanzamos de etapa: mostramos la prueba social regional (aún etapa 3).
    setShowSocialProof(true)
  }

  // Continuar desde la prueba social: recién aquí se pasa a la etapa 4.
  const leaveSocialProof = () => {
    setShowSocialProof(false)
    advance()
  }

  // Etapa 4: guarda cuándo suele apostar y avanza a la etapa 5.
  const submitTiming = () => {
    if (!timing) return
    setAnswers((prev) => ({ ...prev, 4: timing }))
    advance()
  }

  // Etapa 5: alterna un mercado (selección múltiple sin límite).
  const toggleMarket = (value: string) => {
    setMarkets((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    )
  }

  // Etapa 5: guarda los mercados elegidos y avanza a la etapa 6.
  const submitMarkets = () => {
    if (markets.length === 0) return
    setAnswers((prev) => ({ ...prev, 5: markets.join(',') }))
    advance()
  }

  // Etapa 6: alterna una liga/competición (selección múltiple sin límite).
  const toggleLeague = (value: string) => {
    setLeagues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    )
  }

  // Etapa 6: guarda las ligas elegidas y avanza a la etapa 7.
  const submitLeagues = () => {
    if (leagues.length === 0) return
    setAnswers((prev) => ({ ...prev, 6: leagues.join(',') }))
    advance()
  }

  // Etapa 8: mover el arco/barra marca el control como usado y desactiva
  // automáticamente la opción "sin patrón fijo".
  const handleRiskChange = (index: number) => {
    setRiskIndex(index)
    setRiskTouched(true)
    if (noRiskPattern) setNoRiskPattern(false)
  }

  // Etapa 8: alternar la opción "no sigo un patrón fijo".
  const toggleNoRiskPattern = () => {
    setNoRiskPattern((prev) => !prev)
  }

  // Etapa 8: guarda el riesgo elegido (o "sin patrón") y avanza a la etapa 9.
  const submitRisk = () => {
    if (!noRiskPattern && !riskTouched) return
    setAnswers((prev) => ({
      ...prev,
      8: noRiskPattern ? 'sin-patron' : RISK_LEVELS[riskIndex].value,
    }))
    advance()
  }

  // Etapa 9: alterna un método en el mapa radial (selección múltiple).
  const toggleMethod = (value: string) => {
    setMethods((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    )
  }

  // Etapa 9: guarda los métodos elegidos y avanza a la etapa 10.
  const submitMethods = () => {
    if (methods.length === 0) return
    setAnswers((prev) => ({ ...prev, 9: methods.join(',') }))
    advance()
  }

  // Etapa 10: guarda la frecuencia y avanza a la etapa 11.
  const submitFrequency = () => {
    if (!frequency) return
    setAnswers((prev) => ({ ...prev, 10: frequency }))
    advance()
  }

  // Etapa 12: selección única con AVANCE AUTOMÁTICO (sin botón).
  // Se marca la opción, se guarda la respuesta y, tras una transición
  // visual muy corta, se pasa solo a la etapa 13.
  const selectRecovery = (value: string) => {
    setRecovery(value)
    setAnswers((prev) => ({ ...prev, 12: value }))
    window.setTimeout(advance, 280)
  }

  // Etapa 13: selección única con AVANCE AUTOMÁTICO (sin botón).
  const selectBankroll = (value: string) => {
    setBankroll(value)
    setAnswers((prev) => ({ ...prev, 13: value }))
    window.setTimeout(advance, 280)
  }

  // Etapa 14: alterna una carencia (selección múltiple, con botón).
  const toggleGap = (value: string) => {
    setGaps((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    )
  }

  // Etapa 14 (última): guarda todo, persiste las respuestas y entra al
  // flujo post-quiz en /plan (loading → pullups → diagnóstico → oferta).
  const submitGaps = () => {
    if (gaps.length === 0) return
    const finalAnswers = { ...answers, 14: gaps.join(',') }
    setAnswers(finalAnswers)
    try {
      sessionStorage.setItem('betai:answers', JSON.stringify(finalAnswers))
    } catch {
      // sessionStorage puede fallar en modo privado; el plan usa valores por defecto.
    }
    router.push('/plan')
  }

  const goBack = () => {
    setAgeError(null)
    if (showSocialProof) {
      setShowSocialProof(false)
      return
    }
    setCurrentStep((s) => Math.max(1, s - 1))
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Fondo con la misma identidad premium de la primera pantalla */}
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
        {/* Viñeta inferior para dar profundidad continua */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(100% 55% at 50% 120%, oklch(0 0 0 / 0.35) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Encabezado: logo + progreso */}
      <header className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-5 px-6 pt-8">
        <div className="flex items-center justify-center sm:justify-start">
          <Link href="/" aria-label="Volver al inicio de BetAI">
            <BetaiLogo />
          </Link>
        </div>
        <QuizProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </header>

      {/* Contenido */}
      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-8">
        {currentStep === 1 ? (
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                ¿Hace cuánto tiempo apuestas en fútbol?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto max-w-sm text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                Desliza el marcador en la línea de tiempo para elegir.
              </p>

              <div
                className="animate-betai-fade-up mt-8 rounded-3xl border border-hairline bg-[var(--color-surface)]/60 p-6 shadow-[0_1px_0_0_oklch(1_0_0/0.04)_inset,0_24px_60px_-30px_oklch(0_0_0/0.7)] backdrop-blur-sm sm:p-8"
                style={{ animationDelay: '0.2s' }}
              >
                <TimelineSlider
                  options={TIMELINE_OPTIONS}
                  selectedIndex={timelineIndex}
                  onChange={setTimelineIndex}
                />
              </div>
            </div>

            <div className="mt-8">
              <PrimaryButton onClick={goNext} disabled={timelineIndex === null}>
                Continuar
              </PrimaryButton>
            </div>
          </div>
        ) : currentStep === 2 ? (
          // ETAPA 2: motivo por el que empezó a apostar.
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                ¿Por qué empezaste a apostar en fútbol?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto max-w-sm text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                Elige la opción que mejor te describe.
              </p>

              <div className="mt-8">
                <ChoiceOptions
                  name="Motivo para empezar a apostar en fútbol"
                  options={REASON_OPTIONS}
                  selectedValue={reason}
                  onChange={setReason}
                />
              </div>
            </div>

            <div className="mt-8">
              <PrimaryButton onClick={submitReason} disabled={reason === null}>
                Continuar
              </PrimaryButton>
            </div>
          </div>
        ) : currentStep === 3 && showSocialProof ? (
          // ETAPA 3 (prueba social regional LATAM): sigue siendo la etapa 3.
          <LatamSocialProof onContinue={leaveSocialProof} />
        ) : currentStep === 3 ? (
          // ETAPA 3: edad con teclado numérico propio.
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                ¿Cuál es tu edad?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto max-w-sm text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                Ingresa tu edad para continuar.
              </p>

              <div
                className="animate-betai-fade-up mt-8"
                style={{ animationDelay: '0.2s' }}
              >
                <AgeKeypad
                  value={age}
                  onChange={handleAgeChange}
                  maxLength={2}
                  error={ageError}
                />
              </div>
            </div>

            <div className="mt-8">
              <PrimaryButton onClick={submitAge} disabled={age.length === 0}>
                Continuar
              </PrimaryButton>
            </div>
          </div>
        ) : currentStep === 4 ? (
          // ETAPA 4: cuándo suele hacer sus apuestas.
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                ¿Cuándo sueles hacer tus apuestas?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto max-w-sm text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                Elige la opción que mejor te describe.
              </p>

              <div className="mt-8">
                <ChoiceOptions
                  name="Cuándo sueles hacer tus apuestas"
                  options={TIMING_OPTIONS}
                  selectedValue={timing}
                  onChange={setTiming}
                />
              </div>
            </div>

            <div className="mt-8">
              <PrimaryButton onClick={submitTiming} disabled={timing === null}>
                Continuar
              </PrimaryButton>
            </div>
          </div>
        ) : currentStep === 5 ? (
          // ETAPA 5: mercados (selección múltiple, diseño de cuadrícula propio).
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3 py-2">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                ¿En qué mercados sueles apostar más?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto flex items-center gap-2 text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                <span
                  aria-hidden
                  className="inline-flex h-5 items-center rounded-full border border-primary/40 bg-primary/10 px-2 text-[0.68rem] font-bold uppercase tracking-wide text-primary"
                >
                  Multi
                </span>
                Puedes seleccionar más de uno.
              </p>

              <div className="mt-6">
                <MarketMultiSelect
                  options={MARKET_OPTIONS}
                  selected={markets}
                  onToggle={toggleMarket}
                />
              </div>
            </div>

            <div className="mt-8">
              <PrimaryButton onClick={submitMarkets} disabled={markets.length === 0}>
                Continuar
              </PrimaryButton>
            </div>
          </div>
        ) : currentStep === 6 ? (
          // ETAPA 6: ligas y competiciones (selección múltiple con logos oficiales).
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3 py-2">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                ¿En qué ligas o competiciones sueles apostar?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto flex items-center gap-2 text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                <span
                  aria-hidden
                  className="inline-flex h-5 items-center rounded-full border border-primary/40 bg-primary/10 px-2 text-[0.68rem] font-bold uppercase tracking-wide text-primary"
                >
                  Multi
                </span>
                Puedes seleccionar más de una.
              </p>

              <div className="mt-6">
                <LeagueMultiSelect
                  options={LEAGUE_OPTIONS}
                  selected={leagues}
                  onToggle={toggleLeague}
                />
              </div>
            </div>

            <div className="mt-8">
              <PrimaryButton onClick={submitLeagues} disabled={leagues.length === 0}>
                Continuar
              </PrimaryButton>
            </div>
          </div>
        ) : currentStep === 7 ? (
          // ETAPA 7: pantalla de impacto/mecanismo (no es una pregunta).
          <MechanismImpact onContinue={advance} />
        ) : currentStep === 8 ? (
          // ETAPA 8: control de riesgo (arco + barra sincronizados).
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3 py-2">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                ¿Qué porcentaje de tu banca sueles arriesgar por apuesta?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto max-w-sm text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                Desliza para elegir tu nivel de riesgo.
              </p>

              <div
                className="animate-betai-fade-up mt-6"
                style={{ animationDelay: '0.2s' }}
              >
                <RiskArc
                  levels={RISK_LEVELS}
                  selectedIndex={riskIndex}
                  onChange={handleRiskChange}
                  disabled={noRiskPattern}
                />
              </div>

              {/* Opción alternativa al control de riesgo */}
              <button
                type="button"
                onClick={toggleNoRiskPattern}
                aria-pressed={noRiskPattern}
                className={cn(
                  'animate-betai-fade-up group mx-auto mt-6 flex w-full max-w-md items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200',
                  noRiskPattern
                    ? 'border-primary bg-primary/12 shadow-[0_0_0_1px_var(--color-primary)_inset,0_10px_30px_-14px_oklch(0.735_0.168_152/0.7)]'
                    : 'border-hairline bg-[var(--color-surface)]/60 hover:border-muted-foreground/40',
                )}
                style={{ animationDelay: '0.3s' }}
              >
                <span
                  aria-hidden
                  className={cn(
                    'grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors duration-200',
                    noRiskPattern
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/45 bg-transparent',
                  )}
                >
                  {noRiskPattern && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="animate-betai-check-pop"
                      aria-hidden
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold leading-snug transition-colors duration-200 sm:text-base',
                    noRiskPattern ? 'text-secondary' : 'text-foreground/90',
                  )}
                >
                  No sigo un patrón fijo de cantidad por apuesta
                </span>
              </button>
            </div>

            <div className="mt-8">
              <PrimaryButton
                onClick={submitRisk}
                disabled={!noRiskPattern && !riskTouched}
              >
                Continuar
              </PrimaryButton>
            </div>
          </div>
        ) : currentStep === 9 ? (
          // ETAPA 9: mapa radial de métodos actuales (selección múltiple).
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3 py-2">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                ¿Cómo decides tus apuestas actualmente?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto flex items-center gap-2 text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                <span
                  aria-hidden
                  className="inline-flex h-5 items-center rounded-full border border-primary/40 bg-primary/10 px-2 text-[0.68rem] font-bold uppercase tracking-wide text-primary"
                >
                  Multi
                </span>
                Puedes elegir más de una.
              </p>

              <div
                className="animate-betai-fade-up mt-6"
                style={{ animationDelay: '0.2s' }}
              >
                <MethodRadialMap
                  options={METHOD_OPTIONS}
                  selected={methods}
                  onToggle={toggleMethod}
                />
              </div>
            </div>

            <div className="mt-8">
              <PrimaryButton onClick={submitMethods} disabled={methods.length === 0}>
                Continuar
              </PrimaryButton>
            </div>
          </div>
        ) : currentStep === 10 ? (
          // ETAPA 10: frecuencia de uso de BetAI (selección única).
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                ¿Con qué frecuencia vas a usar BetAI?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto max-w-sm text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                Elige la opción que mejor te describe.
              </p>

              <div className="mt-8">
                <ChoiceOptions
                  name="Con qué frecuencia vas a usar BetAI"
                  options={FREQUENCY_OPTIONS}
                  selectedValue={frequency}
                  onChange={setFrequency}
                />
              </div>
            </div>

            <div className="mt-8">
              <PrimaryButton
                onClick={submitFrequency}
                disabled={frequency === null}
              >
                Continuar
              </PrimaryButton>
            </div>
          </div>
        ) : currentStep === 11 ? (
          // ETAPA 11: demostración visual del ciclo RED → descontrol → BetAI.
          <CycleBreakDemo onContinue={advance} />
        ) : currentStep === 12 ? (
          // ETAPA 12: tiempo para volver a apostar tras un RED.
          // Selección única con AVANCE AUTOMÁTICO (sin botón "Continuar").
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                Después de un RED, ¿cuánto tardas en volver a apostar?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto max-w-sm text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                Elige la opción que mejor te describe.
              </p>

              <div className="mt-8">
                <ChoiceOptions
                  name="Después de un RED, cuánto tardas en volver a apostar"
                  options={RECOVERY_OPTIONS}
                  selectedValue={recovery}
                  onChange={selectRecovery}
                />
              </div>
            </div>
          </div>
        ) : currentStep === 13 ? (
          // ETAPA 13: evolución de la banca.
          // Selección única con AVANCE AUTOMÁTICO (sin botón "Continuar").
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                En los últimos meses, tu banca:
              </h1>
              <p
                className="animate-betai-fade-up mx-auto max-w-sm text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                Elige la opción que mejor te describe.
              </p>

              <div className="mt-8">
                <ChoiceOptions
                  name="En los últimos meses tu banca"
                  options={BANKROLL_OPTIONS}
                  selectedValue={bankroll}
                  onChange={selectBankroll}
                />
              </div>
            </div>
          </div>
        ) : currentStep === 14 ? (
          // ETAPA 14: qué le falta para apostar mejor.
          // Selección MÚLTIPLE, con botón "Continuar".
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-3">
              <h1
                className="animate-betai-fade-up text-balance text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
                style={{ animationDelay: '0.05s' }}
              >
                ¿Qué te falta para apostar mejor?
              </h1>
              <p
                className="animate-betai-fade-up mx-auto flex items-center gap-2 text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
                style={{ animationDelay: '0.12s' }}
              >
                <span
                  aria-hidden
                  className="inline-flex h-5 items-center rounded-full border border-primary/40 bg-primary/10 px-2 text-[0.68rem] font-bold uppercase tracking-wide text-primary"
                >
                  Multi
                </span>
                Puedes elegir más de una.
              </p>

              <div className="mt-8">
                <MultiChoiceOptions
                  name="Qué te falta para apostar mejor"
                  options={GAP_OPTIONS}
                  selectedValues={gaps}
                  onToggle={toggleGap}
                />
              </div>
            </div>

            <div className="mt-8">
              <PrimaryButton onClick={submitGaps} disabled={gaps.length === 0}>
                Continuar
              </PrimaryButton>
            </div>
          </div>
        ) : (
          // Estructura lista para las próximas etapas (aún no construidas).
          <div className="animate-betai-fade-up flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-hairline bg-[var(--color-surface)]/60 px-8 py-12 shadow-[0_1px_0_0_oklch(1_0_0/0.04)_inset,0_24px_60px_-30px_oklch(0_0_0/0.7)] backdrop-blur-sm">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-[var(--color-brand-bright)] to-primary text-primary-foreground shadow-[0_8px_22px_-8px_oklch(0.735_0.168_152/0.8)]">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="text-balance text-2xl font-extrabold tracking-[-0.02em]">
                Respuesta guardada
              </h2>
              <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                Estamos preparando la etapa {currentStep} de tu perfil. Las
                siguientes preguntas estarán disponibles muy pronto.
              </p>
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={advance}
                  className="rounded-xl bg-gradient-to-b from-[var(--color-brand-bright)] to-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_8px_22px_-8px_oklch(0.58_0.118_166/0.8)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Continuar
                </button>
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm font-semibold text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  Volver a la etapa anterior
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
