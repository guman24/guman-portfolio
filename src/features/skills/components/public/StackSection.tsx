import type { SkillRow } from '@/types/domain'
import { SkillGroup } from '@/features/skills/components/public/SkillGroup'

export function StackSection({ tools }: { tools: SkillRow[] }) {
  if (tools.length === 0) return null

  return (
    <div className="mt-10 rounded-xl border border-dashed border-border p-6">
      <p className="mb-4 text-sm text-muted-foreground">
        My daily setup — the tools I reach for every day.
      </p>
      <SkillGroup title="Daily tools" skills={tools} />
    </div>
  )
}
