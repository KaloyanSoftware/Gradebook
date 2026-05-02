import { useRef, useState } from 'react'
import { useNotifications, useMarkAllRead, useMarkRead, useUnreadCount } from '../../hooks/useNotifications'
import type { NotificationResponse } from '../../types/notification.types'
import styles from './NotificationBell.module.scss'

interface Props {
  role: 'PARENT' | 'STUDENT'
}

export const NotificationBell = ({ role }: Props) => {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const { data: unreadData } = useUnreadCount(role, true)
  const { data: notifications = [] } = useNotifications(role, open)
  const { mutate: markAll } = useMarkAllRead(role)
  const { mutate: markOne } = useMarkRead(role)

  const unreadCount = unreadData?.count ?? 0

  function toggle() {
    setOpen(prev => !prev)
  }

  function handleMarkOne(n: NotificationResponse) {
    if (!n.isRead) {
      markOne(n.id)
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.bell} onClick={toggle} aria-label="Известия">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className={styles.panel} ref={panelRef}>
          <div className={styles.header}>
            <span className={styles.title}>Известия</span>
            {unreadCount > 0 && (
              <button className={styles.markAll} onClick={markAll}>
                Маркирай всички като прочетени
              </button>
            )}
          </div>
          <div className={styles.list}>
            {notifications.length === 0 ? (
              <p className={styles.empty}>Няма известия</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`${styles.item} ${!n.isRead ? styles.unread : ''}`}
                  onClick={() => handleMarkOne(n)}
                >
                  <p className={styles.message}>{n.message}</p>
                  <span className={styles.time}>{formatDate(n.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
