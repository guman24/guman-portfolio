import { useQuery } from '@tanstack/react-query'
import { fetchPublishedSkills } from '@/features/skills/api'

export function useSkills() {
  return useQuery({
    queryKey: ['skills', 'public'],
    queryFn: fetchPublishedSkills,
    staleTime: 5 * 60_000,
  })
}
