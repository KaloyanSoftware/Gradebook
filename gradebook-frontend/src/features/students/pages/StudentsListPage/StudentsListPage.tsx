import { useState, useMemo } from 'react'
import { CircularProgress, Pagination, TextField, InputAdornment, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useStudents } from '../../hooks/useStudents'
import { StudentGradesPanel } from '@/features/grades/components/StudentGradesPanel/StudentGradesPanel'
import styles from './StudentsListPage.module.scss'

const PAGE_SIZE = 10

export const StudentsListPage = () => {
  const { data: students, isLoading } = useStudents()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!students) return []
    const term = search.toLowerCase().trim()
    if (!term) return students
    return students.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.parents.some((p) => p.toLowerCase().includes(term)),
    )
  }, [students, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageSlice = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
    setExpandedId(null)
  }

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id))

  const initials = (first: string, last: string) =>
    `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const startIndex = (currentPage - 1) * PAGE_SIZE

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Typography className={styles.title}>Ученици</Typography>
          {!isLoading && students && (
            <span className={styles.badge}>{filtered.length}</span>
          )}
        </div>
        <div className={styles.searchWrapper}>
          <TextField
            size="small"
            placeholder="Търсене по име или имейл…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <CircularProgress />
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.card}>
          <div className={styles.empty}>
            {search ? 'Няма ученици, отговарящи на търсенето.' : 'Няма добавени ученици все още.'}
          </div>
        </div>
      ) : (
        <div className={styles.card}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.colNum}>№</th>
                <th>Ученик</th>
                <th>Родител(и)</th>
                <th>Записан на</th>
                <th className={styles.colChevron}></th>
              </tr>
            </thead>
            <tbody>
              {pageSlice.map((student, idx) => {
                const expanded = expandedId === student.id
                return (
                  <>
                    <tr
                      key={student.id}
                      className={`${styles.row} ${expanded ? styles.rowExpanded : ''} ${!student.active ? styles.rowInactive : ''}`}
                      onClick={() => toggleExpand(student.id)}
                    >
                      <td className={`${styles.td} ${styles.colNum}`}>
                        {startIndex + idx + 1}
                      </td>
                      <td className={styles.td}>
                        <div className={styles.studentCell}>
                          <div className={`${styles.avatar} ${!student.active ? styles.avatarInactive : ''}`}>
                            {initials(student.firstName, student.lastName)}
                          </div>
                          <div>
                            <div className={styles.studentName}>
                              {student.firstName} {student.lastName}
                              {!student.active && (
                                <span className={styles.inactiveBadge}>Деактивиран</span>
                              )}
                            </div>
                            <div className={styles.studentEmail}>{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        {student.parents.length > 0 ? (
                          <div className={styles.parentChips}>
                            {student.parents.map((name) => (
                              <span key={name} className={styles.parentChip}>{name}</span>
                            ))}
                          </div>
                        ) : (
                          <span className={styles.noParents}>—</span>
                        )}
                      </td>
                      <td className={styles.td}>
                        <span className={styles.dateText}>{formatDate(student.enrolledAt)}</span>
                      </td>
                      <td className={styles.td}>
                        <KeyboardArrowDownIcon
                          fontSize="small"
                          className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
                          sx={{ color: 'text.secondary' }}
                        />
                      </td>
                    </tr>

                    {expanded && (
                      <tr key={`${student.id}-grades`} className={styles.expandedRow}>
                        <td colSpan={5} className={styles.expandedCell}>
                          <StudentGradesPanel
                            studentId={student.id}
                            active={student.active}
                            onDeleted={() => setExpandedId(null)}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>

          <div className={styles.footer}>
            <span className={styles.footerInfo}>
              {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, filtered.length)} от {filtered.length} ученика
            </span>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, p) => setPage(p)}
              size="small"
              color="primary"
              shape="rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}
