import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProject } from '@/features/projects/hooks/useProject'
import { useProjectMutations } from '@/features/projects/hooks/useProjectMutations'
import { ProjectForm } from '@/features/projects/components/admin/ProjectForm'
import type { ProjectFormValues } from '@/lib/validation/project.schema'
import type { ProjectRow } from '@/types/domain'

const EMPTY_VALUES: ProjectFormValues = {
  slug: '',
  title: '',
  summary: '',
  description: '',
  case_study_body: '',
  category: 'full_stack',
  tech_stack: [],
  thumbnail_url: '',
  video_url: '',
  live_url: '',
  repo_url: '',
  problem_statement: '',
  architecture_notes: '',
  impact_metrics: [],
  featured: false,
  published: false,
}

function toFormValues(project: ProjectRow): ProjectFormValues {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: project.description ?? '',
    case_study_body: project.case_study_body ?? '',
    category: project.category,
    tech_stack: project.tech_stack,
    thumbnail_url: project.thumbnail_url ?? '',
    video_url: project.video_url ?? '',
    live_url: project.live_url ?? '',
    repo_url: project.repo_url ?? '',
    problem_statement: project.problem_statement ?? '',
    architecture_notes: project.architecture_notes ?? '',
    impact_metrics: project.impact_metrics,
    featured: project.featured,
    published: project.published,
  }
}

export function ProjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const { data: project, isLoading } = useProject(isNew ? undefined : id)
  const { create, update } = useProjectMutations()

  async function handleSubmit(values: ProjectFormValues) {
    try {
      if (isNew) {
        const created = await create.mutateAsync(values)
        toast.success('Project created — you can now upload media.')
        navigate(`/admin/projects/${created.id}`, { replace: true })
      } else {
        await update.mutateAsync({ id: id!, values })
        toast.success('Project saved.')
      }
    } catch {
      toast.error('Failed to save project. Check the slug is unique.')
    }
  }

  if (!isNew && isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        nativeButton={false}
        render={<Link to="/admin/projects" />}
      >
        <ArrowLeft className="size-3.5" />
        Back to projects
      </Button>

      <h1 className="mb-6 text-2xl font-semibold">{isNew ? 'New project' : 'Edit project'}</h1>

      <ProjectForm
        projectId={isNew ? null : (id ?? null)}
        defaultValues={project ? toFormValues(project) : EMPTY_VALUES}
        onSubmit={handleSubmit}
        isSubmitting={create.isPending || update.isPending}
      />
    </div>
  )
}
