import { useQuery } from '@tanstack/react-query'
import { fetchPublishedExperience } from '@/features/experience/api'

export function useExperience() {
  return useQuery({
    queryKey: ['experience', 'public'],
    queryFn: fetchPublishedExperience,
    staleTime: 5 * 60_000,
  })
}
