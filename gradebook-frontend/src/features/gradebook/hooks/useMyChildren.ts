import { useQuery } from '@tanstack/react-query'
import { getMyChildren } from '../api/gradebook.api'

export const useMyChildren = () =>
  useQuery({
    queryKey: ['my-children'],
    queryFn: getMyChildren,
  })
