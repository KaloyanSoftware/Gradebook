import { useQuery } from '@tanstack/react-query'
import { getPrincipalStats } from '../api/principal.api'

export const usePrincipalStats = () =>
  useQuery({ queryKey: ['principal-stats'], queryFn: getPrincipalStats })
