import { useExperience } from '@/features/experience/hooks/useExperience'
import { TimelineItem } from '@/features/experience/components/public/TimelineItem'

export function TimelineSection() {
  const { data: experience } = useExperience()

  if (!experience || experience.length === 0) return null

  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Experience & Milestones</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">Roles, education, and shipped work over time.</p>

      <div className="mt-10 max-w-2xl">
        {experience.map((entry, i) => (
          <TimelineItem key={entry.id} entry={entry} isLast={i === experience.length - 1} />
        ))}
      </div>
    </section>
  )
}
