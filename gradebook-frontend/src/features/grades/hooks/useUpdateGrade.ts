import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateGrade } from '../api/grades.api'
import type { UpdateGradeRequest } from '../types/grade.types'

export const useUpdateGrade = (studentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gradeId, data }: { gradeId: string; data: UpdateGradeRequest }) =>
      updateGrade(gradeId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['grades', studentId] }),
  })
}
