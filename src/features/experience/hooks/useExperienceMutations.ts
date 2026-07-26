import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from '@/features/experience/api'
import type { ExperienceInsert, ExperienceUpdate } from '@/types/domain'

export function useExperienceMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['experience'] })

  const create = useMutation({
    mutationFn: (values: ExperienceInsert) => createExperience(values),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ExperienceUpdate }) =>
      updateExperience(id, values),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: invalidate,
  })

  return { create, update, remove }
}
