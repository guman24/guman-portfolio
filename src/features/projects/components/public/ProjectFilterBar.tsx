import { cn } from '@/lib/utils'
import { PROJECT_CATEGORIES } from '@/features/projects/api'
import type { ProjectCategory } from '@/types/domain'

interface ProjectFilterBarProps {
  active: ProjectCategory | 'all'
  onChange: (category: ProjectCategory | 'all') => void
}

export function ProjectFilterBar({ active, onChange }: ProjectFilterBarProps) {
  const options: { value: ProjectCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    ...PROJECT_CATEGORIES,
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
            active === option.value
              ? 'border-foreground bg-foreground text-background'
              : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
