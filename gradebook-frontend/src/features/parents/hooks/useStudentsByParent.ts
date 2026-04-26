import { useQuery } from '@tanstack/react-query'
import { getStudentsByParent } from '../api/parents.api'

export const useStudentsByParent = (parentId: string | null) =>
  useQuery({
    queryKey: ['students', parentId],
    queryFn: () => getStudentsByParent(parentId!),
    enabled: parentId !== null,
  })
