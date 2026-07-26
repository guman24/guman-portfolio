import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TechStackInput } from '@/features/projects/components/admin/TechStackInput'
import { ProjectMediaUploader } from '@/features/projects/components/admin/ProjectMediaUploader'
import { PROJECT_CATEGORIES } from '@/features/projects/api'
import { projectSchema, type ProjectFormValues } from '@/lib/validation/project.schema'
import { slugify } from '@/lib/utils'

export function ProjectForm({
  projectId,
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  projectId: string | null
  defaultValues: ProjectFormValues
  onSubmit: (values: ProjectFormValues) => void | Promise<void>
  isSubmitting: boolean
}) {
  const [slugTouched, setSlugTouched] = useState(!!defaultValues.slug)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'impact_metrics' })

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="max-w-2xl space-y-8 pb-10"
    >
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title', {
                onChange: (e) => {
                  if (!slugTouched) setValue('slug', slugify(e.target.value))
                },
              })}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...register('slug', { onChange: () => setSlugTouched(true) })}
            />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="summary">Summary</Label>
          <Textarea id="summary" rows={2} {...register('summary')} />
          {errors.summary && <p className="text-sm text-destructive">{errors.summary.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea id="description" rows={3} {...register('description')} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tech stack</Label>
            <Controller
              control={control}
              name="tech_stack"
              render={({ field }) => <TechStackInput value={field.value} onChange={field.onChange} />}
            />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <Label>Thumbnail</Label>
        <Controller
          control={control}
          name="thumbnail_url"
          render={({ field }) => (
            <ProjectMediaUploader
              projectId={projectId}
              value={field.value ?? ''}
              onChange={field.onChange}
            />
          )}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="video_url">Video URL (optional)</Label>
          <Input id="video_url" {...register('video_url')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="live_url">Live URL</Label>
          <Input id="live_url" {...register('live_url')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="repo_url">Repository URL</Label>
          <Input id="repo_url" {...register('repo_url')} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="problem_statement">Problem statement</Label>
          <Textarea id="problem_statement" rows={3} {...register('problem_statement')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="architecture_notes">Architecture notes</Label>
          <Textarea id="architecture_notes" rows={3} {...register('architecture_notes')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="case_study_body">Full case study (Markdown)</Label>
          <Textarea id="case_study_body" rows={8} className="font-mono text-xs" {...register('case_study_body')} />
        </div>
      </section>

      <section className="space-y-2">
        <Label>Impact metrics</Label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input placeholder="Label (e.g. Active users)" {...register(`impact_metrics.${index}.label`)} />
              <Input placeholder="Value (e.g. 1,200+)" {...register(`impact_metrics.${index}.value`)} />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ label: '', value: '' })}
        >
          <Plus className="size-3.5" />
          Add metric
        </Button>
      </section>

      <section className="flex flex-wrap gap-8">
        <Controller
          control={control}
          name="featured"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              Featured
            </label>
          )}
        />
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              Published
            </label>
          )}
        />
      </section>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : projectId ? 'Save changes' : 'Create project'}
      </Button>
    </form>
  )
}
