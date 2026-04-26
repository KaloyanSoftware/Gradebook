import { useQuery } from '@tanstack/react-query'
import { getGradesByStudent } from '../api/grades.api'

export const useStudentGrades = (studentId: string) =>
  useQuery({
    queryKey: ['grades', studentId],
    queryFn: () => getGradesByStudent(studentId),
  })
