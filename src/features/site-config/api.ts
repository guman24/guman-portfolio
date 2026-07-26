import { supabase } from '@/lib/supabase/client'
import type { SiteConfigUpdate } from '@/types/domain'

export async function fetchSiteConfig() {
  const { data, error } = await supabase.from('site_config').select('*').single()
  if (error) throw error
  return data
}

export async function updateSiteConfig(patch: SiteConfigUpdate) {
  const { data, error } = await supabase
    .from('site_config')
    .update(patch)
    .eq('id', true)
    .select()
    .single()
  if (error) throw error
  return data
}
