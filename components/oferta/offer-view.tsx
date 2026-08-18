'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BetaiLogo } from '@/components/betai-logo'
import { cn } from '@/lib/utils'
import {
  CHECKOUT_URL,
  PAYMENT_METHODS,
} from '@/lib/betai/config'

/* ─────────────────────────────────────────────────────────────
   Contador regresivo real basado en el deadline firmado por el
   servidor. No se reinicia al recargar: el deadline es fijo.
   ───────────────────────────────────────────────────────────── */
interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function computeTimeLeft(deadline: number): TimeLeft {
  const diff = deadline - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  }
}

function useCountdown(deadline: number): TimeLeft {
  const [time, setTime] = useState<TimeLeft>(() => computeTimeLeft(deadline))
  useEffect(() => {
    setTime(computeTimeLeft(deadline))
    const id = window.setInterval(() => {
      setTime(computeTimeLeft(deadline))
    }, 1000)
    return () => window.clearInterval(id)
  }, [deadline])
  return time
}

const pad = (n: number) => n.toString().padStart(2, '0')

/* ─────────────────────────────────────────────────────────────
   Bloque de tiempo del hero (DÍAS · HORAS · MIN · SEG)
   ───────────────────────────────────────────────────────────── */
function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-[var(--color-surface)]/80 shadow-[0_1px_0_0_oklch(1_0_0/0.06)_inset,0_18px_40px_-24px_oklch(0_0_0/0.9)] sm:h-[4.5rem] sm:w-[4.5rem]">
        <span className="text-3xl font-black tabular-nums tracking-tight sm:text-4xl">
          {pad(value)}
        </span>
      </div>
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function CompactTimer({ time }: { time: TimeLeft }) {
  return (
    <span className="tabular-nums">
      {time.days}d {pad(time.hours)}h {pad(time.minutes)}m
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   Íconos mínimos
   ───────────────────────────────────────────────────────────── */
function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="4" y="10" width="16" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 3l7 2.5v5.5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V5.5L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Datos de contenido
   ───────────────────────────────────────────────────────────── */
const INCLUDED = [
  {
    n: '01',
    title: 'Tips listas todos los días',
    body:
      'BetAI genera selecciones listas para consultar, desde opciones más conservadoras hasta estrategias de mayor riesgo. Tú eliges cómo utilizarlas.',
  },
  {
    n: '02',
    title: 'Control de banca profesional',
    body:
      'Organiza tu banca, establece límites y mantén una gestión más disciplinada para evitar decisiones impulsivas.',
  },
  {
    n: '03',
    title: 'Cruce con más de 100 sitios deportivos',
    body:
      'Información y estadísticas cruzadas en tiempo real, antes y durante el partido.',
  },
  {
    n: '04',
    title: 'Acceso a las principales ligas y competiciones',
    body:
      'Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League, Libertadores, Sudamericana, Copa América, eliminatorias y principales competiciones nacionales.',
  },
  {
    n: '05',
    title: 'Comunidad privada de apostadores',
    body:
      'Espacio para compartir dudas, análisis y experiencias con otros usuarios de la comunidad.',
  },
  {
    n: '06',
    title: 'Acceso vitalicio',
    body:
      'Pago único. Desbloqueas tu acceso hoy y mantienes el acceso mientras el producto exista, conforme a los términos del servicio.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Usuario BetAI',
    country: 'México',
    time: '3 meses usando BetAI',
    text:
      'Antes tomaba decisiones demasiado rápido. Ahora tengo una forma mucho más organizada de analizar cada entrada.',
  },
  {
    name: 'Usuario BetAI',
    country: 'Colombia',
    time: '2 meses usando BetAI',
    text:
      'Lo que más me ayudó fue tener toda la información concentrada en un solo lugar.',
  },
  {
    name: 'Usuario BetAI',
    country: 'Argentina',
    time: '5 meses usando BetAI',
    text:
      'Dejé de entrar en partidos solo porque parecía una buena oportunidad. Ahora primero analizo.',
  },
]

const FAQ = [
  {
    q: '¿Qué es BetAI?',
    a: 'BetAI es una herramienta de análisis y gestión para apostadores. Reúne información, estadísticas cruzadas y control de banca en un solo lugar para ayudarte a tomar decisiones más organizadas.',
  },
  {
    q: '¿Cómo funciona BetAI?',
    a: 'BetAI cruza datos de más de 100 sitios deportivos, genera selecciones listas para consultar y te ayuda a gestionar tu banca con límites y una estructura más disciplinada.',
  },
  {
    q: '¿BetAI garantiza ganancias?',
    a: 'No. BetAI es una herramienta de análisis y gestión. No garantiza resultados ni elimina el riesgo inherente a las apuestas.',
  },
  {
    q: '¿Necesito estudiar todos los partidos?',
    a: 'No es obligatorio. BetAI concentra el análisis y las selecciones para que puedas revisar la información de forma rápida y decidir con más contexto.',
  },
  {
    q: '¿Qué ligas y competiciones están disponibles?',
    a: 'Las principales ligas y competiciones internacionales y nacionales: Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League, Libertadores, Sudamericana, Copa América, eliminatorias y competiciones nacionales de la región.',
  },
  {
    q: '¿Puedo utilizar BetAI desde mi celular?',
    a: 'Sí. BetAI está pensado mobile first: funciona de forma cómoda desde el celular, además de otros dispositivos.',
  },
  {
    q: '¿El acceso es realmente vitalicio?',
    a: 'Sí. Con el pago único desbloqueas tu acceso y lo mantienes mientras el producto exista, conforme a los términos del servicio.',
  },
  {
    q: '¿El pago es único?',
    a: 'Sí. Es un pago único, sin suscripción ni cobros recurrentes.',
  },
  {
    q: '¿Qué métodos de pago puedo utilizar?',
    a: 'Se muestran únicamente los métodos realmente disponibles en el checkout, como PIX y tarjeta de crédito. La lista puede variar según tu país.',
  },
  {
    q: '¿Cómo funciona la garantía de 30 días?',
    a: 'Puedes probar BetAI durante 30 días. Si decides que no es para ti, puedes solicitar un reembolso dentro del período de garantía, según los términos de compra.',
  },
  {
    q: '¿Cuándo recibo mi acceso?',
    a: 'El acceso se libera después de confirmarse el pago en el checkout.',
  },
  {
    q: '¿Puedo cancelar?',
    a: 'Al ser un pago único no hay suscripción que cancelar. Dentro del período de garantía puedes solicitar reembolso según los términos de compra.',
  },
  {
    q: '¿BetAI funciona durante los partidos?',
    a: 'Sí. BetAI cruza información y estadísticas en tiempo real, antes y durante el partido.',
  },
  {
    q: '¿Qué diferencia hay entre Tip Pronta y BetAI Tipster?',
    a: 'Tip Pronta te entrega selecciones listas para consultar de forma inmediata. BetAI Tipster es el análisis más profundo y personalizable, donde ajustas criterios y nivel de riesgo.',
  },
]

/* ─────────────────────────────────────────────────────────────
   Componente principal
   ───────────────────────────────────────────────────────────── */
export function OfferView({
  discount,
  deadline,
  basePrice,
  finalPrice,
}: {
  discount: number
  deadline: number
  basePrice: number
  finalPrice: number
}) {
  const time = useCountdown(deadline)
  const enabledMethods = useMemo(
    () => PAYMENT_METHODS.filter((m) => m.enabled),
    [],
  )

  // Handler AISLADO del checkout.
  const handleCheckout = useCallback(() => {
    if (time.expired || !CHECKOUT_URL) return
    // Si estamos dentro de un iframe (p. ej. la preview), abrimos el checkout
    // en una pestaña nueva; si no, navegamos en la misma pestaña.
    if (typeof window !== 'undefined' && window.self !== window.top) {
      window.open(CHECKOUT_URL, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = CHECKOUT_URL
    }
  }, [time.expired])

  const priceStr = finalPrice.toLocaleString('es-419')
  const baseStr = basePrice.toLocaleString('es-419', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      {/* Fondo premium grafito */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 60% at 50% -8%, oklch(0.24 0.03 158 / 0.55) 0%, transparent 52%), linear-gradient(180deg, oklch(0.16 0.015 162) 0%, oklch(0.13 0.012 162) 100%)',
          }}
        />
        <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-7">
        <Link href="/" aria-label="Inicio de BetAI">
          <BetaiLogo />
        </Link>
        <span className="hidden items-center gap-2 rounded-full border border-hairline bg-[var(--color-surface)]/60 px-3 py-1.5 sm:inline-flex">
          <LockIcon className="h-3.5 w-3.5 text-primary" />
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Pago seguro
          </span>
        </span>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-24">
        {time.expired ? (
          <ExpiredState />
        ) : (
          <>
            <Hero
              discount={discount}
              time={time}
            />
            <Comparison />
            <DiscountCard discount={discount} />
            <MainOfferCard
              discount={discount}
              time={time}
              priceStr={priceStr}
              baseStr={baseStr}
              enabledMethods={enabledMethods}
              onCheckout={handleCheckout}
            />
            <Included />
            <Guarantee />
            <Testimonials />
            <Faq />
            <FinalCta
              discount={discount}
              time={time}
              priceStr={priceStr}
              onCheckout={handleCheckout}
            />
          </>
        )}
      </main>
    </div>
  )
}

/* ── Hero ── */
function Hero({ discount, time }: { discount: number; time: TimeLeft }) {
  return (
    <section className="pt-10 text-center">
      <p className="animate-betai-fade-up text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Oferta termina en
      </p>

      <div
        className="animate-betai-fade-up mt-4 flex items-center justify-center gap-2.5 sm:gap-3"
        style={{ animationDelay: '0.06s' }}
      >
        <TimeBlock value={time.days} label="Días" />
        <span className="pb-6 text-2xl font-light text-muted-foreground/50">:</span>
        <TimeBlock value={time.hours} label="Horas" />
        <span className="pb-6 text-2xl font-light text-muted-foreground/50">:</span>
        <TimeBlock value={time.minutes} label="Min" />
        <span className="pb-6 text-2xl font-light text-muted-foreground/50">:</span>
        <TimeBlock value={time.seconds} label="Seg" />
      </div>

      <div
        className="animate-betai-fade-up mt-8 flex justify-center"
        style={{ animationDelay: '0.12s' }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-bright)]" />
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary">
            Acceso liberado · {discount}% OFF
          </span>
        </span>
      </div>

      <h1
        className="animate-betai-fade-up mx-auto mt-6 max-w-xl text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl"
        style={{ animationDelay: '0.18s' }}
      >
        Desbloquea tu{' '}
        <span
          style={{
            backgroundImage:
              'linear-gradient(180deg, var(--color-brand-bright), var(--color-primary))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          acceso
        </span>{' '}
        a BetAI ahora.
      </h1>

      <div
        className="animate-betai-fade-up mt-4 flex items-baseline justify-center gap-3"
        style={{ animationDelay: '0.24s' }}
      >
        <span
          className="text-5xl font-black tracking-tight sm:text-6xl"
          style={{ color: 'var(--color-gold)' }}
        >
          {discount}% OFF
        </span>
      </div>

      <p
        className="animate-betai-fade-up mt-4 text-sm font-medium text-muted-foreground"
        style={{ animationDelay: '0.3s' }}
      >
        Acceso vitalicio · Pago único
      </p>
    </section>
  )
}

/* ── Comparación ── */
function Comparison() {
  return (
    <section className="mt-20">
      <h2 className="text-balance text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
        La diferencia de apostar con método
      </h2>
      <p className="mx-auto mt-3 max-w-md text-pretty text-center text-sm leading-relaxed text-muted-foreground">
        No se trata de prometer ganancias, sino de pasar del desorden al control
        y a la información.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* Card negativo */}
        <article
          className="overflow-hidden rounded-3xl border p-1.5"
          style={{
            borderColor: 'oklch(0.5 0.16 25 / 0.35)',
            background:
              'linear-gradient(180deg, oklch(0.5 0.16 25 / 0.08), transparent 60%)',
          }}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
            <Image
              src="/betai/situacion-actual.png"
              alt="Persona apostando sin método, con signos de frustración"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              style={{ filter: 'saturate(0.75) brightness(0.82)' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, transparent 30%, oklch(0.16 0.015 162 / 0.85) 100%)',
              }}
            />
            <TrendLine
              color="oklch(0.62 0.2 25)"
              points="8,30 32,52 56,44 80,72 92,66"
              labels={['-73%', '-7%', '-34%', '-44%']}
              negative
            />
          </div>
          <div className="p-5">
            <StatRow label="Estado de la banca" value="En caída" negative />
            <StatRow label="Decisión" value="Por intuición" negative />
            <StatRow label="Confianza" value="Perdida" negative last />
          </div>
        </article>

        {/* Card positivo */}
        <article
          className="overflow-hidden rounded-3xl border p-1.5"
          style={{
            borderColor: 'oklch(0.7 0.17 155 / 0.4)',
            background:
              'linear-gradient(180deg, oklch(0.7 0.17 155 / 0.1), transparent 60%)',
          }}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
            <Image
              src="/betai/con-betai.png"
              alt="Persona apostando con BetAI, tranquila y en control"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, transparent 30%, oklch(0.16 0.015 162 / 0.82) 100%)',
              }}
            />
            <TrendLine
              color="var(--color-brand-bright)"
              points="8,72 32,58 56,60 80,34 92,22"
              labels={['+18%', '+9%', '+37%', '+52%']}
            />
          </div>
          <div className="p-5">
            <StatRow label="Estado de la banca" value="Bajo control" />
            <StatRow label="Decisión" value="Basada en datos" />
            <StatRow label="Confianza" value="Más clara" last />
          </div>
        </article>
      </div>
    </section>
  )
}

