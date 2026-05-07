import { useQuery } from '@tanstack/react-query'
import { getTeachers } from '../api/principal.api'

export const useTeachers = () =>
  useQuery({ queryKey: ['teachers'], queryFn: getTeachers })
