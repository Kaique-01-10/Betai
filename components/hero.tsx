import { BetaiLogo } from '@/components/betai-logo'
import { AccessCta } from '@/components/access-cta'

export function Hero() {
  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Fondo: profundidad grafito + iluminación ambiental verde muy discreta */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Degradado base para profundidad */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% -10%, oklch(0.24 0.03 158 / 0.7) 0%, transparent 55%), linear-gradient(180deg, oklch(0.17 0.016 162) 0%, oklch(0.14 0.013 162) 100%)',
          }}
        />
        {/* Luz ambiental superior */}
        <div className="animate-betai-ambient absolute -top-40 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-primary/12 blur-[130px]" />
        {/* Acento dorado muy tenue */}
        <div className="absolute -bottom-20 right-[-60px] h-[320px] w-[320px] rounded-full bg-[var(--color-gold)]/[0.05] blur-[130px]" />
        {/* Viñeta inferior */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(100% 60% at 50% 120%, oklch(0 0 0 / 0.35) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Encabezado */}
      <header className="animate-betai-fade-up relative z-10 flex items-center justify-center px-6 pt-8 sm:justify-start sm:px-10">
        <BetaiLogo />
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex w-full max-w-xl flex-col items-center gap-6">
          <span
            className="animate-betai-fade-up inline-flex items-center gap-2 rounded-full border border-hairline bg-[var(--color-surface)]/70 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm sm:text-xs"
            style={{ animationDelay: '0.05s' }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Análisis deportivo con IA
          </span>

          <h1
            className="animate-betai-fade-up text-balance text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.035em] sm:text-6xl"
            style={{ animationDelay: '0.12s' }}
          >
            La IA que analiza las{' '}
            <span className="bg-gradient-to-r from-[var(--color-brand-bright)] via-primary to-[var(--color-gold)] bg-clip-text text-transparent">
              estadísticas
            </span>{' '}
            por ti.
          </h1>

          <p
            className="animate-betai-fade-up max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: '0.2s' }}
          >
            +100 sitios deportivos analizados en tiempo real. Apuesta lista en la
            app con un solo clic.
          </p>

          <div
            className="animate-betai-fade-up mt-4 flex w-full max-w-md flex-col items-center gap-3"
            style={{ animationDelay: '0.3s' }}
          >
            <AccessCta href="/quiz" />
            <p className="flex items-center gap-2.5 text-xs font-semibold tracking-wide text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-secondary" />
                <span className="text-secondary">2 min</span>
              </span>
              <span className="h-3 w-px bg-hairline" />
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-primary" />
                <span className="text-primary">100% gratis</span>
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
