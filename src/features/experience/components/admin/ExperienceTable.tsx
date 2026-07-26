import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
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
import { useAdminExperience } from '@/features/experience/hooks/useAdminExperience'
import { useExperienceMutations } from '@/features/experience/hooks/useExperienceMutations'
import type { ExperienceRow } from '@/types/domain'

export function ExperienceTable({ onEdit }: { onEdit: (entry: ExperienceRow) => void }) {
  const { data: entries } = useAdminExperience()
  const { remove } = useExperienceMutations()
  const [pendingDelete, setPendingDelete] = useState<ExperienceRow | null>(null)

  if (!entries || entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No timeline entries yet.</p>
  }

  async function handleDelete() {
    if (!pendingDelete) return
    try {
      await remove.mutateAsync(pendingDelete.id)
      toast.success('Entry deleted.')
    } catch {
      toast.error('Failed to delete entry.')
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <>
      <div className="divide-y divide-border rounded-lg border border-border">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1">
              <p className="font-medium">{entry.title}</p>
              <p className="text-xs text-muted-foreground">
                {entry.organization ? `${entry.organization} · ` : ''}
                {format(new Date(entry.start_date), 'MMM yyyy')} —{' '}
                {entry.is_current || !entry.end_date
                  ? 'Present'
                  : format(new Date(entry.end_date), 'MMM yyyy')}
              </p>
            </div>
            {!entry.published && <Badge variant="secondary">Draft</Badge>}
            <Button size="icon-sm" variant="ghost" onClick={() => onEdit(entry)}>
              <Pencil className="size-3.5" />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => setPendingDelete(entry)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{pendingDelete?.title}"?</AlertDialogTitle>
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
