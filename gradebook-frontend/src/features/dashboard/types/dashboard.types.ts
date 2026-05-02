export interface RecentGradeActivity {
  gradeId: string
  subject: string
  value: number
  date: string
  studentId: string
  studentName: string
  createdAt: string
}

export interface RecentAbsenceActivity {
  absenceId: string
  date: string
  reason?: string
  studentId: string
  studentName: string
  createdAt: string
}

export interface DashboardResponse {
  totalStudents: number
  totalParents: number
  recentGrades: RecentGradeActivity[]
  recentAbsences: RecentAbsenceActivity[]
}
