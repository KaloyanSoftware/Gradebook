import axiosClient from '@/api/axiosClient'
import type { StudentRosterItem } from '../types/student.types'

export const getStudents = async (): Promise<StudentRosterItem[]> => {
  const response = await axiosClient.get<StudentRosterItem[]>('/admin/students')
  return response.data
}
