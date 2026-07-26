import { useQuery } from '@tanstack/react-query'
import { fetchProjectById } from '@/features/projects/api'
import { useSession } from '@/features/auth/hooks/useSession'

export function useProject(id: string | undefined) {
  const { isAdmin } = useSession()
  return useQuery({
    queryKey: ['projects', 'detail', id],
    queryFn: () => fetchProjectById(id!),
    enabled: isAdmin && !!id,
  })
}
