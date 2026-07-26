import { supabase } from '@/lib/supabase/client'
import type { ContactValues } from '@/lib/validation/contact.schema'

export async function submitContactMessage(values: ContactValues) {
  const { data, error } = await supabase.functions.invoke('contact-submit', {
    body: values,
  })
  if (error) throw error
  return data
}
