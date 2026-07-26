import { useQuery } from '@tanstack/react-query'
import { fetchAdminExperience } from '@/features/experience/api'
import { useSession } from '@/features/auth/hooks/useSession'

export function useAdminExperience() {
  const { isAdmin } = useSession()
  return useQuery({
    queryKey: ['experience', 'admin'],
    queryFn: fetchAdminExperience,
    enabled: isAdmin,
  })
}
