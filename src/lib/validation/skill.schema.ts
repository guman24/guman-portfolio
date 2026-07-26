import { z } from 'zod'

export const skillDomainSchema = z.enum(['mobile', 'frontend', 'backend', 'cloud_devops', 'daily_tools'])

export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  domain: skillDomainSchema,
  proficiency: z.number().int().min(1).max(5),
  years_experience: z.number().min(0).max(50).optional().nullable(),
  icon_name: z.string().max(100).optional().or(z.literal('')),
  description: z.string().max(500).optional().or(z.literal('')),
  published: z.boolean(),
})

export type SkillFormValues = z.infer<typeof skillSchema>
