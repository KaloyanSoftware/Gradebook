import { useForm } from 'react-hook-form';
import './AddGradeForm.scss';
import type { AddGradeFormData, NewGrade } from '../model/grade';

type Props = {
    studentId: string;
    subject: string;
    onSubmit: (newGrade: NewGrade) => void;
    onClose: () => void;
    isSubmitting?: boolean;
};

export function AddGradeForm({
                                 studentId,
                                 subject,
                                 onSubmit,
                                 onClose,
                                 isSubmitting = false,
                             }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddGradeFormData>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
        },
    });

    const handleFormSubmit = (formData: AddGradeFormData) => {
        const newGrade: NewGrade = {
            ...formData,
            studentId,
            subject,
        };
        onSubmit(newGrade);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="overlay" onClick={handleOverlayClick}>
            <div className="modal">
                <div className="modal__header">
                    <div className="modal__header-text">
                        <span className="modal__subject">{subject}</span>
                        <h2 className="modal__title">Добави оценка</h2>
                    </div>
                    <button
                        type="button"
                        className="modal__close-btn"
                        onClick={onClose}
                        aria-label="Затвори"
                    >
                        ×
                    </button>
                </div>

                <form
                    className="grade-form"
                    onSubmit={handleSubmit(handleFormSubmit)}
                    noValidate
                >
                    <div className="grade-form__row">
                        <div className="grade-form__field">
                            <label className="grade-form__label" htmlFor="value">
                                Оценка
                            </label>
                            <input
                                id="value"
                                type="number"
                                step="0.01"
                                placeholder="напр. 5.50"
                                className={`grade-form__input ${errors.value ? 'grade-form__input--error' : ''}`}
                                {...register('value', {
                                    required: 'Оценката е задължителна',
                                    min: { value: 2, message: 'Минималната оценка е 2' },
                                    max: { value: 6, message: 'Максималната оценка е 6' },
                                    valueAsNumber: true,
                                })}
                            />
                            {errors.value && (
                                <span className="grade-form__error">
                                    {errors.value.message}
                                </span>
                            )}
                        </div>

                        <div className="grade-form__field">
                            <label className="grade-form__label" htmlFor="date">
                                Дата
                            </label>
                            <input
                                id="date"
                                type="date"
                                className={`grade-form__input ${errors.date ? 'grade-form__input--error' : ''}`}
                                {...register('date', {
                                    required: 'Датата е задължителна',
                                })}
                            />
                            {errors.date && (
                                <span className="grade-form__error">
                                    {errors.date.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grade-form__field">
                        <label className="grade-form__label" htmlFor="comment">
                            Коментар
                            <span className="grade-form__label--optional">(по желание)</span>
                        </label>
                        <textarea
                            id="comment"
                            placeholder="Добави бележка към тази оценка..."
                            className="grade-form__textarea"
                            {...register('comment')}
                        />
                    </div>

                    <div className="grade-form__footer">
                        <button
                            type="button"
                            className="grade-form__btn grade-form__btn--cancel"
                            onClick={onClose}
                        >
                            Откажи
                        </button>
                        <button
                            type="submit"
                            className="grade-form__btn grade-form__btn--submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Запазване...' : 'Добави оценка'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}