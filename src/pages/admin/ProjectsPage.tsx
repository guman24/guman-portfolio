import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectTable } from '@/features/projects/components/admin/ProjectTable'

export function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-muted-foreground">Drag to reorder — order matches the public site.</p>
        </div>
        <Button nativeButton={false} render={<Link to="/admin/projects/new" />}>
          <Plus className="size-4" />
          New project
        </Button>
      </div>

      <ProjectTable />
    </div>
  )
}
