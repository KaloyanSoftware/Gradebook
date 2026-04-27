import { useState } from 'react'
import { Button, CircularProgress, IconButton, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useStudentGrades } from '../../hooks/useStudentGrades'
import { useUpdateGrade } from '../../hooks/useUpdateGrade'
import { useDeleteGrade } from '../../hooks/useDeleteGrade'
import { useCreateGrade } from '../../hooks/useCreateGrade'
import { useDeactivateStudent, useActivateStudent, useDeleteStudent } from '../../../students/hooks/useStudentActions'
import { GradePicker } from '../GradePicker/GradePicker'
import type { UpdateGradeRequest } from '../../types/grade.types'
import styles from './StudentGradesPanel.module.scss'

const SUBJECTS = [
  { value: 'BULGARIAN', label: 'Български език' },
  { value: 'LITERATURE', label: 'Литература' },
]

const SUBJECT_LABEL: Record<string, string> = {
  BULGARIAN: 'Български език',
  LITERATURE: 'Литература',
}

const today = () => new Date().toISOString().split('T')[0]

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' })

const formatValue = (v: number) => Number(v % 1 === 0 ? v : v).toLocaleString('bg-BG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

interface FormState {
  subject: string
  date: string
  value: number | null
  comment: string
}

interface Props {
  studentId: string
  active: boolean
  onDeleted: () => void
}

export const StudentGradesPanel = ({ studentId, active, onDeleted }: Props) => {
  const { data: grades, isLoading } = useStudentGrades(studentId)
  const { mutate: updateGrade, isPending: isUpdating } = useUpdateGrade(studentId)
  const { mutate: deleteGrade, isPending: isDeleting } = useDeleteGrade(studentId)
  const { mutate: addGrade, isPending: isAdding } = useCreateGrade(studentId)
  const { mutate: deactivate, isPending: isDeactivating } = useDeactivateStudent()
  const { mutate: activate, isPending: isActivating } = useActivateStudent()
  const { mutate: deleteStudentMutation, isPending: isDeletingAccount } = useDeleteStudent()

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>({ subject: '', date: '', value: null, comment: '' })
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<FormState>({ subject: 'BULGARIAN', date: today(), value: null, comment: '' })

  const startEdit = (grade: { id: string; subject: string; date: string; value: number; comment?: string }) => {
    setDeletingId(null)
    setEditingId(grade.id)
    setEditForm({
      subject: grade.subject,
      date: grade.date,
      value: grade.value,
      comment: grade.comment ?? '',
    })
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = () => {
    if (!editingId || editForm.value === null) return
    const data: UpdateGradeRequest = {
      subject: editForm.subject,
      date: editForm.date,
      value: editForm.value,
      comment: editForm.comment || undefined,
    }
    updateGrade({ gradeId: editingId, data }, { onSuccess: () => setEditingId(null) })
  }

  const confirmDelete = () => {
    if (!deletingId) return
    deleteGrade(deletingId, { onSuccess: () => setDeletingId(null) })
  }

  const submitAdd = () => {
    if (addForm.value === null) return
    addGrade(
      {
        studentId,
        subject: addForm.subject,
        date: addForm.date,
        value: addForm.value,
        comment: addForm.comment || undefined,
      },
      {
        onSuccess: () => {
          setShowAdd(false)
          setAddForm({ subject: 'BULGARIAN', date: today(), value: null, comment: '' })
        },
      },
    )
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Оценки</span>
        {!showAdd && (
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => { setShowAdd(true); setEditingId(null); setDeletingId(null) }}
          >
            Добави оценка
          </Button>
        )}
      </div>

      <table className={styles.gradeTable}>
        <thead className={styles.gradeHead}>
          <tr>
            <th>Предмет</th>
            <th>Дата</th>
            <th>Оценка</th>
            <th>Коментар</th>
            <th style={{ width: 90 }}></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr className={styles.loadingRow}>
              <td colSpan={5}><CircularProgress size={20} /></td>
            </tr>
          )}

          {!isLoading && grades?.length === 0 && !showAdd && (
            <tr>
              <td colSpan={5} className={styles.emptyGrades}>Няма въведени оценки все още.</td>
            </tr>
          )}

          {grades?.map((grade) => {
            if (deletingId === grade.id) {
              return (
                <tr key={grade.id} className={styles.gradeRow}>
                  <td colSpan={4} className={styles.deleteConfirmCell}>
                    Изтрий тази оценка?
                  </td>
                  <td>
                    <div className={styles.deleteActions}>
                      <Button size="small" color="error" variant="contained"
                        disabled={isDeleting} onClick={confirmDelete}>
                        Да
                      </Button>
                      <Button size="small" color="inherit" onClick={() => setDeletingId(null)}>
                        Не
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            }

            if (editingId === grade.id) {
              return (
                <tr key={grade.id} className={styles.editRow}>
                  <td className={styles.gradeCell}>
                    <select className={styles.editSelect}
                      value={editForm.subject}
                      onChange={(e) => setEditForm(f => ({ ...f, subject: e.target.value }))}>
                      {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </td>
                  <td className={styles.gradeCell}>
                    <input className={styles.editInput} type="date" style={{ width: 130 }}
                      value={editForm.date}
                      onChange={(e) => setEditForm(f => ({ ...f, date: e.target.value }))} />
                  </td>
                  <td className={`${styles.gradeCell} ${styles.pickerCell}`} colSpan={2}>
                    <div className={styles.pickerRow}>
                      <GradePicker
                        value={editForm.value}
                        onChange={(v) => setEditForm(f => ({ ...f, value: v }))}
                        disabled={isUpdating}
                      />
                      <input className={styles.editInput} type="text" placeholder="Коментар..."
                        style={{ minWidth: 120, flex: 1 }}
                        value={editForm.comment}
                        onChange={(e) => setEditForm(f => ({ ...f, comment: e.target.value }))} />
                    </div>
                  </td>
                  <td className={styles.gradeCell}>
                    <div className={styles.editActions}>
                      <Tooltip title="Запази">
                        <span>
                          <IconButton size="small" color="primary"
                            disabled={isUpdating || editForm.value === null}
                            onClick={saveEdit}>
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Откажи">
                        <IconButton size="small" onClick={cancelEdit}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              )
            }

            return (
              <tr key={grade.id} className={styles.gradeRow}>
                <td className={`${styles.gradeCell} ${styles.subjectCell}`}>
                  {SUBJECT_LABEL[grade.subject] ?? grade.subject}
                </td>
                <td className={styles.gradeCell}>{formatDate(grade.date)}</td>
                <td className={`${styles.gradeCell} ${styles.valueCell}`}>{formatValue(grade.value)}</td>
                <td className={`${styles.gradeCell} ${styles.commentCell}`}>{grade.comment ?? '—'}</td>
                <td className={styles.gradeCell}>
                  <div className={styles.actionButtons}>
                    <Tooltip title="Редактирай">
                      <IconButton size="small" onClick={() => startEdit(grade)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Изтрий">
                      <IconButton size="small" color="error"
                        onClick={() => { setEditingId(null); setDeletingId(grade.id) }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            )
          })}

          {showAdd && (
            <tr className={styles.addFormRow}>
              <td>
                <select className={styles.editSelect}
                  value={addForm.subject}
                  onChange={(e) => setAddForm(f => ({ ...f, subject: e.target.value }))}>
                  {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </td>
              <td>
                <input className={styles.editInput} type="date" style={{ width: 130 }}
                  value={addForm.date}
                  onChange={(e) => setAddForm(f => ({ ...f, date: e.target.value }))} />
              </td>
              <td className={styles.pickerCell} colSpan={2}>
                <div className={styles.pickerRow}>
                  <GradePicker
                    value={addForm.value}
                    onChange={(v) => setAddForm(f => ({ ...f, value: v }))}
                    disabled={isAdding}
                  />
                  <input className={styles.editInput} type="text" placeholder="Коментар (незадължително)"
                    style={{ minWidth: 120, flex: 1 }}
                    value={addForm.comment}
                    onChange={(e) => setAddForm(f => ({ ...f, comment: e.target.value }))} />
                </div>
              </td>
              <td>
                <div className={styles.editActions}>
                  <Tooltip title="Добави">
                    <span>
                      <IconButton size="small" color="primary"
                        disabled={isAdding || addForm.value === null}
                        onClick={submitAdd}>
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
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.accountActions}>
        <span className={styles.accountLabel}>Акаунт:</span>
        {active ? (
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<BlockIcon fontSize="small" />}
            disabled={isDeactivating}
            onClick={() => deactivate(studentId)}
          >
            Деактивирай
          </Button>
        ) : (
          <Button
            size="small"
            variant="outlined"
            color="success"
            startIcon={<CheckCircleOutlineIcon fontSize="small" />}
            disabled={isActivating}
            onClick={() => activate(studentId)}
          >
            Активирай
          </Button>
        )}

        {confirmDelete ? (
          <div className={styles.deleteConfirm}>
            <span>Сигурен ли си? Това ще изтрие акаунта завинаги.</span>
            <Button size="small" variant="contained" color="error"
              disabled={isDeletingAccount}
              onClick={() => deleteStudentMutation(studentId, { onSuccess: onDeleted })}>
              Да, изтрий
            </Button>
            <Button size="small" color="inherit" onClick={() => setConfirmDelete(false)}>
              Не
            </Button>
          </div>
        ) : (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon fontSize="small" />}
            onClick={() => setConfirmDelete(true)}
          >
            Изтрий акаунт
          </Button>
        )}
      </div>
    </div>
  )
}
