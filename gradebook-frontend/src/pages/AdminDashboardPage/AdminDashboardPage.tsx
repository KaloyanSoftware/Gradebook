import { CircularProgress, Typography } from '@mui/material'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import SchoolIcon from '@mui/icons-material/School'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import styles from './AdminDashboardPage.module.scss'

const SUBJECT_LABELS: Record<string, string> = {
  BULGARIAN: 'Български език',
  LITERATURE: 'Литература',
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const AdminDashboardPage = () => {
  const { data, isLoading } = useDashboard()

  return (
    <div className={styles.page}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Табло
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Добре дошли в административния панел на Дневника.
      </Typography>

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <CircularProgress />
        </div>
      ) : data ? (
        <>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <SchoolIcon />
              </div>
              <div>
                <div className={styles.statValue}>{data.totalStudents}</div>
                <div className={styles.statLabel}>Ученици</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <PeopleAltIcon />
              </div>
              <div>
                <div className={styles.statValue}>{data.totalParents}</div>
                <div className={styles.statLabel}>Родители</div>
              </div>
            </div>
          </div>

          <div className={styles.activityRow}>
            <div className={styles.activityCard}>
              <div className={styles.activityTitle}>Последни оценки</div>
              {data.recentGrades.length === 0 ? (
                <div className={styles.empty}>Няма записани оценки.</div>
              ) : (
                <ul className={styles.activityList}>
                  {data.recentGrades.map((g) => (
                    <li key={g.gradeId} className={styles.activityItem}>
                      <div className={styles.activityMain}>
                        <span className={styles.activityStudent}>{g.studentName}</span>
                        <span className={styles.activityMeta}>
                          {SUBJECT_LABELS[g.subject] ?? g.subject}
                        </span>
                      </div>
                      <div className={styles.activityRight}>
                        <span className={styles.gradeValue}>{g.value}</span>
                        <span className={styles.activityDate}>{formatDate(g.date)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.activityCard}>
              <div className={styles.activityTitle}>Последни отсъствия</div>
              {data.recentAbsences.length === 0 ? (
                <div className={styles.empty}>Няма записани отсъствия.</div>
              ) : (
                <ul className={styles.activityList}>
                  {data.recentAbsences.map((a) => (
                    <li key={a.absenceId} className={styles.activityItem}>
                      <div className={styles.activityMain}>
                        <span className={styles.activityStudent}>{a.studentName}</span>
                        {a.reason && (
                          <span className={styles.activityMeta}>{a.reason}</span>
                        )}
                      </div>
                      <div className={styles.activityRight}>
                        <span className={styles.activityDate}>{formatDate(a.date)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
