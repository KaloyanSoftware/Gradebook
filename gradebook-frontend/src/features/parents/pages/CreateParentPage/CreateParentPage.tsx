import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Snackbar, Typography } from '@mui/material'
import { CreateParentForm } from '../../components/CreateParentForm/CreateParentForm'
import { useCreateParent } from '../../hooks/useCreateParent'
import type { CreateParentRequest } from '../../types/parent.types'
import styles from './CreateParentPage.module.scss'

export const CreateParentPage = () => {
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { control, handleSubmit, formState: { errors }, reset } = useForm<CreateParentRequest>({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  })

  const { mutate, isPending } = useCreateParent()

  const onSubmit = (data: CreateParentRequest) => {
    mutate(data, {
      onSuccess: () => {
        reset()
        setErrorMessage(null)
        setSuccessOpen(true)
      },
      onError: (error: any) => {
        const status = error?.response?.status
        if (status === 409) {
          setErrorMessage('Потребител с този имейл вече съществува.')
        } else {
          setErrorMessage('Възникна грешка. Моля, опитайте отново.')
        }
      },
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Добавяне на родител
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Попълнете данните за новия родителски акаунт
        </Typography>
      </div>

      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <div className={styles.card}>
        <CreateParentForm
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={isPending}
        />
      </div>

      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessOpen(false)}>
          Родителят е добавен успешно!
        </Alert>
      </Snackbar>
    </div>
  )
}
