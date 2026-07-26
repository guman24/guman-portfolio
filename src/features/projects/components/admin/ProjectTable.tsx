import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
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
import { useAdminProjects } from '@/features/projects/hooks/useAdminProjects'
import { useProjectMutations } from '@/features/projects/hooks/useProjectMutations'
import type { ProjectRow } from '@/types/domain'

function SortableRow({ project, children }: { project: ProjectRow; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'relative z-10 bg-muted' : undefined}
    >
      <TableCell className="w-8">
        <button {...attributes} {...listeners} className="cursor-grab touch-none text-muted-foreground">
          <GripVertical className="size-4" />
        </button>
      </TableCell>
      {children}
    </TableRow>
  )
}

export function ProjectTable() {
  const { data: projects } = useAdminProjects()
  const { update, remove, reorder } = useProjectMutations()
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<ProjectRow | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function handleDragEnd(event: DragEndEvent) {
    if (!projects) return
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = projects.findIndex((p) => p.id === active.id)
    const newIndex = projects.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(projects, oldIndex, newIndex)
    reorder.mutate(reordered.map((p, i) => ({ id: p.id, sort_order: i })))
  }

  async function handleDelete() {
    if (!pendingDelete) return
    try {
      await remove.mutateAsync(pendingDelete.id)
      toast.success('Project deleted.')
    } catch {
      toast.error('Failed to delete project.')
    } finally {
      setPendingDelete(null)
    }
  }

  if (!projects || projects.length === 0) {
    return <p className="text-sm text-muted-foreground">No projects yet — create your first one.</p>
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {projects.map((project) => (
                <SortableRow key={project.id} project={project}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="text-muted-foreground">{project.category}</TableCell>
                  <TableCell className="text-muted-foreground">{project.view_count}</TableCell>
                  <TableCell>
                    <Switch
                      checked={project.featured}
                      onCheckedChange={(checked) =>
                        update.mutate({ id: project.id, values: { featured: checked } })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={project.published}
                      onCheckedChange={(checked) =>
                        update.mutate({ id: project.id, values: { published: checked } })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => navigate(`/admin/projects/${project.id}`)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => setPendingDelete(project)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </SortableRow>
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{pendingDelete?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the project and its view history. This cannot be undone.
            </AlertDialogDescription>
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
