import { useQuery } from '@tanstack/react-query'
import { getTeacherActivity } from '../api/principal.api'

export const useTeacherActivity = (teacherId: string) =>
  useQuery({
    queryKey: ['teacher-activity', teacherId],
    queryFn: () => getTeacherActivity(teacherId),
    enabled: !!teacherId,
  })
