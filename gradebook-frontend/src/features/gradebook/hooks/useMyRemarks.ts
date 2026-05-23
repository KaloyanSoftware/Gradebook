import { useQuery } from '@tanstack/react-query'
import { getMyRemarks } from '../api/gradebook.api'

export const useMyRemarks = () =>
  useQuery({
    queryKey: ['my-remarks'],
    queryFn: getMyRemarks,
  })
