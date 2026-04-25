import { useState } from 'react'
import { Alert, Button, MenuItem, Snackbar, TextField, Typography } from '@mui/material'
import GradeIcon from '@mui/icons-material/Grade'
import { AddGradeForm } from '../../components/AddGradeForm/AddGradeForm'
import { useCreateGrade } from '../../hooks/useCreateGrade'
import type { CreateGradeRequest } from '../../types/grade.types'
import styles from './AddGradePage.module.scss'

const SUBJECTS: { value: string; label: string }[] = [
  { value: 'BULGARIAN', label: 'Български език' },
  { value: 'LITERATURE', label: 'Литература' },
]

export const AddGradePage = () => {
  const [studentId, setStudentId] = useState('')
  const [subject, setSubject] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { mutate, isPending } = useCreateGrade()

  const handleSubmit = (request: CreateGradeRequest) => {
    mutate(request, {
      onSuccess: () => {
        setModalOpen(false)
        setErrorMessage(null)
        setSuccessOpen(true)
      },
      onError: (error: any) => {
        const status = error?.response?.status
        if (status === 404) {
          setErrorMessage('Ученикът не е намерен. Проверете ID-то.')
        } else {
          setErrorMessage('Възникна грешка. Моля, опитайте отново.')
        }
      },
    })
  }

  const canOpenForm = studentId.trim() !== '' && subject !== ''

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Добавяне на оценка
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Изберете ученик и предмет, след което въведете оценката
        </Typography>
      </div>

      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <div className={styles.card}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Стъпка 1 — Изберете ученик и предмет
        </Typography>

        <div className={styles.selectors}>
          <TextField
            label="ID на ученик"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            fullWidth
            size="small"
          />
          <TextField
            select
            label="Предмет"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            size="small"
          >
            {SUBJECTS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <Button
          variant="contained"
          disabled={!canOpenForm}
          startIcon={<GradeIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ mt: 3 }}
        >
          Добави оценка
        </Button>
      </div>

      {modalOpen && (
        <AddGradeForm
          studentId={studentId}
          subject={subject}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
          isSubmitting={isPending}
        />
      )}

      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessOpen(false)}>
          Оценката е добавена успешно!
        </Alert>
      </Snackbar>
    </div>
  )
}
