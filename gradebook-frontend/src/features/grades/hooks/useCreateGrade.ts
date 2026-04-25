import { useMutation } from '@tanstack/react-query'
import { createGrade } from '../api/grades.api'
import type { CreateGradeRequest } from '../types/grade.types'

export const useCreateGrade = () => {
  return useMutation<void, Error, CreateGradeRequest>({
    mutationFn: createGrade,
  })
}
