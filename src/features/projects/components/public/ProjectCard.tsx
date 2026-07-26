import { motion } from 'framer-motion'
import { ExternalLink, FileText } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ProjectRow } from '@/types/domain'

export function ProjectCard({
  project,
  onOpenCaseStudy,
}: {
  project: ProjectRow
  onOpenCaseStudy: (project: ProjectRow) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {project.video_url ? (
          <video
            src={project.video_url}
            muted
            loop
            playsInline
            autoPlay
            className="size-full object-cover"
          />
        ) : project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            {project.title}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-semibold">{project.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{project.summary}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.map((tech) => (
            <Badge key={tech} variant="secondary" className="font-normal">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onOpenCaseStudy(project)}>
            <FileText className="size-3.5" />
            Case Study
          </Button>
          {project.live_url && (
            <Button
              size="icon-sm"
              variant="ghost"
              nativeButton={false}
              render={<a href={project.live_url} target="_blank" rel="noreferrer" aria-label="Live demo" />}
            >
              <ExternalLink className="size-3.5" />
            </Button>
          )}
          {project.repo_url && (
            <Button
              size="icon-sm"
              variant="ghost"
              nativeButton={false}
              render={<a href={project.repo_url} target="_blank" rel="noreferrer" aria-label="Repository" />}
            >
              <GithubIcon className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
