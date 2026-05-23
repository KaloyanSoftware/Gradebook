import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getRemarksByStudent, createRemark, updateRemark, deleteRemark } from '../api/remarks.api'
import type { CreateRemarkRequest, UpdateRemarkRequest } from '../types/remark.types'

export const useStudentRemarks = (studentId: string) =>
  useQuery({
    queryKey: ['remarks', studentId],
    queryFn: () => getRemarksByStudent(studentId),
  })

export const useCreateRemark = (studentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateRemarkRequest) => createRemark(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['remarks', studentId] }),
  })
}

export const useUpdateRemark = (studentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ remarkId, data }: { remarkId: string; data: UpdateRemarkRequest }) =>
      updateRemark(remarkId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['remarks', studentId] }),
  })
}

export const useDeleteRemark = (studentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRemark,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['remarks', studentId] }),
  })
}
