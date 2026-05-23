export interface PraiseResponse {
  id: string
  studentId: string
  date: string
  content: string
  createdAt: string
}

export interface CreatePraiseRequest {
  studentId: string
  date: string
  content: string
}

export interface UpdatePraiseRequest {
  date: string
  content: string
}
