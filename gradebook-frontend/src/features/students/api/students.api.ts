import axiosClient from '@/api/axiosClient'
import type { StudentRosterItem } from '../types/student.types'

export const getStudents = async (): Promise<StudentRosterItem[]> => {
  const response = await axiosClient.get<StudentRosterItem[]>('/admin/students')
  return response.data
}

export const deactivateStudent = async (studentId: string): Promise<void> => {
  await axiosClient.patch(`/admin/students/${studentId}/deactivate`)
}

export const activateStudent = async (studentId: string): Promise<void> => {
  await axiosClient.patch(`/admin/students/${studentId}/activate`)
}

export const deleteStudent = async (studentId: string): Promise<void> => {
  await axiosClient.delete(`/admin/students/${studentId}`)
}
