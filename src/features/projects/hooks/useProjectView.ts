import { useMutation } from '@tanstack/react-query'
import { incrementProjectView } from '@/features/projects/api'

export function useProjectView() {
  return useMutation({
    mutationFn: incrementProjectView,
  })
}
