import { useMutation, useQueryClient } from '@tanstack/react-query'
import { blockTeacher } from '../api/principal.api'

export const useBlockTeacher = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: blockTeacher,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  })
}
