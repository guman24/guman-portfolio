import { useMutation } from '@tanstack/react-query'
import { submitContactMessage } from '@/features/contact/api'

export function useSubmitMessage() {
  return useMutation({
    mutationFn: submitContactMessage,
  })
}
