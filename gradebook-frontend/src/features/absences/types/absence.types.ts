export interface AbsenceResponse {
  id: string
  date: string
  reason?: string
  createdAt: string
}

export interface CreateAbsenceRequest {
  studentId: string
  date: string
  reason?: string
}

export interface UpdateAbsenceRequest {
  date: string
  reason?: string
}
