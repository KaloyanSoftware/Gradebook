import axiosClient from '@/api/axiosClient'
import type { CreateGradeRequest, GradeResponse, UpdateGradeRequest } from '../types/grade.types'

export const createGrade = async (request: CreateGradeRequest): Promise<GradeResponse> => {
  const response = await axiosClient.post<GradeResponse>('/admin/grades', request)
  return response.data
}

export const getGradesByStudent = async (studentId: string): Promise<GradeResponse[]> => {
  const response = await axiosClient.get<GradeResponse[]>(`/admin/students/${studentId}/grades`)
  return response.data
}

export const updateGrade = async (gradeId: string, request: UpdateGradeRequest): Promise<GradeResponse> => {
  const response = await axiosClient.put<GradeResponse>(`/admin/grades/${gradeId}`, request)
  return response.data
}

export const deleteGrade = async (gradeId: string): Promise<void> => {
  await axiosClient.delete(`/admin/grades/${gradeId}`)
}
