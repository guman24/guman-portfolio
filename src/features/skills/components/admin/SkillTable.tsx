import { useState } from 'react'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAdminSkills } from '@/features/skills/hooks/useAdminSkills'
import { useSkillMutations } from '@/features/skills/hooks/useSkillMutations'
import type { SkillRow } from '@/types/domain'

const DOMAIN_LABELS: Record<string, string> = {
  mobile: 'Mobile',
  frontend: 'Frontend',
  backend: 'Backend',
  cloud_devops: 'Cloud & DevOps',
  daily_tools: 'Daily tools',
}

export function SkillTable({ onEdit }: { onEdit: (skill: SkillRow) => void }) {
  const { data: skills } = useAdminSkills()
  const { remove, reorder } = useSkillMutations()
  const [pendingDelete, setPendingDelete] = useState<SkillRow | null>(null)

  if (!skills || skills.length === 0) {
    return <p className="text-sm text-muted-foreground">No skills yet — add your first one.</p>
  }

  const groups = new Map<string, SkillRow[]>()
  for (const skill of skills) {
    const list = groups.get(skill.domain) ?? []
    list.push(skill)
    groups.set(skill.domain, list)
  }

  function move(group: SkillRow[], index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= group.length) return
    const a = group[index]
    const b = group[targetIndex]
    reorder.mutate([
      { id: a.id, sort_order: b.sort_order },
      { id: b.id, sort_order: a.sort_order },
    ])
  }

  async function handleDelete() {
    if (!pendingDelete) return
    try {
      await remove.mutateAsync(pendingDelete.id)
      toast.success('Skill deleted.')
    } catch {
      toast.error('Failed to delete skill.')
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {Array.from(groups.entries()).map(([domain, group]) => (
          <div key={domain}>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              {DOMAIN_LABELS[domain] ?? domain}
            </h3>
            <div className="divide-y divide-border rounded-lg border border-border">
              {group.map((skill, index) => (
                <div key={skill.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => move(group, index, -1)}
                      className="text-muted-foreground disabled:opacity-30"
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === group.length - 1}
                      onClick={() => move(group, index, 1)}
                      className="text-muted-foreground disabled:opacity-30"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                  </div>
                  <span className="flex-1 font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {'★'.repeat(skill.proficiency)}
                    {'☆'.repeat(5 - skill.proficiency)}
                  </span>
                  {!skill.published && <Badge variant="secondary">Draft</Badge>}
                  <Button size="icon-sm" variant="ghost" onClick={() => onEdit(skill)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => setPendingDelete(skill)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{pendingDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
