import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import type { ParentResponse } from '../../types/parent.types'
import { useStudentsByParent } from '../../hooks/useStudentsByParent'
import { useCreateStudent } from '../../hooks/useCreateStudent'
import styles from './AddStudentModal.module.scss'

interface FormValues {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface Props {
  parent: ParentResponse
  open: boolean
  onClose: () => void
}

export const AddStudentModal = ({ parent, open, onClose }: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: students, isLoading: studentsLoading } = useStudentsByParent(open ? parent.id : null)
  const { mutate: createStudent, isPending } = useCreateStudent(parent.id)

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  })

  const onSubmit = (values: FormValues) => {
    setErrorMessage(null)
    createStudent(
      { ...values, parentId: parent.id },
      {
        onSuccess: () => {
          reset()
        },
        onError: (error: unknown) => {
          const status = (error as { response?: { status?: number } })?.response?.status
          if (status === 409) {
            setErrorMessage('Вече съществува акаунт с този имейл адрес.')
          } else {
            setErrorMessage('Възникна грешка. Моля, опитайте отново.')
          }
        },
      },
    )
  }

  const handleClose = () => {
    reset()
    setErrorMessage(null)
    onClose()
  }

  const initials = (name: string) => name.trim().charAt(0).toUpperCase()

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Добавяне на ученик за{' '}
        <strong>{parent.firstName} {parent.lastName}</strong>
      </DialogTitle>

      <DialogContent dividers>
        <Typography className={styles.sectionTitle}>Съществуващи ученици</Typography>

        {studentsLoading ? (
          <CircularProgress size={20} sx={{ display: 'block', margin: '12px auto 24px' }} />
        ) : students && students.length > 0 ? (
          <div className={styles.studentList}>
            {students.map((s) => (
              <div key={s.id} className={styles.studentItem}>
                <div className={styles.studentAvatar}>
                  {initials(s.firstName)}
                </div>
                <div className={styles.studentInfo}>
                  <span className={styles.studentName}>{s.firstName} {s.lastName}</span>
                  <span className={styles.studentEmail}>{s.email}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyStudents}>Няма добавени ученици все още.</div>
        )}

        <Divider sx={{ mb: 3 }} />

        <Typography className={styles.sectionTitle}>Нов ученик</Typography>

        <form id="add-student-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'Полето е задължително' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Собствено име"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Полето е задължително' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Фамилия"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </div>

            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Полето е задължително',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Невалиден имейл адрес' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Имейл адрес"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  size="small"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Полето е задължително',
                minLength: { value: 8, message: 'Паролата трябва да е поне 8 символа' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Парола"
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowPassword((v) => !v)} edge="end">
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          </div>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">Затвори</Button>
        <Button
          type="submit"
          form="add-student-form"
          variant="contained"
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Добави ученик
        </Button>
      </DialogActions>
    </Dialog>
  )
}
