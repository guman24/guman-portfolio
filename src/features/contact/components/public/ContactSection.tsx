import { Calendar, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useSiteConfig } from '@/features/site-config/hooks/useSiteConfig'
import { ContactForm } from '@/features/contact/components/public/ContactForm'

export function ContactSection() {
  const { data: config } = useSiteConfig()
  const social = config?.social_links ?? {}

  return (
    <section id="contact" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Get in touch</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Have a project in mind or just want to say hi? Send a message below.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {social.github && (
          <Button size="sm" variant="outline" nativeButton={false} render={<a href={social.github} target="_blank" rel="noreferrer" />}>
            <GithubIcon className="size-3.5" />
            GitHub
          </Button>
        )}
        {social.linkedin && (
          <Button size="sm" variant="outline" nativeButton={false} render={<a href={social.linkedin} target="_blank" rel="noreferrer" />}>
            <LinkedinIcon className="size-3.5" />
            LinkedIn
          </Button>
        )}
        {social.twitter && (
          <Button size="sm" variant="outline" nativeButton={false} render={<a href={social.twitter} target="_blank" rel="noreferrer" />}>
            <XIcon className="size-3.5" />
            X
          </Button>
        )}
        {social.email && (
          <Button size="sm" variant="outline" nativeButton={false} render={<a href={social.email} />}>
            <Mail className="size-3.5" />
            Email
          </Button>
        )}
        {config?.booking_url && (
          <Button size="sm" variant="outline" nativeButton={false} render={<a href={config.booking_url} target="_blank" rel="noreferrer" />}>
            <Calendar className="size-3.5" />
            Book a call
          </Button>
        )}
      </div>

      <div className="mt-8 max-w-2xl rounded-xl border border-border p-6">
        <ContactForm />
      </div>
    </section>
  )
}
