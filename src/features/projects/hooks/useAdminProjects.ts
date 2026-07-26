import { useQuery } from '@tanstack/react-query'
import { fetchAdminProjects } from '@/features/projects/api'
import { useSession } from '@/features/auth/hooks/useSession'

export function useAdminProjects() {
  const { isAdmin } = useSession()
  return useQuery({
    queryKey: ['projects', 'admin'],
    queryFn: fetchAdminProjects,
    enabled: isAdmin,
  })
}
