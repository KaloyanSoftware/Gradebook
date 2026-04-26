import { useQuery } from '@tanstack/react-query'
import { getStudents } from '../api/students.api'

export const useStudents = () =>
  useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  })
