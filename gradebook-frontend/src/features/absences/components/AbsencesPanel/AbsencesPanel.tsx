import { useState } from 'react'
import { Button, CircularProgress, IconButton, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import { useStudentAbsences, useCreateAbsence, useUpdateAbsence, useDeleteAbsence } from '../../hooks/useAbsences'
import type { UpdateAbsenceRequest } from '../../types/absence.types'
import styles from './AbsencesPanel.module.scss'

const today = () => new Date().toISOString().split('T')[0]

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('bg-BG', { day: '2-digit', month: 'short', year: 'numeric' })

interface Props {
  studentId: string
}

export const AbsencesPanel = ({ studentId }: Props) => {
  const { data: absences, isLoading } = useStudentAbsences(studentId)
  const { mutate: createAbsence, isPending: isCreating } = useCreateAbsence(studentId)
  const { mutate: updateAbsence, isPending: isUpdating } = useUpdateAbsence(studentId)
  const { mutate: deleteAbsence, isPending: isDeleting } = useDeleteAbsence(studentId)

  const [showAdd, setShowAdd] = useState(false)
  const [addDate, setAddDate] = useState(today())
  const [addReason, setAddReason] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editReason, setEditReason] = useState('')

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const startEdit = (id: string, date: string, reason?: string) => {
    setDeletingId(null)
    setEditingId(id)
    setEditDate(date)
    setEditReason(reason ?? '')
  }

  const saveEdit = () => {
    if (!editingId) return
    const data: UpdateAbsenceRequest = { date: editDate, reason: editReason || undefined }
    updateAbsence({ absenceId: editingId, data }, { onSuccess: () => setEditingId(null) })
  }

  const submitAdd = () => {
    createAbsence(
      { studentId, date: addDate, reason: addReason || undefined },
      {
        onSuccess: () => {
          setShowAdd(false)
          setAddDate(today())
          setAddReason('')
        },
      },
    )
  }

  const count = absences?.length ?? 0

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <EventBusyIcon fontSize="small" className={styles.titleIcon} />
          <span className={styles.title}>Отсъствия</span>
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </div>
        {!showAdd && (
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => { setShowAdd(true); setEditingId(null); setDeletingId(null) }}
          >
            Добави
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className={styles.loading}><CircularProgress size={18} /></div>
      ) : (
        <div className={styles.body}>
          {count === 0 && !showAdd && (
            <span className={styles.empty}>Няма записани отсъствия.</span>
          )}

          <div className={styles.chips}>
            {absences?.map((absence) => {
              if (editingId === absence.id) {
                return (
                  <div key={absence.id} className={styles.editChip}>
                    <input
                      type="date"
                      className={styles.dateInput}
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                    <input
                      type="text"
                      className={styles.reasonInput}
                      placeholder="Причина (незадължително)"
                      value={editReason}
                      onChange={(e) => setEditReason(e.target.value)}
                    />
                    <Tooltip title="Запази">
                      <span>
                        <IconButton size="small" color="primary" disabled={isUpdating} onClick={saveEdit}>
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Откажи">
                      <IconButton size="small" onClick={() => setEditingId(null)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                )
              }

              if (deletingId === absence.id) {
                return (
                  <div key={absence.id} className={styles.deleteChip}>
                    <span>Изтрий?</span>
                    <Button size="small" variant="contained" color="error"
                      disabled={isDeleting}
                      onClick={() => deleteAbsence(absence.id, { onSuccess: () => setDeletingId(null) })}>
                      Да
                    </Button>
                    <Button size="small" color="inherit" onClick={() => setDeletingId(null)}>
                      Не
                    </Button>
                  </div>
                )
              }

              return (
                <div key={absence.id} className={styles.chip}>
                  <div className={styles.chipContent}>
                    <span className={styles.chipDate}>{formatDate(absence.date)}</span>
                    {absence.reason && (
                      <span className={styles.chipReason}>{absence.reason}</span>
                    )}
                  </div>
                  <div className={styles.chipActions}>
                    <Tooltip title="Редактирай">
                      <IconButton size="small" onClick={() => startEdit(absence.id, absence.date, absence.reason)}>
                        <EditIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Изтрий">
                      <IconButton size="small" color="error"
                        onClick={() => { setEditingId(null); setDeletingId(absence.id) }}>
                        <DeleteIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              )
            })}

            {showAdd && (
              <div className={styles.editChip}>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={addDate}
                  onChange={(e) => setAddDate(e.target.value)}
                />
                <input
                  type="text"
                  className={styles.reasonInput}
                  placeholder="Причина (незадължително)"
                  value={addReason}
                  onChange={(e) => setAddReason(e.target.value)}
                />
                <Tooltip title="Добави">
                  <span>
                    <IconButton size="small" color="primary" disabled={isCreating || !addDate} onClick={submitAdd}>
                      <CheckIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Откажи">
                  <IconButton size="small" onClick={() => setShowAdd(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
