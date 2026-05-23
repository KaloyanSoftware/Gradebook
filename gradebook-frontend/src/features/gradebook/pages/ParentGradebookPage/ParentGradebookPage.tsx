import { useState } from 'react'
import { CircularProgress } from '@mui/material'
import { useMyChildren } from '../../hooks/useMyChildren'
import { useChildGrades } from '../../hooks/useChildGrades'
import { useChildAbsences } from '../../hooks/useChildAbsences'
import { useChildRemarks } from '../../hooks/useChildRemarks'
import { useChildPraises } from '../../hooks/useChildPraises'
import type { GradeResponse } from '@/features/grades/types/grade.types'
import styles from './ParentGradebookPage.module.scss'

// ── grade colour helper (mirrors GradePicker palette) ──────────────────────
const GRADE_COLORS: Record<number, string> = {
  2: '#DC2626', 2.5: '#EF4444',
  3: '#EA580C', 3.5: '#F97316',
  4: '#CA8A04', 4.5: '#EAB308',
  5: '#65A30D', 5.5: '#22C55E',
  6: '#16A34A',
}
const gradeColor = (v: number) => GRADE_COLORS[v] ?? '#64748B'

const SUBJECT_LABELS: Record<string, string> = {
  BULGARIAN:   'Български език',
  LITERATURE:  'Литература',
}
const subjectLabel = (s: string) => SUBJECT_LABELS[s] ?? s

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('bg-BG', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })

function average(grades: GradeResponse[]): string | null {
  if (grades.length === 0) return null
  const sum = grades.reduce((acc, g) => acc + Number(g.value), 0)
  return (sum / grades.length).toFixed(2)
}

// ── child gradebook panel ──────────────────────────────────────────────────
interface ChildPanelProps { studentId: string }

const ChildPanel = ({ studentId }: ChildPanelProps) => {
  const { data: grades = [], isLoading: gradesLoading } = useChildGrades(studentId)
  const { data: absences = [], isLoading: absencesLoading } = useChildAbsences(studentId)
  const { data: remarks = [], isLoading: remarksLoading } = useChildRemarks(studentId)
  const { data: praises = [], isLoading: praisesLoading } = useChildPraises(studentId)

  const isLoading = gradesLoading || absencesLoading || remarksLoading || praisesLoading

  if (isLoading) {
    return (
      <div className={styles.spinnerRow}>
        <CircularProgress size={28} />
      </div>
    )
  }

  const avg = average(grades)
  const avgNum = avg ? parseFloat(avg) : null

  return (
    <div className={styles.panel}>

      {/* ── Stats bar ── */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{grades.length}</span>
          <span className={styles.statLabel}>оценки</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          {avgNum !== null ? (
            <span
              className={styles.statValue}
              style={{ color: gradeColor(Math.round(avgNum * 2) / 2) }}
            >
              {avg}
            </span>
          ) : (
            <span className={styles.statValue} style={{ color: '#94a3b8' }}>—</span>
          )}
          <span className={styles.statLabel}>среден успех</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{absences.length}</span>
          <span className={styles.statLabel}>отсъствия</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{remarks.length}</span>
          <span className={styles.statLabel}>забележки</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{praises.length}</span>
          <span className={styles.statLabel}>похвали</span>
        </div>
      </div>

      {/* ── Grades ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Оценки</h3>
        {grades.length === 0 ? (
          <p className={styles.empty}>Няма въведени оценки.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Предмет</th>
                <th>Оценка</th>
                <th>Коментар</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.id}>
                  <td>{formatDate(g.date)}</td>
                  <td>{subjectLabel(g.subject)}</td>
                  <td>
                    <span
                      className={styles.gradePill}
                      style={{ backgroundColor: gradeColor(Number(g.value)) }}
                    >
                      {Number(g.value) % 1 === 0
                        ? Number(g.value).toString()
                        : Number(g.value).toFixed(1)}
                    </span>
                  </td>
                  <td className={styles.commentCell}>
                    {g.comment ?? <span className={styles.noComment}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Absences ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Отсъствия</h3>
        {absences.length === 0 ? (
          <p className={styles.empty}>Няма записани отсъствия.</p>
        ) : (
          <div className={styles.absenceList}>
            {absences.map((a) => (
              <div key={a.id} className={styles.absenceChip}>
                <span className={styles.absenceDate}>{formatDate(a.date)}</span>
                {a.reason && (
                  <span className={styles.absenceReason}>{a.reason}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Remarks ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Забележки</h3>
        {remarks.length === 0 ? (
          <p className={styles.empty}>Няма записани забележки.</p>
        ) : (
          <div className={styles.remarkList}>
            {remarks.map((r) => (
              <div key={r.id} className={styles.remarkChip}>
                <span className={styles.remarkDate}>{formatDate(r.date)}</span>
                <span className={styles.remarkContent}>{r.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Praises ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Похвали</h3>
        {praises.length === 0 ? (
          <p className={styles.empty}>Няма записани похвали.</p>
        ) : (
          <div className={styles.praiseList}>
            {praises.map((p) => (
              <div key={p.id} className={styles.praiseChip}>
                <span className={styles.praiseDate}>{formatDate(p.date)}</span>
                <span className={styles.praiseContent}>{p.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

// ── main page ──────────────────────────────────────────────────────────────
export const ParentGradebookPage = () => {
  const { data: children = [], isLoading } = useMyChildren()
  const [activeTab, setActiveTab] = useState(0)

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.spinnerRow}>
          <CircularProgress />
        </div>
      </div>
    )
  }

  if (children.length === 0) {
    return (
      <div className={styles.page}>
        <h2 className={styles.pageTitle}>Дневник</h2>
        <div className={styles.card}>
          <p className={styles.empty}>Нямате свързани ученици.</p>
        </div>
      </div>
    )
  }

  const activeChild = children[activeTab] ?? children[0]

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Дневник</h2>

      {/* ── Child tabs (only shown when 2+ children) ── */}
      {children.length > 1 && (
        <div className={styles.tabs}>
          {children.map((child, i) => (
            <button
              key={child.id}
              className={`${styles.tab} ${i === activeTab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {child.firstName} {child.lastName}
            </button>
          ))}
        </div>
      )}

      {/* ── Child name header (always shown) ── */}
      <div className={styles.card}>
        <div className={styles.childHeader}>
          <div className={styles.childAvatar}>
            {activeChild.firstName.charAt(0)}{activeChild.lastName.charAt(0)}
          </div>
          <div>
            <div className={styles.childName}>
              {activeChild.firstName} {activeChild.lastName}
            </div>
            <div className={styles.childEmail}>{activeChild.email}</div>
          </div>
        </div>

        <ChildPanel studentId={activeChild.id} />
      </div>
    </div>
  )
}