function TrendLine({
  color,
  points,
  labels,
  negative,
}: {
  color: string
  points: string
  labels: string[]
  negative?: boolean
}) {
  const coords = points.split(' ').map((p) => p.split(',').map(Number))
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      {coords.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="1.6" fill={color} vectorEffect="non-scaling-stroke" />
          {labels[i] && (
            <text
              x={x}
              y={negative ? y - 5 : y - 5}
              fontSize="7"
              fontWeight="800"
              fill={color}
              textAnchor="middle"
            >
              {labels[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

function StatRow({
  label,
  value,
  negative,
  last,
}: {
  label: string
  value: string
  negative?: boolean
  last?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-2.5',
        !last && 'border-b border-hairline',
      )}
    >
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span
        className="text-sm font-bold"
        style={{ color: negative ? 'oklch(0.68 0.19 25)' : 'var(--color-brand-bright)' }}
      >
        {value}
      </span>
    </div>
  )
}

/* ── Card de descuento ── */
function DiscountCard({ discount }: { discount: number }) {
  return (
    <section className="mt-16">
      <div
        className="relative overflow-hidden rounded-3xl border p-7 sm:p-9"
        style={{
          borderColor: 'oklch(0.7 0.15 158 / 0.35)',
          background:
            'linear-gradient(150deg, oklch(0.22 0.04 160) 0%, oklch(0.16 0.02 162) 60%)',
        }}
      >
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/15 blur-[70px]"
        />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-primary">
              Descuento de acceso aplicado
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-hairline bg-black/30 px-3 py-1.5">
              <span className="text-sm font-mono font-bold tracking-widest text-foreground/90">
                BETAI_28D
              </span>
            </div>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              El descuento se aplicará automáticamente al precio de tu oferta.
              Válido hasta que el contador llegue a cero.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center">
            <span
              className="text-6xl font-black leading-none tracking-tighter sm:text-7xl"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, var(--color-brand-bright), var(--color-primary))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              −{discount}%
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Card principal (blanco) ── */
function MainOfferCard({
  discount,
  time,
  priceStr,
  baseStr,
  enabledMethods,
  onCheckout,
}: {
  discount: number
  time: TimeLeft
  priceStr: string
  baseStr: string
  enabledMethods: { id: string; label: string }[]
  onCheckout: () => void
}) {
  return (
    <section className="mt-16">
      <div className="overflow-hidden rounded-[28px] bg-white text-neutral-900 shadow-[0_40px_90px_-30px_oklch(0_0_0/0.9)]">
        <div className="flex items-center justify-between border-b border-neutral-200 px-7 py-5">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-500">
            Tu oferta
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold tabular-nums text-neutral-700">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.6_0.19_25)]" />
            <CompactTimer time={time} />
          </span>
        </div>

        <div className="px-7 py-8">
          <div className="flex items-center justify-center gap-3">
            <span className="text-lg font-medium text-neutral-400 line-through">
              USD {baseStr}
            </span>
            <span className="rounded-full bg-[oklch(0.95_0.03_150)] px-2.5 py-1 text-sm font-black text-[oklch(0.45_0.15_155)]">
              −{discount}% OFF
            </span>
          </div>

          <div className="mt-4 flex items-start justify-center">
            <span className="mt-3 mr-1 text-2xl font-bold text-neutral-500">USD</span>
            <span className="text-7xl font-black leading-none tracking-tighter text-neutral-900 sm:text-8xl">
              {priceStr}
            </span>
          </div>

          <p className="mt-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-neutral-500">
            Al contado
          </p>
          <p className="mt-1 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[oklch(0.5_0.13_158)]">
            Acceso vitalicio · Pago único
          </p>

          <button
            type="button"
            onClick={onCheckout}
            className="group relative mt-7 flex w-full items-center justify-center overflow-hidden rounded-2xl px-6 text-base font-black uppercase tracking-wide text-white transition-transform active:scale-[0.98]"
            style={{
              background:
                'linear-gradient(180deg, var(--color-brand-bright), var(--color-primary))',
              boxShadow:
                '0 18px 44px -14px oklch(0.66 0.17 158 / 0.75), 0 0 0 1px oklch(0.6 0.15 158 / 0.4) inset',
              paddingTop: '1.1rem',
              paddingBottom: '1.1rem',
            }}
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            Liberar mi acceso
          </button>

          {/* Métodos de pago */}
          <div className="mt-7">
            <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
              Métodos de pago
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {enabledMethods.map((m) => (
                <span
                  key={m.id}
                  className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-bold text-neutral-700"
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          {/* Seguridad */}
          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-neutral-50 px-4 py-3">
            <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.5_0.13_158)]" />
            <p className="text-xs leading-relaxed text-neutral-500">
              Compra procesada con cifrado seguro. Los datos de tu tarjeta no son
              compartidos con nosotros.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Qué incluye ── */
function Included() {
  return (
    <section className="mt-20">
      <h2 className="text-center text-xs font-bold uppercase tracking-[0.28em] text-primary">
        Qué incluye
      </h2>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {INCLUDED.map((item) => (
          <article
            key={item.n}
            className="rounded-2xl border border-hairline bg-[var(--color-surface)]/60 p-5"
          >
            <div className="flex items-center gap-3">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black"
                style={{
                  background: 'oklch(0.7 0.17 155 / 0.14)',
                  color: 'var(--color-brand-bright)',
                }}
              >
                {item.n}
              </span>
              <h3 className="text-pretty text-base font-bold leading-snug">
                {item.title}
              </h3>
            </div>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ── Garantía ── */
function Guarantee() {
  return (
    <section className="mt-16">
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-hairline bg-[var(--color-surface)]/60 p-8 text-center sm:flex-row sm:text-left">
        <div
          className="grid h-20 w-20 shrink-0 place-items-center rounded-full border"
          style={{
            borderColor: 'oklch(0.7 0.15 158 / 0.4)',
            background: 'oklch(0.7 0.17 155 / 0.1)',
          }}
        >
          <ShieldIcon className="h-10 w-10 text-[var(--color-brand-bright)]" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">
            Garantía de 30 días
          </h2>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            Prueba BetAI durante 30 días. Si decides que no es para ti, puedes
            solicitar un reembolso dentro del período de garantía, según los
            términos de compra.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Testimonios ── */
function Testimonials() {
  return (
    <section className="mt-20">
      <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
        Lo que dicen nuestros usuarios
      </h2>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={i}
            className="flex flex-col rounded-2xl border border-hairline bg-[var(--color-surface)]/60 p-5"
          >
            <div className="flex gap-0.5" aria-label="5 de 5">
              {Array.from({ length: 5 }).map((_, s) => (
                <span key={s} style={{ color: 'var(--color-gold)' }}>
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                  </svg>
                </span>
              ))}
            </div>
            <blockquote className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
              “{t.text}”
            </blockquote>
            <figcaption className="mt-4 border-t border-hairline pt-3">
              <p className="text-sm font-bold">{t.name}</p>
              <p className="text-xs text-muted-foreground">
                {t.country} · {t.time}
              </p>
              <p className="mt-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground/60">
                Ejemplo de testimonio
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ── FAQ ── */
function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="mt-20">
      <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
        Preguntas frecuentes
      </h2>
      <div className="mx-auto mt-8 max-w-2xl">
        {FAQ.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="border-b border-hairline">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-pretty text-sm font-bold sm:text-base">
                  {item.q}
                </span>
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-hairline text-muted-foreground transition-transform duration-300"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <p className="pb-4 pr-10 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ── CTA final ── */
function FinalCta({
  discount,
  time,
  priceStr,
  onCheckout,
}: {
  discount: number
  time: TimeLeft
  priceStr: string
  onCheckout: () => void
}) {
  return (
    <section className="mt-20">
      <div
        className="relative overflow-hidden rounded-[28px] border p-8 text-center sm:p-10"
        style={{
          borderColor: 'oklch(0.7 0.15 158 / 0.3)',
          background:
            'radial-gradient(120% 80% at 50% 0%, oklch(0.24 0.04 160 / 0.7), oklch(0.15 0.018 162) 70%)',
        }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
          Tu acceso a BetAI
        </p>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Acceso vitalicio · Pago único
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span
            className="text-6xl font-black tracking-tighter"
            style={{
              backgroundImage:
                'linear-gradient(180deg, oklch(0.99 0 0), oklch(0.85 0.02 160))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            USD {priceStr}
          </span>
        </div>
        <span
          className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-black"
          style={{
            background: 'oklch(0.7 0.17 155 / 0.14)',
            color: 'var(--color-brand-bright)',
          }}
        >
          −{discount}% OFF
        </span>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="text-xs font-bold uppercase tracking-[0.16em]">
            Termina en
          </span>
          <span className="rounded-lg border border-hairline bg-black/20 px-2.5 py-1 font-bold tabular-nums text-foreground/90">
            <CompactTimer time={time} />
          </span>
        </div>

        <button
          type="button"
          onClick={onCheckout}
          className="group relative mx-auto mt-7 flex w-full max-w-md items-center justify-center overflow-hidden rounded-2xl px-6 text-base font-black uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.98]"
          style={{
            background:
              'linear-gradient(180deg, var(--color-brand-bright), var(--color-primary))',
            boxShadow: '0 18px 44px -14px oklch(0.66 0.17 158 / 0.8)',
            paddingTop: '1.1rem',
            paddingBottom: '1.1rem',
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
          Liberar mi acceso
        </button>
      </div>

      <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground/60">
        BetAI es una herramienta de análisis y gestión. No garantiza resultados ni
        elimina el riesgo inherente a las apuestas. Juega de forma responsable.
      </p>
    </section>
  )
}

/* ── Estado de oferta expirada ── */
function ExpiredState() {
  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center py-20 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-[var(--color-surface)]/60 px-4 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Oferta finalizada
        </span>
      </span>
      <h1 className="mt-6 max-w-md text-balance text-3xl font-black tracking-tight">
        Esta oferta ya expiró
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
        El tiempo del descuento llegó a cero, por lo que ya no está disponible.
        Puedes volver al inicio para conocer las opciones vigentes de BetAI.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-2xl border border-hairline bg-[var(--color-surface)]/70 px-6 py-3.5 text-sm font-bold transition-colors hover:border-muted-foreground/40"
      >
        Volver al inicio
      </Link>
    </section>
  )
}
