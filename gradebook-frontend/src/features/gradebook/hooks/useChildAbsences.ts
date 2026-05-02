import { useQuery } from '@tanstack/react-query'
import { getMyChildAbsences } from '../api/gradebook.api'

export const useChildAbsences = (studentId: string | null) =>
  useQuery({
    queryKey: ['child-absences', studentId],
    queryFn: () => getMyChildAbsences(studentId!),
    enabled: studentId !== null,
  })
