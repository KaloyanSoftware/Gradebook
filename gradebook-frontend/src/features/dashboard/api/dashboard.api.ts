import axiosClient from '@/api/axiosClient'
import type { DashboardResponse } from '../types/dashboard.types'

export const getDashboardStats = async (): Promise<DashboardResponse> => {
  const { data } = await axiosClient.get<DashboardResponse>('/admin/dashboard')
  return data
}
