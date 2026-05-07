import axiosClient from '@/api/axiosClient'
import type { TeacherResponse, TeacherActivityResponse, PrincipalStatsResponse } from '../types/principal.types'
import type { StudentRosterItem } from '@/features/students/types/student.types'
import type { ParentResponse } from '@/features/parents/types/parent.types'

export interface CreateTeacherRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const getPrincipalStats = async (): Promise<PrincipalStatsResponse> => {
  const response = await axiosClient.get<PrincipalStatsResponse>('/principal/stats')
  return response.data
}

export const getTeachers = async (): Promise<TeacherResponse[]> => {
  const response = await axiosClient.get<TeacherResponse[]>('/principal/teachers')
  return response.data
}

export const createTeacher = async (data: CreateTeacherRequest): Promise<TeacherResponse> => {
  const response = await axiosClient.post<TeacherResponse>('/principal/teachers', data)
  return response.data
}

export const blockTeacher = async (id: string): Promise<void> => {
  await axiosClient.patch(`/principal/teachers/${id}/block`)
}

export const unblockTeacher = async (id: string): Promise<void> => {
  await axiosClient.patch(`/principal/teachers/${id}/unblock`)
}

export const deleteTeacher = async (id: string): Promise<void> => {
  await axiosClient.delete(`/principal/teachers/${id}`)
}

export const getTeacherActivity = async (id: string): Promise<TeacherActivityResponse> => {
  const response = await axiosClient.get<TeacherActivityResponse>(`/principal/teachers/${id}/activity`)
  return response.data
}

export const getPrincipalStudents = async (): Promise<StudentRosterItem[]> => {
  const response = await axiosClient.get<StudentRosterItem[]>('/principal/students')
  return response.data
}

export const getPrincipalParents = async (): Promise<ParentResponse[]> => {
  const response = await axiosClient.get<ParentResponse[]>('/principal/parents')
  return response.data
}
