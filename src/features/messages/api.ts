import { supabase } from '@/lib/supabase/client'
import type { MessageRow } from '@/types/domain'

export async function fetchAdminMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateMessage(id: string, patch: Partial<Pick<MessageRow, 'is_read' | 'is_starred'>>) {
  const { data, error } = await supabase.from('messages').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteMessage(id: string) {
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) throw error
}
