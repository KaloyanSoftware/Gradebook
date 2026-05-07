export interface TeacherResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  active: boolean
}

export interface GradeActivityItem {
  gradeId: string
  studentName: string
  subject: string
  value: number
  date: string
  createdAt: string
}

export interface AbsenceActivityItem {
  absenceId: string
  studentName: string
  date: string
  reason: string | null
  createdAt: string
}

export interface TeacherActivityResponse {
  grades: GradeActivityItem[]
  absences: AbsenceActivityItem[]
}

export interface TeacherStat {
  teacherId: string
  teacherName: string
  gradesRecorded: number
  absencesRecorded: number
}

export interface PrincipalStatsResponse {
  totalTeachers: number
  totalStudents: number
  totalParents: number
  totalGradesRecorded: number
  totalAbsencesRecorded: number
  schoolAverageGrade: number
  averageAbsencesPerStudent: number
  mostActiveTeacher: TeacherStat | null
  leastActiveTeacher: TeacherStat | null
}
