import { useSkills } from '@/features/skills/hooks/useSkills'
import { SkillGroup } from '@/features/skills/components/public/SkillGroup'
import { StackSection } from '@/features/skills/components/public/StackSection'
import type { SkillDomain } from '@/types/supabase'

const DOMAIN_LABELS: Record<Exclude<SkillDomain, 'daily_tools'>, string> = {
  mobile: 'Mobile',
  frontend: 'Frontend',
  backend: 'Backend',
  cloud_devops: 'Cloud & DevOps',
}

const DOMAIN_ORDER: Exclude<SkillDomain, 'daily_tools'>[] = [
  'mobile',
  'frontend',
  'backend',
  'cloud_devops',
]

export function SkillsSection() {
  const { data: skills } = useSkills()

  if (!skills || skills.length === 0) return null

  const dailyTools = skills.filter((s) => s.domain === 'daily_tools')

  return (
    <section id="skills" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Skills & Approach</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Grounded in shipping production apps end-to-end — mobile, frontend, backend, and the
        infrastructure that keeps them running.
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {DOMAIN_ORDER.map((domain) => (
          <SkillGroup
            key={domain}
            title={DOMAIN_LABELS[domain]}
            skills={skills.filter((s) => s.domain === domain)}
          />
        ))}
      </div>

      <StackSection tools={dailyTools} />
    </section>
  )
}
