'use client'

import { VIMEO_ASPECT_RATIO } from '@/lib/betai/config'

interface VideoFrameProps {
  // ID numérico del video de Vimeo. Si está vacío, se muestra el placeholder.
  vimeoId?: string
  // Proporción ancho/alto del marco. Por defecto, el formato vertical original.
  aspectRatio?: string
  label?: string
}

// Marco de video premium: bordes redondeados y glow verde sutil.
// Embebe el video de Vimeo respetando SIEMPRE su proporción original
// (vertical), sin recortes ni deformación.
export function VideoFrame({
  vimeoId,
  aspectRatio = VIMEO_ASPECT_RATIO,
  label = 'Video de demostración',
}: VideoFrameProps) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Glow verde detrás del marco */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-[26px] bg-primary/15 blur-2xl"
      />
      <div
        className="relative w-full overflow-hidden rounded-3xl border border-hairline bg-[var(--color-surface-2)] shadow-[0_1px_0_0_oklch(1_0_0/0.05)_inset,0_30px_70px_-30px_oklch(0_0_0/0.8)]"
        style={{ aspectRatio }}
      >
        {/* Borde superior iluminado */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />

        {vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
            title={label}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          // Placeholder premium (sin video configurado)
          <div className="absolute inset-0 grid place-items-center">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  'radial-gradient(120% 80% at 50% 0%, oklch(0.66 0.14 164 / 0.15) 0%, transparent 55%)',
              }}
            />
            <div className="relative flex flex-col items-center gap-4">
              <PlayButton decorative />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PlayButton({ decorative }: { decorative?: boolean }) {
  return (
    <span
      className={
        'relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-b from-[var(--color-brand-bright)] to-primary shadow-[0_10px_30px_-8px_oklch(0.66_0.14_164/0.85)] transition-transform duration-200' +
        (decorative ? '' : ' group-hover:scale-105')
      }
    >
      <span
        aria-hidden
        className="animate-betai-glow-breathe absolute inset-0 rounded-full bg-primary/30 blur-lg"
      />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="relative ml-1">
        <path d="M8 5v14l11-7L8 5z" fill="var(--color-primary-foreground)" />
      </svg>
    </span>
  )
}
