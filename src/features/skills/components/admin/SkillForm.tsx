import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { skillSchema, type SkillFormValues } from '@/lib/validation/skill.schema'

const DOMAIN_OPTIONS: { value: SkillFormValues['domain']; label: string }[] = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'cloud_devops', label: 'Cloud & DevOps' },
  { value: 'daily_tools', label: 'Daily tools' },
]

export function SkillForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues: SkillFormValues
  onSubmit: (values: SkillFormValues) => void | Promise<void>
  isSubmitting: boolean
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SkillFormValues>({ resolver: zodResolver(skillSchema), defaultValues })

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Domain</Label>
          <Controller
            control={control}
            name="domain"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOMAIN_OPTIONS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="proficiency">Proficiency (1-5)</Label>
          <Input
            id="proficiency"
            type="number"
            min={1}
            max={5}
            {...register('proficiency', { valueAsNumber: true })}
          />
          {errors.proficiency && <p className="text-sm text-destructive">{errors.proficiency.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="years_experience">Years experience</Label>
          <Input
            id="years_experience"
            type="number"
            step="0.5"
            min={0}
            {...register('years_experience', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="icon_name">Icon name (lucide, e.g. "flutter" or "database")</Label>
        <Input id="icon_name" {...register('icon_name')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description (shown on hover)</Label>
        <Textarea id="description" rows={2} {...register('description')} />
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
        {isSubmitting ? 'Saving…' : 'Save skill'}
      </Button>
    </form>
  )
}
