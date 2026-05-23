import { useState } from 'react'
import { Button, CircularProgress, IconButton, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ReportIcon from '@mui/icons-material/Report'
import { useStudentRemarks, useCreateRemark, useUpdateRemark, useDeleteRemark } from '../../hooks/useRemarks'
import type { UpdateRemarkRequest } from '../../types/remark.types'
import styles from './RemarksPanel.module.scss'

const today = () => new Date().toISOString().split('T')[0]

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('bg-BG', { day: '2-digit', month: 'short', year: 'numeric' })

interface Props {
  studentId: string
}

export const RemarksPanel = ({ studentId }: Props) => {
  const { data: remarks, isLoading } = useStudentRemarks(studentId)
  const { mutate: createRemark, isPending: isCreating } = useCreateRemark(studentId)
  const { mutate: updateRemark, isPending: isUpdating } = useUpdateRemark(studentId)
  const { mutate: deleteRemark, isPending: isDeleting } = useDeleteRemark(studentId)

  const [showAdd, setShowAdd] = useState(false)
  const [addDate, setAddDate] = useState(today())
  const [addContent, setAddContent] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editContent, setEditContent] = useState('')

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const startEdit = (id: string, date: string, content: string) => {
    setDeletingId(null)
    setEditingId(id)
    setEditDate(date)
    setEditContent(content)
  }

  const saveEdit = () => {
    if (!editingId) return
    const data: UpdateRemarkRequest = { date: editDate, content: editContent }
    updateRemark({ remarkId: editingId, data }, { onSuccess: () => setEditingId(null) })
  }

  const submitAdd = () => {
    createRemark(
      { studentId, date: addDate, content: addContent },
      {
        onSuccess: () => {
          setShowAdd(false)
          setAddDate(today())
          setAddContent('')
        },
      },
    )
  }

  const count = remarks?.length ?? 0

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <ReportIcon fontSize="small" className={styles.titleIcon} />
          <span className={styles.title}>Забележки</span>
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </div>
        {!showAdd && (
          <Button
            size="small"
            variant="outlined"
            color="error"
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
            <span className={styles.empty}>Няма записани забележки.</span>
          )}

          <div className={styles.chips}>
            {remarks?.map((remark) => {
              if (editingId === remark.id) {
                return (
                  <div key={remark.id} className={styles.editChip}>
                    <input
                      type="date"
                      className={styles.dateInput}
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                    <input
                      type="text"
                      className={styles.contentInput}
                      placeholder="Забележка"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <Tooltip title="Запази">
                      <span>
                        <IconButton
                          size="small"
                          color="primary"
                          disabled={isUpdating || !editContent.trim()}
                          onClick={saveEdit}
                        >
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

              if (deletingId === remark.id) {
                return (
                  <div key={remark.id} className={styles.deleteChip}>
                    <span>Изтрий?</span>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      disabled={isDeleting}
                      onClick={() => deleteRemark(remark.id, { onSuccess: () => setDeletingId(null) })}
                    >
                      Да
                    </Button>
                    <Button size="small" color="inherit" onClick={() => setDeletingId(null)}>
                      Не
                    </Button>
                  </div>
                )
              }

              return (
                <div key={remark.id} className={styles.chip}>
                  <div className={styles.chipContent}>
                    <span className={styles.chipDate}>{formatDate(remark.date)}</span>
                    <span className={styles.chipText}>{remark.content}</span>
                  </div>
                  <div className={styles.chipActions}>
                    <Tooltip title="Редактирай">
                      <IconButton size="small" onClick={() => startEdit(remark.id, remark.date, remark.content)}>
                        <EditIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Изтрий">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => { setEditingId(null); setDeletingId(remark.id) }}
                      >
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
                  className={styles.contentInput}
                  placeholder="Забележка"
                  value={addContent}
                  onChange={(e) => setAddContent(e.target.value)}
                />
                <Tooltip title="Добави">
                  <span>
                    <IconButton
                      size="small"
                      color="primary"
                      disabled={isCreating || !addDate || !addContent.trim()}
                      onClick={submitAdd}
                    >
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
