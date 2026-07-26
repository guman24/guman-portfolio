import { supabase } from '@/lib/supabase/client'
import type { SkillInsert, SkillUpdate } from '@/types/domain'

export async function fetchPublishedSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('published', true)
    .order('domain', { ascending: true })
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

// ---------- admin ----------

export async function fetchAdminSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('domain', { ascending: true })
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function createSkill(values: SkillInsert) {
  const { data, error } = await supabase.from('skills').insert(values).select().single()
  if (error) throw error
  return data
}

export async function updateSkill(id: string, values: SkillUpdate) {
  const { data, error } = await supabase.from('skills').update(values).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteSkill(id: string) {
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) throw error
}

export async function reorderSkills(ordered: { id: string; sort_order: number }[]) {
  await Promise.all(
    ordered.map(({ id, sort_order }) =>
      supabase.from('skills').update({ sort_order }).eq('id', id).then(({ error }) => {
        if (error) throw error
      }),
    ),
  )
}
