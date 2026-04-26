import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStudent } from '../api/parents.api'
import type { CreateStudentRequest, StudentResponse } from '../types/parent.types'

export const useCreateStudent = (parentId: string) => {
  const queryClient = useQueryClient()

  return useMutation<StudentResponse, Error, CreateStudentRequest>({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', parentId] })
    },
  })
}
