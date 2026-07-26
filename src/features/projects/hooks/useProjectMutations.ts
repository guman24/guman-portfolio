import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from '@/features/projects/api'
import type { ProjectInsert, ProjectUpdate } from '@/types/domain'

export function useProjectMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['projects'] })

  const create = useMutation({
    mutationFn: (values: ProjectInsert) => createProject(values),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProjectUpdate }) => updateProject(id, values),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: invalidate,
  })

  const reorder = useMutation({
    mutationFn: reorderProjects,
    onMutate: async (ordered) => {
      await queryClient.cancelQueries({ queryKey: ['projects', 'admin'] })
      const previous = queryClient.getQueryData(['projects', 'admin'])
      queryClient.setQueryData(['projects', 'admin'], (old: unknown) => {
        if (!Array.isArray(old)) return old
        const order = new Map(ordered.map((o) => [o.id, o.sort_order]))
        return [...old]
          .map((p) => ({ ...p, sort_order: order.get(p.id) ?? p.sort_order }))
          .sort((a, b) => a.sort_order - b.sort_order)
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['projects', 'admin'], context.previous)
    },
    onSettled: invalidate,
  })

  return { create, update, remove, reorder }
}
