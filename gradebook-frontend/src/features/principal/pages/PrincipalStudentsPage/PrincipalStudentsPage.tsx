import { CircularProgress, Typography } from '@mui/material'
import { usePrincipalStudents } from '../../hooks/usePrincipalStudents'
import styles from './PrincipalStudentsPage.module.scss'

export const PrincipalStudentsPage = () => {
  const { data: students, isLoading } = usePrincipalStudents()

  const initials = (f: string, l: string) => `${f.charAt(0)}${l.charAt(0)}`.toUpperCase()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography className={styles.title}>Ученици</Typography>
      </div>

      {isLoading ? (
        <div className={styles.loading}><CircularProgress /></div>
      ) : !students || students.length === 0 ? (
        <div className={styles.empty}>Няма добавени ученици все още.</div>
      ) : (
        <div className={styles.list}>
          {students.map((student) => (
            <div key={student.id} className={styles.card}>
              <div className={styles.avatar}>{initials(student.firstName, student.lastName)}</div>
              <div className={styles.info}>
                <div className={styles.name}>{student.firstName} {student.lastName}</div>
                <div className={styles.email}>{student.email}</div>
                {student.parents.length > 0 && (
                  <div className={styles.parents}>
                    Родители: {student.parents.join(', ')}
                  </div>
                )}
              </div>
              <div className={styles.enrolledAt}>
                {new Date(student.enrolledAt).toLocaleDateString('bg-BG')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
