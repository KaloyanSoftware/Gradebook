import { useQuery } from '@tanstack/react-query'
import { getMyPraises } from '../api/gradebook.api'

export const useMyPraises = () =>
  useQuery({
    queryKey: ['my-praises'],
    queryFn: getMyPraises,
  })
