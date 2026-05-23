import axiosClient from '@/api/axiosClient'
import type { RemarkResponse, CreateRemarkRequest, UpdateRemarkRequest } from '../types/remark.types'

export const getRemarksByStudent = async (studentId: string): Promise<RemarkResponse[]> => {
  const response = await axiosClient.get<RemarkResponse[]>(`/admin/students/${studentId}/remarks`)
  return response.data
}

export const createRemark = async (request: CreateRemarkRequest): Promise<RemarkResponse> => {
  const response = await axiosClient.post<RemarkResponse>('/admin/remarks', request)
  return response.data
}

export const updateRemark = async (remarkId: string, request: UpdateRemarkRequest): Promise<RemarkResponse> => {
  const response = await axiosClient.put<RemarkResponse>(`/admin/remarks/${remarkId}`, request)
  return response.data
}

export const deleteRemark = async (remarkId: string): Promise<void> => {
  await axiosClient.delete(`/admin/remarks/${remarkId}`)
}
