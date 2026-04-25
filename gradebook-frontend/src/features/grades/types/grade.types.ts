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
