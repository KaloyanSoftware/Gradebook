import { useAuth } from '@/context/AuthContext';
import styles from './StudentDashboardPage.module.scss';

export const StudentDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>
        Добре дошли, {user?.firstName} {user?.lastName}!
      </h1>
      <p className={styles.sub}>
        Тук ще намирате вашите оценки и отсъствия по Български език и литература.
      </p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Моите оценки</h3>
          <p>Преглед на всички ваши оценки по предмети.</p>
          <span className={styles.soon}>Очаквайте скоро</span>
        </div>
        <div className={styles.card}>
          <h3>Отсъствия</h3>
          <p>Справка с вашите отсъствия и закъснения.</p>
          <span className={styles.soon}>Очаквайте скоро</span>
        </div>
      </div>
    </div>
  );
};
