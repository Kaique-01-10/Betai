'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface ScratchCardProps {
  // Si ya fue revelada (estado del servidor), no se dibuja la cobertura.
  revealed: boolean
  // Se llama UNA sola vez al alcanzar el umbral de revelado.
  onReveal: () => void
  // Porcentaje de área raspada para revelar automáticamente (0–1).
  threshold?: number
  // Contenido del premio (debajo de la cobertura).
  children: React.ReactNode
}

// Raspadinha digital real usando <canvas> y composición destination-out.
// Funciona con toque (iPhone/Android) y mouse (desktop) vía Pointer Events.
export function ScratchCard({
  revealed,
  onReveal,
  threshold = 0.7,
  children,
}: ScratchCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
  const revealedRef = useRef(revealed)
  const [cleared, setCleared] = useState(revealed)

  // Pinta la cobertura metálica premium sobre el canvas.
  const paintCover = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { width, height } = canvas
    ctx.globalCompositeOperation = 'source-over'
    ctx.clearRect(0, 0, width, height)

    // Base metálica con degradado diagonal
    const g = ctx.createLinearGradient(0, 0, width, height)
    g.addColorStop(0, '#5c6169')
    g.addColorStop(0.35, '#868c95')
    g.addColorStop(0.5, '#9ba1a9')
    g.addColorStop(0.65, '#787e87')
    g.addColorStop(1, '#565b63')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, width, height)

    // Textura de ruido sutil (puntos claros/oscuros)
    for (let i = 0; i < (width * height) / 900; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      ctx.fillStyle =
        Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
      ctx.fillRect(x, y, 1.5, 1.5)
    }

    // Brillo diagonal
    const sheen = ctx.createLinearGradient(0, 0, width, height)
    sheen.addColorStop(0, 'rgba(255,255,255,0)')
    sheen.addColorStop(0.45, 'rgba(255,255,255,0.14)')
    sheen.addColorStop(0.55, 'rgba(255,255,255,0.05)')
    sheen.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = sheen
    ctx.fillRect(0, 0, width, height)

    // Texto "RASPA AQUÍ"
    const dpr = width / canvas.clientWidth || 1
    ctx.fillStyle = 'rgba(20,24,28,0.55)'
    ctx.font = `700 ${13 * dpr}px ui-sans-serif, system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.letterSpacing = `${3 * dpr}px`
    ctx.fillText('RASPA AQUÍ', width / 2, height / 2)
  }, [])

  // Configura el tamaño real del canvas (con devicePixelRatio) y pinta.
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const rect = wrap.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)
    paintCover(canvas)
  }, [paintCover])

  useEffect(() => {
    revealedRef.current = revealed
    if (revealed) setCleared(true)
  }, [revealed])

  useEffect(() => {
    if (cleared) return
    setupCanvas()
    const onResize = () => setupCanvas()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [cleared, setupCanvas])

  // Calcula el porcentaje raspado leyendo el canal alfa.
  const computeScratched = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return 0
    const ctx = canvas.getContext('2d')
    if (!ctx) return 0
    const { width, height } = canvas
    const img = ctx.getImageData(0, 0, width, height).data
    let transparent = 0
    // Muestreo cada 16 píxeles para rendimiento.
    const step = 16
    let sampled = 0
    for (let i = 3; i < img.length; i += 4 * step) {
      sampled++
      if (img[i] === 0) transparent++
    }
    return sampled ? transparent / sampled : 0
  }, [])

  const doReveal = useCallback(() => {
    if (revealedRef.current) return
    revealedRef.current = true
    onReveal()
    // Limpia el resto de la cobertura con una transición suave.
    const canvas = canvasRef.current
    if (canvas) canvas.style.transition = 'opacity 0.45s ease-out'
    setTimeout(() => setCleared(true), 60)
  }, [onReveal])

  const pointerPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const dpr = canvas.width / rect.width
    return {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    }
  }

  const scratchLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const radius = 26 * dpr
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = radius * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(to.x, to.y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (cleared || revealedRef.current) return
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    drawing.current = true
    const p = pointerPos(e)
    lastPoint.current = p
    scratchLine(p, p)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current || cleared || revealedRef.current) return
    e.preventDefault()
    const p = pointerPos(e)
    scratchLine(lastPoint.current ?? p, p)
    lastPoint.current = p
    // Chequea el umbral de forma económica.
    if (computeScratched() >= threshold) doReveal()
  }

  const endStroke = () => {
    if (!drawing.current) return
    drawing.current = false
    lastPoint.current = null
    if (!revealedRef.current && computeScratched() >= threshold) doReveal()
  }

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full select-none overflow-hidden rounded-[22px]"
    >
      {/* Premio (debajo) */}
      <div className="absolute inset-0">{children}</div>

      {/* Cobertura raspable */}
      {!cleared && (
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
          onPointerCancel={endStroke}
          className="absolute inset-0 h-full w-full touch-none"
          style={{ cursor: 'grab' }}
          aria-label="Raspa para revelar tu descuento"
        />
      )}
    </div>
  )
}
