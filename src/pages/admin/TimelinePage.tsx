import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ExperienceTable } from '@/features/experience/components/admin/ExperienceTable'
import { ExperienceForm } from '@/features/experience/components/admin/ExperienceForm'
import { useExperienceMutations } from '@/features/experience/hooks/useExperienceMutations'
import type { ExperienceFormValues } from '@/lib/validation/experience.schema'
import type { ExperienceRow } from '@/types/domain'

const EMPTY_VALUES: ExperienceFormValues = {
  type: 'role',
  title: '',
  organization: '',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  highlights: [],
  published: true,
}

function toFormValues(entry: ExperienceRow): ExperienceFormValues {
  return {
    type: entry.type,
    title: entry.title,
    organization: entry.organization ?? '',
    location: entry.location ?? '',
    start_date: entry.start_date,
    end_date: entry.end_date ?? '',
    is_current: entry.is_current,
    description: entry.description ?? '',
    highlights: entry.highlights,
    published: entry.published,
  }
}

export function TimelinePage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ExperienceRow | null>(null)
  const { create, update } = useExperienceMutations()

  function openCreate() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(entry: ExperienceRow) {
    setEditing(entry)
    setOpen(true)
  }

  async function handleSubmit(values: ExperienceFormValues) {
    try {
      const payload = { ...values, end_date: values.is_current ? null : values.end_date || null }
      if (editing) {
        await update.mutateAsync({ id: editing.id, values: payload })
        toast.success('Entry saved.')
      } else {
        await create.mutateAsync(payload)
        toast.success('Entry added.')
      }
      setOpen(false)
    } catch {
      toast.error('Failed to save entry.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Timeline</h1>
          <p className="text-muted-foreground">Roles, milestones, and education.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New entry
        </Button>
      </div>

      <ExperienceTable onEdit={openEdit} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit entry' : 'New entry'}</DialogTitle>
          </DialogHeader>
          <ExperienceForm
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
