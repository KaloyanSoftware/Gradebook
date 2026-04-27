import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateParent, activateParent, deleteParent } from '../api/parents.api'

export const useDeactivateParent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateParent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parents'] }),
  })
}

export const useActivateParent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateParent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parents'] }),
  })
}

export const useDeleteParent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteParent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parents'] }),
  })
}
