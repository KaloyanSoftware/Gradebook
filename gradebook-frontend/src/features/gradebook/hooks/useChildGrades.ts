import { useQuery } from '@tanstack/react-query'
import { getMyChildGrades } from '../api/gradebook.api'

export const useChildGrades = (studentId: string | null) =>
  useQuery({
    queryKey: ['child-grades', studentId],
    queryFn: () => getMyChildGrades(studentId!),
    enabled: studentId !== null,
  })
