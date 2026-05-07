import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTeacher } from '../api/principal.api'
import type { CreateTeacherRequest } from '../api/principal.api'
import type { TeacherResponse } from '../types/principal.types'

export const useCreateTeacher = () => {
  const queryClient = useQueryClient()
  return useMutation<TeacherResponse, Error, CreateTeacherRequest>({
    mutationFn: createTeacher,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  })
}
