import type { Metadata } from 'next'
import { PlanFlow } from '@/components/post-quiz/plan-flow'

export const metadata: Metadata = {
  title: 'Preparando tu plan | BetAI',
  description:
    'Estamos cruzando tu perfil con BetAI para preparar tu plan personalizado.',
}

export default function PlanPage() {
  return <PlanFlow />
}
