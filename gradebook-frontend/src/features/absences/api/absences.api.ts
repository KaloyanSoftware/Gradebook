import axiosClient from '@/api/axiosClient'
import type { AbsenceResponse, CreateAbsenceRequest, UpdateAbsenceRequest } from '../types/absence.types'

export const getAbsencesByStudent = async (studentId: string): Promise<AbsenceResponse[]> => {
  const response = await axiosClient.get<AbsenceResponse[]>(`/admin/students/${studentId}/absences`)
  return response.data
}

export const createAbsence = async (request: CreateAbsenceRequest): Promise<AbsenceResponse> => {
  const response = await axiosClient.post<AbsenceResponse>('/admin/absences', request)
  return response.data
}

export const updateAbsence = async (absenceId: string, request: UpdateAbsenceRequest): Promise<AbsenceResponse> => {
  const response = await axiosClient.put<AbsenceResponse>(`/admin/absences/${absenceId}`, request)
  return response.data
}

export const deleteAbsence = async (absenceId: string): Promise<void> => {
  await axiosClient.delete(`/admin/absences/${absenceId}`)
}
