import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createParent } from '../api/parents.api'
import type { CreateParentRequest, ParentResponse } from '../types/parent.types'

export const useCreateParent = () => {
  const queryClient = useQueryClient()

  return useMutation<ParentResponse, Error, CreateParentRequest>({
    mutationFn: createParent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] })
    },
  })
}
