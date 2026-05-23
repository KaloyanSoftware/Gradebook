export interface RemarkResponse {
  id: string
  studentId: string
  date: string
  content: string
  createdAt: string
}

export interface CreateRemarkRequest {
  studentId: string
  date: string
  content: string
}

export interface UpdateRemarkRequest {
  date: string
  content: string
}
