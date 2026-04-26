export interface AddGradeFormData {
  value: number
  comment?: string
  date: string
}

export interface CreateGradeRequest {
  studentId: string
  date: string
  subject: string
  value: number
  comment?: string
}

export interface UpdateGradeRequest {
  date: string
  subject: string
  value: number
  comment?: string
}

export interface GradeResponse {
  id: string
  subject: string
  date: string
  value: number
  comment?: string
  createdAt: string
  updatedAt?: string
}
