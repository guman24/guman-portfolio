import type { Database } from '@/types/supabase'

export type { ProjectCategory, SkillDomain, ExperienceType } from '@/types/supabase'

export type ProjectRow = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type SkillRow = Database['public']['Tables']['skills']['Row']
export type SkillInsert = Database['public']['Tables']['skills']['Insert']
export type SkillUpdate = Database['public']['Tables']['skills']['Update']

export type ExperienceRow = Database['public']['Tables']['experience']['Row']
export type ExperienceInsert = Database['public']['Tables']['experience']['Insert']
export type ExperienceUpdate = Database['public']['Tables']['experience']['Update']

export type MessageRow = Database['public']['Tables']['messages']['Row']

export type SiteConfigRow = Database['public']['Tables']['site_config']['Row']
export type SiteConfigUpdate = Database['public']['Tables']['site_config']['Update']

export interface ImpactMetric {
  label: string
  value: string
}

export interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  email?: string
}
