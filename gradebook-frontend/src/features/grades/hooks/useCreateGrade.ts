import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createGrade } from '../api/grades.api'
import type { CreateGradeRequest, GradeResponse } from '../types/grade.types'

export const useCreateGrade = (studentId: string) => {
  const queryClient = useQueryClient()

  return useMutation<GradeResponse, Error, CreateGradeRequest>({
    mutationFn: createGrade,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['grades', studentId] }),
  })
}
