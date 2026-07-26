import { supabase } from '@/lib/supabase/client'
import type { ExperienceInsert, ExperienceUpdate } from '@/types/domain'

export async function fetchPublishedExperience() {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .eq('published', true)
    .order('start_date', { ascending: false })
  if (error) throw error
  return data
}

// ---------- admin ----------

export async function fetchAdminExperience() {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('start_date', { ascending: false })
  if (error) throw error
  return data
}

export async function createExperience(values: ExperienceInsert) {
  const { data, error } = await supabase.from('experience').insert(values).select().single()
  if (error) throw error
  return data
}

export async function updateExperience(id: string, values: ExperienceUpdate) {
  const { data, error } = await supabase
    .from('experience')
    .update(values)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) throw error
}
