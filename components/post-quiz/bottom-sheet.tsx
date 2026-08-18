'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  // Si es false, no se puede cerrar por gesto/backdrop (p. ej. durante una carga).
  dismissible?: boolean
  children: React.ReactNode
  // Etiqueta accesible del diálogo.
  label?: string
}

// Pullup / bottom sheet premium que sube desde abajo.
// - Ocupa ~88% de la altura en mobile.
// - Se puede cerrar arrastrando hacia abajo, con el botón o tocando el backdrop.
// - Bloquea el scroll del fondo mientras está abierto.
export function BottomSheet({
  open,
  onClose,
  dismissible = true,
  children,
  label = 'Panel',
}: BottomSheetProps) {
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)
  const dragging = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Bloquea el scroll del body mientras el sheet está abierto.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Cierra con Escape.
  useEffect(() => {
    if (!open || !dismissible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, dismissible, onClose])

  if (!open) return null

  const onPointerDown = (e: React.PointerEvent) => {
    if (!dismissible) return
    // Sólo iniciar el arrastre si el contenido está en el tope (evita robar scroll).
    if (scrollRef.current && scrollRef.current.scrollTop > 0) return
    startY.current = e.clientY
    dragging.current = true
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || startY.current === null) return
    const delta = e.clientY - startY.current
    if (delta > 0) setDragY(delta)
  }

  const endDrag = () => {
    if (!dragging.current) return
    dragging.current = false
    startY.current = null
    // Si se arrastró más de 120px, cerrar; si no, volver a su lugar.
    if (dragY > 120) {
      onClose()
    }
    setDragY(0)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={dismissible ? 0 : -1}
        onClick={() => dismissible && onClose()}
        className="animate-betai-backdrop-in absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <div
        className="animate-betai-sheet-up relative flex h-[88svh] w-full max-w-xl flex-col overflow-hidden rounded-t-[28px] border-t border-hairline bg-[var(--color-surface)] shadow-[0_-24px_70px_-20px_oklch(0_0_0/0.85)]"
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragging.current ? 'none' : 'transform 0.32s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Iluminación verde sutil en el borde superior */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-px left-1/2 h-24 w-2/3 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />

        {/* Zona de arrastre + handle */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cn(
            'relative flex shrink-0 items-center justify-center pt-3 pb-2',
            dismissible ? 'cursor-grab touch-none active:cursor-grabbing' : '',
          )}
        >
          <span className="h-1.5 w-11 rounded-full bg-white/20" aria-hidden />
          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar panel"
              className="absolute right-4 top-3 grid h-8 w-8 place-items-center rounded-full border border-hairline bg-white/5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Contenido con scroll */}
        <div ref={scrollRef} className="relative flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  )
}
