import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setSessionLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id

  // A Supabase session only proves someone is logged in — is_admin() (checked
  // via this query against admin_users) is what proves they're the admin.
  // This is UX-only; RLS on the server is the real security boundary.
  const { data: isAdmin, isLoading: adminCheckLoading } = useQuery({
    queryKey: ['auth', 'is-admin', userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('admin_users').select('id').single()
      if (error) return false
      return !!data
    },
    enabled: !!userId,
  })

  return {
    session,
    isLoading: sessionLoading || (!!userId && adminCheckLoading),
    isAdmin: !!userId && !!isAdmin,
  }
}
