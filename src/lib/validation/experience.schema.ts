import { z } from 'zod'

export const experienceTypeSchema = z.enum(['role', 'project_milestone', 'education', 'certification'])

export const experienceSchema = z.object({
  type: experienceTypeSchema,
  title: z.string().min(1, 'Title is required').max(200),
  organization: z.string().max(200).optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().or(z.literal('')),
  is_current: z.boolean(),
  description: z.string().max(2000).optional().or(z.literal('')),
  highlights: z.array(z.string().min(1)),
  published: z.boolean(),
})

export type ExperienceFormValues = z.infer<typeof experienceSchema>
