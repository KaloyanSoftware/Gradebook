import axiosClient from '@/api/axiosClient'
import type { ChildResponse } from '../types/gradebook.types'
import type { GradeResponse } from '@/features/grades/types/grade.types'
import type { AbsenceResponse } from '@/features/absences/types/absence.types'

export const getMyChildren = async (): Promise<ChildResponse[]> => {
  const response = await axiosClient.get<ChildResponse[]>('/parent/me/children')
  return response.data
}

export const getMyChildGrades = async (studentId: string): Promise<GradeResponse[]> => {
  const response = await axiosClient.get<GradeResponse[]>(`/parent/me/children/${studentId}/grades`)
  return response.data
}

export const getMyChildAbsences = async (studentId: string): Promise<AbsenceResponse[]> => {
  const response = await axiosClient.get<AbsenceResponse[]>(`/parent/me/children/${studentId}/absences`)
  return response.data
}
