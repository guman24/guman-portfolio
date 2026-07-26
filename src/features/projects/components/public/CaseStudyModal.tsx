import Markdown from 'react-markdown'
import { ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ProjectRow } from '@/types/domain'

export function CaseStudyModal({
  project,
  onOpenChange,
}: {
  project: ProjectRow | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={!!project} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        {project && (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">{project.title}</DialogTitle>
              <DialogDescription>{project.summary}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="font-normal">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              {project.live_url && (
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<a href={project.live_url} target="_blank" rel="noreferrer" />}
                >
                  <ExternalLink className="size-3.5" />
                  Live demo
                </Button>
              )}
              {project.repo_url && (
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<a href={project.repo_url} target="_blank" rel="noreferrer" />}
                >
                  <GithubIcon className="size-3.5" />
                  Repository
                </Button>
              )}
            </div>

            {project.impact_metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4 sm:grid-cols-3">
                {project.impact_metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-lg font-semibold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            )}

            {project.problem_statement && (
              <section>
                <h4 className="mb-1.5 text-sm font-semibold">Problem</h4>
                <p className="text-sm text-muted-foreground">{project.problem_statement}</p>
              </section>
            )}

            {project.architecture_notes && (
              <section>
                <h4 className="mb-1.5 text-sm font-semibold">Architecture</h4>
                <p className="text-sm text-muted-foreground">{project.architecture_notes}</p>
              </section>
            )}

            {project.case_study_body && (
              <section className="space-y-2 text-sm text-muted-foreground [&_h2]:mt-4 [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-4 [&_ul]:list-disc">
                <Markdown>{project.case_study_body}</Markdown>
              </section>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
