import { useMutation } from '@tanstack/react-query'
import { uploadProjectMedia } from '@/lib/supabase/storage'

export function useProjectMedia() {
  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      uploadProjectMedia(projectId, file),
  })
}
