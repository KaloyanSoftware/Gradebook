import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import HistoryIcon from '@mui/icons-material/History'
import { useTeachers } from '../../hooks/useTeachers'
import { useCreateTeacher } from '../../hooks/useCreateTeacher'
import { useBlockTeacher } from '../../hooks/useBlockTeacher'
import { useUnblockTeacher } from '../../hooks/useUnblockTeacher'
import { useDeleteTeacher } from '../../hooks/useDeleteTeacher'
import styles from './TeachersPage.module.scss'

export const TeachersPage = () => {
  const navigate = useNavigate()
  const { data: teachers, isLoading } = useTeachers()
  const { mutate: block, isPending: isBlocking } = useBlockTeacher()
  const { mutate: unblock, isPending: isUnblocking } = useUnblockTeacher()
  const { mutate: deleteTeacher, isPending: isDeleting } = useDeleteTeacher()
  const { mutate: createTeacher, isPending: isCreating, error: createError } = useCreateTeacher()

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })

  const initials = (f: string, l: string) => `${f.charAt(0)}${l.charAt(0)}`.toUpperCase()

  const handleCreate = () => {
    createTeacher(form, {
      onSuccess: () => {
        setModalOpen(false)
        setForm({ firstName: '', lastName: '', email: '', password: '' })
      },
    })
  }

  const handleDelete = (id: string) => {
    setDeleteError(null)
    deleteTeacher(id, {
      onSuccess: () => setConfirmDeleteId(null),
      onError: (err: Error) => {
        setConfirmDeleteId(null)
        setDeleteError(err.message || 'Преподавателят има записи и не може да бъде изтрит. Блокирайте го.')
      },
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography className={styles.title}>Преподаватели</Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setModalOpen(true)}>
          Нов преподавател
        </Button>
      </div>

      {deleteError && (
        <div style={{ color: '#991b1b', background: '#fee2e2', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: '0.88rem' }}>
          {deleteError}
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '32px 0' }}><CircularProgress /></div>
      ) : !teachers || teachers.length === 0 ? (
        <div className={styles.empty}>Няма добавени преподаватели все още.</div>
      ) : (
        <div className={styles.list}>
          {teachers.map((teacher) => (
            <div key={teacher.id} className={styles.card}>
              <div className={styles.avatar}>{initials(teacher.firstName, teacher.lastName)}</div>

              <div className={styles.info}>
                <div className={styles.name}>{teacher.firstName} {teacher.lastName}</div>
                <div className={styles.email}>{teacher.email}</div>
              </div>

              <span className={teacher.active ? styles.badgeActive : styles.badgeBlocked}>
                {teacher.active ? 'Активен' : 'Блокиран'}
              </span>

              <div className={styles.actions}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<HistoryIcon fontSize="small" />}
                  onClick={() => navigate(`/principal/teachers/${teacher.id}/activity`)}
                >
                  Активност
                </Button>

                {teacher.active ? (
                  <Button
                    variant="outlined"
                    size="small"
                    color="warning"
                    startIcon={<BlockIcon fontSize="small" />}
                    disabled={isBlocking}
                    onClick={() => block(teacher.id)}
                  >
                    Блокирай
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    color="success"
                    startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                    disabled={isUnblocking}
                    onClick={() => unblock(teacher.id)}
                  >
                    Активирай
                  </Button>
                )}

                {confirmDeleteId === teacher.id ? (
                  <div className={styles.deleteConfirm}>
                    <span>Сигурен ли си?</span>
                    <Button size="small" variant="contained" color="error" disabled={isDeleting}
                      onClick={() => handleDelete(teacher.id)}>
                      Да
                    </Button>
                    <Button size="small" color="inherit" onClick={() => setConfirmDeleteId(null)}>
                      Не
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon fontSize="small" />}
                    onClick={() => setConfirmDeleteId(teacher.id)}
                  >
                    Изтрий
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className={styles.modal} onClick={() => setModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>Нов преподавател</div>
            <div className={styles.fields}>
              <TextField
                label="Име"
                size="small"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              />
              <TextField
                label="Фамилия"
                size="small"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              />
              <TextField
                label="Имейл"
                size="small"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <TextField
                label="Парола"
                size="small"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
              {createError && (
                <div style={{ color: '#991b1b', fontSize: '0.82rem' }}>{createError.message}</div>
              )}
            </div>
            <div className={styles.modalActions}>
              <Button variant="outlined" onClick={() => setModalOpen(false)}>Отказ</Button>
              <Button variant="contained" disabled={isCreating} onClick={handleCreate}>
                Създай
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
