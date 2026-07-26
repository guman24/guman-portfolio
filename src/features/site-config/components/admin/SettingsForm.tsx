import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ResumeUploader } from '@/features/site-config/components/admin/ResumeUploader'
import { ProfileImageUploader } from '@/features/site-config/components/admin/ProfileImageUploader'
import { useSiteConfig } from '@/features/site-config/hooks/useSiteConfig'
import { useSiteConfigMutation } from '@/features/site-config/hooks/useSiteConfigMutation'

interface SettingsFormValues {
  headline: string
  bio: string
  available_for_hire: boolean
  profile_image_url: string
  resume_url: string
  booking_url: string
  github: string
  linkedin: string
  twitter: string
  email: string
  seo_title: string
  seo_description: string
  seo_og_image_url: string
}

export function SettingsForm() {
  const { data: config, isLoading } = useSiteConfig()
  const mutation = useSiteConfigMutation()

  const { register, handleSubmit, control } = useForm<SettingsFormValues>({
    values: config
      ? {
          headline: config.headline ?? '',
          bio: config.bio ?? '',
          available_for_hire: config.available_for_hire,
          profile_image_url: config.profile_image_url ?? '',
          resume_url: config.resume_url ?? '',
          booking_url: config.booking_url ?? '',
          github: config.social_links?.github ?? '',
          linkedin: config.social_links?.linkedin ?? '',
          twitter: config.social_links?.twitter ?? '',
          email: config.social_links?.email ?? '',
          seo_title: config.seo_title ?? '',
          seo_description: config.seo_description ?? '',
          seo_og_image_url: config.seo_og_image_url ?? '',
        }
      : undefined,
  })

  async function onSubmit(values: SettingsFormValues) {
    try {
      await mutation.mutateAsync({
        headline: values.headline,
        bio: values.bio,
        available_for_hire: values.available_for_hire,
        profile_image_url: values.profile_image_url || null,
        resume_url: values.resume_url || null,
        booking_url: values.booking_url || null,
        social_links: {
          github: values.github,
          linkedin: values.linkedin,
          twitter: values.twitter,
          email: values.email,
        },
        seo_title: values.seo_title,
        seo_description: values.seo_description,
        seo_og_image_url: values.seo_og_image_url || null,
      })
      toast.success('Settings saved.')
    } catch {
      toast.error('Failed to save settings.')
    }
  }

  if (isLoading || !config) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Hero</h2>
        <Controller
          control={control}
          name="available_for_hire"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              Available for hire
            </label>
          )}
        />
        <div className="space-y-1.5">
          <Label>Profile photo</Label>
          <Controller
            control={control}
            name="profile_image_url"
            render={({ field }) => (
              <ProfileImageUploader value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" {...register('headline')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={4} {...register('bio')} />
        </div>
        <div className="space-y-1.5">
          <Label>Resume</Label>
          <Controller
            control={control}
            name="resume_url"
            render={({ field }) => <ResumeUploader value={field.value} onChange={field.onChange} />}
          />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="github">GitHub URL</Label>
            <Input id="github" {...register('github')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" {...register('linkedin')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="twitter">X / Twitter URL</Label>
            <Input id="twitter" {...register('twitter')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email (mailto:...)</Label>
            <Input id="email" {...register('email')} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="booking_url">Booking URL (optional)</Label>
            <Input id="booking_url" {...register('booking_url')} />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">SEO</h2>
        <div className="space-y-1.5">
          <Label htmlFor="seo_title">Page title</Label>
          <Input id="seo_title" {...register('seo_title')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="seo_description">Meta description</Label>
          <Textarea id="seo_description" rows={2} {...register('seo_description')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="seo_og_image_url">OG image URL</Label>
          <Input id="seo_og_image_url" {...register('seo_og_image_url')} />
        </div>
      </section>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving…' : 'Save settings'}
      </Button>
    </form>
  )
}
