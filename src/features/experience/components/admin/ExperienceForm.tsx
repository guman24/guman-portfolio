import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { experienceSchema, type ExperienceFormValues } from '@/lib/validation/experience.schema'

const TYPE_OPTIONS: { value: ExperienceFormValues['type']; label: string }[] = [
  { value: 'role', label: 'Role' },
  { value: 'project_milestone', label: 'Project milestone' },
  { value: 'education', label: 'Education' },
  { value: 'certification', label: 'Certification' },
]

export function ExperienceForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues: ExperienceFormValues
  onSubmit: (values: ExperienceFormValues) => void | Promise<void>
  isSubmitting: boolean
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormValues>({ resolver: zodResolver(experienceSchema), defaultValues })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'highlights' as never,
  })
  const isCurrent = watch('is_current')

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="organization">Organization</Label>
          <Input id="organization" {...register('organization')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register('location')} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Start date</Label>
          <Input id="start_date" type="date" {...register('start_date')} />
          {errors.start_date && <p className="text-sm text-destructive">{errors.start_date.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date">End date</Label>
          <Input id="end_date" type="date" disabled={isCurrent} {...register('end_date')} />
        </div>
      </div>

      <Controller
        control={control}
        name="is_current"
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm font-medium">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            This is ongoing
          </label>
        )}
      />

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register('description')} />
      </div>

      <div className="space-y-2">
        <Label>Highlights</Label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`highlights.${index}` as const)} />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => append('' as never)}>
          <Plus className="size-3.5" />
          Add highlight
        </Button>
      </div>

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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save entry'}
      </Button>
    </form>
  )
}
