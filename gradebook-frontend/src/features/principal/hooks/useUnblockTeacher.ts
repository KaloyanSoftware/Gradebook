import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unblockTeacher } from '../api/principal.api'

export const useUnblockTeacher = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: unblockTeacher,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  })
}
