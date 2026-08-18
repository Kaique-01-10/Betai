'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface TimelineOption {
  value: string
  label: string
  short: string
}

interface TimelineSliderProps {
  options: TimelineOption[]
  selectedIndex: number | null
  onChange: (index: number) => void
}

export function TimelineSlider({
  options,
  selectedIndex,
  onChange,
}: TimelineSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const hasSelection = selectedIndex !== null
  const lastIndex = options.length - 1

  // Posición del marcador: si no hay selección, se muestra al inicio.
  const activeIndex = selectedIndex ?? 0
  const thumbPct = (activeIndex / lastIndex) * 100

  const setFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const ratio = (clientX - rect.left) / rect.width
      const clamped = Math.min(1, Math.max(0, ratio))
      const index = Math.round(clamped * lastIndex)
      onChange(index)
    },
    [lastIndex, onChange],
  )

  // Capturamos el puntero en el propio contenedor (no en el elemento tocado)
  // para que el arrastre no se trabe al presionar sobre el marcador o sus capas.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    areaRef.current?.setPointerCapture(e.pointerId)
    draggingRef.current = true
    setDragging(true)
    setFromClientX(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    setFromClientX(e.clientX)
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (areaRef.current?.hasPointerCapture(e.pointerId)) {
      areaRef.current.releasePointerCapture(e.pointerId)
    }
    draggingRef.current = false
    setDragging(false)
  }

  // Soporte de teclado para accesibilidad.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(Math.min(lastIndex, activeIndex + 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(Math.max(0, activeIndex - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      onChange(lastIndex)
    }
  }

  // Muestra la pista de arrastre solo hasta la primera interacción.
  const [showHint, setShowHint] = useState(true)
  useEffect(() => {
    if (hasSelection) setShowHint(false)
  }, [hasSelection])

  return (
    <div className="flex w-full select-none flex-col gap-9">
      {/* Valor seleccionado, grande y en tiempo real */}
      <div className="flex min-h-[76px] flex-col items-center justify-center gap-1 text-center">
        {hasSelection ? (
          <>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Tu respuesta
            </span>
            <span
              key={selectedIndex}
              className="animate-betai-fade-up bg-gradient-to-r from-primary via-[var(--color-brand-bright)] to-[var(--color-gold)] bg-clip-text text-3xl font-extrabold tracking-[-0.02em] text-transparent sm:text-[2.5rem]"
            >
              {options[selectedIndex].label}
            </span>
          </>
        ) : (
          <span className="text-lg font-semibold text-muted-foreground">
            Desliza para elegir
          </span>
        )}
      </div>

      {/* Pista del slider */}
      <div className="relative px-1 pt-2 pb-1">
        {/* Área de toque amplia */}
        <div
          ref={areaRef}
          className="relative flex h-16 cursor-pointer touch-none items-center"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* Línea base */}
          <div
            ref={trackRef}
            className="relative h-3 w-full rounded-full bg-[var(--color-surface-2)] shadow-[0_1px_1px_0_oklch(0_0_0/0.35)_inset,0_1px_0_0_oklch(1_0_0/0.04)]"
          >
            {/* Relleno activo */}
            <div
              className={cn(
                'absolute inset-y-0 left-0 overflow-hidden rounded-full bg-gradient-to-r from-[var(--color-brand-deep)] via-primary to-[var(--color-brand-bright)]',
                !dragging && 'transition-[width] duration-200 ease-out',
              )}
              style={{
                width: hasSelection ? `${thumbPct}%` : '0%',
                boxShadow: hasSelection
                  ? '0 0 14px -2px oklch(0.735 0.168 152 / 0.75)'
                  : 'none',
              }}
            >
              {/* Reflejo superior del relleno */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/15"
              />
            </div>

            {/* Marcas de las categorías */}
            {options.map((opt, i) => {
              const pct = (i / lastIndex) * 100
              const reached = hasSelection && i <= selectedIndex
              return (
                <span
                  key={opt.value}
                  aria-hidden
                  className={cn(
                    'absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200',
                    reached
                      ? 'bg-primary-foreground/70'
                      : 'bg-muted-foreground/35',
                  )}
                  style={{ left: `${pct}%` }}
                />
              )
            })}

            {/* Marcador (thumb) */}
            <button
              type="button"
              role="slider"
              aria-valuemin={0}
              aria-valuemax={lastIndex}
              aria-valuenow={activeIndex}
              aria-valuetext={
                hasSelection ? options[activeIndex].label : 'Sin seleccionar'
              }
              aria-label="¿Hace cuánto tiempo apuestas en fútbol?"
              onKeyDown={handleKeyDown}
              className={cn(
                'group absolute top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 touch-none place-items-center rounded-full outline-none',
                !dragging && 'transition-[left] duration-200 ease-out',
                showHint && !hasSelection && 'animate-betai-drag-hint',
              )}
              style={{ left: `${thumbPct}%` }}
            >
              {/* Halo/glow suave */}
              <span
                aria-hidden
                className={cn(
                  'absolute h-11 w-11 rounded-full bg-primary/25 blur-md transition-opacity duration-200',
                  dragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-70',
                  !hasSelection && 'animate-betai-thumb-pulse opacity-70',
                )}
              />
              {/* Anillo de enfoque dorado */}
              <span
                aria-hidden
                className="absolute h-12 w-12 rounded-full ring-2 ring-[var(--color-gold)] opacity-0 transition-opacity group-focus-visible:opacity-100"
              />
              {/* Cuerpo del marcador */}
              <span
                className={cn(
                  'relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-[var(--color-brand-bright)] to-primary ring-1 ring-[var(--color-gold)]/40 transition-transform duration-150',
                  'shadow-[0_1px_0_0_oklch(1_0_0/0.35)_inset,0_6px_16px_-4px_oklch(0_0_0/0.55),0_0_18px_-4px_oklch(0.735_0.168_152/0.8)]',
                  dragging ? 'scale-110' : 'group-hover:scale-105',
                )}
              >
                {/* Núcleo claro */}
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full bg-primary-foreground/90 shadow-[0_0_6px_0_oklch(1_0_0/0.4)]"
                />
              </span>
            </button>
          </div>
        </div>

        {/* Etiquetas de las categorías */}
        <div className="mt-6 flex justify-between gap-1">
          {options.map((opt, i) => {
            const isActive = hasSelection && i === selectedIndex
            const align =
              i === 0
                ? 'items-start text-left'
                : i === lastIndex
                  ? 'items-end text-right'
                  : 'items-center text-center'
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(i)}
                className={cn(
                  'flex flex-1 flex-col leading-tight transition-colors duration-200',
                  align,
                )}
              >
                <span
                  className={cn(
                    'text-[11px] font-semibold tracking-tight transition-colors duration-200 sm:text-xs',
                    isActive
                      ? 'text-secondary'
                      : 'text-muted-foreground/70 hover:text-muted-foreground',
                  )}
                >
                  {opt.short}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
