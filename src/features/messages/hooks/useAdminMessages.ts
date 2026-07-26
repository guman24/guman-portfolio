import { useQuery } from '@tanstack/react-query'
import { fetchAdminMessages } from '@/features/messages/api'
import { useSession } from '@/features/auth/hooks/useSession'

export function useAdminMessages() {
  const { isAdmin } = useSession()
  return useQuery({
    queryKey: ['messages', 'admin'],
    queryFn: fetchAdminMessages,
    enabled: isAdmin,
  })
}
