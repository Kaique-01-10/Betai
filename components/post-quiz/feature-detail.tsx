'use client'

import { PrimaryButton } from '@/components/primary-button'
import { VideoFrame } from '@/components/post-quiz/video-frame'

interface FeatureDetailProps {
  eyebrow: string // "FUNCIONALIDAD 01 / 02"
  title: string
  paragraphs: string[]
  vimeoId?: string
  ctaLabel: string
  onCta: () => void
}

// Contenido de un pullup de funcionalidad (01 o 02), con área de video destacada.
export function FeatureDetail({
  eyebrow,
  title,
  paragraphs,
  vimeoId,
  ctaLabel,
  onCta,
}: FeatureDetailProps) {
  return (
    <div className="flex min-h-full flex-col px-6 pb-8 pt-2">
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          {title}
        </h2>

        {/* Video destacado */}
        <div className="mt-6">
          <VideoFrame vimeoId={vimeoId || undefined} />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={onCta}>{ctaLabel}</PrimaryButton>
      </div>
    </div>
  )
}
