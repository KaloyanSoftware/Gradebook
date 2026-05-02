import { useQuery } from '@tanstack/react-query'
import { getMyAbsences } from '../api/gradebook.api'

export const useMyAbsences = () =>
  useQuery({
    queryKey: ['my-absences'],
    queryFn: getMyAbsences,
  })
