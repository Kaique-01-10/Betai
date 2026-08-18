// Cálculo del perfil del apostador a partir de las respuestas del quiz.
//
// REGLAS:
// - Es DETERMINISTA: las mismas respuestas producen siempre el mismo perfil.
//   No hay aleatoriedad, por lo que recargar la página no cambia el resultado.
// - No inventa ni altera las respuestas: sólo las lee.
// - El scoring está centralizado y es fácil de editar (ver SCORE_TABLE).

export type RiskClass = 'ESTABLE' | 'EN_RIESGO' | 'CRITICO'

export interface BettorProfile {
  title: string
  description: string
  classification: RiskClass
  // Puntaje de riesgo normalizado 0–100 (útil para la barra visual).
  riskScore: number
}

// Respuestas del quiz, indexadas por número de etapa (multi = separado por comas).
export type QuizAnswers = Record<number, string>

// ── Tabla de puntajes de riesgo (editable) ──────────────────────────────
// Puntaje más alto = comportamiento más arriesgado / descontrolado.
const SCORE_TABLE: Record<number, Record<string, number>> = {
  // Etapa 8 · % de banca arriesgada por apuesta
  8: { '2': 0, '10': 8, '20': 16, '20+': 22, 'sin-patron': 20 },
  // Etapa 12 · tiempo para volver a apostar tras un RED
  12: { 'dia-siguiente': 0, 'unas-horas': 10, 'justo-despues': 20 },
  // Etapa 13 · evolución de la banca
  13: { multiplico: 0, 'subio-poco': 6, igual: 12, redujo: 22 },
  // Etapa 10 · frecuencia
  10: { ocasional: 0, 'fines-semana': 6, diario: 12 },
}

// Métodos (etapa 9) que suman riesgo cuando aparecen.
const METHOD_RISK: Record<string, number> = {
  intuicion: 10,
  amigo: 8,
  'sin-metodo': 12,
  telegram: 6,
  estadisticas: -6, // analizar reduce el riesgo
}

const MAX_SCORE = 22 + 20 + 22 + 12 + 12 // suma de los máximos posibles

function parseMulti(value: string | undefined): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

// Deriva un título de perfil estable según el método dominante declarado.
function deriveTitle(answers: QuizAnswers): string {
  const methods = parseMulti(answers[9])
  if (methods.includes('estadisticas') && methods.length === 1) {
    return 'APOSTADOR ANALÍTICO'
  }
  if (methods.includes('sin-metodo')) return 'APOSTADOR SIN MÉTODO'
  if (methods.includes('amigo')) return 'APOSTADOR POR INFLUENCIA'
  if (methods.includes('telegram')) return 'APOSTADOR DE TIPS'
  // Por defecto (incluye "intuición"), el perfil más común del público.
  return 'APOSTADOR POR INTUICIÓN'
}

export function computeProfile(answers: QuizAnswers): BettorProfile {
  let raw = 0

  for (const stepKey of Object.keys(SCORE_TABLE)) {
    const step = Number(stepKey)
    const value = answers[step]
    if (value && SCORE_TABLE[step][value] !== undefined) {
      raw += SCORE_TABLE[step][value]
    }
  }

  // Métodos: se acumula el riesgo de cada método marcado.
  for (const method of parseMulti(answers[9])) {
    raw += METHOD_RISK[method] ?? 0
  }

  const riskScore = Math.max(
    0,
    Math.min(100, Math.round((raw / MAX_SCORE) * 100)),
  )

  // Umbrales de clasificación (editables).
  let classification: RiskClass = 'ESTABLE'
  if (riskScore >= 66) classification = 'CRITICO'
  else if (riskScore >= 33) classification = 'EN_RIESGO'

  const title = deriveTitle(answers)

  return {
    title,
    description:
      'Llevas años apostando, pero todavía tomas muchas decisiones por intuición. Tu banca sube y baja sin un patrón claro.',
    classification,
    riskScore,
  }
}

// Etiquetas legibles de cada clasificación (para la UI).
export const RISK_CLASS_LABEL: Record<RiskClass, string> = {
  ESTABLE: 'ESTABLE',
  EN_RIESGO: 'EN RIESGO',
  CRITICO: 'CRÍTICO',
}
