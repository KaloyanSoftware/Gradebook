import { useState } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import type { CreateParentRequest } from '../../types/parent.types'
import styles from './CreateParentForm.module.scss'

interface Props {
  control: Control<CreateParentRequest>
  errors: FieldErrors<CreateParentRequest>
  onSubmit: () => void
  isLoading: boolean
}

export const CreateParentForm = ({ control, errors, onSubmit, isLoading }: Props) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <div className={styles.row}>
        <Controller
          name="firstName"
          control={control}
          rules={{ required: 'Задължително поле' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Първо Име"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          rules={{ required: 'Задължително поле' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Фамилия"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
            />
          )}
        />
      </div>

      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Задължително поле',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Невалиден имейл адрес',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Имейл"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: 'Задължително поле',
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
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                      aria-label={showPassword ? 'Скрий паролата' : 'Покажи паролата'}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
        className={styles.submitButton}
        fullWidth
      >
        {isLoading ? 'Запазване...' : 'Добавяне на родител'}
      </Button>
    </form>
  )
}
