import axiosClient from '@/api/axiosClient'
import type { CreateGradeRequest } from '../types/grade.types'

export const createGrade = async (request: CreateGradeRequest): Promise<void> => {
  await axiosClient.post('/admin/grades', request)
}
