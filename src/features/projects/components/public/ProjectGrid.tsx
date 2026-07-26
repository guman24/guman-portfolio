import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useProjectView } from '@/features/projects/hooks/useProjectView'
import { ProjectFilterBar } from '@/features/projects/components/public/ProjectFilterBar'
import { ProjectCard } from '@/features/projects/components/public/ProjectCard'
import { CaseStudyModal } from '@/features/projects/components/public/CaseStudyModal'
import type { ProjectCategory, ProjectRow } from '@/types/domain'

export function ProjectGrid() {
  const { data: projects } = useProjects()
  const trackView = useProjectView()
  const [category, setCategory] = useState<ProjectCategory | 'all'>('all')
  const [activeProject, setActiveProject] = useState<ProjectRow | null>(null)

  const filtered = useMemo(() => {
    if (!projects) return []
    if (category === 'all') return projects
    return projects.filter((p) => p.category === category)
  }, [projects, category])

  function handleOpenCaseStudy(project: ProjectRow) {
    setActiveProject(project)
    trackView.mutate(project.id)
  }

  if (!projects || projects.length === 0) return null

  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Featured Projects</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        A selection of production work — case studies included.
      </p>

      <div className="mt-6">
        <ProjectFilterBar active={category} onChange={setCategory} />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onOpenCaseStudy={handleOpenCaseStudy} />
          ))}
        </AnimatePresence>
      </div>

      <CaseStudyModal
        project={activeProject}
        onOpenChange={(open) => !open && setActiveProject(null)}
      />
    </section>
  )
}
