import axiosClient from '@/api/axiosClient'
import type { PraiseResponse, CreatePraiseRequest, UpdatePraiseRequest } from '../types/praise.types'

export const getPraisesByStudent = async (studentId: string): Promise<PraiseResponse[]> => {
  const response = await axiosClient.get<PraiseResponse[]>(`/admin/students/${studentId}/praises`)
  return response.data
}

export const createPraise = async (request: CreatePraiseRequest): Promise<PraiseResponse> => {
  const response = await axiosClient.post<PraiseResponse>('/admin/praises', request)
  return response.data
}

export const updatePraise = async (praiseId: string, request: UpdatePraiseRequest): Promise<PraiseResponse> => {
  const response = await axiosClient.put<PraiseResponse>(`/admin/praises/${praiseId}`, request)
  return response.data
}

export const deletePraise = async (praiseId: string): Promise<void> => {
  await axiosClient.delete(`/admin/praises/${praiseId}`)
}
