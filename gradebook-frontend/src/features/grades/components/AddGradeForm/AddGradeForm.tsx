import { useForm } from 'react-hook-form'
import type { AddGradeFormData, CreateGradeRequest } from '../../types/grade.types'
import styles from './AddGradeForm.module.scss'

interface Props {
  studentId: string
  subject: string
  onSubmit: (request: CreateGradeRequest) => void
  onClose: () => void
  isSubmitting?: boolean
}

export const AddGradeForm = ({
  studentId,
  subject,
  onSubmit,
  onClose,
  isSubmitting = false,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddGradeFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  })

  const handleFormSubmit = (formData: AddGradeFormData) => {
    onSubmit({ ...formData, studentId, subject })
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderText}>
            <span className={styles.modalSubject}>{subject}</span>
            <h2 className={styles.modalTitle}>Добави оценка</h2>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Затвори"
          >
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="value">
                Оценка
              </label>
              <input
                id="value"
                type="number"
                step="0.01"
                placeholder="напр. 5.50"
                className={`${styles.formInput} ${errors.value ? styles.formInputError : ''}`}
                {...register('value', {
                  required: 'Оценката е задължителна',
                  min: { value: 2, message: 'Минималната оценка е 2' },
                  max: { value: 6, message: 'Максималната оценка е 6' },
                  valueAsNumber: true,
                })}
              />
              {errors.value && (
                <span className={styles.formError}>{errors.value.message}</span>
              )}
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="date">
                Дата
              </label>
              <input
                id="date"
                type="date"
                className={`${styles.formInput} ${errors.date ? styles.formInputError : ''}`}
                {...register('date', { required: 'Датата е задължителна' })}
              />
              {errors.date && (
                <span className={styles.formError}>{errors.date.message}</span>
              )}
            </div>
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="comment">
              Коментар
              <span className={styles.formLabelOptional}>(по желание)</span>
            </label>
            <textarea
              id="comment"
              placeholder="Добави бележка към тази оценка..."
              className={styles.formTextarea}
              {...register('comment')}
            />
          </div>

          <div className={styles.formFooter}>
            <button
              type="button"
              className={`${styles.formBtn} ${styles.formBtnCancel}`}
              onClick={onClose}
            >
              Откажи
            </button>
            <button
              type="submit"
              className={`${styles.formBtn} ${styles.formBtnSubmit}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Запазване...' : 'Добави оценка'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
