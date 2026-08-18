import { cn } from '@/lib/utils'

export function BetaiLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex select-none items-center text-[1.6rem] font-extrabold leading-none tracking-[-0.03em]',
        className,
      )}
      aria-label="BetAI"
    >
      <span className="text-foreground">Bet</span>
      <span className="relative ml-1 inline-flex items-center overflow-hidden rounded-[7px] px-[7px] py-[3px] text-primary-foreground">
        {/* Cuerpo del sello con degradado de marca */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-[7px] bg-gradient-to-b from-[var(--color-brand-bright)] to-primary"
        />
        {/* Reflejo superior sutil */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-[7px] bg-white/20"
        />
        {/* Hilo dorado inferior */}
        <span
          aria-hidden
          className="absolute inset-x-[3px] bottom-[2px] h-[1.5px] rounded-full bg-[var(--color-gold)]/80"
        />
        <span className="relative tracking-[-0.02em]">AI</span>
      </span>
    </div>
  )
}
