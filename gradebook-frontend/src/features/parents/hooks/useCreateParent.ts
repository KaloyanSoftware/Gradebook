import { useMutation } from '@tanstack/react-query'
import { createParent } from '../api/parents.api'
import type { CreateParentRequest, ParentResponse } from '../types/parent.types'

export const useCreateParent = () => {
  return useMutation<ParentResponse, Error, CreateParentRequest>({
    mutationFn: createParent,
  })
}
