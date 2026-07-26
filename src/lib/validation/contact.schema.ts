import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Enter a valid email'),
  subject: z.string().max(200).optional(),
  body: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  // honeypot: real users never fill this in (hidden via CSS); bots that
  // blindly fill every field trip it. Never rendered visibly to humans.
  company: z.string().max(0).optional(),
})

export type ContactValues = z.infer<typeof contactSchema>
