'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface RiskLevel {
  value: string
  label: string
}

interface RiskArcProps {
  levels: RiskLevel[]
  /** Índice del nivel seleccionado en el arco/barra. */
  selectedIndex: number
  onChange: (index: number) => void
  /** Cuando true, el control queda desactivado visual y funcionalmente. */
  disabled?: boolean
}

/* Geometría del arco (viewBox 300 x 170). Semicírculo de 180°. */
const VB_W = 300
const CX = 150
const CY = 158
const R = 128
const START = Math.PI // 180° (izquierda)
const END = 0 // 0° (derecha)

/** Devuelve el punto (x,y) sobre el arco para un ratio 0..1 (izq → der). */
function pointAt(ratio: number) {
  const angle = START + (END - START) * ratio
  return { x: CX + R * Math.cos(angle), y: CY - R * Math.sin(angle) }
}

/** Path del arco entre dos ratios. */
function arcPath(from: number, to: number) {
  const a = pointAt(from)
  const b = pointAt(to)
  // largeArc siempre 0 (cada tramo < 180°), sweep 1 (sentido horario en pantalla)
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`
}

export function RiskArc({
  levels,
  selectedIndex,
  onChange,
  disabled = false,
}: RiskArcProps) {
  const lastIndex = levels.length - 1
  const ratio = selectedIndex / lastIndex
  const thumb = pointAt(ratio)

  const arcAreaRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const barTrackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [showHint, setShowHint] = useState(true)

  // Convierte una posición de puntero en un índice a partir del ÁNGULO respecto
  // al centro del arco: mucho más natural que proyectar sobre X.
  const setFromArcPointer = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      // Escala del viewBox al tamaño renderizado.
      const scaleX = VB_W / rect.width
      const px = (clientX - rect.left) * scaleX
      const py = (clientY - rect.top) * (VB_W / rect.width) // misma escala uniforme
      const dx = px - CX
      const dy = CY - py // invertimos Y (arriba positivo)
      let angle = Math.atan2(dy, dx) // π (izq) .. 0 (der) en el semicírculo
      if (angle < 0) angle = angle < -Math.PI / 2 ? Math.PI : 0 // clamp fuera del arco
      const r = (START - angle) / (START - END)
      const clamped = Math.min(1, Math.max(0, r))
      onChange(Math.round(clamped * lastIndex))
    },
    [lastIndex, onChange],
  )

  const setFromBarPointer = useCallback(
    (clientX: number) => {
      const track = barTrackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const r = (clientX - rect.left) / rect.width
      const clamped = Math.min(1, Math.max(0, r))
      onChange(Math.round(clamped * lastIndex))
    },
    [lastIndex, onChange],
  )

  const beginArc = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    e.preventDefault()
    arcAreaRef.current?.setPointerCapture(e.pointerId)
    draggingRef.current = true
    setDragging(true)
    setShowHint(false)
    setFromArcPointer(e.clientX, e.clientY)
  }
  const moveArc = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || disabled) return
    setFromArcPointer(e.clientX, e.clientY)
  }
  const beginBar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    e.preventDefault()
    barTrackRef.current?.parentElement?.setPointerCapture?.(e.pointerId)
    draggingRef.current = true
    setDragging(true)
    setShowHint(false)
    setFromBarPointer(e.clientX)
  }
  const moveBar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || disabled) return
    setFromBarPointer(e.clientX)
  }
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId)
    draggingRef.current = false
    setDragging(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(Math.min(lastIndex, selectedIndex + 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(Math.max(0, selectedIndex - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      onChange(lastIndex)
    }
  }

  useEffect(() => {
    if (disabled) setShowHint(false)
  }, [disabled])

  const smooth = !dragging

  return (
    <div
      className={cn(
        'flex w-full select-none flex-col items-center transition-opacity duration-300',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      {/* Valor grande en tiempo real */}
      <div className="mb-2 flex min-h-[74px] flex-col items-center justify-center gap-1 text-center">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Riesgo por apuesta
        </span>
        <span
          key={selectedIndex}
          className={cn(
            'animate-betai-fade-up bg-gradient-to-r from-primary via-[var(--color-brand-bright)] to-[var(--color-gold)] bg-clip-text text-5xl font-extrabold tracking-[-0.02em] text-transparent sm:text-6xl',
            disabled && 'from-muted-foreground via-muted-foreground to-muted-foreground',
          )}
        >
          {levels[selectedIndex].label}
        </span>
      </div>

      {/* ARCO semicircular */}
      <div
        ref={arcAreaRef}
        className="relative w-full max-w-[340px] touch-none"
        style={{ aspectRatio: `${VB_W} / 172`, cursor: disabled ? 'default' : 'pointer' }}
        onPointerDown={beginArc}
        onPointerMove={moveArc}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} 172`}
          className="h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="risk-fill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-brand-deep)" />
              <stop offset="55%" stopColor="var(--color-brand-bright)" />
              <stop offset="100%" stopColor="var(--color-gold)" />
            </linearGradient>
            <filter id="risk-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Pista base */}
          <path
            d={arcPath(0, 1)}
            fill="none"
            stroke="var(--color-surface-2)"
            strokeWidth={14}
            strokeLinecap="round"
          />
          {/* Relleno activo */}
          <path
            d={arcPath(0, Math.max(0.0001, ratio))}
            fill="none"
            stroke="url(#risk-fill)"
            strokeWidth={14}
            strokeLinecap="round"
            filter={disabled ? undefined : 'url(#risk-glow)'}
            style={{
              transition: smooth ? 'stroke-dashoffset 0.2s ease-out' : 'none',
            }}
          />

          {/* Marcas de cada nivel sobre el arco */}
          {levels.map((lvl, i) => {
            const p = pointAt(i / lastIndex)
            const reached = i <= selectedIndex
            return (
              <circle
                key={lvl.value}
                cx={p.x}
                cy={p.y}
                r={3}
                fill={
                  reached && !disabled
                    ? 'oklch(1 0 0 / 0.85)'
                    : 'oklch(0.7 0.02 160 / 0.4)'
                }
              />
            )
          })}
        </svg>

        {/* Marcador (thumb) posicionado en % sobre el contenedor */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={0}
          aria-valuemax={lastIndex}
          aria-valuenow={selectedIndex}
          aria-valuetext={levels[selectedIndex].label}
          aria-label="Porcentaje de tu banca que arriesgas por apuesta"
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
          className={cn(
            'group absolute grid h-16 w-16 place-items-center rounded-full outline-none',
            smooth && 'transition-[left,top] duration-200 ease-out',
            showHint && !disabled && 'animate-betai-drag-hint',
          )}
          style={{
            left: `${(thumb.x / VB_W) * 100}%`,
            top: `${(thumb.y / 172) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Glow */}
          <span
            aria-hidden
            className={cn(
              'absolute h-12 w-12 rounded-full bg-primary/40 blur-md transition-opacity duration-200',
              disabled ? 'opacity-0' : dragging ? 'opacity-100' : 'opacity-70',
            )}
          />
          {/* Anillo de enfoque dorado */}
          <span
            aria-hidden
            className="absolute h-14 w-14 rounded-full ring-2 ring-[var(--color-gold)] opacity-0 transition-opacity group-focus-visible:opacity-100"
          />
          {/* Cuerpo */}
          <span
            className={cn(
              'relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-[var(--color-brand-bright)] to-primary ring-1 ring-[var(--color-gold)]/40 transition-transform duration-150',
              'shadow-[0_1px_0_0_oklch(1_0_0/0.35)_inset,0_8px_20px_-6px_oklch(0_0_0/0.6),0_0_22px_-4px_oklch(0.735_0.168_152/0.85)]',
              disabled
                ? 'from-muted-foreground/50 to-muted-foreground/40 ring-0 shadow-none'
                : dragging
                  ? 'scale-110'
                  : 'group-hover:scale-105',
            )}
          >
            <span
              aria-hidden
              className="h-3 w-3 rounded-full bg-primary-foreground/90 shadow-[0_0_6px_0_oklch(1_0_0/0.4)]"
            />
          </span>
        </div>

        {/* Indicación de interacción */}
        {!disabled && (
          <div
            className={cn(
              'pointer-events-none absolute left-1/2 top-[58%] flex -translate-x-1/2 items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.28em] text-muted-foreground transition-opacity duration-300',
              dragging ? 'opacity-0' : 'opacity-80',
            )}
          >
            <span>Desliza</span>
            <span aria-hidden className="animate-betai-hint-arrow text-secondary">
              ↔
            </span>
          </div>
        )}
      </div>

      {/* CONTROL HORIZONTAL sincronizado */}
      <div className="mt-6 w-full max-w-[340px]">
        <div
          className="relative flex h-12 touch-none items-center"
          style={{ cursor: disabled ? 'default' : 'pointer' }}
          onPointerDown={beginBar}
          onPointerMove={moveBar}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            ref={barTrackRef}
            className="relative h-2.5 w-full rounded-full bg-[var(--color-surface-2)] shadow-[0_1px_1px_0_oklch(0_0_0/0.35)_inset]"
          >
            <div
              className={cn(
                'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-brand-deep)] via-primary to-[var(--color-brand-bright)]',
                smooth && 'transition-[width] duration-200 ease-out',
              )}
              style={{
                width: `${ratio * 100}%`,
                boxShadow: disabled
                  ? 'none'
                  : '0 0 12px -2px oklch(0.735 0.168 152 / 0.7)',
              }}
            />
            {/* Puntos de nivel */}
            {levels.map((lvl, i) => {
              const pct = (i / lastIndex) * 100
              const reached = i <= selectedIndex
              return (
                <span
                  key={lvl.value}
                  aria-hidden
                  className={cn(
                    'absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full',
                    reached && !disabled
                      ? 'bg-primary-foreground/70'
                      : 'bg-muted-foreground/35',
                  )}
                  style={{ left: `${pct}%` }}
                />
              )
            })}
            {/* Thumb de la barra */}
            <span
              aria-hidden
              className={cn(
                'absolute top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-b from-[var(--color-brand-bright)] to-primary ring-1 ring-[var(--color-gold)]/40',
                smooth && 'transition-[left] duration-200 ease-out',
                disabled
                  ? 'from-muted-foreground/50 to-muted-foreground/40 ring-0'
                  : 'shadow-[0_4px_12px_-4px_oklch(0_0_0/0.55),0_0_16px_-4px_oklch(0.735_0.168_152/0.8)]',
              )}
              style={{ left: `${ratio * 100}%` }}
            >
              <span className="h-2 w-2 rounded-full bg-primary-foreground/90" />
            </span>
          </div>
        </div>

        {/* Etiquetas de cada nivel: la activa se destaca */}
        <div className="mt-3 flex justify-between">
          {levels.map((lvl, i) => {
            const isActive = i === selectedIndex
            return (
              <button
                key={lvl.value}
                type="button"
                disabled={disabled}
                onClick={() => onChange(i)}
                className={cn(
                  'flex-1 text-center text-sm font-bold tracking-tight transition-all duration-200',
                  disabled
                    ? 'text-muted-foreground/50'
                    : isActive
                      ? 'scale-110 text-secondary'
                      : 'text-muted-foreground/60 hover:text-muted-foreground',
                )}
              >
                {lvl.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
