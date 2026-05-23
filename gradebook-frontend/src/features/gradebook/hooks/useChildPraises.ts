import { useQuery } from '@tanstack/react-query'
import { getMyChildPraises } from '../api/gradebook.api'

export const useChildPraises = (studentId: string) =>
  useQuery({
    queryKey: ['child-praises', studentId],
    queryFn: () => getMyChildPraises(studentId),
  })
