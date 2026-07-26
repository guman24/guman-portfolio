// Hand-authored to match supabase/migrations/0001_init_schema.sql until the
// Supabase project exists and `supabase gen types typescript` can regenerate
// this file for real. Keep in sync with migrations until then.

export type ProjectCategory = 'mobile' | 'full_stack' | 'ui_ux' | 'ai_tools'
export type SkillDomain = 'mobile' | 'frontend' | 'backend' | 'cloud_devops' | 'daily_tools'
export type ExperienceType = 'role' | 'project_milestone' | 'education' | 'certification'

export interface Database {
  public: {
    Views: Record<string, never>
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          role: 'owner' | 'editor'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'owner' | 'editor'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          slug: string
          title: string
          summary: string
          description: string | null
          case_study_body: string | null
          category: ProjectCategory
          tech_stack: string[]
          thumbnail_url: string | null
          video_url: string | null
          live_url: string | null
          repo_url: string | null
          problem_statement: string | null
          architecture_notes: string | null
          impact_metrics: { label: string; value: string }[]
          featured: boolean
          sort_order: number
          published: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['projects']['Row']> & {
          slug: string
          title: string
          summary: string
          category: ProjectCategory
        }
        Update: Partial<Database['public']['Tables']['projects']['Row']>
        Relationships: []
      }
      project_views: {
        Row: {
          id: number
          project_id: string
          viewed_at: string
          referrer: string | null
        }
        Insert: {
          id?: number
          project_id: string
          viewed_at?: string
          referrer?: string | null
        }
        Update: Partial<Database['public']['Tables']['project_views']['Insert']>
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          name: string
          domain: SkillDomain
          proficiency: number
          years_experience: number | null
          icon_name: string | null
          description: string | null
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['skills']['Row']> & {
          name: string
          domain: SkillDomain
          proficiency: number
        }
        Update: Partial<Database['public']['Tables']['skills']['Row']>
        Relationships: []
      }
      experience: {
        Row: {
          id: string
          type: ExperienceType
          title: string
          organization: string | null
          location: string | null
          start_date: string
          end_date: string | null
          is_current: boolean
          description: string | null
          highlights: string[]
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['experience']['Row']> & {
          title: string
          start_date: string
        }
        Update: Partial<Database['public']['Tables']['experience']['Row']>
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          body: string
          is_read: boolean
          is_starred: boolean
          source_ip: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['messages']['Row']> & {
          name: string
          email: string
          body: string
        }
        Update: Partial<Database['public']['Tables']['messages']['Row']>
        Relationships: []
      }
      message_submissions_log: {
        Row: {
          id: number
          ip: string
          submitted_at: string
        }
        Insert: {
          id?: number
          ip: string
          submitted_at?: string
        }
        Update: Partial<Database['public']['Tables']['message_submissions_log']['Insert']>
        Relationships: []
      }
      site_config: {
        Row: {
          id: true
          available_for_hire: boolean
          bio: string | null
          headline: string | null
          resume_url: string | null
          profile_image_url: string | null
          seo_title: string | null
          seo_description: string | null
          seo_og_image_url: string | null
          social_links: Record<string, string>
          booking_url: string | null
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['site_config']['Row']>
        Update: Partial<Database['public']['Tables']['site_config']['Row']>
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      increment_project_view: {
        Args: { p_project_id: string; p_referrer?: string | null }
        Returns: void
      }
    }
  }
}
