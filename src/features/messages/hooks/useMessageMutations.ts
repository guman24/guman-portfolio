import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMessage, deleteMessage } from '@/features/messages/api'
import type { MessageRow } from '@/types/domain'

export function useMessageMutations() {
  const queryClient = useQueryClient()
  const queryKey = ['messages', 'admin']

  function optimisticPatch(id: string, patch: Partial<MessageRow>) {
    queryClient.setQueryData(queryKey, (old: unknown) => {
      if (!Array.isArray(old)) return old
      return old.map((m: MessageRow) => (m.id === id ? { ...m, ...patch } : m))
    })
  }

  const setRead = useMutation({
    mutationFn: ({ id, is_read }: { id: string; is_read: boolean }) => updateMessage(id, { is_read }),
    onMutate: async ({ id, is_read }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)
      optimisticPatch(id, { is_read })
      return { previous }
    },
    onError: (_e, _v, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const toggleStar = useMutation({
    mutationFn: ({ id, is_starred }: { id: string; is_starred: boolean }) =>
      updateMessage(id, { is_starred }),
    onMutate: async ({ id, is_starred }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)
      optimisticPatch(id, { is_starred })
      return { previous }
    },
    onError: (_e, _v, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { setRead, toggleStar, remove }
}
