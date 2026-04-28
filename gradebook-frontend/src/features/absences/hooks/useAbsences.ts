import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAbsencesByStudent, createAbsence, updateAbsence, deleteAbsence } from '../api/absences.api'
import type { CreateAbsenceRequest, UpdateAbsenceRequest } from '../types/absence.types'

export const useStudentAbsences = (studentId: string) =>
  useQuery({
    queryKey: ['absences', studentId],
    queryFn: () => getAbsencesByStudent(studentId),
  })

export const useCreateAbsence = (studentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateAbsenceRequest) => createAbsence(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['absences', studentId] }),
  })
}

export const useUpdateAbsence = (studentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ absenceId, data }: { absenceId: string; data: UpdateAbsenceRequest }) =>
      updateAbsence(absenceId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['absences', studentId] }),
  })
}

export const useDeleteAbsence = (studentId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAbsence,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['absences', studentId] }),
  })
}
