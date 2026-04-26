import axiosClient from '@/api/axiosClient'
import type {
  CreateParentRequest,
  ParentResponse,
  CreateStudentRequest,
  StudentResponse,
} from '../types/parent.types'

export const createParent = async (data: CreateParentRequest): Promise<ParentResponse> => {
  const response = await axiosClient.post<ParentResponse>('/admin/parents', data)
  return response.data
}

export const getParents = async (): Promise<ParentResponse[]> => {
  const response = await axiosClient.get<ParentResponse[]>('/admin/parents')
  return response.data
}

export const getStudentsByParent = async (parentId: string): Promise<StudentResponse[]> => {
  const response = await axiosClient.get<StudentResponse[]>(`/admin/parents/${parentId}/students`)
  return response.data
}

export const createStudent = async (data: CreateStudentRequest): Promise<StudentResponse> => {
  const response = await axiosClient.post<StudentResponse>('/admin/students', data)
  return response.data
}
