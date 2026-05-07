import { useQuery } from '@tanstack/react-query'
import { getPrincipalParents } from '../api/principal.api'

export const usePrincipalParents = () =>
  useQuery({ queryKey: ['principal-parents'], queryFn: getPrincipalParents })
