import { useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import SchoolIcon from '@mui/icons-material/School'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import StarIcon from '@mui/icons-material/Star'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { useAuth } from '@/context/AuthContext'
import { usePrincipalStats } from '../../hooks/usePrincipalStats'
import styles from './PrincipalDashboardPage.module.scss'

const GRADE_COLOR = (avg: number) => {
  if (avg >= 5.5) return '#16a34a'
  if (avg >= 4.5) return '#2563eb'
  if (avg >= 3.5) return '#d97706'
  if (avg >= 3.0) return '#ea580c'
  return '#dc2626'
}

export const PrincipalDashboardPage = () => {
  const { user } = useAuth()
  const { data: stats, isLoading } = usePrincipalStats()
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        Добре дошли, {user?.firstName} {user?.lastName}!
      </div>
      <p className={styles.sub}>Преглед на статистиките за учебното заведение</p>

      {isLoading ? (
        <div className={styles.loading}><CircularProgress /></div>
      ) : stats && (
        <>
          <div className={styles.topGrid}>
            <div className={styles.statCard} onClick={() => navigate('/principal/teachers')} style={{ cursor: 'pointer' }}>
              <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
                <PeopleIcon />
              </div>
              <div className={styles.statValue}>{stats.totalTeachers}</div>
              <div className={styles.statLabel}>Преподаватели</div>
            </div>

            <div className={styles.statCard} onClick={() => navigate('/principal/students')} style={{ cursor: 'pointer' }}>
              <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                <SchoolIcon />
              </div>
              <div className={styles.statValue}>{stats.totalStudents}</div>
              <div className={styles.statLabel}>Ученици</div>
            </div>

            <div className={styles.statCard} onClick={() => navigate('/principal/parents')} style={{ cursor: 'pointer' }}>
              <div className={styles.statIcon} style={{ background: '#fce7f3', color: '#db2777' }}>
                <FamilyRestroomIcon />
              </div>
              <div className={styles.statValue}>{stats.totalParents}</div>
              <div className={styles.statLabel}>Родители</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#fef9c3', color: '#ca8a04' }}>
                <StarIcon />
              </div>
              <div className={styles.statValue}>{stats.totalGradesRecorded}</div>
              <div className={styles.statLabel}>Записани оценки</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#fee2e2', color: '#dc2626' }}>
                <EventBusyIcon />
              </div>
              <div className={styles.statValue}>{stats.totalAbsencesRecorded}</div>
              <div className={styles.statLabel}>Записани отсъствия</div>
            </div>
          </div>

          <div className={styles.midGrid}>
            <div className={styles.bigStatCard}>
              <div className={styles.bigStatLabel}>Среден успех на училището</div>
              <div
                className={styles.bigStatValue}
                style={{ color: stats.schoolAverageGrade > 0 ? GRADE_COLOR(stats.schoolAverageGrade) : undefined }}
              >
                {stats.schoolAverageGrade > 0 ? stats.schoolAverageGrade.toFixed(2) : '—'}
              </div>
              <div className={styles.bigStatSub}>от всички оценки в системата</div>
            </div>

            <div className={styles.bigStatCard}>
              <div className={styles.bigStatLabel}>Средно отсъствия на ученик</div>
              <div className={styles.bigStatValue} style={{ color: '#ea580c' }}>
                {stats.averageAbsencesPerStudent > 0 ? stats.averageAbsencesPerStudent.toFixed(1) : '—'}
              </div>
              <div className={styles.bigStatSub}>брой отсъствия / брой ученици</div>
            </div>
          </div>

          <div className={styles.teacherGrid}>
            {stats.mostActiveTeacher && (
              <div
                className={`${styles.teacherCard} ${styles.teacherCardTop}`}
                onClick={() => navigate(`/principal/teachers/${stats.mostActiveTeacher!.teacherId}/activity`)}
              >
                <div className={styles.teacherCardBadge}>
                  <EmojiEventsIcon fontSize="small" />
                  Най-активен преподавател
                </div>
                <div className={styles.teacherAvatar}>
                  {stats.mostActiveTeacher.teacherName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className={styles.teacherName}>{stats.mostActiveTeacher.teacherName}</div>
                <div className={styles.teacherMeta}>
                  <span>{stats.mostActiveTeacher.gradesRecorded} оценки</span>
                  <span className={styles.dot}>·</span>
                  <span>{stats.mostActiveTeacher.absencesRecorded} отсъствия</span>
                </div>
              </div>
            )}

            {stats.leastActiveTeacher && stats.leastActiveTeacher.teacherId !== stats.mostActiveTeacher?.teacherId && (
              <div
                className={`${styles.teacherCard} ${styles.teacherCardLow}`}
                onClick={() => navigate(`/principal/teachers/${stats.leastActiveTeacher!.teacherId}/activity`)}
              >
                <div className={styles.teacherCardBadge}>
                  <TrendingDownIcon fontSize="small" />
                  Най-малко активен
                </div>
                <div className={styles.teacherAvatar}>
                  {stats.leastActiveTeacher.teacherName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className={styles.teacherName}>{stats.leastActiveTeacher.teacherName}</div>
                <div className={styles.teacherMeta}>
                  <span>{stats.leastActiveTeacher.gradesRecorded} оценки</span>
                  <span className={styles.dot}>·</span>
                  <span>{stats.leastActiveTeacher.absencesRecorded} отсъствия</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
