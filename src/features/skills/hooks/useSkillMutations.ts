import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSkill, updateSkill, deleteSkill, reorderSkills } from '@/features/skills/api'
import type { SkillInsert, SkillUpdate } from '@/types/domain'

export function useSkillMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['skills'] })

  const create = useMutation({
    mutationFn: (values: SkillInsert) => createSkill(values),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, values }: { id: string; values: SkillUpdate }) => updateSkill(id, values),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onSuccess: invalidate,
  })

  const reorder = useMutation({
    mutationFn: reorderSkills,
    onSettled: invalidate,
  })

  return { create, update, remove, reorder }
}
