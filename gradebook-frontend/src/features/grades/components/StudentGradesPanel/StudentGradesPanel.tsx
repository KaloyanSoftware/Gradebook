import { useState } from 'react'
import { Button, CircularProgress, IconButton, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { useStudentGrades } from '../../hooks/useStudentGrades'
import { useUpdateGrade } from '../../hooks/useUpdateGrade'
import { useDeleteGrade } from '../../hooks/useDeleteGrade'
import { createGrade } from '../../api/grades.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

const formatValue = (v: number) => Number(v).toFixed(2)

interface EditState {
  subject: string
  date: string
  value: string
  comment: string
}

interface Props {
  studentId: string
}

export const StudentGradesPanel = ({ studentId }: Props) => {
  const { data: grades, isLoading } = useStudentGrades(studentId)
  const { mutate: updateGrade, isPending: isUpdating } = useUpdateGrade(studentId)
  const { mutate: deleteGrade, isPending: isDeleting } = useDeleteGrade(studentId)

  const queryClient = useQueryClient()
  const { mutate: addGrade, isPending: isAdding } = useMutation({
    mutationFn: createGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades', studentId] })
      setShowAdd(false)
      setAddForm({ subject: 'BULGARIAN', date: today(), value: '', comment: '' })
    },
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditState>({ subject: '', date: '', value: '', comment: '' })
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<EditState>({ subject: 'BULGARIAN', date: today(), value: '', comment: '' })

  const startEdit = (grade: { id: string; subject: string; date: string; value: number; comment?: string }) => {
    setDeletingId(null)
    setEditingId(grade.id)
    setEditForm({
      subject: grade.subject,
      date: grade.date,
      value: String(grade.value),
      comment: grade.comment ?? '',
    })
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = () => {
    if (!editingId) return
    const data: UpdateGradeRequest = {
      subject: editForm.subject,
      date: editForm.date,
      value: parseFloat(editForm.value),
      comment: editForm.comment || undefined,
    }
    updateGrade({ gradeId: editingId, data }, { onSuccess: () => setEditingId(null) })
  }

  const confirmDelete = () => {
    if (!deletingId) return
    deleteGrade(deletingId, { onSuccess: () => setDeletingId(null) })
  }

  const submitAdd = () => {
    addGrade({
      studentId,
      subject: addForm.subject,
      date: addForm.date,
      value: parseFloat(addForm.value),
      comment: addForm.comment || undefined,
    })
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
            <th style={{ width: 100 }}></th>
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
                        Да, изтрий
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
                <tr key={grade.id} className={styles.gradeRow}>
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
                  <td className={styles.gradeCell}>
                    <input className={styles.editInput} type="number" min="2" max="6" step="0.25"
                      style={{ width: 70 }}
                      value={editForm.value}
                      onChange={(e) => setEditForm(f => ({ ...f, value: e.target.value }))} />
                  </td>
                  <td className={styles.gradeCell}>
                    <input className={styles.editInput} type="text" placeholder="Коментар..."
                      value={editForm.comment}
                      onChange={(e) => setEditForm(f => ({ ...f, comment: e.target.value }))} />
                  </td>
                  <td className={styles.gradeCell}>
                    <div className={styles.editActions}>
                      <Tooltip title="Запази">
                        <span>
                          <IconButton size="small" color="primary" disabled={isUpdating} onClick={saveEdit}>
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
              <td>
                <input className={styles.editInput} type="number" min="2" max="6" step="0.25"
                  style={{ width: 70 }}
                  value={addForm.value}
                  onChange={(e) => setAddForm(f => ({ ...f, value: e.target.value }))} />
              </td>
              <td>
                <input className={styles.editInput} type="text" placeholder="Коментар (незадължително)"
                  value={addForm.comment}
                  onChange={(e) => setAddForm(f => ({ ...f, comment: e.target.value }))} />
              </td>
              <td>
                <div className={styles.editActions}>
                  <Tooltip title="Добави">
                    <span>
                      <IconButton size="small" color="primary"
                        disabled={isAdding || !addForm.value}
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
    </div>
  )
}
