import { useAuth } from '@/context/AuthContext';
import styles from './ParentDashboardPage.module.scss';

export const ParentDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>
        Добре дошли, {user?.firstName} {user?.lastName}!
      </h1>
      <p className={styles.sub}>
        Тук ще намирате информация за вашите деца, техните оценки и отсъствия.
      </p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Оценки</h3>
          <p>Преглед на оценките на вашето дете по всички предмети.</p>
          <span className={styles.soon}>Очаквайте скоро</span>
        </div>
        <div className={styles.card}>
          <h3>Отсъствия</h3>
          <p>Справка с всички отсъствия и закъснения.</p>
          <span className={styles.soon}>Очаквайте скоро</span>
        </div>
        <div className={styles.card}>
          <h3>Известия</h3>
          <p>Уведомления от учителя за новини и промени.</p>
          <span className={styles.soon}>Очаквайте скоро</span>
        </div>
      </div>
    </div>
  );
};
