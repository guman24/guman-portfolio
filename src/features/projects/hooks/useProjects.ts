import { useQuery } from '@tanstack/react-query'
import { fetchPublishedProjects } from '@/features/projects/api'

export function useProjects() {
  return useQuery({
    queryKey: ['projects', 'public'],
    queryFn: fetchPublishedProjects,
    staleTime: 5 * 60_000,
  })
}
