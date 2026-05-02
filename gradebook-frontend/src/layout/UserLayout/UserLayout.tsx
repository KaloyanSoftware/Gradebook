import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { NotificationBell } from '@/features/notifications/components/NotificationBell/NotificationBell';
import styles from './UserLayout.module.scss';

export const UserLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const roleLabel: Record<string, string> = {
    PARENT: 'Родител',
    STUDENT: 'Ученик',
  };

  const bellRole = user?.role === 'PARENT' || user?.role === 'STUDENT'
    ? (user.role as 'PARENT' | 'STUDENT')
    : null;

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <span className={styles.brand}>Дневник</span>
        <div className={styles.right}>
          {user && (
            <span className={styles.name}>
              {user.firstName} {user.lastName}
            </span>
          )}
          {user && (
            <span className={styles.badge}>{roleLabel[user.role] ?? user.role}</span>
          )}
          {bellRole && <NotificationBell role={bellRole} />}
          <button className={styles.signout} onClick={handleSignOut}>
            Изход
          </button>
        </div>
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};
