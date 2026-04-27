import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateStudent, activateStudent, deleteStudent } from '../api/students.api'

export const useDeactivateStudent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  })
}

export const useActivateStudent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  })
}

export const useDeleteStudent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  })
}
