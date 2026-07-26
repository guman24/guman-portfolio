import { useQuery } from '@tanstack/react-query'
import { fetchSiteConfig } from '@/features/site-config/api'

export function useSiteConfig() {
  return useQuery({
    queryKey: ['site-config'],
    queryFn: fetchSiteConfig,
    staleTime: 5 * 60_000,
  })
}
