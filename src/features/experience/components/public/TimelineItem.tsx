import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Award, Milestone } from 'lucide-react'
import type { ExperienceRow, ExperienceType } from '@/types/domain'

const TYPE_ICON: Record<ExperienceType, typeof Briefcase> = {
  role: Briefcase,
  project_milestone: Milestone,
  education: GraduationCap,
  certification: Award,
}

function formatRange(start: string, end: string | null, isCurrent: boolean) {
  const startLabel = format(new Date(start), 'MMM yyyy')
  if (isCurrent || !end) return `${startLabel} — Present`
  return `${startLabel} — ${format(new Date(end), 'MMM yyyy')}`
}

export function TimelineItem({ entry, isLast }: { entry: ExperienceRow; isLast: boolean }) {
  const Icon = TYPE_ICON[entry.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4 }}
      className="relative flex gap-4 pb-10"
    >
      <div className="flex flex-col items-center">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card">
          <Icon className="size-4 text-muted-foreground" />
        </span>
        {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
      </div>

      <div className="flex-1 pb-2">
        <p className="text-xs font-medium text-muted-foreground">
          {formatRange(entry.start_date, entry.end_date, entry.is_current)}
        </p>
        <h3 className="mt-0.5 font-semibold">{entry.title}</h3>
        {entry.organization && (
          <p className="text-sm text-muted-foreground">
            {entry.organization}
            {entry.location ? ` · ${entry.location}` : ''}
          </p>
        )}
        {entry.description && <p className="mt-2 text-sm text-muted-foreground">{entry.description}</p>}
        {entry.highlights.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {entry.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}
