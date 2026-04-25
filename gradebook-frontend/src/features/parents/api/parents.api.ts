import axiosClient from '@/api/axiosClient'
import type { CreateParentRequest, ParentResponse } from '../types/parent.types'

export const createParent = async (data: CreateParentRequest): Promise<ParentResponse> => {
  const response = await axiosClient.post<ParentResponse>('/admin/parents', data)
  return response.data
}
