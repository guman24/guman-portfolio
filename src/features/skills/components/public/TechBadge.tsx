import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DynamicIcon } from '@/components/DynamicIcon'
import { cn } from '@/lib/utils'
import type { SkillRow } from '@/types/domain'

export function TechBadge({ skill }: { skill: SkillRow }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:border-foreground/30" />
        }
      >
        <DynamicIcon iconName={skill.icon_name} className="size-4 text-muted-foreground" />
        <span className="font-medium">{skill.name}</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-56 space-y-1.5">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'size-1.5 rounded-full',
                i < skill.proficiency ? 'bg-current' : 'bg-current/20',
              )}
            />
          ))}
          {skill.years_experience != null && (
            <span className="ml-1 text-xs opacity-70">{skill.years_experience}y</span>
          )}
        </div>
        {skill.description && <p className="text-xs opacity-80">{skill.description}</p>}
      </TooltipContent>
    </Tooltip>
  )
}
