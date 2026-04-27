export interface CreateParentRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface ParentResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  active: boolean
}

export interface CreateStudentRequest {
  parentId: string
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface StudentResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  enrolledAt: string
}
