import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSiteConfig } from '@/features/site-config/api'

export function useSiteConfigMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSiteConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-config'] })
    },
  })
}
