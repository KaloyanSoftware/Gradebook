import { useParams, useNavigate } from 'react-router-dom'
import { Button, CircularProgress, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTeacherActivity } from '../../hooks/useTeacherActivity'
import styles from './TeacherActivityPage.module.scss'

const SUBJECT_LABELS: Record<string, string> = {
  BULGARIAN: 'Български език',
  LITERATURE: 'Литература',
}

export const TeacherActivityPage = () => {
  const { teacherId } = useParams<{ teacherId: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useTeacherActivity(teacherId!)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/principal/teachers')}
        >
          Назад
        </Button>
        <Typography className={styles.title}>История на активността</Typography>
      </div>

      {isLoading ? (
        <div className={styles.loading}><CircularProgress /></div>
      ) : (
        <>
          <section className={styles.section}>
            <Typography className={styles.sectionTitle}>Оценки</Typography>
            {!data?.grades.length ? (
              <div className={styles.empty}>Няма записани оценки.</div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ученик</th>
                      <th>Предмет</th>
                      <th>Оценка</th>
                      <th>Дата</th>
                      <th>Добавено на</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.grades.map((g) => (
                      <tr key={g.gradeId}>
                        <td>{g.studentName}</td>
                        <td>{SUBJECT_LABELS[g.subject] ?? g.subject}</td>
                        <td className={styles.gradeValue}>{g.value}</td>
                        <td>{new Date(g.date).toLocaleDateString('bg-BG')}</td>
                        <td>{new Date(g.createdAt).toLocaleString('bg-BG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <Typography className={styles.sectionTitle}>Отсъствия</Typography>
            {!data?.absences.length ? (
              <div className={styles.empty}>Няма записани отсъствия.</div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ученик</th>
                      <th>Дата</th>
                      <th>Причина</th>
                      <th>Добавено на</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.absences.map((a) => (
                      <tr key={a.absenceId}>
                        <td>{a.studentName}</td>
                        <td>{new Date(a.date).toLocaleDateString('bg-BG')}</td>
                        <td>{a.reason ?? '—'}</td>
                        <td>{new Date(a.createdAt).toLocaleString('bg-BG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
