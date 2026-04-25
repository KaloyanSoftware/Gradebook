import { useQuery } from '@tanstack/react-query'
import { getParents } from '../api/parents.api'

export const useParents = () =>
  useQuery({
    queryKey: ['parents'],
    queryFn: getParents,
  })
