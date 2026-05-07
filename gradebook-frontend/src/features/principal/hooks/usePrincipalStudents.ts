import { useQuery } from '@tanstack/react-query'
import { getPrincipalStudents } from '../api/principal.api'

export const usePrincipalStudents = () =>
  useQuery({ queryKey: ['principal-students'], queryFn: getPrincipalStudents })
