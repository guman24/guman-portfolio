import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SkillTable } from '@/features/skills/components/admin/SkillTable'
import { SkillForm } from '@/features/skills/components/admin/SkillForm'
import { useSkillMutations } from '@/features/skills/hooks/useSkillMutations'
import type { SkillFormValues } from '@/lib/validation/skill.schema'
import type { SkillRow } from '@/types/domain'

const EMPTY_VALUES: SkillFormValues = {
  name: '',
  domain: 'frontend',
  proficiency: 3,
  years_experience: undefined,
  icon_name: '',
  description: '',
  published: true,
}

function toFormValues(skill: SkillRow): SkillFormValues {
  return {
    name: skill.name,
    domain: skill.domain,
    proficiency: skill.proficiency,
    years_experience: skill.years_experience ?? undefined,
    icon_name: skill.icon_name ?? '',
    description: skill.description ?? '',
    published: skill.published,
  }
}

export function SkillsPage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<SkillRow | null>(null)
  const { create, update } = useSkillMutations()

  function openCreate() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(skill: SkillRow) {
    setEditing(skill)
    setOpen(true)
  }

  async function handleSubmit(values: SkillFormValues) {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, values })
        toast.success('Skill saved.')
      } else {
        const maxSortOrder = 0
        await create.mutateAsync({ ...values, sort_order: maxSortOrder })
        toast.success('Skill added.')
      }
      setOpen(false)
    } catch {
      toast.error('Failed to save skill.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Skills</h1>
          <p className="text-muted-foreground">Grouped by domain — use the arrows to reorder.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New skill
        </Button>
      </div>

      <SkillTable onEdit={openEdit} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit skill' : 'New skill'}</DialogTitle>
          </DialogHeader>
          <SkillForm
            key={editing?.id ?? 'new'}
            defaultValues={editing ? toFormValues(editing) : EMPTY_VALUES}
            onSubmit={handleSubmit}
            isSubmitting={create.isPending || update.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
