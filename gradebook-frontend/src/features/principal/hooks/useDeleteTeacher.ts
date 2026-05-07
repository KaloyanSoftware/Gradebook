import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTeacher } from '../api/principal.api'

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteTeacher,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  })
}
