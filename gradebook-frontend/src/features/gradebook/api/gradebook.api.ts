import axiosClient from '@/api/axiosClient'
import type { ChildResponse } from '../types/gradebook.types'
import type { GradeResponse } from '@/features/grades/types/grade.types'
import type { AbsenceResponse } from '@/features/absences/types/absence.types'
import type { RemarkResponse } from '@/features/remarks/types/remark.types'

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

export const getMyChildRemarks = async (studentId: string): Promise<RemarkResponse[]> => {
  const response = await axiosClient.get<RemarkResponse[]>(`/parent/me/children/${studentId}/remarks`)
  return response.data
}

// ── Student self-view ──────────────────────────────────────────────────────
export const getMyGrades = async (): Promise<GradeResponse[]> => {
  const response = await axiosClient.get<GradeResponse[]>('/student/me/grades')
  return response.data
}

export const getMyAbsences = async (): Promise<AbsenceResponse[]> => {
  const response = await axiosClient.get<AbsenceResponse[]>('/student/me/absences')
  return response.data
}

export const getMyRemarks = async (): Promise<RemarkResponse[]> => {
  const response = await axiosClient.get<RemarkResponse[]>('/student/me/remarks')
  return response.data
}
