import { supabase } from '@/lib/supabase/client'

export async function fetchDashboardProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, view_count, published, created_at, updated_at')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchDashboardMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data
}

export async function fetchProjectViewsSeries() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('project_views')
    .select('viewed_at')
    .gte('viewed_at', thirtyDaysAgo)
  if (error) throw error
  return data
}
