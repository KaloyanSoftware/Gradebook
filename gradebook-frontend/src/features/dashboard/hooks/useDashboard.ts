import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '../api/dashboard.api'

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardStats,
  })
