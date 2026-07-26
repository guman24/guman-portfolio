import { useQuery } from '@tanstack/react-query'
import { fetchAdminSkills } from '@/features/skills/api'
import { useSession } from '@/features/auth/hooks/useSession'

export function useAdminSkills() {
  const { isAdmin } = useSession()
  return useQuery({
    queryKey: ['skills', 'admin'],
    queryFn: fetchAdminSkills,
    enabled: isAdmin,
  })
}
