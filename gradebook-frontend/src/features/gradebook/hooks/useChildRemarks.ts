import { useQuery } from '@tanstack/react-query'
import { getMyChildRemarks } from '../api/gradebook.api'

export const useChildRemarks = (studentId: string) =>
  useQuery({
    queryKey: ['child-remarks', studentId],
    queryFn: () => getMyChildRemarks(studentId),
  })
