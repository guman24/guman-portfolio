import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSubmitMessage } from '@/features/contact/hooks/useSubmitMessage'
import { contactSchema, type ContactValues } from '@/lib/validation/contact.schema'

export function ContactForm() {
  const submitMessage = useSubmitMessage()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) })

  async function onSubmit(values: ContactValues) {
    try {
      await submitMessage.mutateAsync(values)
      toast.success("Message sent — I'll get back to you soon.")
      reset()
    } catch {
      toast.error('Something went wrong sending your message. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject (optional)</Label>
        <Input id="subject" {...register('subject')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Message</Label>
        <Textarea id="body" rows={5} {...register('body')} />
        {errors.body && <p className="text-sm text-destructive">{errors.body.message}</p>}
      </div>

      {/* Honeypot — visually hidden and unreachable by keyboard/AT; a filled value marks the submission as spam server-side. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      <Button type="submit" disabled={submitMessage.isPending}>
        <Send className="size-3.5" />
        {submitMessage.isPending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
