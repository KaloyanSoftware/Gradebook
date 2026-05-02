import { CircularProgress } from '@mui/material'
import { useAuth } from '@/context/AuthContext'
import { useNotifications, useMarkAllRead } from '../../hooks/useNotifications'
import { useMarkRead } from '../../hooks/useNotifications'
import type { NotificationResponse } from '../../types/notification.types'
import styles from './NotificationsPage.module.scss'

// ── date grouping ─────────────────────────────────────────────────────────
function groupLabel(iso: string): string {
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Днес'
  if (date.toDateString() === yesterday.toDateString()) return 'Вчера'
  return date.toLocaleDateString('bg-BG', { day: '2-digit', month: 'long', year: 'numeric' })
}

function groupNotifications(
  notifications: NotificationResponse[],
): { label: string; items: NotificationResponse[] }[] {
  const map = new Map<string, NotificationResponse[]>()
  for (const n of notifications) {
    const label = groupLabel(n.createdAt)
    if (!map.has(label)) map.set(label, [])
    map.get(label)!.push(n)
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })
}

// ── page ──────────────────────────────────────────────────────────────────
export const NotificationsPage = () => {
  const { user } = useAuth()
  const role = (user?.role ?? 'PARENT') as 'PARENT' | 'STUDENT'

  const { data: notifications = [], isLoading } = useNotifications(role, true)
  const { mutate: markAll } = useMarkAllRead(role)
  const { mutate: markOne } = useMarkRead(role)

  const unreadCount = notifications.filter(n => !n.isRead).length
  const groups = groupNotifications(notifications)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Известия</h2>
          {!isLoading && (
            <p className={styles.sub}>
              {notifications.length === 0
                ? 'Нямате известия.'
                : `${notifications.length} известия${unreadCount > 0 ? `, ${unreadCount} непрочетени` : ''}`}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button className={styles.markAllBtn} onClick={() => markAll()}>
            Маркирай всички като прочетени
          </button>
        )}
      </div>

      {isLoading ? (
        <div className={styles.spinnerRow}>
          <CircularProgress />
        </div>
      ) : notifications.length === 0 ? (
        <div className={styles.emptyCard}>
          <span className={styles.emptyIcon}>🔔</span>
          <p>Няма известия все още.</p>
        </div>
      ) : (
        <div className={styles.card}>
          {groups.map(({ label, items }) => (
            <div key={label}>
              <div className={styles.groupLabel}>{label}</div>
              {items.map((n) => (
                <div
                  key={n.id}
                  className={`${styles.item} ${!n.isRead ? styles.unread : ''}`}
                  onClick={() => { if (!n.isRead) markOne(n.id) }}
                >
                  <div className={styles.itemLeft}>
                    {!n.isRead && <span className={styles.dot} />}
                  </div>
                  <div className={styles.itemBody}>
                    <p className={styles.message}>{n.message}</p>
                    <span className={styles.time}>{formatTime(n.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
