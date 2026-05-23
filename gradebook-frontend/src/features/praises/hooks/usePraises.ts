import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPraisesByStudent, createPraise, updatePraise, deletePraise } from '../api/praises.api'
import type { CreatePraiseRequest, UpdatePraiseRequest } from '../types/praise.types'

export const useStudentPraises = (studentId: string) =>
  useQuery({
    queryKey: ['praises', studentId],
    queryFn: () => getPraisesByStudent(studentId),
  })

export const useCreatePraise = (studentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreatePraiseRequest) => createPraise(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['praises', studentId] }),
  })
}

export const useUpdatePraise = (studentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ praiseId, data }: { praiseId: string; data: UpdatePraiseRequest }) =>
      updatePraise(praiseId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['praises', studentId] }),
  })
}

export const useDeletePraise = (studentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePraise,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['praises', studentId] }),
  })
}
