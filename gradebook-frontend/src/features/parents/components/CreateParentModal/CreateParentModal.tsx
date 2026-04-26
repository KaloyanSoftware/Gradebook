import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useCreateParent } from '../../hooks/useCreateParent'
import type { CreateParentRequest } from '../../types/parent.types'
import styles from './CreateParentModal.module.scss'

interface Props {
  open: boolean
  onClose: () => void
}

export const CreateParentModal = ({ open, onClose }: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { mutate, isPending } = useCreateParent()

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateParentRequest>({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  })

  const onSubmit = (values: CreateParentRequest) => {
    setErrorMessage(null)
    mutate(values, {
      onSuccess: () => {
        reset()
        onClose()
      },
      onError: (error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response?.status
        if (status === 409) {
          setErrorMessage('Вече съществува акаунт с този имейл адрес.')
        } else {
          setErrorMessage('Възникна грешка. Моля, опитайте отново.')
        }
      },
    })
  }

  const handleClose = () => {
    reset()
    setErrorMessage(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавяне на родител</DialogTitle>

      <DialogContent dividers>
        <form id="create-parent-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
        <Button onClick={handleClose} color="inherit">Откажи</Button>
        <Button
          type="submit"
          form="create-parent-form"
          variant="contained"
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Добави родител
        </Button>
      </DialogActions>
    </Dialog>
  )
}
