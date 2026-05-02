import { useQuery } from '@tanstack/react-query'
import { getMyGrades } from '../api/gradebook.api'

export const useMyGrades = () =>
  useQuery({
    queryKey: ['my-grades'],
    queryFn: getMyGrades,
  })
