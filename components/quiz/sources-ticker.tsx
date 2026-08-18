'use client'

/**
 * Ticker horizontal infinito de fuentes deportivas analizadas por BetAI.
 * - Se mueve de DERECHA → IZQUIERDA a velocidad constante.
 * - La lista se duplica internamente y la animación recorre -50%, por lo que
 *   el loop es perfecto y sin salto perceptible.
 * - Usa logos oficiales reales (descargados a /public/sources). Para editar la
 *   lista, basta con modificar SOURCES abajo.
 */

type Source = {
  name: string
  src: string
  /** Ancho relativo dentro del chip: 'wide' para wordmarks, 'mark' para íconos. */
  variant?: 'wide' | 'mark'
}

// Fuentes analizadas. Fácilmente editable: agrega/quita entradas aquí.
const SOURCES: Source[] = [
  { name: 'SofaScore', src: '/sources/sofascore.png', variant: 'mark' },
  { name: 'Flashscore', src: '/sources/flashscore.png', variant: 'mark' },
  { name: 'FotMob', src: '/sources/fotmob.svg', variant: 'mark' },
  { name: 'FBref', src: '/sources/fbref.png', variant: 'mark' },
  { name: 'Transfermarkt', src: '/sources/transfermarkt.png', variant: 'wide' },
  { name: '365Scores', src: '/sources/365scores.png', variant: 'mark' },
  { name: 'FootyStats', src: '/sources/footystats.png', variant: 'mark' },
  { name: 'Lance', src: '/sources/lance.png', variant: 'mark' },
  { name: 'Oddspedia', src: '/sources/oddspedia.jpg', variant: 'mark' },
]

function SourceChip({ source }: { source: Source }) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-center rounded-2xl border border-hairline bg-[var(--color-surface)]/70 px-6 shadow-[0_1px_0_0_oklch(1_0_0/0.04)_inset] backdrop-blur-sm">
      <img
        src={source.src || '/placeholder.svg'}
        alt={`Logo de ${source.name}`}
        loading="lazy"
        draggable={false}
        className={`w-auto select-none object-contain opacity-90 ${
          source.variant === 'wide' ? 'h-5 sm:h-6' : 'h-7 sm:h-8'
        }`}
      />
    </div>
  )
}

export function SourcesTicker() {
  // Se renderiza la lista dos veces para el loop continuo sin costura.
  const loop = [...SOURCES, ...SOURCES]

  return (
    <div
      className="relative w-full overflow-hidden"
      // Máscara de desvanecido en ambos bordes para un efecto premium.
      style={{
        maskImage:
          'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
      }}
      aria-label="Fuentes deportivas analizadas por BetAI"
    >
      <div className="betai-marquee-track gap-3 sm:gap-4">
        {loop.map((source, i) => (
          <SourceChip key={`${source.name}-${i}`} source={source} />
        ))}
      </div>
    </div>
  )
}
