import { z } from 'zod'

export const projectCategorySchema = z.enum(['mobile', 'full_stack', 'ui_ux', 'ai_tools'])

export const impactMetricSchema = z.object({
  label: z.string().min(1, 'Required'),
  value: z.string().min(1, 'Required'),
})

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase letters, numbers, and hyphens only'),
  title: z.string().min(1, 'Title is required').max(200),
  summary: z.string().min(1, 'Summary is required').max(300),
  description: z.string().max(2000).optional().or(z.literal('')),
  case_study_body: z.string().max(20000).optional().or(z.literal('')),
  category: projectCategorySchema,
  tech_stack: z.array(z.string().min(1)),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  video_url: z.string().url().optional().or(z.literal('')),
  live_url: z.string().url().optional().or(z.literal('')),
  repo_url: z.string().url().optional().or(z.literal('')),
  problem_statement: z.string().max(4000).optional().or(z.literal('')),
  architecture_notes: z.string().max(4000).optional().or(z.literal('')),
  impact_metrics: z.array(impactMetricSchema),
  featured: z.boolean(),
  published: z.boolean(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
