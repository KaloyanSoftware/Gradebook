import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteGrade } from '../api/grades.api'

export const useDeleteGrade = (studentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGrade,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['grades', studentId] }),
  })
}
