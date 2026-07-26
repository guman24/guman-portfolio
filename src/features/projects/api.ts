import { supabase } from '@/lib/supabase/client'
import type { ProjectCategory, ProjectInsert, ProjectUpdate } from '@/types/domain'

export async function fetchPublishedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function incrementProjectView(projectId: string) {
  const { error } = await supabase.rpc('increment_project_view', {
    p_project_id: projectId,
    p_referrer: document.referrer || null,
  })
  if (error) throw error
}

export const PROJECT_CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'full_stack', label: 'Full-Stack' },
  // { value: 'ui_ux', label: 'UI/UX' },
  // { value: 'ai_tools', label: 'AI Tools' },
]

// ---------- admin ----------

export async function fetchAdminProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function fetchProjectById(id: string) {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createProject(values: ProjectInsert) {
  const { data, error } = await supabase.from('projects').insert(values).select().single()
  if (error) throw error
  return data
}

export async function updateProject(id: string, values: ProjectUpdate) {
  const { data, error } = await supabase
    .from('projects')
    .update(values)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function reorderProjects(ordered: { id: string; sort_order: number }[]) {
  await Promise.all(
    ordered.map(({ id, sort_order }) =>
      supabase.from('projects').update({ sort_order }).eq('id', id).then(({ error }) => {
        if (error) throw error
      }),
    ),
  )
}
